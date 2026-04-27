def generate_merge_sort_steps(array: list[int]) -> list[dict]:
    steps = []
    arr = list(array)
    n = len(arr)
    merged_indices = set()
    stats = {"comparisons": 0, "writes": 0}
    segments: list[list[int]] = [[0, n - 1, 0]] if n > 0 else []

    def add_step(op, desc, line, depth,
                 comparing=None, swapping=None, overwriting=None,
                 r=None, lr=None, rr=None, merge_range=None):
        steps.append({
            "array": list(arr),
            "comparing": comparing if comparing is not None else [],
            "swapping": swapping if swapping is not None else [],
            "overwriting": overwriting if overwriting is not None else [],
            "sorted": sorted(list(merged_indices)),
            "comparisons": stats["comparisons"],
            "swaps": stats["writes"],
            "operation": op,
            "description": desc,
            "pseudocode_line": line,
            "range": r if r is not None else [],
            "left_range": lr if lr is not None else [],
            "right_range": rr if rr is not None else [],
            "depth": depth,
            "segments": [list(s) for s in segments],
            "merge_range": merge_range if merge_range is not None else [],
        })

    def merge_sort(left, right, depth):
        if left >= right:
            return

        mid = (left + right) // 2

        for idx in range(len(segments) - 1, -1, -1):
            if segments[idx] == [left, right, depth]:
                segments.pop(idx)
                break
        segments.append([left, mid, depth + 1])
        segments.append([mid + 1, right, depth + 1])

        add_step("split", f"Splitting array into [{left}, {mid}] and [{mid+1}, {right}]",
                 2, depth, r=[left, right], lr=[left, mid], rr=[mid+1, right])

        merge_sort(left, mid, depth + 1)
        merge_sort(mid + 1, right, depth + 1)

        i = left
        j = mid + 1
        cur_mid = mid

        add_step("merge_init", f"Preparing to merge ranges [{left}, {mid}] and [{mid+1}, {right}]",
                 7, depth, r=[left, right], lr=[left, mid], rr=[mid+1, right],
                 merge_range=[left, right])

        while i <= cur_mid and j <= right:
            stats["comparisons"] += 1
            add_step("compare", f"Comparing arr[{i}]={arr[i]} and arr[{j}]={arr[j]}",
                     10, depth, comparing=[i, j], r=[left, right], merge_range=[left, right])

            if arr[i] <= arr[j]:
                i += 1
            else:
                k = j
                while k > i:
                    l_val = arr[k - 1]
                    r_val = arr[k]
                    arr[k], arr[k - 1] = arr[k - 1], arr[k]
                    stats["writes"] += 1
                    add_step("swap", f"Swapping {l_val} (index {k-1}) and {r_val} (index {k})",
                             11, depth, swapping=[k - 1, k], r=[left, right], merge_range=[left, right])
                    k -= 1
                i += 1
                cur_mid += 1
                j += 1

        for idx in range(left, right + 1):
            merged_indices.add(idx)

        for idx in range(len(segments) - 1, -1, -1):
            if segments[idx] in ([left, mid, depth + 1], [mid + 1, right, depth + 1]):
                segments.pop(idx)
        segments.append([left, right, depth])

        add_step("merged", f"Merged range [{left}, {right}]", 5, depth, r=[left, right])

    add_step("start", "Starting Merge Sort", 0, 0)
    if n > 0:
        merge_sort(0, n - 1, 0)
    add_step("complete", "Merge Sort complete", -1, 0)
    return steps
