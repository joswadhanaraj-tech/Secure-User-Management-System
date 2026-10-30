from database import Base, engine
import models  # ← import all your models so they are registered with Base

Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
