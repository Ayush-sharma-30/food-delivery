import sys
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.dish import Dish
from app.models.delivery_partner import DeliveryPartner
from app.models.admin import Admin
from app.models.platform_fee import PlatformFee
from app.models.offer import Offer
from app.auth import get_password_hash

def seed_database():
    db = SessionLocal()
    
    try:
        print("🌱 Seeding database with sample data...")
        
        # Create Admin
        admin = Admin(
            username="admin",
            email="admin@fooddelivery.com",
            password_hash=get_password_hash("admin123"),
            full_name="System Administrator"
        )
        db.add(admin)
        print("✅ Admin created")
        
        # Create Platform Fee
        platform_fee = PlatformFee(
            fee_type="Service Fee",
            fee_value=5.0,
            is_percentage=True,
            description="Platform service fee",
            is_active=True
        )
        db.add(platform_fee)
        print("✅ Platform fee created")
        
        # Create Restaurants
        restaurants_data = [
            {
                "name": "Pizza Palace",
                "pin_code": "110001",
                "address": "123 Main Street, Delhi",
                "phone": "9876543210",
                "owner_name": "John Doe",
                "owner_email": "pizza@restaurant.com",
                "owner_password": "pizza123",
                "restaurant_fees": 3.0
            },
            {
                "name": "Burger Hub",
                "pin_code": "110001",
                "address": "456 Park Avenue, Delhi",
                "phone": "9876543211",
                "owner_name": "Jane Smith",
                "owner_email": "burger@restaurant.com",
                "owner_password": "burger123",
                "restaurant_fees": 2.5
            },
            {
                "name": "Sushi Station",
                "pin_code": "110002",
                "address": "789 Ocean Drive, Delhi",
                "phone": "9876543212",
                "owner_name": "Mike Johnson",
                "owner_email": "sushi@restaurant.com",
                "owner_password": "sushi123",
                "restaurant_fees": 4.0
            },
            {
                "name": "Curry Corner",
                "pin_code": "110002",
                "address": "321 Spice Lane, Delhi",
                "phone": "9876543213",
                "owner_name": "Priya Sharma",
                "owner_email": "curry@restaurant.com",
                "owner_password": "curry123",
                "restaurant_fees": 2.0
            }
        ]
        
        restaurants = []
        for r_data in restaurants_data:
            restaurant = Restaurant(
                name=r_data["name"],
                pin_code=r_data["pin_code"],
                address=r_data["address"],
                phone=r_data["phone"],
                owner_name=r_data["owner_name"],
                owner_email=r_data["owner_email"],
                owner_password_hash=get_password_hash(r_data["owner_password"]),
                restaurant_fees=r_data["restaurant_fees"],
                status="active"
            )
            db.add(restaurant)
            restaurants.append(restaurant)
        
        db.commit()
        for r in restaurants:
            db.refresh(r)
        print(f"✅ {len(restaurants)} restaurants created")
        
        # Create Dishes for each restaurant
        dishes_data = {
            "Pizza Palace": [
                {"name": "Margherita Pizza", "price": 299, "category": "Pizza", "description": "Classic tomato and mozzarella"},
                {"name": "Pepperoni Pizza", "price": 399, "category": "Pizza", "description": "Loaded with pepperoni"},
                {"name": "Veggie Supreme", "price": 349, "category": "Pizza", "description": "Fresh vegetables"},
                {"name": "Garlic Bread", "price": 99, "category": "Sides", "description": "Crispy garlic bread"},
                {"name": "Pasta Alfredo", "price": 249, "category": "Pasta", "description": "Creamy alfredo sauce"}
            ],
            "Burger Hub": [
                {"name": "Classic Burger", "price": 199, "category": "Burgers", "description": "Beef patty with cheese"},
                {"name": "Chicken Burger", "price": 179, "category": "Burgers", "description": "Grilled chicken"},
                {"name": "Veggie Burger", "price": 159, "category": "Burgers", "description": "Plant-based patty"},
                {"name": "French Fries", "price": 79, "category": "Sides", "description": "Crispy fries"},
                {"name": "Milkshake", "price": 129, "category": "Beverages", "description": "Chocolate milkshake"}
            ],
            "Sushi Station": [
                {"name": "California Roll", "price": 349, "category": "Sushi", "description": "Crab and avocado"},
                {"name": "Salmon Nigiri", "price": 399, "category": "Sushi", "description": "Fresh salmon"},
                {"name": "Tuna Roll", "price": 429, "category": "Sushi", "description": "Spicy tuna"},
                {"name": "Miso Soup", "price": 99, "category": "Soup", "description": "Traditional miso"},
                {"name": "Edamame", "price": 149, "category": "Appetizers", "description": "Steamed soybeans"}
            ],
            "Curry Corner": [
                {"name": "Butter Chicken", "price": 299, "category": "Main Course", "description": "Creamy tomato curry"},
                {"name": "Paneer Tikka", "price": 249, "category": "Main Course", "description": "Grilled cottage cheese"},
                {"name": "Biryani", "price": 279, "category": "Rice", "description": "Aromatic rice dish"},
                {"name": "Naan", "price": 49, "category": "Bread", "description": "Indian flatbread"},
                {"name": "Gulab Jamun", "price": 99, "category": "Dessert", "description": "Sweet dumplings"}
            ]
        }
        
        dish_count = 0
        for restaurant in restaurants:
            if restaurant.name in dishes_data:
                for dish_data in dishes_data[restaurant.name]:
                    dish = Dish(
                        restaurant_id=restaurant.id,
                        name=dish_data["name"],
                        description=dish_data["description"],
                        price=dish_data["price"],
                        category=dish_data["category"],
                        photo_path=f"/images/dishes/{dish_data['name'].lower().replace(' ', '_')}.jpg",
                        availability=True
                    )
                    db.add(dish)
                    dish_count += 1
        
        db.commit()
        print(f"✅ {dish_count} dishes created")
        
        # Create Delivery Partners
        delivery_partners_data = [
            {"name": "Rahul Kumar", "email": "rahul@delivery.com", "password": "delivery123", "phone": "9876543220", "pin_code": "110001"},
            {"name": "Amit Singh", "email": "amit@delivery.com", "password": "delivery123", "phone": "9876543221", "pin_code": "110001"},
            {"name": "Priya Patel", "email": "priya@delivery.com", "password": "delivery123", "phone": "9876543222", "pin_code": "110002"},
            {"name": "Vijay Sharma", "email": "vijay@delivery.com", "password": "delivery123", "phone": "9876543223", "pin_code": "110002"}
        ]
        
        for dp_data in delivery_partners_data:
            partner = DeliveryPartner(
                name=dp_data["name"],
                email=dp_data["email"],
                password_hash=get_password_hash(dp_data["password"]),
                phone=dp_data["phone"],
                pin_code=dp_data["pin_code"],
                availability=True
            )
            db.add(partner)
        
        db.commit()
        print(f"✅ {len(delivery_partners_data)} delivery partners created")
        
        # Create Sample Customers
        customers_data = [
            {"name": "Alice Johnson", "email": "alice@customer.com", "password": "customer123", "phone": "9876543230", "pin_code": "110001", "address": "101 Customer Street"},
            {"name": "Bob Williams", "email": "bob@customer.com", "password": "customer123", "phone": "9876543231", "pin_code": "110002", "address": "202 User Avenue"}
        ]
        
        for c_data in customers_data:
            customer = User(
                name=c_data["name"],
                email=c_data["email"],
                password_hash=get_password_hash(c_data["password"]),
                phone=c_data["phone"],
                role="customer",
                address=c_data["address"],
                pin_code=c_data["pin_code"]
            )
            db.add(customer)
        
        db.commit()
        print(f"✅ {len(customers_data)} customers created")
        
        # Create Customer Care User
        support = User(
            name="Support Team",
            email="support@fooddelivery.com",
            password_hash=get_password_hash("support123"),
            phone="9876543240",
            role="customer_care"
        )
        db.add(support)
        db.commit()
        print("✅ Customer care user created")
        
        # Create Platform Offers
        offers_data = [
            {"code": "WELCOME50", "description": "Welcome offer - 50 off", "discount_type": "fixed", "discount_value": 50, "min_order_value": 200},
            {"code": "FLAT20", "description": "Flat 20% off", "discount_type": "percentage", "discount_value": 20, "min_order_value": 300, "max_discount": 100}
        ]
        
        for o_data in offers_data:
            offer = Offer(
                code=o_data["code"],
                description=o_data["description"],
                discount_type=o_data["discount_type"],
                discount_value=o_data["discount_value"],
                min_order_value=o_data["min_order_value"],
                max_discount=o_data.get("max_discount"),
                offer_type="platform",
                is_active=True
            )
            db.add(offer)
        
        db.commit()
        print(f"✅ {len(offers_data)} platform offers created")
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📝 Login Credentials:")
        print("\n👤 Admin:")
        print("   Email: admin@fooddelivery.com")
        print("   Password: admin123")
        print("\n🍕 Restaurant Owners:")
        print("   Pizza Palace: pizza@restaurant.com / pizza123")
        print("   Burger Hub: burger@restaurant.com / burger123")
        print("   Sushi Station: sushi@restaurant.com / sushi123")
        print("   Curry Corner: curry@restaurant.com / curry123")
        print("\n👥 Customers:")
        print("   Alice: alice@customer.com / customer123")
        print("   Bob: bob@customer.com / customer123")
        print("\n🚚 Delivery Partners:")
        print("   Rahul: rahul@delivery.com / delivery123")
        print("   Amit: amit@delivery.com / delivery123")
        print("   Priya: priya@delivery.com / delivery123")
        print("   Vijay: vijay@delivery.com / delivery123")
        print("\n💬 Customer Care:")
        print("   Support: support@fooddelivery.com / support123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
    seed_database()
