# TasteAI - Monorepo Structure & Architecture

## Backend Structure (`backend/app/`)
```
backend/app/
├── main.py                     # FastAPI application entrypoint
├── config/                     # Configuration and logging
│   ├── config.py
│   └── logging.py
├── middleware/                 # Global exception handlers and response envelopes
│   ├── exceptions.py
│   └── responses.py
├── database/                   # Database session and base ORM model
│   ├── base.py
│   └── session.py
├── models/                     # SQLAlchemy models (User, Restaurant, Category, Dish, TasteProfile, CommunitySignal)
├── schemas/                    # Pydantic validation schemas (User, TasteProfile, Dish, Recommendation, Chat, etc.)
├── routes/                     # FastAPI route handlers (restaurant, categories, dishes, users, taste_profile, recommendations, community, chat, health)
├── controllers/                # Request processing controllers
├── services/                   # Business logic (taste_identity, recommendation engine)
├── ai/                         # AI & Vector Engine
│   ├── recommendation/         # Similarity and ranking algorithms
│   ├── embeddings/             # Vector space operations
│   ├── vector_store/           # Vector storage
│   └── prompts/                # LLM Providers (Gemini, Nvidia), Context Builder, Prompt Builder, Tool Definitions & Executor
├── ingestion/                  # Database seeding and data ingestion scripts
└── utils/                      # Helper utilities
```

## Frontend Structure (`frontend/src/`)
```
frontend/src/
├── main.tsx                    # Vite entrypoint
├── App.tsx                     # Main App component
├── router.tsx                  # React Router configuration
├── pages/                      # Page components
│   ├── LandingPage.tsx
│   ├── QuizPage.tsx
│   ├── RestaurantPage.tsx
│   ├── DishDetailPage.tsx
│   ├── ProfilePage.tsx
│   └── CartPage.tsx
├── components/                 # UI & Feature components
│   ├── AvailabilityBadge.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   ├── CategoryTabs.tsx
│   ├── ChatWindow.tsx
│   ├── DishCard.tsx
│   ├── DishGrid.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── FloatingChatWidget.tsx
│   ├── LoadingSkeleton.tsx
│   ├── PriceTag.tsx
│   ├── ProfileSummary.tsx
│   ├── ProgressIndicator.tsx
│   ├── QuizCard.tsx
│   ├── QuizOption.tsx
│   ├── RecommendationCarousel.tsx
│   ├── RecommendationReasonList.tsx
│   ├── RestaurantHero.tsx
│   ├── TasteDimensionCard.tsx
│   ├── TasteProfileSkeleton.tsx
│   └── VegIndicator.tsx
├── layouts/                    # App layouts
│   └── Layout.tsx
├── hooks/                      # Custom hooks & context providers
│   ├── CartContext.tsx
│   ├── SessionContext.tsx
│   ├── ThemeContext.ts
│   ├── useCart.ts
│   ├── useTheme.ts
│   └── providers.tsx
├── services/                   # API client, React Query hooks, and TypeScript interfaces
│   ├── api.ts
│   ├── queries.ts
│   └── types.ts
├── utils/                      # Helper utilities
│   └── cn.ts
├── assets/                     # Static images and icons
└── styles/                     # Stylesheets
    ├── index.css
    └── App.css
```
