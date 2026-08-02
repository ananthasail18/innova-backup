# TasteAI: Development Roadmap

## Stage 1: Foundation & Infrastructure
- **Objectives**: Set up repositories, CI/CD, and basic routing.
- **Deliverables**:
  - React/Vite frontend initialized with Tailwind and shadcn/ui.
  - FastAPI backend initialized.
  - SQLite database schema created (using SQLAlchemy).
- **Dependencies**: None.
- **Acceptance Criteria**: Both frontend and backend run locally. API health endpoint returns 200 OK.
- **Estimated Complexity**: Low

## Stage 2: Data Model & Mock Data
- **Objectives**: Implement the database schemas and populate a mock restaurant menu.
- **Deliverables**:
  - ORM models defined.
  - A seeding script containing 1 fictional restaurant with 15-20 fully annotated dishes (flavor vectors, ingredients).
- **Dependencies**: Stage 1.
- **Acceptance Criteria**: Database contains queryable mock data matching the PRD schemas.
- **Estimated Complexity**: Low

## Stage 3: Recommendation Engine (Backend)
- **Objectives**: Implement the core math for the Taste Vector.
- **Deliverables**:
  - Cosine similarity function in Python.
  - `/recommendations` API endpoint that accepts a user vector and returns sorted dishes.
- **Dependencies**: Stage 2.
- **Acceptance Criteria**: Endpoint correctly sorts dishes. A user vector heavily weighted towards "spicy" returns spicy dishes first.
- **Estimated Complexity**: Medium

## Stage 4: Taste Quiz & Onboarding (Frontend)
- **Objectives**: Build the user entry flow.
- **Deliverables**:
  - Restaurant landing page.
  - Taste Quiz UI.
  - State management to store the resulting Taste Vector locally.
- **Dependencies**: Stage 1.
- **Acceptance Criteria**: User can click through the quiz and a JSON taste vector is generated and stored in local state/storage.
- **Estimated Complexity**: Medium

## Stage 5: Visual Menu & Dish Details (Frontend)
- **Objectives**: Display the menu driven by the recommendation engine.
- **Deliverables**:
  - Main menu view with sticky categories.
  - Dish cards displaying match badges.
  - Dish detail page layout.
- **Dependencies**: Stage 3, Stage 4.
- **Acceptance Criteria**: Menu renders. Items are ordered based on the user's vector generated in Stage 4.
- **Estimated Complexity**: High

## Stage 6: AI Integration (Backend + NIM)
- **Objectives**: Connect Llama 3.1 70B for explanations and chat.
- **Deliverables**:
  - `PromptBuilder` utility.
  - Integration with NVIDIA NIM API.
  - `/chat` endpoint.
  - Explanation generation integrated into the recommendation pipeline.
- **Dependencies**: Stage 2.
- **Acceptance Criteria**: Backend can successfully prompt the LLM with restaurant context and receive a hallucination-free response.
- **Estimated Complexity**: High

## Stage 7: AI Chat UI & Cart (Frontend)
- **Objectives**: Bring the AI to the user and allow ordering.
- **Deliverables**:
  - Floating chat interface.
  - Cart state management.
  - Checkout flow UI.
- **Dependencies**: Stage 5, Stage 6.
- **Acceptance Criteria**: User can chat with the AI about the menu. User can add items to the cart and view the checkout screen.
- **Estimated Complexity**: High

## Stage 8: Polish, Feedback & Hackathon Demo Prep
- **Objectives**: Tie loose ends and prepare for live presentation.
- **Deliverables**:
  - Post-checkout feedback UI.
  - Final styling pass (glassmorphism, animations).
  - Pre-load specific user personas for the demo.
- **Dependencies**: All previous stages.
- **Acceptance Criteria**: App looks premium. Demo flows flawlessly without crashes.
- **Estimated Complexity**: Medium
