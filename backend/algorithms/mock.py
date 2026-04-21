def generate_mock_steps(array: list[int]) -> list[dict]:
    """
    Bubble sort step generator used as a placeholder for all algorithms.
    Replace calls to this function per-algorithm once real implementations exist.
    """
    arr = array.copy()
    steps: list[dict] = []
    n = len(arr)
    comparisons = 0
    swaps = 0
    array_accesses = 0
    sorted_indices: list[int] = []

    for i in range(n):
        for j in range(n - i - 1):
            comparisons += 1
            array_accesses += 2
            steps.append({
                "array": arr.copy(),
                "comparing": [j, j + 1],
                "swapping": [],
                "overwriting": [],
                "sorted": sorted_indices.copy(),
                "comparisons": comparisons,
                "swaps": swaps,
                "array_accesses": array_accesses,
            })
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
                array_accesses += 2
                steps.append({
                    "array": arr.copy(),
                    "comparing": [],
                    "swapping": [j, j + 1],
                    "overwriting": [],
                    "sorted": sorted_indices.copy(),
                    "comparisons": comparisons,
                    "swaps": swaps,
                    "array_accesses": array_accesses,
                })
        sorted_indices.append(n - i - 1)

    steps.append({
        "array": arr.copy(),
        "comparing": [],
        "swapping": [],
        "overwriting": [],
        "sorted": list(range(n)),
        "comparisons": comparisons,
        "swaps": swaps,
        "array_accesses": array_accesses,
    })

    return steps
