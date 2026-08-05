# TasteAI Hybrid Recommendation Engines - Context & Architecture

This document outlines the architecture of the Hybrid Recommendation Engine located in `backend/app/services/recommendation.py`.

The core philosophy of the TasteAI recommendation system is to calculate a deterministic `final_score` for every dish by blending three distinct sub-engines. This ensures that recommendations are heavily personalized, socially validated, and mathematically reproducible.

## The Recommendation Formula
For every available dish in a restaurant, a final score is calculated using the following weighted blend:

```text
Final Score = (Taste Match * 0.60) + (Community Score * 0.15) + (Popularity * 0.25)
```

### Engine 1: Taste Match Engine (Content-Based)
**Weight:** 60%  
**Mechanism:** Vector Cosine Similarity

This is the primary driver of personalization.
*   **User Vector:** The system fetches the user's 8-dimensional Taste DNA profile (Spice, Sweetness, Creaminess, Tanginess, Saltiness, Crunch, Masala Intensity, Oiliness).
*   **Dish Vector:** The system fetches the 8-dimensional flavor profile for the target dish.
*   **Calculation:** It computes the Cosine Similarity between the two vectors.
*   **Result:** A score between 0.0 and 1.0 indicating how closely the dish's inherent flavors match the user's biological preferences.

### Engine 2: Community Collaborative Filtering Engine
**Weight:** 15%  
**Mechanism:** Similarity-Weighted Signal Scoring

This engine leverages the wisdom of the crowd, but specifically filters for users with similar tastes.
*   **Signal Gathering:** The system finds all `CommunitySignal` records (e.g., likes, reorders) from other users for the target dish.
*   **Taste Homophily Filtering:** It fetches the Taste DNA profiles of those other users and calculates their Cosine Similarity against the current user. It filters out anyone with a similarity score below 0.82.
*   **Calculation:** For the remaining "taste-alikes", it evaluates their feedback (e.g., +0.5 for a like, +0.5 for a reorder intent).
*   **Weighted Average:** The final community score is a weighted average where signals from users with highly similar tastes carry more mathematical weight than users just above the threshold.

### Engine 3: Popularity & Highlight Engine
**Weight:** 25%  
**Mechanism:** Baseline Metric

This engine ensures that objectively incredible dishes or restaurant specialties surface even if the mathematical vector match is only average.
*   **Calculation:** It uses the static `popularity_score` stored on the Dish model (normalized between 0.0 and 1.0).
*   **Purpose:** Prevents the system from getting stuck in an absolute mathematical local minimum, allowing serendipitous discovery of highly-rated chef specials.

## Explanation Generation & Confidence
After the `final_score` is computed, the engine passes the vectors to the UI.
*   **Confidence Levels:** The engine outputs a discrete confidence tier (Very High >0.90, High >0.80, Medium >0.70, Low).
*   **Match Strengths:** It calculates the absolute integer difference between each dimension to generate human-readable match strengths (e.g., "Matches your Spice preference") which are sent to the frontend UI.
