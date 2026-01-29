import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import time

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/dbname")

def get_db_connection():
    """Establish a connection to the PostgreSQL database."""
    retries = 5
    while retries > 0:
        try:
            conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
            return conn
        except psycopg2.OperationalError as e:
            print(f"Database connection failed, retrying... ({retries} left)")
            retries -= 1
            time.sleep(2)
            if retries == 0:
                raise e

def init_db():
    """Initialize database tables using raw SQL."""
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        
        # Users Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS p_users (
                id SERIAL PRIMARY KEY,
                email VARCHAR NOT NULL,
                password VARCHAR NOT NULL,
                name VARCHAR,
                type VARCHAR,
                address VARCHAR,
                city VARCHAR,
                state VARCHAR,
                zip VARCHAR
            );
        """)
        
        # Donations Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS p_donations_v2 (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                item VARCHAR,
                quantity INTEGER,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                shipping_number VARCHAR DEFAULT 'PENDING-123'
            );
        """)
        
        # Requests Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS p_requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                item VARCHAR,
                quantity INTEGER,
                status VARCHAR DEFAULT 'Pending',
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        print("Tables initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        conn.rollback()
    finally:
        conn.close()
