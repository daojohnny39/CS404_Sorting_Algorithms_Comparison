def generate_quick_sort_steps(array: list[int]) -> list[dict]:
    n = len(array)
    steps = []

    arr = list(array)
    sorted_indices: set[int] = set()
    segments: list[list[int]] = [[0, n - 1, 0]] if n > 0 else []
    stats = {"comparisons": 0, "swaps": 0, "accesses": 0}

    def add_step(operation, description, line, depth=0,
                 comparing=None, swapping=None, range_val=None,
                 pivot_idx=-1, part_idx=-1, scan_idx=-1):
        steps.append({
            "array": list(arr),
            "comparing": comparing if comparing is not None else [],
            "swapping": swapping if swapping is not None else [],
            "overwriting": [],
            "sorted": sorted(list(sorted_indices)),
            "comparisons": stats["comparisons"],
            "swaps": stats["swaps"],
            "array_accesses": stats["accesses"],
            "operation": operation,
            "description": description,
            "pseudocode_line": line,
            "range": range_val if range_val is not None else [],
            "left_range": [],
            "right_range": [],
            "depth": depth,
            "segments": [list(s) for s in segments],
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
            "pivot_index": pivot_idx,
            "partition_index": part_idx,
            "scan_index": scan_idx,
        })

    def remove_segment(left, right, depth):
        for idx in range(len(segments) - 1, -1, -1):
            if segments[idx] == [left, right, depth]:
                segments.pop(idx)
                return

    def partition(left, right, depth) -> int:
        pivot = arr[right]
        i = left - 1

        add_step("pivot_select", f"Selecting pivot {pivot} at index {right}",
                 7, depth=depth, range_val=[left, right],
                 pivot_idx=right, part_idx=i, scan_idx=-1)

        for j in range(left, right):
            add_step("compare",
                     f"Comparing arr[{j}]={arr[j]} with pivot {pivot}",
                     10, depth=depth, comparing=[j, right],
                     range_val=[left, right],
                     pivot_idx=right, part_idx=i, scan_idx=j)
            stats["comparisons"] += 1
            stats["accesses"] += 2

            if arr[j] <= pivot:
                i += 1
                if i != j:
                    add_step("swap",
                             f"Swapping arr[{i}]={arr[i]} and arr[{j}]={arr[j]}",
                             11, depth=depth, swapping=[i, j],
                             range_val=[left, right],
                             pivot_idx=right, part_idx=i, scan_idx=j)
                    arr[i], arr[j] = arr[j], arr[i]
                    stats["swaps"] += 1
                    stats["accesses"] += 2
                    add_step("swapped",
                             f"Swapped arr[{i}] and arr[{j}]",
                             11, depth=depth,
                             range_val=[left, right],
                             pivot_idx=right, part_idx=i, scan_idx=j)

        add_step("pivot_place",
                 f"Placing pivot {pivot} at index {i + 1}",
                 12, depth=depth, swapping=[i + 1, right],
                 range_val=[left, right],
                 pivot_idx=right, part_idx=i + 1, scan_idx=-1)
        arr[i + 1], arr[right] = arr[right], arr[i + 1]
        stats["swaps"] += 1
        stats["accesses"] += 2
        return i + 1

    def quick_sort(left, right, depth):
        if left > right:
            return

        if left == right:
            sorted_indices.add(left)
            remove_segment(left, right, depth)
            add_step("base_case",
                     f"Single element at index {left} is sorted",
                     1, depth=depth, range_val=[left, right])
            return

        add_step("quick_call",
                 f"Sorting range [{left}, {right}]",
                 0, depth=depth, range_val=[left, right])

        p = partition(left, right, depth)

        remove_segment(left, right, depth)
        if left <= p - 1:
            segments.append([left, p - 1, depth + 1])
        if p + 1 <= right:
            segments.append([p + 1, right, depth + 1])
        sorted_indices.add(p)

        add_step("partition_done",
                 f"Pivot placed at index {p}, partitioning [{left},{right}] complete",
                 2, depth=depth, range_val=[left, right], pivot_idx=p)

        quick_sort(left, p - 1, depth + 1)
        quick_sort(p + 1, right, depth + 1)

    add_step("start", "Starting Quick Sort", 0,
             range_val=[0, n - 1] if n > 0 else [])

    if n > 0:
        quick_sort(0, n - 1, 0)

    add_step("complete", "Quick Sort complete", -1,
             range_val=[0, n - 1] if n > 0 else [])

    return steps
