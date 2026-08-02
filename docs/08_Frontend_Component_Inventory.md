# TasteAI: Frontend Component Inventory

*Note: Build using `shadcn/ui` primitives whenever possible.*

## 1. Cards
- `DishCard`: Used in list views. Displays thumbnail image (left or top), dish name, price, short description, and recommendation percentage badge.
- `QuizCard`: Large visual card for the onboarding taste quiz. Clickable entirely.
- `CartItemCard`: Compact row showing item name, quantity controls (+/-), and total price.

## 2. Buttons
- `PrimaryActionBtn`: Large, full-width, highly visible (e.g., "Add to Cart", "Checkout"). Uses restaurant's theme color.
- `SecondaryActionBtn`: Outline or ghost button for secondary actions (e.g., "Skip Quiz").
- `FloatingChatBtn`: Circular FAB fixed to the bottom right of the screen.

## 3. Dialogs & Modals
- `FeedbackModal`: Appears post-checkout. Contains star rating and optional text input.
- `ItemOptionsModal`: Appears before adding to cart if the dish has required modifiers (e.g., "Choose spice level").

## 4. Chat Interface
- `ChatContainer`: The main wrapper, handles scrolling to the bottom.
- `UserMessageBubble`: Right-aligned, themed color background.
- `AIMessageBubble`: Left-aligned, neutral gray background. Includes a small TasteAI avatar.
- `TypingIndicator`: Animated three dots.
- `QuickReplyChip`: Horizontal scrolling list of suggested questions above the input bar.

## 5. Badges & Chips
- `MatchBadge`: Small pill showing percentage (e.g., "95% Match"). Colors scale from green (high) to yellow (medium).
- `CommunityBadge`: Icon + text (e.g., "🔥 Top pick for profiles like yours").
- `DietaryChip`: Small un-intrusive tag (e.g., "V", "GF").
- `CategoryChip`: Used in the top sticky navigation to jump to sections (e.g., "Starters").

## 6. Skeletons (Loading States)
- `MenuSkeleton`: Simulates the layout of `DishCard`s while data is fetching.
- `HeroSkeleton`: Gray pulsing block for the restaurant landing image.

## 7. Empty States
- `EmptyCartView`: Icon of an empty plate, text "Your cart is hungry", button "Back to Menu".
- `EmptySearchView`: "No dishes found matching your criteria."

## 8. Navigation
- `TopNavBar`: Minimal. Contains back button, restaurant name, and cart icon with item count badge.
- `CategoryStickyNav`: Horizontal scrollable list of categories that pins to the top below the NavBar.
