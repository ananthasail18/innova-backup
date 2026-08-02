# TasteAI: UI/UX Specification

## General Principles
- **Mobile-First**: The MVP is designed almost exclusively for mobile screens (QR code scanning scenario).
- **Aesthetics**: Premium, appetizing, clean. Heavy use of high-quality imagery, glassmorphism for overlays, and smooth transitions.
- **Dark/Light Mode**: Support system preference, but default to a rich dark mode for premium dinner vibes.

## 1. Landing (QR Entry)
- **Purpose**: Welcome the user to the specific restaurant.
- **Layout**: Full-screen hero image of the restaurant/food. Large welcome text.
- **Components**:
  - `HeroBackground`
  - `RestaurantLogo`
  - `PrimaryButton` ("View Menu" or "Take Taste Quiz")
- **User Actions**: If new session -> route to Taste Quiz. If returning -> route to Menu.
- **Loading State**: Skeleton of hero text.

## 2. Taste Quiz
- **Purpose**: Onboard the user's taste preferences quickly.
- **Layout**: Swipeable cards or a 3-step wizard. Highly visual.
- **Components**:
  - `ProgressBar`
  - `ImageChoiceCard` (e.g., "Choose your ideal Friday night meal: [Image A] or [Image B]")
  - `MultiSelectChips` (for dietary restrictions)
- **Responsive Behavior**: Fixed bottom action bar.

## 3. Restaurant Menu (Categories & Dish Gallery)
- **Purpose**: The main exploration interface.
- **Layout**: Sticky top navigation for categories. Vertical scroll for dishes. A dedicated "For You" top section.
- **Components**:
  - `CategoryScrollRow` (Sticky header)
  - `RecommendationCarousel` (Horizontal scroll for top matches)
  - `DishListCard` (Thumbnail, name, price, description snippet, recommendation badge)
  - `FloatingActionButton` (AI Chat toggle)
- **User Actions**: Tap category to scroll, tap dish to view details, tap FAB to open chat.
- **Empty State**: (Should not happen unless backend fails) "Menu is currently unavailable."

## 4. Dish Details
- **Purpose**: Deep dive into a specific dish.
- **Layout**: Full-width header image pulling down to reveal content. Bottom fixed "Add to Cart" bar.
- **Components**:
  - `ParallaxHeaderImage`
  - `DishTitleAndPrice`
  - `RecommendationExplanationBox` (AI-generated text: "Why you'll love this...")
  - `IngredientTags`
  - `QuantitySelector`
  - `AddToCartButton`
- **User Actions**: Adjust quantity, add to cart, return to menu.

## 5. AI Chat
- **Purpose**: Conversational assistant overlay.
- **Layout**: Bottom sheet or half-screen modal sliding up.
- **Components**:
  - `ChatHistoryFeed`
  - `MessageBubble` (User and AI variants)
  - `SuggestedPrompts` (Chips: "What's the spiciest?", "Vegan options?")
  - `MessageInputBar`
- **Loading State**: Typing indicator (animated dots) while streaming response.
- **Accessibility Notes**: Auto-focus input when opened on desktop, but be careful on mobile to avoid keyboard covering content immediately.

## 6. Cart & Checkout
- **Purpose**: Review and finalize the order.
- **Layout**: Standard list view.
- **Components**:
  - `CartItemRow` (Swipe to delete)
  - `OrderSummary` (Subtotal, tax, total)
  - `CheckoutButton`
- **Empty State**: "Your tray is empty." with a button returning to the menu.

## 7. Feedback (Post-Meal)
- **Purpose**: Capture ratings to improve the engine.
- **Layout**: Modal pop-up appearing upon revisiting the app post-checkout.
- **Components**:
  - `StarRating` or `ThumbsUpDown` per ordered item.
  - `SubmitFeedbackButton`
