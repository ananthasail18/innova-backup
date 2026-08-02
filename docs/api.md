# TasteAI API Reference

## Configuration

- **Base URL**: `http://localhost:8001/api/v1`
- **Content-Type**: `application/json`

---

## Response Format

All API endpoints return responses formatted in a standard response envelope:

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional message text"
}
```

---

## Endpoints Summary

### System & Health

#### `GET /health`
Verifies backend operational status.

- **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "data": { "status": "ok" },
    "message": "System is healthy"
  }
  ```

---

### Restaurant & Menu

#### `GET /api/v1/restaurant`
Fetches primary restaurant metadata.

- **Response `200 OK`**: `ResponseEnvelope[RestaurantOut]`

#### `GET /api/v1/categories`
Fetches menu categories sorted by display order.

- **Response `200 OK`**: `ResponseEnvelope[List[CategoryOut]]`

#### `GET /api/v1/dishes`
Fetches dishes. Optionally filterable by category.

- **Query Parameters**:
  - `category_id` *(optional, string)*: Category UUID filter.
- **Response `200 OK`**: `ResponseEnvelope[List[DishOut]]`

#### `GET /api/v1/dish/{id}`
Fetches detailed dish information including flavor vectors, ingredients, allergens, and chef's notes.

- **Path Parameters**:
  - `id` *(string)*: Dish UUID.
- **Response `200 OK`**: `ResponseEnvelope[DishOut]`

---

### User & Taste Profile

#### `POST /api/v1/users`
Creates a guest user session.

- **Request Body**:
  ```json
  { "name": "Guest", "email": "user@example.com" }
  ```
- **Response `201 Created`**: User object details.

#### `GET /api/v1/users/{user_id}`
Fetches user details by ID.

#### `POST /api/v1/taste-profile`
Submits quiz answers and generates an 8-dimensional Taste Profile vector using the baseline-delta algorithm.

- **Request Body**:
  ```json
  {
    "user_id": "uuid-str",
    "answers": [
      { "question_id": "q_paneer_butter", "selected_option_id": "opt_too_mild" }
    ]
  }
  ```
- **Response `201 Created`**: Generated `TasteProfileOut` object.

#### `GET /api/v1/taste-profile/{user_id}`
Fetches calculated Taste Identity flavor vectors for a user.

---

### Recommendation Engine

#### `GET /api/v1/recommendations/{user_id}`
Calculates deterministic vector distance similarity and returns ranked dish recommendations.

- **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "data": {
      "user_id": "uuid-str",
      "recommendations": [
        {
          "dish": { ... },
          "score": 0.92,
          "confidence": 0.85,
          "reasons": [
            { "type": "taste", "text": "Matches your high spice preference (80%)" }
          ]
        }
      ]
    }
  }
  ```

#### `GET /api/v1/recommendations/{user_id}/top`
Fetches top `N` recommendations (default `limit=3`).

#### `GET /api/v1/recommendations/{user_id}/dish/{dish_id}`
Fetches recommendation match score and explainability reasons for a specific dish.

---

### AI Dining Assistant

#### `POST /api/v1/chat`
Interacts with the Google Gemini AI Assistant.

- **Request Body**:
  ```json
  {
    "user_id": "uuid-str",
    "restaurant_id": "uuid-str",
    "message": "Can you recommend a crunchy starter?",
    "conversation_history": [
      { "role": "user", "content": "Hi" },
      { "role": "assistant", "content": "Hello! How can I help?" }
    ],
    "page_context": "/restaurant",
    "selected_dish_id": null
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "data": {
      "message": "I highly recommend the Spicy Edamame!",
      "tool_calls": [
        { "id": "call_123", "name": "openDish", "arguments": "{\"dish_id\":\"uuid-str\"}" }
      ],
      "updated_ui_actions": [
        { "action": "NAVIGATE", "payload": { "path": "/dish/uuid-str" } }
      ]
    }
  }
  ```
