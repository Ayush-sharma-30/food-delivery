from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric, Boolean
from sqlalchemy.sql import func
from ..database import Base

class PlatformFee(Base):
    __tablename__ = "platform_fees"

    id = Column(Integer, primary_key=True, index=True)
    fee_type = Column(String(50), nullable=False)
    fee_value = Column(Numeric(10, 2), nullable=False)
    is_percentage = Column(Boolean, default=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
