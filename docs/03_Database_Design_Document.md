# TasteAI: Database Design Document

*Note: For the MVP, SQLite can be used, but the schema is designed with PostgreSQL in mind, specifically utilizing JSON/JSONB fields for flexible vector storage.*

## 1. Restaurant
Stores information about participating restaurants.
- **Fields**:
  - `id` (UUID, Primary Key)
  - `name` (String, Not Null)
  - `description` (Text)
  - `logo_url` (String)
  - `theme_color` (String)
  - `created_at` (DateTime, Default: now())
- **Relationships**: Has many Dishes, Categories, Orders.
- **Indexes**: `idx_restaurant_name`

## 2. Category
Menu categories (e.g., Starters, Mains, Drinks).
- **Fields**:
  - `id` (UUID, Primary Key)
  - `restaurant_id` (UUID, Foreign Key)
  - `name` (String, Not Null)
  - `sort_order` (Integer, Default: 0)
- **Relationships**: Belongs to Restaurant, Has many Dishes.
- **Constraints**: Unique `(restaurant_id, name)`

## 3. Dish
Individual menu items.
- **Fields**:
  - `id` (UUID, Primary Key)
  - `restaurant_id` (UUID, Foreign Key)
  - `category_id` (UUID, Foreign Key)
  - `name` (String, Not Null)
  - `description` (Text)
  - `price` (Decimal(10,2), Not Null)
  - `image_url` (String)
  - `flavor_vector` (JSONB) - e.g., `{"sweet": 0.1, "spicy": 0.8, "umami": 0.6}`
  - `dietary_tags` (JSONB) - e.g., `["vegan", "gluten-free"]`
  - `ingredients` (JSONB) - List of ingredients for AI RAG.
  - `is_available` (Boolean, Default: True)
- **Relationships**: Belongs to Restaurant, Category. Has many OrderItems, Feedbacks.
- **Indexes**: `idx_dish_restaurant_id`

## 4. User
End users of the platform (diners).
- **Fields**:
  - `id` (UUID, Primary Key)
  - `session_token` (String, Unique) - For anonymous MVP tracking.
  - `name` (String, Nullable)
  - `created_at` (DateTime)
- **Relationships**: Has one TasteProfile, Has many Orders, Feedbacks.
- **Future Extensions**: Add email, phone, password_hash for persistent accounts.

## 5. TasteProfile
The core Taste Identity of a user.
- **Fields**:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, Foreign Key, Unique)
  - `taste_vector` (JSONB) - e.g., `{"sweet": 0.4, "spicy": 0.9, "umami": 0.7, "adventurous": 0.8}`
  - `dietary_restrictions` (JSONB) - e.g., `["nut_allergy"]`
  - `updated_at` (DateTime)
- **Relationships**: Belongs to User.
- **Constraints**: Unique `user_id`.

## 6. Order
Represents a user's cart and finalized order.
- **Fields**:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, Foreign Key)
  - `restaurant_id` (UUID, Foreign Key)
  - `status` (String) - Enum: `pending`, `paid`, `completed`
  - `total_amount` (Decimal(10,2))
  - `created_at` (DateTime)
- **Relationships**: Belongs to User, Restaurant. Has many OrderItems.

## 7. OrderItem
Dishes within an order.
- **Fields**:
  - `id` (UUID, Primary Key)
  - `order_id` (UUID, Foreign Key)
  - `dish_id` (UUID, Foreign Key)
  - `quantity` (Integer, Default: 1)
  - `unit_price` (Decimal(10,2))
  - `notes` (Text, Nullable)
- **Relationships**: Belongs to Order, Dish.

## 8. Feedback
Post-meal ratings used to update Taste Profiles and Community Signals.
- **Fields**:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, Foreign Key)
  - `dish_id` (UUID, Foreign Key)
  - `rating` (Integer) - 1 to 5 scale, or binary 1/-1 for MVP.
  - `created_at` (DateTime)
- **Relationships**: Belongs to User, Dish.
- **Constraints**: Unique `(user_id, dish_id)` to prevent duplicate ratings on the same dish (or handle via time-scoping).

## 9. CommunitySignal (Materialized View / Aggregate Table)
Pre-calculated or frequently updated aggregates for faster recommendation lookups.
- **Fields**:
  - `dish_id` (UUID, Primary Key)
  - `positive_ratings_count` (Integer)
  - `average_rating` (Decimal(3,2))
  - `top_taste_traits` (JSONB) - Traits of users who liked this most.
- **Future Extensions**: Convert to a true Redis/In-memory cache layer.

## 10. RestaurantMetadata
Additional context strictly for the AI assistant.
- **Fields**:
  - `id` (UUID, Primary Key)
  - `restaurant_id` (UUID, Foreign Key)
  - `key` (String) - e.g., `wifi_password`, `restroom_code`, `chef_bio`, `sourcing_info`
  - `value` (Text)
- **Relationships**: Belongs to Restaurant.
- **Indexes**: `idx_meta_restaurant_key`
