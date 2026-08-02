# TasteAI: Product Requirements Document (PRD)

## 1. Vision
TasteAI helps customers confidently discover dishes they will enjoy instead of repeatedly ordering familiar food. By combining restaurant knowledge, a personal taste identity, and community intelligence, TasteAI aims to build a portable Taste Identity that works across all participating restaurants, creating a network effect where recommendations improve as more restaurants and users join the platform.

## 2. Problem Statement
Diners often face decision fatigue when presented with a large or unfamiliar restaurant menu. The fear of disappointment leads them to order the same "safe" dishes repeatedly, missing out on new culinary experiences. Simultaneously, restaurants struggle to guide customers toward high-margin or specialty items effectively without being pushy. Existing food apps provide generic popularity metrics but fail to account for a user's highly individual taste profile.

## 3. Product Goals
- **Personalization over Generalization**: Shift from "what is popular" to "what you will love."
- **Confidence in Choice**: Empower users to try new dishes with explainable AI recommendations.
- **Portable Taste Identity**: Give ownership of taste preferences to the user, not siloed to one restaurant.
- **Zero-Hallucination Assistant**: Ensure the AI serves as a reliable interface to the menu, never hallucinating ingredients or allergens.

## 4. User Personas
### Persona 1: The Hesitant Foodie (End User)
- **Profile**: Loves food but hates wasting money on a bad meal.
- **Pain Point**: Spends 15 minutes staring at a menu, googling dish names, and ultimately ordering the same old thing.
- **Needs**: Assurances that a new dish aligns with their specific flavor preferences and dietary restrictions.

### Persona 2: The Innovative Restaurateur (Customer)
- **Profile**: Owns a mid-to-high-end casual dining restaurant.
- **Pain Point**: Wants to turn first-time visitors into regulars by ensuring their first meal is unforgettable.
- **Needs**: A way to ingest their menu effortlessly and present it dynamically to diners.

## 5. Customer Journey
1. **Entry**: User scans a QR code at the restaurant table.
2. **Onboarding**: User takes a quick 3-question visual "Taste Quiz" (if they are a new user) to establish their baseline Taste Identity.
3. **Exploration**: User lands on the visual menu. Dishes are ranked and badged based on their personal taste vector and community similarity.
4. **Interaction**: User taps a dish or asks the floating AI assistant, "What's good here if I love spicy seafood?"
5. **Decision**: The AI explains *why* a dish is recommended (e.g., "Because you enjoy umami flavors and this dish shares traits with your favorite Pad Thai").
6. **Checkout**: User adds items to the cart and checks out.
7. **Feedback**: Post-meal, user provides a quick thumbs-up/down or rating, which refines their Taste Identity and contributes to the Community Signal.

## 6. User Stories
- As a user, I want to scan a QR code so I can instantly view the restaurant's menu without downloading an app.
- As a user, I want to take a quick taste quiz so the app understands my flavor preferences.
- As a user, I want to see personalized "For You" recommendations so I don't have to guess what I'll like.
- As a user, I want to ask the AI assistant questions about the menu so I can clarify ingredients or portions.
- As a user, I want to know *why* a dish is recommended to me so I can trust the suggestion.
- As a user, I want to add items to my cart and check out seamlessly.
- As a user, I want to leave feedback after my meal so my future recommendations get better.

## 7. Functional Requirements
- **QR Code Entry**: Support URL parameters to identify the specific restaurant and table.
- **Taste Quiz**: A visual, image-based quiz that generates an initial JSON-based taste vector for the user.
- **Dynamic Menu Display**: Fetch menu items from the database and sort/badge them dynamically based on recommendation scores.
- **Explainable Recommendations**: Generate personalized text explaining why a dish matches a user's profile.
- **AI Assistant**: A chat interface powered by Llama 3.1 70B (via NVIDIA NIM) with strict RAG constraints against the restaurant's metadata.
- **Cart & Checkout**: Standard e-commerce flow for menu items.
- **Feedback Loop**: Post-order interface to rate dishes, which updates the user's taste vector in PostgreSQL.

## 8. Non-functional Requirements
- **Performance**: Initial menu load must be under 2 seconds. AI chat responses must stream with a Time-To-First-Token (TTFT) of under 800ms.
- **Reliability**: Deterministic backend ranking ensures recommendations are consistently generated even if the LLM generation fails or degrades.
- **Accuracy**: Zero tolerance for hallucinated menu items, prices, ingredients, or allergens.
- **Scalability**: Stateless AI interactions where context is passed per request; backend handles vector math efficiently.

## 9. Success Metrics
- **Taste Profile Completion Rate**: % of users who complete the onboarding taste quiz.
- **Recommendation Acceptance Rate**: % of orders that include at least one "For You" recommended item.
- **AI Engagement**: Average number of chat turns per user session.
- **Time to Order**: Reduction in average time spent from scanning QR code to placing an order.

## 10. MVP Scope
- Web-based responsive frontend (React/Vite).
- QR code entry and Restaurant landing page.
- Taste Identity onboarding quiz.
- Visual menu, dish gallery, and dish detail pages.
- Deterministic recommendation engine (Cosine Similarity).
- Floating AI assistant (chat interface).
- Cart, Checkout, and Post-meal feedback.
- Restaurant metadata ingestion (scripted/manual for MVP).
- Seeded recommendation demo.

## 11. Future Roadmap
- **Voice Assistant**: Allow users to order via voice ("Get me my usual, but make it spicy").
- **Loyalty Program Integration**: Tie taste identity to restaurant-specific rewards.
- **Restaurant Analytics Dashboard**: Show restaurants aggregate data on local taste trends.
- **Payment Gateway**: Actual Stripe/Square integration (mocked for MVP).
- **Group Ordering**: Merge multiple Taste Identities to recommend shared appetizers.
- **Cross-platform Integration**: Native iOS/Android apps for persistent identity outside the web-app.

## 12. Risks
- **LLM Hallucination**: AI might recommend dishes not on the menu or invent ingredients. *Mitigation: Strict layered prompting and deterministic retrieval.*
- **Cold Start Problem**: New users might get poor recommendations. *Mitigation: Taste Quiz establishes a strong baseline.*
- **Latency**: Heavy LLM prompts could slow down the experience. *Mitigation: NVIDIA NIM for high-throughput inference; stream responses.*

## 13. Assumptions
- Users are willing to spend 15-30 seconds taking a visual quiz if it promises a better meal.
- Restaurants are willing to provide detailed metadata (ingredients, flavor profiles) for their dishes.
- We can accurately model taste as a numerical vector of flavor traits (sweet, salty, umami, spicy, adventurous, etc.).
