# TasteAI - Project Context & Integration Guide

This document outlines the features and components that have been developed for the TasteAI project. It is intended to help team members, specifically backend engineers, understand the current implementation state, data flow, and frontend requirements for seamless integration.

## Implemented Features

### Frontend (Mobile React/Vite/Tailwind)
*   **Taste DNA Onboarding (Quiz):** 
    *   Automatically provisions a guest session if none exists.
    *   Walks the user through a guided 8-question quiz matched exactly to the Taste DNA dimensions.
    *   Features smooth auto-advancing UX on selection and explicit "Establish Taste DNA" validation step.
*   **Zomato Overlay / Native Experience:**
    *   Custom `ZomatoOverlayPage.tsx` designed to match Zomato's UI aesthetic (Red color scheme, compact glassmorphism).
    *   Includes a quick Multi-Restaurant Switcher pill bar to easily swap between context menus (e.g., Spice Symphony, Rameshwaram Cafe).
*   **Phone Chassis & Container Queries:**
    *   The `Layout.tsx` traps the UI in a max 415px phone simulator frame on desktop.
    *   Uses Tailwind v4 `@container` queries exclusively inside components (e.g. `@md:grid-cols-2`) instead of standard media queries to ensure grids scale correctly relative to the chassis, not the physical monitor.
*   **Taste DNA Dashboard (`TasteDNADashboard.tsx`):**
    *   Visualizes the user's 8-dimensional Taste DNA via a Radar Chart.
    *   Displays a real-time **Taste DNA Evolution Timeline**, reflecting changes to the profile over time.
*   **Personalized Recommendation Engine UI:**
    *   `RecommendationCarousel.tsx` displays dishes prioritized by Taste DNA match scores.
    *   Spaced, mobile-friendly product cards with badges for dietary restrictions.
*   **Real-time Post-Order Feedback Loop (`PostOrderFeedback.tsx`):**
    *   Modal that pops up after ordering, allowing users to rate their meals across all 8 Taste DNA dimensions (Spiciness, Sweetness, Creaminess, Tanginess, Masala, Crunchiness, Oiliness, Saltiness).
    *   Immediately triggers the `/taste-dna/feedback` API and displays a real-time preview of the resulting DNA evolution history (e.g., "Spice adjusted 0.50 ➔ 0.60").

### Backend / API (FastAPI)
*   **Taste DNA Learning Engine (`taste_dna_learning.py`):**
    *   Uses a LERP (Linear Interpolation) algorithm to adjust flavor vectors based on feedback deltas.
    *   Maintains a `recent_evolution` log of text-based summaries whenever a profile is updated.
*   **Context & Menu Management:**
    *   Provides structured restaurant menus and contexts to the frontend (`/restaurants/{id}`).
*   **Core Endpoints:**
    *   `POST /api/v1/taste-profile/quiz` - Ingests onboarding data.
    *   `POST /api/v1/taste-dna/feedback` - Takes 8-dimensional deltas and returns the updated Taste Profile.
    *   `GET /api/v1/taste-profile/{user_id}` - Retrieves the Taste Profile (Matrix & Evolution).
    *   `GET /api/v1/restaurants/{id}` - Fetches the menu.
    *   `POST /api/v1/chat` - RAG pipeline for the AI Waiter Chat Window.

---

## Data Schemas & Integration Notes

For the backend integration, please ensure your endpoints conform to these structures used by the React Query hooks on the frontend:

### Taste DNA Feedback Payload
Triggered by `PostOrderFeedback.tsx` to `POST /api/v1/taste-dna/feedback`:
```json
{
  "user_id": "string",
  "event_type": "RECOMMENDATION_FEEDBACK",
  "dimension_deltas": {
    "spice": 0.1,
    "sweetness": -0.1,
    "creaminess": 0.0,
    "tanginess": 0.0,
    "masala_intensity": 0.0,
    "crunchiness": 0.0,
    "oiliness": -0.05,
    "saltiness": 0.1
  },
  "event_description": "Feedback on ordered dishes: Dish Name (Too Sweet, Need More Spice)"
}
```

### Taste Profile Output
The frontend expects `GET /api/v1/taste-profile/{user_id}` and the response of the feedback POST to return this structure:
```json
{
  "user_id": "string",
  "dna_matrix": {
    "spice": 0.60,
    "sweetness": 0.45,
    "creaminess": 0.50,
    "tanginess": 0.50,
    "masala_intensity": 0.50,
    "crunchiness": 0.50,
    "oiliness": 0.40,
    "saltiness": 0.55,
    "recent_evolution": [
      {
        "event": "RECOMMENDATION_FEEDBACK",
        "description": "Spice adjusted 0.50 ➔ 0.60",
        "timestamp": "2026-08-05T12:00:00Z"
      }
    ]
  }
}
```

---

## Monorepo Structure & Architecture

### Backend Structure (`backend/app/`)
```
backend/app/
├── main.py                     # FastAPI application entrypoint
├── config/                     # Configuration and logging
├── middleware/                 # Global exception handlers and responses
├── database/                   # Database session and base ORM model
├── models/                     # SQLAlchemy models
├── schemas/                    # Pydantic validation schemas
├── routes/                     # FastAPI route handlers
├── controllers/                # Request processing controllers
├── services/                   # Business logic (taste_identity, recommendation engine)
├── ai/                         # AI & Vector Engine
│   ├── recommendation/         # Similarity and ranking algorithms
│   ├── context/                # Context Builder
│   ├── prompt/                 # Prompt Builder
│   ├── providers/              # LLM Providers (Gemini)
│   └── tools/                  # Tool Definitions & Executor
└── ingestion/                  # Database seeding and data ingestion scripts
```

### Frontend Structure (`frontend/src/`)
```
frontend/src/
├── main.tsx                    # Vite entrypoint
├── App.tsx                     # Main App component
├── router.tsx                  # React Router configuration
├── pages/                      # Page components (QuizPage, ZomatoOverlayPage, etc.)
├── components/                 # UI components (PostOrderFeedback, TasteDNADashboard, RecommendationCarousel, etc.)
├── layouts/                    # App layouts
├── hooks/                      # Custom hooks & Context providers (SessionContext, etc.)
├── services/                   # React Query API calls (`api.ts`, `queries.ts`)
├── styles/                     # Tailwind CSS entry (`index.css`)
└── utils/                      # Helper utilities
```
