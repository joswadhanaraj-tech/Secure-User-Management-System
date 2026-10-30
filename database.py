from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base
import os

# -----------------------------
#  Database Configuration
# -----------------------------
# Use DATABASE_URL if provided, otherwise default to sqlite ./app.db so it matches main.py
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///./app.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# -----------------------------
#  Create Tables (safe to call multiple times)
# -----------------------------
Base.metadata.create_all(bind=engine)

