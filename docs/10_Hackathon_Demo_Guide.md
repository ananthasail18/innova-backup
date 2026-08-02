# TasteAI: Hackathon Demo Guide

## 1. Pitch Flow (3 Minutes)
1. **The Hook (30s)**: "Have you ever stared at a menu for 15 minutes, overwhelmed, only to order the exact same thing you always get because you're afraid to waste money on a bad meal? TasteAI fixes this."
2. **The Problem (30s)**: "Restaurants want you to try their high-margin specials, but generic popularity metrics don't help *you*. Taste is highly subjective."
3. **The Solution (60s)**: "TasteAI is an intelligent menu that combines your personal 'Taste Identity' with restaurant knowledge. We don't just tell you what's popular; we calculate exactly what *you* will love using deterministic vector math, and use Llama 3.1 to explain *why*."
4. **The Vision (60s)**: "Your Taste Identity is portable. You take it to any restaurant. As the community grows, the AI learns that people with your exact flavor profile loved a specific dish, creating a powerful network effect."

## 2. Live Demo Flow
**Persona Setup**: Explain that we are demoing as "Alex," who loves spicy food and umami flavors, but hates sweet savory dishes.
1. **QR Scan (Simulated)**: Open the web app on a mobile emulator. "Alex scans the QR code at 'Spice Symphony'."
2. **The Menu & Recommendations**: Scroll the menu. Point out that the "Spicy Tuna Crispy Rice" has a "98% Match" badge.
3. **The Explanation**: Tap the dish. Read the AI-generated reason: *"Matches your high preference for umami and spice."*
4. **AI Chat Interaction**: Open the floating assistant.
   - *Prompt*: "I'm allergic to peanuts. Is this safe?"
   - *Response*: AI confirms safety based strictly on the restaurant metadata.
   - *Prompt*: "What's the spiciest thing on the menu?"
   - *Response*: AI recommends the 'Volcano Roll' based on the menu context.
5. **Checkout & Feedback**: Add to cart, simulate checkout, and show the post-meal feedback screen to explain the continuous learning loop.

## 3. Community Recommendation Showcase
- **The "Aha" Moment**: Highlight a specific dish (e.g., "Dragon Roll") that has a "🔥 Community Pick" badge.
- **Explanation**: "Alex's taste vector didn't perfectly match this dish. BUT, our engine found 50 other users with a >90% similarity to Alex's taste profile, and *they* rated this dish 5 stars. The engine dynamically boosted this recommendation."

## 4. AI Showcase (NVIDIA NIM & Llama 3.1)
- Emphasize that the AI is **NOT** hallucinating.
- Mention that Llama 3.1 70B is used via NVIDIA NIM for blazing-fast inference.
- Explain the architecture: "We don't let the LLM guess. We use deterministic cosine similarity for the math, and restrict the LLM strictly to generating explanations based on our database constraints."

## 5. Expected Judge Questions & Suggested Answers
**Q: How do you prevent the AI from recommending something that's sold out or doesn't exist?**
*A: We use a layered architecture. The AI doesn't decide the ranking; our backend deterministic engine does. The AI only has access to a strict JSON context of the currently available menu. It acts as an interface, not the source of truth.*

**Q: Why not use a Vector Database?**
*A: For our MVP and initial scale, calculating cosine similarity on 50-100 menu items against a single user vector is computationally trivial in memory. As we scale to millions of cross-restaurant community matches, we will introduce a vector DB, but it's over-engineering for the MVP.*

**Q: How do you get the restaurant data?**
*A: Initially through manual onboarding or simple PDF menu parsing scripts. Our roadmap includes POS integration (Square/Toast) to sync menus and availability automatically.*

**Q: What about the cold start problem? How do you know my taste on day one?**
*A: We solve this with a 3-question highly visual Taste Quiz on your first scan. By forcing choices between extreme flavor profiles (e.g., Spicy vs Sweet), we establish a strong baseline vector immediately, which refines over time with post-meal feedback.*
