# TasteAI - Project Context & Implementation Details

## Executive Summary
**TasteAI** is a personalized food discovery and recommendation platform for dining experiences. It combines a **deterministic vector-based recommendation engine** with an **AI Dining Assistant powered by Google Gemini**.

The core philosophy of TasteAI is strict separation of concerns:
- **Business Logic & Recommendations**: Fully deterministic, math-based, reproducible, and non-LLM.
- **AI Dining Assistant**: Context-aware conversational agent responsible for explanation, guidance, and interactive assistant capabilities without overriding backend calculations.

---

## Technical Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database & ORM**: SQLite + SQLAlchemy ORM
- **Validation**: Pydantic schemas
- **AI Integration**: Google Gemini API via `google-genai` SDK
- **Architecture**: Layered architecture (API routes -> Services -> Repositories -> Models)

### Frontend
- **Framework**: React 18 + Vite (TypeScript)
- **Styling**: Vanilla CSS + Tailwind CSS v4 custom design system
- **State & Data Fetching**: TanStack React Query + React Context API
- **Icons**: Lucide React
- **Theme**: Premium Dark Mode Palette

---

## Detailed Implementation Breakdown

### 1. Stage 0: Architecture & Data Foundations
- Defined 8-dimensional **Taste Vector Schema**:
  - `Spice`
  - `Sweetness`
  - `Creaminess`
  - `Tanginess`
  - `Smokiness`
  - `Crunch`
  - `Adventure`
  - `Portion Size`
- Standardized API Response Envelopes (`status`, `data`, `message`).
- Currency standardization: Global usage of **Indian Rupees (₹)** across database seeds, models, and UI formatting.

---

### 2. Stage 1: Core Domain & Restaurant Experience
- **Database Models & Repositories**:
  - `User`: Handles identity and session tracking.
  - `Restaurant`: Single/multi-restaurant baseline entity (`Spice Symphony`).
  - `Category`: Categorizes dishes (Starters, Sushi Rolls, Main Course, Desserts, Beverages).
  - `Dish`: Includes vector scores, JSON arrays (`ingredients`, `allergens`, `dietary_tags`, `recommended_pairings`), price in `₹`, and metadata.
- **Frontend Features**:
  - `RestaurantHero`: Displays restaurant banner, name, description, and theme.
  - `CategoryTabs`: Category navigation with active filters.
  - `DishGrid`: Responsive grid layout (scalable up to 7 columns on desktop viewports).
  - `DishCard`: Compact card rendering price in ₹, veg/non-veg indicator, availability, image, and navigation to details.
  - `CartContext` & `CartSummary`: Floating bottom bar managing item quantities, totals in ₹, and active cart state.

---

### 3. Stage 2: Taste Identity System
- **Interactive Quiz Questionnaire**:
  - 8 scenario-based questions mapping user preferences to flavor vectors.
  - Baseline-delta algorithm: Initializes all 8 vector dimensions at **0.5 (50%)**.
  - Applies positive/negative deltas based on user choices and clamps final values between **0.0 (0%)** and **1.0 (100%)**.
- **Taste Profile View**:
  - Displays user profile summary and animated 8-dimensional **Flavor Vector Progress Bars**.
  - Option to retake quiz at any time.

---

### 4. Stage 3: Deterministic Recommendation Engine
- **Service**: `backend/app/services/recommendation.py`
- **Algorithm**:
  - Computes similarity scores between a user's `TasteProfile` vector and every `Dish` vector using weighted Euclidean distance and cosine similarity metrics.
  - Calculates confidence scores based on vector magnitude and question coverage.
  - Generates deterministic, rule-based explanation reasons (e.g., *"Matches your high spice preference"*, *"Fits your crunchy food preference"*).
  - Exposes `/api/v1/recommendations/{user_id}` and `/api/v1/recommendations/{user_id}/dish/{dish_id}`.
- **UI Integration**:
  - `RecommendationCarousel`: Highlights top-matched dishes on the main menu page with match percentages (e.g. `92% Match`).

---

### 5. Stage 4: AI Dining Assistant (Google Gemini)
- **Service**: `backend/app/ai/` (`GeminiProvider`, `PromptBuilder`)
- **Integration**:
  - Uses Google Gemini API key (`AIzaSyC...`).
  - Formats rich system context including restaurant metadata, full dish catalog, current user Taste Identity, active cart items, and current route context.
  - Supports tool calling for UI actions (e.g. adding items to cart, opening dish detail pages, filtering categories).
- **UI Component**:
  - `FloatingChatWidget`: Collapsible, interactive chat window available across pages.

---

### 6. Recent UI/UX Enhancements & Refinement
- **Full Dark Mode Theme**:
  - Custom Tailwind CSS variables (`bg-background: #0A0A0A`, `bg-card: #171717`, `primary: #F97316`).
- **Dense 7-Column Desktop Layout**:
  - Updated `DishGrid` container to `max-w-[1600px]`, `gap-4`, and grid responsive breakpoints up to `2xl:grid-cols-7`.
  - Compact `DishCard` design (`p-3`, `text-xs sm:text-sm` typography).
- **Expanded Dish Details Page (`DishDetailPage`)**:
  - **Dish Flavor Profile**: Renders progress bars for all 8 flavor vector dimensions (`Spice`, `Sweetness`, `Creaminess`, `Tanginess`, `Smokiness`, `Crunch`, `Adventure`, `Portion Size`).
  - **Ingredients**: Rendered as a wrapped pill/badge list for high-density horizontal layout.
  - **Allergens**: Highlighted with red warning badges for safety.
  - **Dietary Tags & Chef's Notes**: Surface dietary options and culinary highlights.
- **Session & Routing Reliability**:
  - Robust session validation on `LandingPage`.
  - Automatically checks if user has a valid `TasteProfile`. If onboarding was interrupted, redirects directly to `/quiz`.
  - Global `ErrorState` component with "Start Over" flow reset.

---

## File Structure Reference

```
innova hack/
├── context.md (This file)
├── backend/
│   ├── app/
│   │   ├── ai/               # Gemini Provider & Prompt Builder
│   │   ├── api/              # FastAPI Routers (restaurant, dishes, taste_profile, recommendations, chat, etc.)
│   │   ├── core/             # Config, Exceptions, Logging
│   │   ├── database/         # SQLAlchemy session setup
│   │   ├── models/           # DB Models (User, Restaurant, Category, Dish, TasteProfile)
│   │   ├── repositories/     # Data Access Layer
│   │   ├── schemas/          # Pydantic Request/Response schemas
│   │   ├── seed/             # Database seeding scripts (Rupee pricing, dish data)
│   │   ├── services/         # Business Logic (Taste Identity, Recommendation Engine)
│   │   └── main.py           # FastAPI App entrypoint
├── frontend/
│   ├── src/
│   │   ├── app/              # Router & Layout wrappers
│   │   ├── features/
│   │   │   ├── chat/         # Floating AI Chat widget
│   │   │   ├── landing/      # Landing Page
│   │   │   ├── onboarding/   # Quiz Page & Questions
│   │   │   ├── profile/      # Taste Profile Page & Vector Cards
│   │   │   └── restaurant/   # Restaurant Page, Dish Grid, Carousel, Dish Details Page
│   │   ├── shared/           # Reusable Components, Types, API Client (Axios), React Query Hooks
│   │   └── index.css         # Dark theme CSS variable definitions
```

---

## Port Configuration & How to Run

- **Backend**: Port `8001`
  ```powershell
  cd backend
  $env:PYTHONPATH = "c:\Users\anant\Desktop\projects\innova hack\backend"
  .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8001
  ```
- **Frontend**: Port `5173`
  ```powershell
  cd frontend
  npm run dev
  ```
