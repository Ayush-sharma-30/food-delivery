from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    restaurant_id = Column(Integer, ForeignKey('restaurants.id'), nullable=False, index=True)
    delivery_partner_id = Column(Integer, ForeignKey('delivery_partners.id'))
    total_amount = Column(Numeric(10, 2), nullable=False)
    restaurant_fees = Column(Numeric(10, 2), default=0.00)
    platform_fees = Column(Numeric(10, 2), default=0.00)
    delivery_charges = Column(Numeric(10, 2), default=0.00)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    final_amount = Column(Numeric(10, 2), nullable=False)
    payment_mode = Column(String(20))
    status = Column(String(20), default='pending', index=True)
    delivery_address = Column(Text, nullable=False)
    delivery_pin_code = Column(String(10), nullable=False)
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    delivered_at = Column(DateTime(timezone=True))

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    dish_id = Column(Integer, ForeignKey('dishes.id'), nullable=False)
    dish_name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    photo_path = Column(String(255))
