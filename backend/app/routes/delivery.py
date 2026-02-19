from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..auth import require_role, get_current_user
from ..models.delivery_partner import DeliveryPartner
from ..models.order import Order, OrderItem
from ..models.restaurant import Restaurant

router = APIRouter()

class AvailabilityUpdate(BaseModel):
    availability: bool

class DeliveryStatusUpdate(BaseModel):
    status: str

@router.put("/availability", dependencies=[Depends(require_role(["delivery_partner"]))])
def toggle_availability(update: AvailabilityUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    partner_id = current_user["id"]
    
    partner = db.query(DeliveryPartner).filter(DeliveryPartner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found")
    
    partner.availability = update.availability
    db.commit()
    
    return {
        "availability": partner.availability,
        "message": f"Availability set to {'available' if update.availability else 'unavailable'}"
    }

@router.get("/orders", dependencies=[Depends(require_role(["delivery_partner"]))])
def get_assigned_orders(status: Optional[str] = None, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    partner_id = current_user["id"]
    
    query = db.query(Order).filter(Order.delivery_partner_id == partner_id)
    
    if status:
        query = query.filter(Order.status == status)
    else:
        query = query.filter(Order.status.in_(['ready', 'picked_up']))
    
    orders = query.order_by(Order.order_date.desc()).all()
    
    result = []
    for order in orders:
        restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        
        result.append({
            "id": order.id,
            "restaurant": {
                "name": restaurant.name,
                "address": restaurant.address,
                "phone": restaurant.phone
            } if restaurant else None,
            "customer_address": order.delivery_address,
            "customer_pin_code": order.delivery_pin_code,
            "status": order.status,
            "items": [
                {
                    "dish_name": item.dish_name,
                    "quantity": item.quantity
                }
                for item in items
            ],
            "order_date": order.order_date.isoformat() if order.order_date else None
        })
    
    return {"orders": result}

@router.put("/orders/{order_id}/status", dependencies=[Depends(require_role(["delivery_partner"]))])
def update_delivery_status(order_id: int, status_update: DeliveryStatusUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    partner_id = current_user["id"]
    
    order = db.query(Order).filter(Order.id == order_id, Order.delivery_partner_id == partner_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or not assigned to you")
    
    if status_update.status not in ['picked_up', 'delivered']:
        raise HTTPException(status_code=400, detail="Invalid status. Use 'picked_up' or 'delivered'")
    
    order.status = status_update.status
    
    if status_update.status == 'delivered':
        from datetime import datetime
        order.delivered_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Order status updated to {status_update.status}"}
