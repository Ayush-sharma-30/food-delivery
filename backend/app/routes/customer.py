from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..auth import require_role, get_current_user
from ..models.restaurant import Restaurant
from ..models.dish import Dish
from ..models.order import Order, OrderItem
from ..models.offer import Offer
from ..models.complaint import Complaint
from ..models.delivery_partner import DeliveryPartner
from ..models.platform_fee import PlatformFee

router = APIRouter()

# In-memory cart storage (for prototype - in production use Redis or DB)
cart_storage = {}

class CartItem(BaseModel):
    dish_id: int
    quantity: int

class OfferValidation(BaseModel):
    offer_code: str
    order_amount: float
    restaurant_id: int

class OrderCreate(BaseModel):
    restaurant_id: int
    items: List[CartItem]
    delivery_address: str
    delivery_pin_code: str
    payment_mode: str
    offer_code: Optional[str] = None

class ComplaintCreate(BaseModel):
    order_id: int
    description: str

@router.get("/restaurants")
def browse_restaurants(pin_code: Optional[str] = None, current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    query = db.query(Restaurant).filter(Restaurant.status == 'active')
    
    if pin_code:
        query = query.filter(Restaurant.pin_code == pin_code)
    
    restaurants = query.all()
    
    return {
        "restaurants": [
            {
                "id": r.id,
                "name": r.name,
                "address": r.address,
                "pin_code": r.pin_code,
                "status": r.status
            }
            for r in restaurants
        ]
    }

@router.get("/restaurants/{restaurant_id}/menu")
def get_restaurant_menu(restaurant_id: int, current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    dishes = db.query(Dish).filter(Dish.restaurant_id == restaurant_id).all()
    
    return {
        "restaurant": {
            "id": restaurant.id,
            "name": restaurant.name,
            "address": restaurant.address
        },
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

@router.post("/cart")
def add_to_cart(item: CartItem, current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    user_id = current_user["id"]
    
    dish = db.query(Dish).filter(Dish.id == item.dish_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    if user_id not in cart_storage:
        cart_storage[user_id] = {}
    
    if item.dish_id in cart_storage[user_id]:
        new_qty = cart_storage[user_id][item.dish_id]["quantity"] + item.quantity
        if new_qty <= 0:
            del cart_storage[user_id][item.dish_id]
            return {"message": "Item removed from cart"}
        cart_storage[user_id][item.dish_id]["quantity"] = new_qty
    else:
        if item.quantity <= 0:
            return {"message": "Invalid quantity"}
        cart_storage[user_id][item.dish_id] = {
            "dish_id": item.dish_id,
            "dish_name": dish.name,
            "price": float(dish.price),
            "quantity": item.quantity,
            "photo_path": dish.photo_path,
            "restaurant_id": dish.restaurant_id
        }
    
    return {"message": "Item added to cart"}

@router.get("/cart")
def get_cart(current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    user_id = current_user["id"]
    
    if user_id not in cart_storage or not cart_storage[user_id]:
        return {"items": [], "subtotal": 0.0}
    
    cart_items = list(cart_storage[user_id].values())
    subtotal = sum(item["price"] * item["quantity"] for item in cart_items)
    
    return {
        "items": cart_items,
        "subtotal": subtotal
    }

@router.delete("/cart/{dish_id}")
def remove_from_cart(dish_id: int, current_user: dict = Depends(require_role(["customer"]))):
    user_id = current_user["id"]
    
    if user_id in cart_storage and dish_id in cart_storage[user_id]:
        del cart_storage[user_id][dish_id]
        return {"message": "Item removed from cart"}
    
    raise HTTPException(status_code=404, detail="Item not found in cart")

@router.post("/offers/validate")
def validate_offer(validation: OfferValidation, current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(
        Offer.code == validation.offer_code,
        Offer.is_active == True
    ).first()
    
    if not offer:
        return {"valid": False, "message": "Invalid offer code"}
    
    if offer.offer_type == "restaurant" and offer.restaurant_id != validation.restaurant_id:
        return {"valid": False, "message": "Offer not valid for this restaurant"}
    
    if validation.order_amount < float(offer.min_order_value):
        return {
            "valid": False,
            "message": f"Minimum order value is {offer.min_order_value}"
        }
    
    discount = 0.0
    if offer.discount_type == "percentage":
        discount = validation.order_amount * (float(offer.discount_value) / 100)
        if offer.max_discount:
            discount = min(discount, float(offer.max_discount))
    else:
        discount = float(offer.discount_value)
    
    final_amount = validation.order_amount - discount
    
    return {
        "valid": True,
        "discount_amount": discount,
        "final_amount": final_amount
    }

@router.post("/orders")
def place_order(order_data: OrderCreate, current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    user_id = current_user["id"]
    
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order_data.restaurant_id).first()
    if not restaurant or restaurant.status != 'active':
        raise HTTPException(status_code=400, detail="Restaurant not available")
    
    total_amount = 0.0
    order_items_data = []
    
    for item in order_data.items:
        dish = db.query(Dish).filter(Dish.id == item.dish_id).first()
        if not dish or not dish.availability:
            raise HTTPException(status_code=400, detail=f"Dish {item.dish_id} not available")
        
        item_total = float(dish.price) * item.quantity
        total_amount += item_total
        
        order_items_data.append({
            "dish_id": dish.id,
            "dish_name": dish.name,
            "quantity": item.quantity,
            "price": float(dish.price),
            "photo_path": dish.photo_path
        })
    
    restaurant_fees = total_amount * (float(restaurant.restaurant_fees) / 100) if restaurant.restaurant_fees else 0.0
    
    platform_fee = db.query(PlatformFee).filter(PlatformFee.is_active == True).first()
    platform_fees = 0.0
    if platform_fee:
        if platform_fee.is_percentage:
            platform_fees = total_amount * (float(platform_fee.fee_value) / 100)
        else:
            platform_fees = float(platform_fee.fee_value)
    
    delivery_charges = 40.0
    discount_amount = 0.0
    
    if order_data.offer_code:
        offer = db.query(Offer).filter(Offer.code == order_data.offer_code, Offer.is_active == True).first()
        if offer and total_amount >= float(offer.min_order_value):
            if offer.discount_type == "percentage":
                discount_amount = total_amount * (float(offer.discount_value) / 100)
                if offer.max_discount:
                    discount_amount = min(discount_amount, float(offer.max_discount))
            else:
                discount_amount = float(offer.discount_value)
    
    final_amount = total_amount + restaurant_fees + platform_fees + delivery_charges - discount_amount
    
    available_partner = db.query(DeliveryPartner).filter(
        DeliveryPartner.pin_code == order_data.delivery_pin_code,
        DeliveryPartner.availability == True
    ).first()
    
    new_order = Order(
        user_id=user_id,
        restaurant_id=order_data.restaurant_id,
        delivery_partner_id=available_partner.id if available_partner else None,
        total_amount=total_amount,
        restaurant_fees=restaurant_fees,
        platform_fees=platform_fees,
        delivery_charges=delivery_charges,
        discount_amount=discount_amount,
        final_amount=final_amount,
        payment_mode=order_data.payment_mode,
        status='confirmed' if available_partner else 'pending',
        delivery_address=order_data.delivery_address,
        delivery_pin_code=order_data.delivery_pin_code
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=new_order.id,
            **item_data
        )
        db.add(order_item)
    
    db.commit()
    
    if user_id in cart_storage:
        cart_storage[user_id] = {}
    
    return {
        "order_id": new_order.id,
        "final_amount": float(final_amount),
        "status": new_order.status,
        "delivery_partner_assigned": available_partner is not None,
        "message": "Order placed successfully"
    }

@router.get("/orders")
def get_order_history(current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    user_id = current_user["id"]
    
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.order_date.desc()).all()
    
    result = []
    for order in orders:
        restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        
        result.append({
            "id": order.id,
            "restaurant_name": restaurant.name if restaurant else "Unknown",
            "items": [
                {
                    "dish_name": item.dish_name,
                    "quantity": item.quantity,
                    "price": float(item.price)
                }
                for item in items
            ],
            "final_amount": float(order.final_amount),
            "status": order.status,
            "order_date": order.order_date.isoformat() if order.order_date else None
        })
    
    return {"orders": result}

@router.get("/orders/{order_id}")
def track_order(order_id: int, current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    user_id = current_user["id"]
    
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    
    delivery_partner = None
    if order.delivery_partner_id:
        delivery_partner = db.query(DeliveryPartner).filter(DeliveryPartner.id == order.delivery_partner_id).first()
    
    return {
        "id": order.id,
        "restaurant": {
            "id": restaurant.id,
            "name": restaurant.name,
            "address": restaurant.address
        } if restaurant else None,
        "items": [
            {
                "dish_name": item.dish_name,
                "quantity": item.quantity,
                "price": float(item.price),
                "photo_path": item.photo_path
            }
            for item in items
        ],
        "status": order.status,
        "delivery_partner": {
            "name": delivery_partner.name,
            "phone": delivery_partner.phone
        } if delivery_partner else None,
        "final_amount": float(order.final_amount),
        "order_date": order.order_date.isoformat() if order.order_date else None,
        "delivery_address": order.delivery_address
    }

@router.post("/complaints")
def raise_complaint(complaint_data: ComplaintCreate, current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    user_id = current_user["id"]
    
    order = db.query(Order).filter(Order.id == complaint_data.order_id, Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    new_complaint = Complaint(
        order_id=complaint_data.order_id,
        user_id=user_id,
        description=complaint_data.description
    )
    
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    
    return {
        "complaint_id": new_complaint.id,
        "status": new_complaint.status,
        "message": "Complaint registered successfully"
    }

@router.get("/complaints")
def get_complaints(current_user: dict = Depends(require_role(["customer"])), db: Session = Depends(get_db)):
    user_id = current_user["id"]
    
    complaints = db.query(Complaint).filter(Complaint.user_id == user_id).order_by(Complaint.created_at.desc()).all()
    
    return {
        "complaints": [
            {
                "id": c.id,
                "order_id": c.order_id,
                "description": c.description,
                "status": c.status,
                "resolution_notes": c.resolution_notes,
                "created_at": c.created_at.isoformat() if c.created_at else None
            }
            for c in complaints
        ]
    }
