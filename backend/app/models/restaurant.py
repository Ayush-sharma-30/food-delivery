from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric
from sqlalchemy.sql import func
from ..database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    pin_code = Column(String(10), nullable=False, index=True)
    address = Column(Text, nullable=False)
    phone = Column(String(15))
    status = Column(String(20), default='active')
    owner_name = Column(String(100))
    owner_email = Column(String(100), unique=True, nullable=False)
    owner_password_hash = Column(String(255), nullable=False)
    restaurant_fees = Column(Numeric(10, 2), default=0.00)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
