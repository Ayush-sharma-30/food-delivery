from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..auth import get_password_hash, verify_password, create_access_token
from ..models.user import User
from ..models.restaurant import Restaurant
from ..models.delivery_partner import DeliveryPartner
from ..models.admin import Admin

router = APIRouter()

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    role: str
    address: str = None
    pin_code: str = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str

class DeliveryPartnerRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    pin_code: str

@router.post("/register")
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    if user_data.role not in ['customer', 'customer_care']:
        raise HTTPException(status_code=400, detail="Invalid role for user registration")
    
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        phone=user_data.phone,
        role=user_data.role,
        address=user_data.address,
        pin_code=user_data.pin_code
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    
    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role,
        "token": token
    }

@router.post("/register/delivery-partner")
def register_delivery_partner(partner_data: DeliveryPartnerRegister, db: Session = Depends(get_db)):
    existing = db.query(DeliveryPartner).filter(DeliveryPartner.email == partner_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(partner_data.password)
    
    new_partner = DeliveryPartner(
        name=partner_data.name,
        email=partner_data.email,
        password_hash=hashed_password,
        phone=partner_data.phone,
        pin_code=partner_data.pin_code
    )
    
    db.add(new_partner)
    db.commit()
    db.refresh(new_partner)
    
    token = create_access_token(data={"sub": str(new_partner.id), "role": "delivery_partner"})
    
    return {
        "id": new_partner.id,
        "name": new_partner.name,
        "email": new_partner.email,
        "role": "delivery_partner",
        "token": token
    }

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = None
    user_id = None
    
    if login_data.role == "customer" or login_data.role == "customer_care":
        user = db.query(User).filter(
            User.email == login_data.email,
            User.role == login_data.role
        ).first()
        if user:
            user_id = user.id
            password_hash = user.password_hash
    
    elif login_data.role == "restaurant":
        user = db.query(Restaurant).filter(Restaurant.owner_email == login_data.email).first()
        if user:
            user_id = user.id
            password_hash = user.owner_password_hash
    
    elif login_data.role == "delivery_partner":
        user = db.query(DeliveryPartner).filter(DeliveryPartner.email == login_data.email).first()
        if user:
            user_id = user.id
            password_hash = user.password_hash
    
    elif login_data.role == "admin":
        user = db.query(Admin).filter(Admin.email == login_data.email).first()
        if user:
            user_id = user.id
            password_hash = user.password_hash
    
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    if not user or not verify_password(login_data.password, password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = create_access_token(data={"sub": str(user_id), "role": login_data.role})
    
    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": user.name if hasattr(user, 'name') else user.owner_name if hasattr(user, 'owner_name') else user.username,
            "email": login_data.email,
            "role": login_data.role
        }
    }
