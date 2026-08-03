# TasteAI - Merged Features & Active Services Summary

This document summarizes all the features that have been successfully refactored, merged, and validated in the TasteAI application, as well as the active services and test statuses currently running on the system.

---

## 🚀 Merged Features

### 1. Unified 8-Dimensional Taste DNA System
- **Aligned Schema**: Synced the backend SQLAlchemy models, Pydantic schemas, database migrations, and frontend TypeScript typings to the finalized 8-dimensional Taste DNA system:
  1. `Spice`
  2. `Sweetness`
  3. `Creaminess`
  4. `Tanginess`
  5. `Masala Intensity` (Replaced *Smokiness*)
  6. `Crunchiness`
  7. `Oiliness` (Replaced *Adventuresomeness*)
  8. `Saltiness` (Replaced *Portion Size*)
- **Database Seeding**: Cleaned and re-seeded the SQLite database (`tasteai.db`) with full authentic taste DNA dimensions for demo restaurants and dishes, including a pre-seeded realistic taste profile for the user `Ananth` (so onboarding quiz bypass is supported).

### 2. Fast Offline Local Asset Ingestion
- **Local Asset Migration**: Migrated all dish pictures, covers, and logos from remote Unsplash URLs to local asset storage inside `frontend/public/images/` (`dishes/`, `logos/`, `covers/`).
- **Seeding Integration**: Rewrote the database seeding scripts to use relative local paths (e.g. `/images/dishes/dish_xyz.jpg`). The application is now 100% offline-friendly, independent of external CDN availability, and loads instantly.
- **Glassmorphism CSS Gradient Fallbacks**: Replaced standard raw `img` tags across the frontend with a custom `<DishImage>` component. If an image file is missing or fails to resolve, it automatically falls back to a gorgeous, deterministic color gradient with the dish name centered in clean uppercase typography.

### 3. On-Demand QR Scanner & Dynamic Switcher
- **Decodable QR Codes**: Generated and integrated high-quality decodable QR codes for all demo restaurants (`Rameshwaram Cafe`, `Truffles`, and `Spice Symphony`).
- **Interactive Demo Hub**: Made the QR images in `/demo` fully clickable. Clicking any QR card or "Open Directly" toggles the application to that restaurant instantly.
- **Optional Camera Mode**: Changed the scanner `/scanner` so that it doesn't query the system for cameras immediately on load (preventing browser "Link your phone camera" prompts). It now displays a "Start Camera Scanner" button to launch the webcam on-demand, allowing users to upload image files or browse demo restaurants directly.
- **Header Navigation**: Fixed the scan button in the restaurant page header to redirect to the scanner view (`/scanner`) rather than the landing page.

### 4. Cart Session Persistence
- **State Preservation**: Wired the frontend `CartContext` to serialize active cart items to browser `localStorage` keyed by `restaurant.id`. Reloading the browser or switching tabs no longer wipes the customer's selected items.

### 5. Dynamic High-Contrast Themes
- **Adaptive Text Overlay**: Added a contrast calculation function (using relative YIQ luminance formulas) to `RestaurantContext.tsx`. When loading a restaurant's primary/secondary brand colors, it automatically sets foreground text variables to dark black (`#0A0A0A`) or off-white (`#F5F5F5`) depending on background light levels, fixing unreadable white-on-cream headers and buttons.

---

## 🛠️ Currently Running & Active Services

### 1. Active Backend Server (FastAPI)
- **Status**: **RUNNING** (as background daemon task `task-2591`)
- **Address**: `http://localhost:8001`
- **Command**:
  ```powershell
  python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
  ```
- **Endpoints**:
  - GET `/api/v1/health`: 200 OK
  - POST `/api/v1/chat`: Chatbot assistant RAG processing and tool execution.
  - GET `/api/v1/restaurants/{slug}`: Restaurant detail and menus.

### 2. Active Frontend Server (Vite + React + TS)
- **Status**: **RUNNING** (as background daemon task `task-2595`)
- **Address**: `http://localhost:5173`
- **Command**:
  ```bash
  npm run dev
  ```
- **Build Status**: Compiles cleanly with zero errors/warnings (`tsc -b && vite build` successfully completes in ~600ms).

### 3. Unit Test Suite (Pytest)
- **Status**: **PASSING**
- **Command**:
  ```bash
  pytest
  ```
- **Results**: **10/10 tests passed successfully** (covering API routers, prompt builders, tool executors, recommendation math, and gradual DNA learning engines).
