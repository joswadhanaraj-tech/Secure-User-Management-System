from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product  # make sure your Product model is imported

db: Session = SessionLocal()

test_product = Product(
    name="Test Product",
    description="This is a test product",
    price=100.0,
    quantity=10
)

existing_product = db.query(Product).filter(Product.name == test_product.name).first()
if existing_product:
    print("Test product already exists")
else:
    db.add(test_product)
    db.commit()
    print("Test product inserted successfully")

db.close()
