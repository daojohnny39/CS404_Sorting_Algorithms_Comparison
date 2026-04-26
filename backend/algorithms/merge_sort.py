def generate_merge_sort_steps(array: list[int]) -> list[dict]:
    steps = []
    arr = list(array)
    n = len(arr)
    merged_indices = set()
    stats = {"comparisons": 0, "writes": 0}
    segments: list[list[int]] = [[0, n - 1, 0]] if n > 0 else []

    def add_step(op, desc, line, depth,
                 comparing=None, overwriting=None,
                 r=None, lr=None, rr=None,
                 merge_range=None, temp_snapshot=None,
                 temp_lr=None, temp_rr=None,
                 t_l_ptr=-1, t_r_ptr=-1,
                 w_idx=-1, w_val=None,
                 src_side="", src_indices=None):
        steps.append({
            "array": list(arr),
            "comparing": comparing if comparing is not None else [],
            "swapping": [],
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
            "temp_snapshot": temp_snapshot if temp_snapshot is not None else [],
            "temp_left_range": temp_lr if temp_lr is not None else [],
            "temp_right_range": temp_rr if temp_rr is not None else [],
            "temp_left_ptr": t_l_ptr,
            "temp_right_ptr": t_r_ptr,
            "write_index": w_idx,
            "write_value": w_val,
            "source_side": src_side,
            "source_indices": src_indices if src_indices is not None else [],
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

        left_len = mid - left + 1
        right_len = right - mid
        temp = arr[left:right + 1]
        t_lr = [0, left_len - 1]
        t_rr = [left_len, left_len + right_len - 1]

        add_step("merge_init", f"Preparing to merge ranges [{left}, {mid}] and [{mid+1}, {right}]",
                 7, depth, r=[left, right], lr=[left, mid], rr=[mid+1, right],
                 merge_range=[left, right], temp_snapshot=list(temp),
                 temp_lr=t_lr, temp_rr=t_rr, t_l_ptr=0, t_r_ptr=0)

        i = 0
        j = 0
        k = left

        while i < left_len and j < right_len:
            abs_i = left + i
            abs_j = mid + 1 + j
            add_step("compare", f"Comparing {temp[i]} (index {abs_i}) and {temp[left_len + j]} (index {abs_j})",
                     10, depth, comparing=[abs_i, abs_j], r=[left, right],
                     merge_range=[left, right], temp_snapshot=list(temp),
                     temp_lr=t_lr, temp_rr=t_rr, t_l_ptr=i, t_r_ptr=j,
                     src_indices=[abs_i, abs_j])
            stats["comparisons"] += 1

            if temp[i] <= temp[left_len + j]:
                val = temp[i]; src_side = "left"; src_idx = abs_i; i += 1
            else:
                val = temp[left_len + j]; src_side = "right"; src_idx = abs_j; j += 1

            arr[k] = val
            stats["writes"] += 1
            add_step("write", f"Writing {val} from {src_side} half to index {k}",
                     11, depth, overwriting=[k], r=[left, right],
                     merge_range=[left, right], temp_snapshot=list(temp),
                     temp_lr=t_lr, temp_rr=t_rr, t_l_ptr=i, t_r_ptr=j,
                     w_idx=k, w_val=val, src_side=src_side, src_indices=[src_idx])
            k += 1

        while i < left_len:
            val = temp[i]; abs_i = left + i
            arr[k] = val
            stats["writes"] += 1
            add_step("copy_remaining", f"Copying remaining element {val} from left half to index {k}",
                     12, depth, overwriting=[k], r=[left, right],
                     merge_range=[left, right], temp_snapshot=list(temp),
                     temp_lr=t_lr, temp_rr=t_rr, t_l_ptr=i, t_r_ptr=j,
                     w_idx=k, w_val=val, src_side="left", src_indices=[abs_i])
            i += 1; k += 1

        while j < right_len:
            val = temp[left_len + j]; abs_j = mid + 1 + j
            arr[k] = val
            stats["writes"] += 1
            add_step("copy_remaining", f"Copying remaining element {val} from right half to index {k}",
                     13, depth, overwriting=[k], r=[left, right],
                     merge_range=[left, right], temp_snapshot=list(temp),
                     temp_lr=t_lr, temp_rr=t_rr, t_l_ptr=i, t_r_ptr=j,
                     w_idx=k, w_val=val, src_side="right", src_indices=[abs_j])
            j += 1; k += 1

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
