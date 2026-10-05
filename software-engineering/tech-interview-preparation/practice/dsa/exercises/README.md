# Editable DSA exercises

[Practice commands](../README.md) · [Data structures](../../../software-engineering-theory/data-structures/data-structures-revision.md) · [Algorithms](../../../software-engineering-theory/algorithms/algorithms-revision.md)

Work down this list. Each starter exports `solve`; implement the function without changing its signature. Run commands from `software-engineering/practice/dsa`. All inputs use the stated contract; numeric inputs are finite and arrays are dense. Complexity uses the usual array/hash-table model.

```bash
pnpm run exercise list
pnpm run exercise frequency-count
# After attempting it, compare with the answer:
pnpm run exercise:solution frequency-count
```

Starters initially throw a helpful error. Completed solutions are in [solutions/](../solutions/); the normal `pnpm test` command checks those solutions, while `pnpm run exercise <id>` checks your starter.

| Order | ID | Main skill | Target |
| --- | --- | --- | --- |
| 1 | `frequency-count` | Map and identity | Expected O(n) time, O(u) space |
| 2 | `valid-brackets` | Stack and nesting | O(n) time, O(n) space |
| 3 | `reverse-list` | References and in-place updates | O(n) time, O(1) auxiliary space |
| 4 | `binary-search` | Shrinking a valid search interval | O(log n) time, O(1) space |
| 5 | `max-window-sum` | Reusing a consecutive window | O(n) time, O(1) space |
| 6 | `merge-intervals` | Sort then scan | O(n log n) time, O(n) copied/output space |
| 7 | `k-smallest` | Heap invariant | O(n log n + k log n) using this heap |
| 8 | `shortest-path` | BFS, visited state, parents | O(V + E) time, O(V) space |
| 9 | `min-coins` | State, base case, recurrence | O((A + 1) × (c + 1)) time, O(A + 1) space |

## frequency-count

**Signature:** `solve(values) -> Map`. Count each value; preserve the distinction between `0`, `"0"`, and different object identities. `NaN` values share one key. Empty input returns an empty Map. Leave the input unchanged.

Example: `["a", "b", "a"] -> new Map([["a", 2], ["b", 1]])`.

<details>
<summary>Hint and revision link</summary>

For each value, read its old count or zero and write back count + 1. A plain object would coerce keys. See [Map and Set](../../../software-engineering-theory/data-structures/data-structures-revision.md#map-and-set).

</details>

## valid-brackets

**Signature:** `solve(text) -> boolean`. Input contains only `()[]{}`. Every closer must match the latest unfinished opener. Empty input is valid. `([)]` is invalid even though counts match.

Examples: `"([]{})" -> true`; `"(()" -> false`.

<details>
<summary>Hint and revision link</summary>

Store expected closing brackets on a stack. A mismatched pop fails; a nonempty stack at the end also fails. See [stack](../../../software-engineering-theory/data-structures/data-structures-revision.md#stack).

</details>

## reverse-list

**Signature:** `solve(head) -> newHead`. Each node is `{ value, next }`; an empty list is `null`. The list is acyclic. Reverse links in place without creating replacement nodes. Return the original tail as the new head; the old head must point to `null`.

Example: `1 -> 2 -> 3 -> null` becomes `3 -> 2 -> 1 -> null` using the same node objects.

<details>
<summary>Hint and revision link</summary>

Use `previous`, `current`, and a saved `next`. Advance only after rewiring. See [linked list](../../../software-engineering-theory/data-structures/data-structures-revision.md#singly-linked-list).

</details>

## binary-search

**Signature:** `solve(values, target) -> index`. Input is ascending sorted numbers. Return any matching index for duplicates, otherwise `-1`. Leave input unchanged. Test empty input and targets below/above the entire range.

Example: `([1, 3, 5, 7], 5) -> 2`.

<details>
<summary>Hint and revision link</summary>

Maintain an inclusive `[low, high]` range; each comparison must remove at least the middle element. See [binary search](../../../software-engineering-theory/algorithms/algorithms-revision.md#binary-search).

</details>

## max-window-sum

**Signature:** `solve(values, k) -> number`. Return the greatest sum of exactly k consecutive values. k must be an integer from 1 to `values.length`, otherwise throw `RangeError`. All-negative values are valid; input is unchanged.

Examples: `([2, 1, 5, 1, 3, 2], 3) -> 9`; `([-5, -2, -3], 2) -> -5`.

<details>
<summary>Hint and revision link</summary>

Initialise from the first complete window, then subtract the outgoing value and add the incoming value. See [sliding window](../../../software-engineering-theory/algorithms/algorithms-revision.md#sliding-window).

</details>

## merge-intervals

**Signature:** `solve(intervals) -> newIntervals`. Each closed interval is `[start, end]` with `start <= end`. Merge overlaps and touching endpoints. Return sorted, disjoint pairs without changing the input or its nested pairs. Empty input returns `[]`.

Example: `[[8, 10], [1, 3], [2, 6], [10, 12]] -> [[1, 6], [8, 12]]`.

<details>
<summary>Hint and revision link</summary>

Copy pairs before sorting by numeric start. Compare the next start with the last merged end. See [merge intervals](../../../software-engineering-theory/algorithms/algorithms-revision.md#merge-intervals).

</details>

## k-smallest

**Signature:** `solve(values, k) -> number[]`. Return the k smallest values in ascending order, retaining duplicates and leaving input unchanged. k must be an integer from 0 to `values.length`, otherwise throw `RangeError`.

Example: `([5, 1, 4, 1, -2], 3) -> [-2, 1, 1]`. Import `MinHeap` from `../src/structures/min-heap.js` into the starter and use it rather than built-in sorting for this exercise.

<details>
<summary>Hint and revision link</summary>

Push all values, then pop k times. This heap is built with repeated insertions, not bottom-up heapify. See [min-heap](../../../software-engineering-theory/data-structures/data-structures-revision.md#min-heap). The returned output uses O(k) space in addition to the O(n) heap.

</details>

## shortest-path

**Signature:** `solve(graph, start, target) -> path | null`. Use a well-formed `Map<vertex, Set<vertex>>` of unweighted neighbours. Return any shortest route including both endpoints. Missing or disconnected endpoints return `null`; an existing start equal to target gives `[start]`. Do not mutate the graph.

Example: with edges A–B, A–C, B–D, C–D, either `["A", "B", "D"]` or `["A", "C", "D"]` is valid.

<details>
<summary>Hint and revision link</summary>

Mark on enqueue, record first parents, and reconstruct backwards. The tests accept tied shortest paths. See [unweighted shortest path](../../../software-engineering-theory/algorithms/algorithms-revision.md#unweighted-shortest-path).

</details>

## min-coins

**Signature:** `solve(coins, amount) -> number`. Coins are reusable positive safe integers; amount is a non-negative safe integer. Return the minimum count, or `-1` if impossible. Throw `RangeError` for invalid denominations/amount. Use small practice amounts; memory grows with amount. Do not mutate coins.

Examples: `([1, 3, 4], 6) -> 2`; `([2], 3) -> -1`; `([], 0) -> 0`.

<details>
<summary>Hint and revision link</summary>

Define the meaning of `dp[total]`, set `dp[0]`, and compute from smaller totals. See [dynamic programming](../../../software-engineering-theory/algorithms/algorithms-revision.md#dynamic-programming).

</details>

## After each exercise

Record the mistake or missing invariant in your own private practice log. Re-solve after a gap; passing immediately after reading a solution mainly checks short-term recall. Add a new problem with different wording that uses the same pattern. These local exercises work well before selected [LeetCode 75](https://leetcode.com/studyplan/leetcode-75/) or [NeetCode practice](https://neetcode.io/practice) problems; the goal is independent solving and explanation, not a problem-count target.
