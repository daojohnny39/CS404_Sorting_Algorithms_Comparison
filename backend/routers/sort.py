from fastapi import APIRouter, HTTPException

from models import AlgorithmMeta, SortRequest, SortResponse, SortStep
from algorithms import generate_mock_steps

router = APIRouter()

ALGORITHMS: list[AlgorithmMeta] = [
    AlgorithmMeta(
        id="bubble",
        name="Bubble Sort",
        time_complexity={"best": "O(n)", "average": "O(n²)", "worst": "O(n²)"},
        space_complexity="O(1)",
        description="Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
        stable=True,
    ),
    AlgorithmMeta(
        id="selection",
        name="Selection Sort",
        time_complexity={"best": "O(n²)", "average": "O(n²)", "worst": "O(n²)"},
        space_complexity="O(1)",
        description="Divides the array into a sorted and unsorted region, repeatedly selecting the minimum from the unsorted region.",
        stable=False,
    ),
    AlgorithmMeta(
        id="insertion",
        name="Insertion Sort",
        time_complexity={"best": "O(n)", "average": "O(n²)", "worst": "O(n²)"},
        space_complexity="O(1)",
        description="Builds the sorted array one element at a time by inserting each element into its correct position.",
        stable=True,
    ),
    AlgorithmMeta(
        id="merge",
        name="Merge Sort",
        time_complexity={"best": "O(n log n)", "average": "O(n log n)", "worst": "O(n log n)"},
        space_complexity="O(n)",
        description="Divides the array into halves, recursively sorts each half, then merges the sorted halves back together.",
        stable=True,
    ),
    AlgorithmMeta(
        id="quick",
        name="Quick Sort",
        time_complexity={"best": "O(n log n)", "average": "O(n log n)", "worst": "O(n²)"},
        space_complexity="O(log n)",
        description="Selects a pivot and partitions the array into elements less than and greater than the pivot, then recurses.",
        stable=False,
    ),
    AlgorithmMeta(
        id="heap",
        name="Heap Sort",
        time_complexity={"best": "O(n log n)", "average": "O(n log n)", "worst": "O(n log n)"},
        space_complexity="O(1)",
        description="Converts the array into a max-heap, then repeatedly extracts the maximum to build the sorted output.",
        stable=False,
    ),
]

_ALGORITHM_MAP = {a.id: a for a in ALGORITHMS}


@router.get("/algorithms", response_model=list[AlgorithmMeta])
def get_algorithms() -> list[AlgorithmMeta]:
    return ALGORITHMS


@router.post("/sort", response_model=SortResponse)
def sort_array(request: SortRequest) -> SortResponse:
    if request.algorithm not in _ALGORITHM_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown algorithm '{request.algorithm}'. Valid options: {sorted(_ALGORITHM_MAP)}",
        )
    raw_steps = generate_mock_steps(request.array)
    steps = [SortStep(**s) for s in raw_steps]
    return SortResponse(
        algorithm=request.algorithm,
        initial_array=request.array,
        steps=steps,
    )
