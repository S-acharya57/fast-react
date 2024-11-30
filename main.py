from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# SQLite database
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT,
            lastName TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class UserSignup(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/signup")
async def signup(user_data: UserSignup):
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # user already exists
        c.execute("SELECT * FROM users WHERE email = ?", (user_data.email,))
        if c.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # new user
        c.execute("""
            INSERT INTO users (firstName, lastName, email, password) 
            VALUES (?, ?, ?, ?)
        """, (user_data.firstName, user_data.lastName, user_data.email, user_data.password))
        
        conn.commit()
        conn.close()
        
        return {"message": "User registered successfully", "email": user_data.email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def login(user_data: UserLogin):
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Find user
        c.execute("SELECT * FROM users WHERE email = ? AND password = ?", 
                  (user_data.email, user_data.password))
        user = c.fetchone()
        
        conn.close()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {
            "message": "Login successful", 
            "user": {
                "firstName": user[1],
                "lastName": user[2],
                "email": user[3]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))