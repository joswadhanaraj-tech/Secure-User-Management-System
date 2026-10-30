from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User
from passlib.context import CryptContext

# 1️⃣ Create all tables
Base.metadata.create_all(bind=engine)
print("All tables created successfully!")

# 2️⃣ Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 3️⃣ Create a database session
db: Session = SessionLocal()

# 4️⃣ Admin user credentials
username = "Joswa.Dhanaraj@agilisium.com"
password = "JOSHJOSH@7200.."

# 5️⃣ Hash the password
hashed_password = pwd_context.hash(password)

# 6️⃣ Check if user already exists
existing_user = db.query(User).filter(User.username == username).first()
if existing_user:
    print("User already exists")
else:
    user = User(username=username, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    print("Admin user created successfully")

# 7️⃣ Close the session
db.close()

