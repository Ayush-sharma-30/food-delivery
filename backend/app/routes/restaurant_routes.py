from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..auth import require_role, get_current_user
from ..models.dish import Dish
from ..models.restaurant import Restaurant
from ..models.order import Order, OrderItem
from ..models.offer import Offer

router = APIRouter()

class DishCreate(BaseModel):
    name: str
    description: str = None
    price: float
    photo_path: str = None
    category: str = None
    availability: bool = True

class DishUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    photo_path: Optional[str] = None
    availability: Optional[bool] = None

class RestaurantStatusUpdate(BaseModel):
    status: str

class RestaurantOfferCreate(BaseModel):
    code: str
    description: str
    discount_type: str
    discount_value: float
    min_order_value: float = 0.0
    max_discount: Optional[float] = None

@router.post("/dishes", dependencies=[Depends(require_role(["restaurant"]))])
def add_dish(dish: DishCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    
    new_dish = Dish(
        restaurant_id=restaurant_id,
        name=dish.name,
        description=dish.description,
        price=dish.price,
        photo_path=dish.photo_path,
        category=dish.category,
        availability=dish.availability
    )
    
    db.add(new_dish)
    db.commit()
    db.refresh(new_dish)
    
    return {
        "id": new_dish.id,
        "name": new_dish.name,
        "price": float(new_dish.price),
        "message": "Dish added successfully"
    }

@router.get("/dishes", dependencies=[Depends(require_role(["restaurant"]))])
def get_restaurant_dishes(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    dishes = db.query(Dish).filter(Dish.restaurant_id == restaurant_id).all()
    
    return {
        "dishes": [
            {
                "id": d.id,
                "name": d.name,
                "description": d.description,
                "price": float(d.price),
                "photo_path": d.photo_path,
                "availability": d.availability,
                "category": d.category
            }
            for d in dishes
        ]
    }

@router.put("/dishes/{dish_id}", dependencies=[Depends(require_role(["restaurant"]))])
def update_dish(dish_id: int, dish_update: DishUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    
    dish = db.query(Dish).filter(Dish.id == dish_id, Dish.restaurant_id == restaurant_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    if dish_update.name:
        dish.name = dish_update.name
    if dish_update.description is not None:
        dish.description = dish_update.description
    if dish_update.price is not None:
        dish.price = dish_update.price
    if dish_update.photo_path is not None:
        dish.photo_path = dish_update.photo_path
    if dish_update.availability is not None:
        dish.availability = dish_update.availability
    
    db.commit()
    return {"message": "Dish updated successfully"}

@router.delete("/dishes/{dish_id}", dependencies=[Depends(require_role(["restaurant"]))])
def delete_dish(dish_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    
    dish = db.query(Dish).filter(Dish.id == dish_id, Dish.restaurant_id == restaurant_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    db.delete(dish)
    db.commit()
    return {"message": "Dish deleted successfully"}

@router.put("/status", dependencies=[Depends(require_role(["restaurant"]))])
def update_restaurant_status(status_update: RestaurantStatusUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    restaurant.status = status_update.status
    db.commit()
    
    return {"message": f"Restaurant status updated to {status_update.status}"}

@router.get("/orders", dependencies=[Depends(require_role(["restaurant"]))])
def get_restaurant_orders(status: Optional[str] = None, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    
    query = db.query(Order).filter(Order.restaurant_id == restaurant_id)
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.order_date.desc()).all()
    
    result = []
    for order in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "items": [
                {
                    "dish_name": item.dish_name,
                    "quantity": item.quantity,
                    "price": float(item.price)
                }
                for item in items
            ],
            "total_amount": float(order.total_amount),
            "final_amount": float(order.final_amount),
            "status": order.status,
            "order_date": order.order_date.isoformat() if order.order_date else None,
            "delivery_address": order.delivery_address
        })
    
    return {"orders": result}

class OrderStatusUpdate(BaseModel):
    status: str

@router.put("/orders/{order_id}/status", dependencies=[Depends(require_role(["restaurant"]))])
def update_order_status(order_id: int, status_update: OrderStatusUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    
    order = db.query(Order).filter(Order.id == order_id, Order.restaurant_id == restaurant_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    valid_transitions = {
        'pending': ['confirmed', 'preparing', 'cancelled'],
        'confirmed': ['preparing', 'cancelled'],
        'preparing': ['ready', 'cancelled'],
        'ready': [],
    }
    allowed = valid_transitions.get(order.status, [])
    if status_update.status not in allowed:
        raise HTTPException(status_code=400, detail=f"Cannot change from '{order.status}' to '{status_update.status}'")
    
    order.status = status_update.status
    db.commit()
    
    return {"message": f"Order status updated to {status_update.status}"}

@router.post("/offers", dependencies=[Depends(require_role(["restaurant"]))])
def create_restaurant_offer(offer: RestaurantOfferCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant_id = current_user["id"]
    
    existing = db.query(Offer).filter(Offer.code == offer.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Offer code already exists")
    
    new_offer = Offer(
        code=offer.code,
        description=offer.description,
        discount_type=offer.discount_type,
        discount_value=offer.discount_value,
        min_order_value=offer.min_order_value,
        max_discount=offer.max_discount,
        restaurant_id=restaurant_id,
        offer_type="restaurant"
    )
    
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    
    return {"id": new_offer.id, "code": new_offer.code, "message": "Restaurant offer created successfully"}
