from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from database import SessionLocal, engine
import models, schemas

# Create tables
models.Base.metadata.create_all(bind=engine)

# Try to update schema if tables exist but columns don't
try:
    with engine.connect() as conn:
        conn.execute(text("COMMIT")) # Ensure we are not in a transaction block
        try:
            conn.execute(text("ALTER TABLE p_requests ADD COLUMN status VARCHAR DEFAULT 'Pending'"))
        except Exception as e:
            print(f"Migration note: {e}")
        try:
            conn.execute(text("ALTER TABLE p_requests ADD COLUMN date TIMESTAMP DEFAULT NOW()"))
        except Exception as e:
            print(f"Migration note: {e}")
        try:
            conn.execute(text("ALTER TABLE p_donations ADD COLUMN date TIMESTAMP DEFAULT NOW()"))
        except Exception as e:
            print(f"Migration note: {e}")
        try:
            conn.execute(text("ALTER TABLE p_donations ADD COLUMN shipping_number VARCHAR DEFAULT 'PENDING-123'"))
        except Exception as e:
            print(f"Migration note: {e}")
except Exception as e:
    print(f"Database connection/migration error: {e}")

app = FastAPI()

# CORS (for React)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    u = models.User(**user.dict())
    db.add(u)
    db.commit()
    return {"message": "User created"}

@app.post("/login")
def login(data: schemas.LoginSchema, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == data.email,
        models.User.password == data.password
    ).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid login credentials")
    return {"message": "Success", "user_id": user.id, "type": user.type}

@app.post("/donate")
def donate(data: schemas.DonationSchema, db: Session = Depends(get_db)):
    d = models.Donation(**data.dict())
    db.add(d)
    db.commit()
    return {"message": "Donation saved"}

@app.post("/request")
def request_item(data: schemas.RequestSchema, db: Session = Depends(get_db)):
    r = models.Request(**data.dict())
    db.add(r)
    db.commit()
    return {"message": "Request saved"}

@app.get("/requests/{user_id}", response_model=List[schemas.RequestResponse])
def get_user_requests(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Request).filter(models.Request.user_id == user_id).all()

@app.get("/donations/{user_id}", response_model=List[schemas.DonationResponse])
def get_user_donations(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Donation).filter(models.Donation.user_id == user_id).all()

@app.get("/available-requests", response_model=List[schemas.SchoolRequestResponse])
def get_available_requests(db: Session = Depends(get_db)):
    results = db.query(models.Request, models.User.name).join(
        models.User, models.Request.user_id == models.User.id
    ).filter(models.Request.status == "Pending").all()
    
    return [
        {**schemas.RequestResponse.from_orm(req).dict(), "school_name": school_name}
        for req, school_name in results
    ]
