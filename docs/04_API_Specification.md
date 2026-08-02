# TasteAI: API Specification

*Base URL: `/api/v1`*
*Authentication for MVP: Custom header `X-Session-Token` passed by frontend for user identification.*

## 1. Restaurant Endpoints

### GET `/restaurants/{restaurant_id}`
- **Purpose**: Fetch restaurant landing page details.
- **Method**: GET
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "Spice Symphony",
    "description": "Modern Asian Fusion",
    "logo_url": "https://...",
    "theme_color": "#FF5733"
  }
  ```

### GET `/restaurants/{restaurant_id}/menu`
- **Purpose**: Fetch the full menu, categorized.
- **Method**: GET
- **Response**:
  ```json
  {
    "categories": [
      {
        "id": "uuid",
        "name": "Starters",
        "dishes": [
          {
            "id": "uuid",
            "name": "Spicy Edamame",
            "price": 6.99,
            "image_url": "..."
          }
        ]
      }
    ]
  }
  ```

## 2. Recommendation Endpoints

### GET `/recommendations/{restaurant_id}`
- **Purpose**: Get personalized dish recommendations for the current user.
- **Method**: GET
- **Authentication**: `X-Session-Token` required.
- **Response**:
  ```json
  {
    "recommended_dishes": [
      {
        "dish_id": "uuid",
        "score": 92,
        "reason": "Matches your high preference for umami and spice.",
        "badges": ["Top Match", "Community Pick"]
      }
    ]
  }
  ```

## 3. Taste Profile Endpoints

### POST `/users/taste-profile/quiz`
- **Purpose**: Submit initial taste quiz results to generate a Taste Vector.
- **Method**: POST
- **Request Body**:
  ```json
  {
    "answers": {
      "question_1": "spicy_noodles",
      "question_2": "savory_umami",
      "dietary": ["none"]
    }
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "taste_vector": {
      "spicy": 0.8,
      "umami": 0.7,
      "sweet": 0.2
    }
  }
  ```

### GET `/users/taste-profile`
- **Purpose**: Retrieve the user's current Taste Identity.
- **Method**: GET
- **Authentication**: `X-Session-Token` required.

## 4. AI Chat Endpoints

### POST `/chat/message`
- **Purpose**: Send a message to the AI assistant.
- **Method**: POST
- **Authentication**: `X-Session-Token` required.
- **Request Body**:
  ```json
  {
    "restaurant_id": "uuid",
    "message": "Are the spicy noodles very hot?",
    "context": {
      "current_dish_id": "uuid"
    }
  }
  ```
- **Response**: (Preferably Server-Sent Events / Stream, but JSON for fallback)
  ```json
  {
    "reply": "The spicy noodles use Thai chilies and are quite hot (8/10). Based on your taste profile, you usually enjoy high heat, so this should be perfect for you!"
  }
  ```

## 5. Order & Cart Endpoints

### POST `/orders`
- **Purpose**: Create a new order (Checkout).
- **Method**: POST
- **Authentication**: `X-Session-Token` required.
- **Request Body**:
  ```json
  {
    "restaurant_id": "uuid",
    "items": [
      {
        "dish_id": "uuid",
        "quantity": 2,
        "notes": "No cilantro"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "order_id": "uuid",
    "status": "pending",
    "total": 24.98
  }
  ```

## 6. Feedback Endpoints

### POST `/feedback`
- **Purpose**: Submit post-meal ratings.
- **Method**: POST
- **Authentication**: `X-Session-Token` required.
- **Request Body**:
  ```json
  {
    "dish_id": "uuid",
    "rating": 5
  }
  ```
- **Response**: `200 OK`
