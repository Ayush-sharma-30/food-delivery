from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base

# Import all models to ensure they are registered with SQLAlchemy
from .models.user import User
from .models.restaurant import Restaurant
from .models.dish import Dish
from .models.order import Order, OrderItem
from .models.delivery_partner import DeliveryPartner
from .models.complaint import Complaint
from .models.offer import Offer
from .models.platform_fee import PlatformFee
from .models.admin import Admin

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Food Delivery Platform API",
    description="API for food ordering and delivery management system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from .routes import auth, admin, restaurant_routes, customer, delivery, support

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(restaurant_routes.router, prefix="/api/v1/restaurant", tags=["Restaurant"])
app.include_router(customer.router, prefix="/api/v1/customer", tags=["Customer"])
app.include_router(delivery.router, prefix="/api/v1/delivery", tags=["Delivery"])
app.include_router(support.router, prefix="/api/v1/support", tags=["Support"])

@app.get("/")
async def root():
    return {
        "message": "Food Delivery Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
