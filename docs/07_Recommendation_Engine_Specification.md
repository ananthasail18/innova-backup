# TasteAI: Recommendation Engine Specification

## 1. Concept: The Taste Vector
At the core of TasteAI is the Taste Vector—a normalized mathematical representation of flavor profiles. Both users and dishes possess a vector in the same dimensional space.

**Dimensions (MVP):**
1. Sweet
2. Salty
3. Sour
4. Bitter
5. Umami
6. Spicy
7. Adventurous (willingness to try unusual ingredients)
8. Richness (heavy/fatty vs. light)

Each value is a float between `0.0` and `1.0`.
- *Example Dish (Cheeseburger)*: `{"sweet": 0.1, "salty": 0.8, "sour": 0.2, "bitter": 0.0, "umami": 0.9, "spicy": 0.0, "adventurous": 0.1, "richness": 0.9}`

## 2. Scoring: Cosine Similarity
To determine how well a dish matches a user, the backend calculates the Cosine Similarity between the User Vector (U) and the Dish Vector (D).

**Formula:**
`Similarity = (U • D) / (||U|| * ||D||)`

This yields a score between `0.0` (completely opposite) and `1.0` (perfect match). The score is then converted to a percentage (e.g., 92% Match).

## 3. Community Similarity
To incorporate the "Community Pick" signal without diluting the personal vector:
1. When a user requests a menu, the system queries for users whose Taste Vector has a Cosine Similarity > `0.85` compared to the current user.
2. The system aggregates the positive feedback (ratings) these similar users have left at the current restaurant.
3. Dishes highly rated by this "taste cohort" receive a fixed scalar boost (e.g., `+0.05`) to their final recommendation score.

## 4. Reason Generation & Explanation
The mathematical calculation is opaque to the user. To provide explainability:
1. After calculating similarity, identify the 2 dimensions where both the user and the dish have the highest absolute values (e.g., both score > 0.7 on `Spicy` and `Umami`).
2. Pass these dimensions to the LLM via the Prompt Builder to generate a natural language explanation (see AI System Design).

## 5. Recommendation Confidence
Recommendations must clear a threshold to be badged as a "Top Match."
- **Threshold**: Similarity > `0.75`.
- If no dishes clear the threshold (e.g., user is vegan but at a steakhouse), the system falls back to sorting by popularity and clearly states, "We couldn't find a perfect flavor match, but here are the most popular items."

## 6. Cold Start Problem
When a user first joins, their vector is `[0,0,0,0,0,0,0,0]`.
- **Solution**: The Taste Quiz. By asking the user to choose between 3 sets of highly contrasting visual food options, the system initializes a baseline vector.
  - *Example*: Choosing "Spicy Curry" over "Vanilla Ice Cream" immediately bumps `spicy` and `umami` and lowers `sweet`.

## 7. Feedback Learning
When a user rates a dish post-meal (1-5 stars):
- **Positive Rating (4-5)**: The User Vector is pulled slightly toward the Dish Vector using an exponentially decaying learning rate.
- **Negative Rating (1-2)**: The User Vector is pushed slightly away from the Dish Vector.
- *Math*: `New_User_Vector = Current_User_Vector + learning_rate * (Dish_Vector - Current_User_Vector)`

## 8. Community Aggregation
For MVP performance, Community Signals (average ratings by taste cohorts) can be calculated asynchronously via a cron job (e.g., nightly) and stored in the `CommunitySignal` materialized view.
