# TasteAI Team Contribution & Git Workflow Guide

Welcome to the **TasteAI** development team! To ensure smooth collaboration across our four-member team, please adhere strictly to this branch strategy and workflow guide.

---

## 🌿 Recommended Branch Strategy

We follow a GitFlow-inspired branching strategy:

```
main (Production)
  ▲
  │  [Release Merge]
  │
develop (Integration Branch)
  ▲               ▲               ▲               ▲
  │ (PR Merge)    │ (PR Merge)    │ (PR Merge)    │ (PR Merge)
  │               │               │               │
feature/frontend  feature/backend  feature/ai     feature/data
```

### Branch Definitions & Ownership

| Branch | Purpose | Scope |
| :--- | :--- | :--- |
| `main` | Production-ready stable release | Primary production deployments only. Directly pushing is strictly prohibited. |
| `develop` | Shared integration branch | Integration environment where all features are tested together before release. |
| `feature/frontend` | Frontend UI Development | React components, pages, Tailwind CSS styles, state context hooks, routing. |
| `feature/backend` | Backend API Development | FastAPI routes, controllers, services, repositories, Pydantic schemas, middleware. |
| `feature/ai` | AI Engine & LLM Integration | Google Gemini provider, system prompt builder, context builder, UI tool executors. |
| `feature/data` | Database & Ingestion | SQLAlchemy models, database migrations (Alembic), seed data scripts. |

---

## 🔄 Step-by-Step Collaborative Workflow

### Step 1: Sync Local Environment
Before starting any new work, always pull the latest changes from `develop`:

```bash
git checkout develop
git pull origin develop
```

### Step 2: Switch to Your Feature Branch
Work on your assigned feature branch (or create a sub-feature branch off `develop` like `feature/frontend-cart`):

```bash
git checkout feature/frontend
# Merge latest develop into your feature branch to stay up to date
git merge develop
```

### Step 3: Commit Your Changes
Make atomic, descriptive commits following Conventional Commits format:

```bash
git add .
git commit -m "feat(frontend): implement 7-column desktop menu grid"
```

Common commit prefixes:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation updates
- `style`: Formatting, CSS, or UI layout tweaks
- `refactor`: Code restructures without functional changes
- `test`: Adding or updating unit tests

### Step 4: Run Verification Tests Locally
Before opening a Pull Request, **you MUST verify that all local checks pass**:

```bash
# 1. Backend tests
cd backend
$env:PYTHONPATH = "."
python -m pytest

# 2. Frontend TypeScript & Build
cd ../frontend
npm run build
```

### Step 5: Push Feature Branch to GitHub
```bash
git push origin feature/frontend
```

### Step 6: Open a Pull Request (PR)
1. Go to [https://github.com/ananthasail18/innova_hack/pulls](https://github.com/ananthasail18/innova_hack/pulls).
2. Open a Pull Request: **Base: `develop` ◄ Target: `feature/frontend`**.
3. Fill out the **Pull Request Template**.
4. Request code review from team members.

### Step 7: Merge into `develop` & Release to `main`
- Once PR checks pass and 1 code review approval is received, merge the PR into `develop`.
- Periodically, when milestone requirements are fulfilled, a release PR is opened from `develop` -> `main`.

---

## 📐 Coding Standards

### Python / Backend
- Python 3.11+
- Enforce type annotations on all function definitions.
- Use Pydantic v2 `model_config = ConfigDict(from_attributes=True)` for ORM schemas.
- Route responses must use `ResponseEnvelope[T]`.

### TypeScript / Frontend
- React 18 + Vite (TypeScript strict mode enabled).
- Use path alias `@/` for imports (e.g. `@/components/DishCard`, `@/services/api`).
- Style components using Tailwind CSS theme variables defined in `src/styles/index.css`.
