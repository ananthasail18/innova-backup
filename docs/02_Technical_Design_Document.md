# TasteAI: Technical Design Document

## 1. Overall Architecture
TasteAI follows a modern, decoupled client-server architecture.
- **Client**: A responsive web application built with React, Vite, and TailwindCSS.
- **Backend API**: A RESTful API built with FastAPI (Python) handling business logic, database operations, and recommendation scoring.
- **Database**: PostgreSQL (SQLite for MVP local dev) for structured relational data and JSON fields for taste vectors.
- **AI Layer**: NVIDIA NIM hosting Llama 3.1 70B, accessed via API by the FastAPI backend to generate conversational responses and recommendation explanations.

## 2. Frontend Architecture
- **Framework**: React 18+ with TypeScript, bundled by Vite for fast HMR and optimized builds.
- **Styling**: TailwindCSS for utility-first styling.
- **UI Library**: `shadcn/ui` for accessible, customizable, and unstyled base components (Radix UI primitives).
- **State Management**: React Context for global state (User Session, Cart, Taste Profile) and local component state for UI interactions. React Query (TanStack Query) for server-state caching and API fetching.
- **Routing**: React Router for client-side navigation (Landing -> Quiz -> Menu -> Dish -> Cart -> Checkout).

## 3. Backend Architecture
- **Framework**: FastAPI (Python 3.11+). Chosen for high performance, async support, and automatic OpenAPI documentation.
- **ORM**: SQLAlchemy 2.0 with async engine for database interactions.
- **Data Validation**: Pydantic v2 for request/response schemas and environment variable management.
- **Endpoints**: Modular routers (`/users`, `/restaurants`, `/menu`, `/recommendations`, `/chat`, `/orders`).

## 4. AI Architecture
- **Model**: Llama 3.1 70B hosted on NVIDIA NIM.
- **Integration**: FastAPI backend acts as an orchestrator/proxy. The frontend never talks directly to the LLM.
- **Execution Flow**:
  1. Frontend sends user message + current context (viewing dish X, cart contents).
  2. Backend constructs a layered prompt (System Rules + Restaurant Context + User Taste Profile + Conversation History).
  3. Backend calls NVIDIA NIM API (streaming response).
  4. Backend streams the response back to the frontend via Server-Sent Events (SSE) or WebSocket.

## 5. Recommendation Engine
- **Core Concept**: Deterministic scoring based on Cosine Similarity. No vector database is required for the MVP.
- **Taste Vector**: A JSON object mapping flavor dimensions (e.g., `spicy: 0.8`, `sweet: 0.2`, `umami: 0.9`, `adventurous: 0.7`) stored for both the User and the Dish.
- **Calculation**: When a menu is requested, the backend calculates the cosine similarity between the User's Taste Vector and every Dish's Flavor Vector in real-time.
- **Output**: An ordered list of dishes with a `match_score` (0-100%).
- **Explainability**: The backend passes the highest matching traits to the LLM to generate a one-sentence reason (e.g., "Matches your high preference for umami and spice").

## 6. Prompt Builder
The backend includes a `PromptBuilder` utility that constructs context-rich prompts dynamically:
- **System Layer**: Strict instructions on persona ("You are TasteAI...") and boundaries ("Do not invent dishes").
- **Knowledge Layer**: Injected JSON of the restaurant's menu, ingredients, and currently available items.
- **Identity Layer**: The user's parsed taste preferences and dietary restrictions.
- **Context Layer**: The user's current UI state (e.g., "The user is currently looking at the Spicy Tuna Roll").

## 7. Community Recommendation Engine
- **Mechanism**: Alongside the direct Taste Vector match, dishes gain a "Community Boost" score.
- **Calculation**: Find users with a high cosine similarity (>0.85) to the current user's Taste Vector. Aggregate their highest-rated dishes at the current restaurant.
- **Signal**: If a similar user loved a dish, bump its recommendation score and tag it as a "Community Pick."

## 8. Database Relationships
- `Restaurant` (1) --- (N) `Dish`
- `Restaurant` (1) --- (N) `Category`
- `Dish` (N) --- (1) `Category`
- `User` (1) --- (1) `TasteProfile`
- `User` (1) --- (N) `Order`
- `Restaurant` (1) --- (N) `Order`
- `Order` (1) --- (N) `OrderItem`
- `OrderItem` (N) --- (1) `Dish`
- `User` (1) --- (N) `Feedback`
- `Dish` (1) --- (N) `Feedback`

## 9. Authentication Strategy (Future)
- **MVP**: Anonymous sessions tied to local storage / session cookies. A temporary `user_id` is generated upon scanning the QR code.
- **Future**: OAuth2 (Google/Apple) or Magic Links via SMS to persist the Taste Identity across devices and visits. JWT-based authentication for the API.

## 10. Deployment Architecture
- **Frontend**: Hosted on Vercel or Netlify for edge CDN caching and CI/CD integration.
- **Backend API**: Deployed on Render, Heroku, or AWS App Runner as a Dockerized container.
- **Database**: Managed PostgreSQL (e.g., Supabase, Neon, or AWS RDS).
- **AI Inference**: External API call to NVIDIA NIM endpoints.
