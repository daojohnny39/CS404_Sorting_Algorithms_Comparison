# SortViz — CS 404 Mini Project

Interactive sorting algorithm visualizer with a React frontend and FastAPI backend.

## Quick Start

**First time only — install all dependencies:**
```bash
npm run setup
```

**Start both servers:**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Project Structure

```
├── frontend/        React + Vite + TypeScript + Tailwind CSS
│   └── src/
│       ├── components/   Header, AlgorithmSelector, BarVisualizer, Controls, StatsPanel, StatusMessage
│       ├── hooks/        useSorter.ts — playback state machine
│       ├── api.ts        fetch wrappers for backend
│       └── types.ts      shared TypeScript types
├── backend/         FastAPI + Python 3.11+
│   ├── main.py           app entry point, CORS config
│   ├── models.py         Pydantic models
│   ├── routers/sort.py   /algorithms and /sort endpoints
│   └── algorithms/
│       └── mock.py       bubble sort placeholder (replace per-algorithm later)
└── package.json     root scripts (dev, setup)
```

## Adding a Real Algorithm

1. Create `backend/algorithms/<name>.py` with a `generate_steps(array: list[int]) -> list[dict]` function.  
   Each step dict must match the `SortStep` model in `models.py`.
2. In `backend/routers/sort.py`, import your function and call it instead of `generate_mock_steps` when `request.algorithm == "<name>"`.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Backend status check |
| GET | `/algorithms` | List all algorithms with metadata |
| POST | `/sort` | Body: `{algorithm, array}` → returns step sequence |
# CS404_Sorting_Algorithms_Comparison
