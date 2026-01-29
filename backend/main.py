from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_db_connection
import schemas

# Initialize database tables
init_db()

app = FastAPI()

# CORS (for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

@app.post("/signup")
def signup(user: schemas.UserCreate, conn = Depends(get_db)):
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO p_users (email, password, name, type, address, city, state, zip)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (user.email, user.password, user.name, user.type, user.address, user.city, user.state, user.zip))
        conn.commit()
        return {"message": "User created"}
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

@app.post("/login")
def login(data: schemas.LoginSchema, conn = Depends(get_db)):
    cur = conn.cursor()
    cur.execute("SELECT * FROM p_users WHERE email = %s AND password = %s", (data.email, data.password))
    user = cur.fetchone()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid login credentials")
    
    return {"message": "Success", "user_id": user['id'], "type": user['type']}

@app.post("/donate")
def donate(data: schemas.DonationSchema, conn = Depends(get_db)):
    try:
        print(f"Received donation: {data}")
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO p_donations_v2 (user_id, item, quantity)
            VALUES (%s, %s, %s)
        """, (data.user_id, data.item, data.quantity))
        conn.commit()
        print("Donation inserted successfully")
        return {"message": "Donation saved"}
    except Exception as e:
        conn.rollback()
        print(f"Error inserting donation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/request")
def request_item(data: schemas.RequestSchema, conn = Depends(get_db)):
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO p_requests (user_id, item, quantity)
            VALUES (%s, %s, %s)
        """, (data.user_id, data.item, data.quantity))
        conn.commit()
        return {"message": "Request saved"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/requests/{user_id}", response_model=list[schemas.RequestResponse])
def get_user_requests(user_id: int, conn = Depends(get_db)):
    cur = conn.cursor()
    cur.execute("SELECT * FROM p_requests WHERE user_id = %s", (user_id,))
    rows = cur.fetchall()
    return rows

@app.get("/donations/{user_id}", response_model=list[schemas.DonationResponse])
def get_user_donations(user_id: int, conn = Depends(get_db)):
    print(f"Fetching donations for user_id: {user_id}")
    cur = conn.cursor()
    cur.execute("SELECT * FROM p_donations_v2 WHERE user_id = %s", (user_id,))
    rows = cur.fetchall()
    print(f"Found {len(rows)} donations")
    return rows

@app.get("/available-requests", response_model=list[schemas.SchoolRequestResponse])
def get_available_requests(conn = Depends(get_db)):
    cur = conn.cursor()
    query = """
        SELECT r.*, u.name as school_name 
        FROM p_requests r
        JOIN p_users u ON r.user_id = u.id
        WHERE r.status = 'Pending'
    """
    cur.execute(query)
    rows = cur.fetchall()
    return rows
