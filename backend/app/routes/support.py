from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..database import get_db
from ..auth import require_role
from ..models.complaint import Complaint
from ..models.order import Order, OrderItem
from ..models.user import User
from ..models.restaurant import Restaurant

router = APIRouter()

class ComplaintUpdate(BaseModel):
    status: str
    resolution_notes: Optional[str] = None

@router.get("/complaints", dependencies=[Depends(require_role(["customer_care"]))])
def get_all_complaints(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Complaint)
    
    if status:
        query = query.filter(Complaint.status == status)
    
    complaints = query.order_by(Complaint.created_at.desc()).all()
    
    result = []
    for complaint in complaints:
        user = db.query(User).filter(User.id == complaint.user_id).first()
        
        result.append({
            "id": complaint.id,
            "order_id": complaint.order_id,
            "user_name": user.name if user else "Unknown",
            "user_email": user.email if user else "Unknown",
            "description": complaint.description,
            "status": complaint.status,
            "resolution_notes": complaint.resolution_notes,
            "created_at": complaint.created_at.isoformat() if complaint.created_at else None
        })
    
    return {"complaints": result}

@router.put("/complaints/{complaint_id}", dependencies=[Depends(require_role(["customer_care"]))])
def update_complaint(complaint_id: int, update: ComplaintUpdate, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if update.status not in ['open', 'in_progress', 'resolved', 'closed']:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    complaint.status = update.status
    
    if update.resolution_notes:
        complaint.resolution_notes = update.resolution_notes
    
    if update.status in ['resolved', 'closed']:
        complaint.resolved_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Complaint updated successfully"}

@router.get("/orders/{order_id}", dependencies=[Depends(require_role(["customer_care"]))])
def get_order_details(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    user = db.query(User).filter(User.id == order.user_id).first()
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    
    return {
        "order": {
            "id": order.id,
            "status": order.status,
            "total_amount": float(order.total_amount),
            "final_amount": float(order.final_amount),
            "payment_mode": order.payment_mode,
            "delivery_address": order.delivery_address,
            "order_date": order.order_date.isoformat() if order.order_date else None
        },
        "customer": {
            "name": user.name if user else "Unknown",
            "email": user.email if user else "Unknown",
            "phone": user.phone if user else "Unknown"
        },
        "restaurant": {
            "name": restaurant.name if restaurant else "Unknown",
            "address": restaurant.address if restaurant else "Unknown"
        },
        "items": [
            {
                "dish_name": item.dish_name,
                "quantity": item.quantity,
                "price": float(item.price)
            }
            for item in items
        ]
    }
