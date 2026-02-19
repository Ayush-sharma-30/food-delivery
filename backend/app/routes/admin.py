from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from ..database import get_db
from ..auth import require_role, get_password_hash
from ..models.restaurant import Restaurant
from ..models.platform_fee import PlatformFee
from ..models.offer import Offer

router = APIRouter()

class RestaurantCreate(BaseModel):
    name: str
    pin_code: str
    address: str
    phone: str
    owner_name: str
    owner_email: EmailStr
    owner_password: str
    restaurant_fees: float = 0.0

class RestaurantUpdate(BaseModel):
    status: Optional[str] = None
    restaurant_fees: Optional[float] = None

class PlatformFeeCreate(BaseModel):
    fee_type: str
    fee_value: float
    is_percentage: bool = False
    description: str = None

class OfferCreate(BaseModel):
    code: str
    description: str
    discount_type: str
    discount_value: float
    min_order_value: float = 0.0
    max_discount: Optional[float] = None
    valid_until: Optional[str] = None

@router.post("/restaurants", dependencies=[Depends(require_role(["admin"]))])
def add_restaurant(restaurant: RestaurantCreate, db: Session = Depends(get_db)):
    existing = db.query(Restaurant).filter(Restaurant.owner_email == restaurant.owner_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Restaurant with this email already exists")
    
    hashed_password = get_password_hash(restaurant.owner_password)
    
    new_restaurant = Restaurant(
        name=restaurant.name,
        pin_code=restaurant.pin_code,
        address=restaurant.address,
        phone=restaurant.phone,
        owner_name=restaurant.owner_name,
        owner_email=restaurant.owner_email,
        owner_password_hash=hashed_password,
        restaurant_fees=restaurant.restaurant_fees
    )
    
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    
    return {
        "id": new_restaurant.id,
        "name": new_restaurant.name,
        "status": new_restaurant.status,
        "message": "Restaurant added successfully"
    }

@router.get("/restaurants", dependencies=[Depends(require_role(["admin"]))])
def get_all_restaurants(db: Session = Depends(get_db)):
    restaurants = db.query(Restaurant).all()
    return {
        "restaurants": [
            {
                "id": r.id,
                "name": r.name,
                "pin_code": r.pin_code,
                "address": r.address,
                "status": r.status,
                "restaurant_fees": float(r.restaurant_fees),
                "owner_name": r.owner_name,
                "owner_email": r.owner_email
            }
            for r in restaurants
        ]
    }

@router.put("/restaurants/{restaurant_id}", dependencies=[Depends(require_role(["admin"]))])
def update_restaurant(restaurant_id: int, update_data: RestaurantUpdate, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    if update_data.status:
        restaurant.status = update_data.status
    if update_data.restaurant_fees is not None:
        restaurant.restaurant_fees = update_data.restaurant_fees
    
    db.commit()
    return {"message": "Restaurant updated successfully"}

@router.post("/platform-fees", dependencies=[Depends(require_role(["admin"]))])
def create_platform_fee(fee: PlatformFeeCreate, db: Session = Depends(get_db)):
    new_fee = PlatformFee(
        fee_type=fee.fee_type,
        fee_value=fee.fee_value,
        is_percentage=fee.is_percentage,
        description=fee.description
    )
    
    db.add(new_fee)
    db.commit()
    db.refresh(new_fee)
    
    return {"id": new_fee.id, "message": "Platform fee created successfully"}

@router.get("/platform-fees", dependencies=[Depends(require_role(["admin"]))])
def get_platform_fees(db: Session = Depends(get_db)):
    fees = db.query(PlatformFee).filter(PlatformFee.is_active == True).all()
    return {
        "fees": [
            {
                "id": f.id,
                "fee_type": f.fee_type,
                "fee_value": float(f.fee_value),
                "is_percentage": f.is_percentage,
                "description": f.description
            }
            for f in fees
        ]
    }

@router.post("/offers", dependencies=[Depends(require_role(["admin"]))])
def create_platform_offer(offer: OfferCreate, db: Session = Depends(get_db)):
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
        offer_type="platform"
    )
    
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    
    return {"id": new_offer.id, "code": new_offer.code, "message": "Platform offer created successfully"}

@router.get("/offers", dependencies=[Depends(require_role(["admin"]))])
def get_platform_offers(db: Session = Depends(get_db)):
    offers = db.query(Offer).filter(Offer.offer_type == "platform", Offer.is_active == True).all()
    return {
        "offers": [
            {
                "id": o.id,
                "code": o.code,
                "description": o.description,
                "discount_type": o.discount_type,
                "discount_value": float(o.discount_value),
                "min_order_value": float(o.min_order_value)
            }
            for o in offers
        ]
    }
