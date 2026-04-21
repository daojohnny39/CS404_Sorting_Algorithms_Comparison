---
name: SortViz Project State
description: CS 404 scroll-driven merge sort visualizer — stack, components built, color semantics, dev server ports
type: project
---

React + Vite frontend, FastAPI + Pydantic backend.

**Why:** CS 404 mini project — educational merge sort visualizer.

**Dev servers:** Backend on port 8000 (uvicorn), frontend on port 5173/5175 (vite, picks available port).

**How to apply:** When suggesting changes, be aware of the current architecture and what's already been built.

---

## Architecture

### Backend
- `backend/main.py` — FastAPI app
- `backend/routers/sort.py` — POST /sort, GET /algorithms
- `backend/models.py` — Pydantic: AlgorithmMeta, SortRequest, SortStep, SortResponse
- `backend/algorithms/merge_sort.py` — generates step-by-step trace

### Frontend
- `frontend/src/components/ScrollSortVisualizer.tsx` — scroll-driven section; generates 10-element array
- `frontend/src/components/SortTileGrid.tsx` — tree-layout tile visualizer with absolute positioning + framer-motion
- `frontend/src/components/PseudocodePanel.tsx` — pseudocode display
- `frontend/src/hooks/useSortSteps.ts` — fetches steps from API
- `frontend/src/hooks/useScrollStepper.ts` — maps scroll % → step index

---

## Current Feature State (as of 2026-04-21)

### Array size
Fixed at 10 unique 2-digit values (Fisher-Yates shuffle of 10–99).

### Tree-layout animation
`SortTileGrid` positions each tile absolutely at `left = ((i+0.5)/n)*100%` (proportional, fixed horizontally).  
Vertical position: `y = segDepth * ROW_HEIGHT + liftY` animated via framer-motion spring.  
Each step's `segments: [[left, right, depth], ...]` drives which row each tile sits in.

Tiles physically descend as the recursion splits and ascend as merges complete.

### Temp row
During `compare`/`write`/`copy_remaining` steps, a "temp" row appears below the tree showing the snapshot of the two halves being merged. Left half: blue tint; right half: lighter blue. Active read pointers highlighted yellow.

### Color semantics
- Default: dark slate / `#334155` border
- Comparing: yellow / `#EAB308`
- Overwriting (write destination): purple / `#8B5CF6`
- Sorted: teal / `#14B8A6`
- Complete: green / `#22C55E`

### SortStep fields (backend → frontend)
Standard: `array`, `comparing`, `swapping`, `overwriting`, `sorted`, `comparisons`, `swaps`, `array_accesses`, `operation`, `description`, `pseudocode_line`, `range`, `left_range`, `right_range`

New: `depth`, `segments`, `merge_range`, `temp_snapshot`, `temp_left_range`, `temp_right_range`, `temp_left_ptr`, `temp_right_ptr`, `write_index`, `write_value`, `source_side`, `source_indices`

### Scroll height
`Math.max(5000, Math.min(18000, steps.length * 50))` — gives ~50px of scroll per step.
