from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas

models.Base.metadata.create_all(bind=engine)

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
        return {"error": "Invalid login"}
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
