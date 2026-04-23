def generate_bubble_sort_steps(array: list[int]) -> list[dict]:
    steps = []
    arr = list(array)
    n = len(arr)
    sorted_indices: set[int] = set()
    stats = {"comparisons": 0, "writes": 0, "accesses": 0}

    def add_step(op, desc, line,
                 comparing=None, swapping=None, overwriting=None):
        steps.append({
            "array": list(arr),
            "comparing": comparing if comparing is not None else [],
            "swapping": swapping if swapping is not None else [],
            "overwriting": overwriting if overwriting is not None else [],
            "sorted": sorted(list(sorted_indices)),
            "comparisons": stats["comparisons"],
            "swaps": stats["writes"],
            "array_accesses": stats["accesses"],
            "operation": op,
            "description": desc,
            "pseudocode_line": line,
            # Merge-sort-specific fields left at defaults
            "range": [],
            "left_range": [],
            "right_range": [],
            "depth": 0,
            "segments": [],
            "merge_range": [],
            "temp_snapshot": [],
            "temp_left_range": [],
            "temp_right_range": [],
            "temp_left_ptr": -1,
            "temp_right_ptr": -1,
            "write_index": -1,
            "write_value": None,
            "source_side": "",
            "source_indices": [],
        })

    add_step("start", "Starting Bubble Sort", 0)

    for i in range(n):
        swapped = False

        add_step(
            "pass_start",
            f"Starting pass {i + 1} of {n}",
            1,
        )

        for j in range(n - i - 1):
            stats["comparisons"] += 1
            stats["accesses"] += 2

            add_step(
                "compare",
                f"Comparing {arr[j]} (index {j}) and {arr[j + 1]} (index {j + 1})",
                3,
                comparing=[j, j + 1],
            )

            if arr[j] > arr[j + 1]:
                # Record the swap
                stats["writes"] += 2
                stats["accesses"] += 2

                add_step(
                    "swap",
                    f"Swapping {arr[j]} and {arr[j + 1]}",
                    4,
                    swapping=[j, j + 1],
                )

                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

                add_step(
                    "swapped",
                    f"Swapped: {arr[j]} is now at index {j}, {arr[j + 1]} at index {j + 1}",
                    4,
                )

        # The last element of this pass is now in its final position
        sorted_indices.add(n - 1 - i)

        add_step(
            "element_sorted",
            f"Element {arr[n - 1 - i]} at index {n - 1 - i} is in its final position",
            5,
        )

        if not swapped:
            # Early termination: remaining elements are already sorted
            for k in range(n - 1 - i):
                sorted_indices.add(k)
            add_step(
                "early_exit",
                "No swaps in this pass — array is already sorted",
                6,
            )
            break

    add_step("complete", "Bubble Sort complete", -1)

    return steps
