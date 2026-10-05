# Algorithms: JavaScript revision

[Back to the topic index](./README.md)

An algorithm is a sequence of steps that transforms an input into a result. Learn the reason a pattern works, then implement it without looking. Use the table for quick revision and the complete examples for practice.

## Quick lookup

`n` = items, `V` = vertices, `E` = edges, `A` = target amount, `c` = coin denominations. Space below excludes input and returned output unless stated. Hash operations use expected constant time; ordinary dense-array access uses the standard interview model.

| Pattern                  | Recognition clue / precondition                   | Time                           | Auxiliary space                    |
| ------------------------ | ------------------------------------------------- | ------------------------------ | ---------------------------------- |
| Linear search            | Unsorted input; find the first match              | O(n)                           | O(1)                               |
| Binary search            | Sorted input or a proven monotonic predicate      | O(log n)                       | O(1)                               |
| Merge sort               | Need predictable comparison sorting and stability | O(n log n)                     | O(n)                               |
| Hashing                  | Remember previously seen values                   | Expected O(n)                  | O(n)                               |
| Two pointers             | Sorted pair search; move boundaries with a proof  | O(n)                           | O(1)                               |
| Sliding window           | Consecutive items; update rather than rescan      | O(n)                           | O(1) for this fixed window         |
| Prefix sums              | Many sum queries on unchanged input               | Build O(n); query O(1)         | O(n) stored prefix; O(1) per query |
| Merge intervals          | Overlapping ranges; sort by start first           | O(n log n) under sorting model | O(n), including copied intervals   |
| BFS / DFS                | Reachability and traversal with a visited set     | O(V + E)                       | O(V)                               |
| Unweighted shortest path | Fewest edges; use BFS and parents                 | O(V + E)                       | O(V)                               |
| Backtracking             | Enumerate choices and undo each one               | O(n × n!) for permutations     | O(n); output O(n × n!)             |
| Dynamic programming      | Repeated subproblems with a reusable state        | O((A + 1) × (c + 1)) here      | O(A + 1)                           |

## How to practise

1. State the input contract and edge cases.
2. Describe a simple correct baseline and its cost.
3. State the invariant that permits the faster approach.
4. Copy one implementation and its “Try it” block into the same `practice.mjs`; run `node practice.mjs` with Node.js 24 or newer.
5. Close the notes and solve the linked [editable exercise](../../practice/dsa/exercises/README.md). Explain time, auxiliary space, output space, and mutation separately.

No extra packages are needed. See the [pnpm commands](../../practice/dsa/README.md). Avoid recursion on very deep input unless the call depth is bounded; JavaScript can throw a stack overflow. Use finite numbers in numeric examples. They use JavaScript `Number`, so large integers and decimal arithmetic need appropriate precision handling.

Jump to: [Search](#linear-search) · [Binary search](#binary-search) · [Sort](#merge-sort) · [Hashing](#hashing-two-sum) · [Two pointers](#two-pointers) · [Window](#sliding-window) · [Prefix](#prefix-sums) · [Intervals](#merge-intervals) · [Traversal](#bfs-and-dfs) · [Path](#unweighted-shortest-path) · [Backtracking](#backtracking) · [DP](#dynamic-programming)

## Linear search

Check values in order and return the first matching index, or `-1` if absent. It works without sorting; comparisons here use `===`.

**Invariant:** before index i, every earlier value has been checked and is not the target.

<!-- example:linear-search -->

```js
export function linearSearch(values, target) {
  for (let index = 0; index < values.length; index++) {
    if (values[index] === target) return index;
  }
  return -1;
}
```

Try it (append to the code above):

```js
console.log(JSON.stringify([linearSearch([8, 3, 5], 3), linearSearch([], 3)]));
```

Expected output:

```text
[1,-1]
```

<!-- /example:linear-search -->

**Cost:** O(n) worst-case time, O(1) auxiliary space. Best case is O(1) if the first value matches. No input mutation.

**Try next:** modify it to return all matching indices; count output space separately. Compare the result with JavaScript `indexOf()` for numeric inputs.

## Binary search

Repeatedly halve an ascending sorted numeric array. Return any matching index, or `-1`. This version does not promise the first occurrence of a duplicate.

**Invariant:** if the target exists, it is inside the inclusive range `[low, high]`. After testing the middle, exclude it with `middle + 1` or `middle - 1` so the range shrinks.

<!-- example:binary-search -->

```js
export function binarySearch(values, target) {
  let low = 0;
  let high = values.length - 1;
  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    if (values[middle] === target) return middle;
    if (values[middle] < target) low = middle + 1;
    else high = middle - 1;
  }
  return -1;
}
```

Try it (append to the code above):

```js
console.log(
  JSON.stringify([
    binarySearch([1, 3, 5, 7], 5),
    binarySearch([1, 3, 5, 7], 6),
  ]),
);
```

Expected output:

```text
[2,-1]
```

<!-- /example:binary-search -->

**Cost:** O(log n) time and O(1) auxiliary space. Sorting previously unsorted input adds its own cost; one isolated search may be cheaper as a scan. No mutation.

**Practise:** [binary-search](../../practice/dsa/exercises/README.md#binary-search). Test empty, one-item, absent, and duplicate inputs. Later implement “first value >= target” with a half-open range. Binary search on an answer requires a monotonic feasibility predicate, not necessarily a literal sorted array.

## Merge sort

Split into smaller halves, sort them, then merge sorted results. This implementation returns a new array and is **stable**: equal comparison keys keep their input order.

**Invariant:** the two halves are sorted; selecting the smaller next value keeps the merged prefix sorted. Choose the left value on a tie to preserve stability.

<!-- example:merge-sort -->

```js
export function mergeSort(values, compare = (a, b) => a - b) {
  if (values.length < 2) return values.slice();
  const middle = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, middle), compare);
  const right = mergeSort(values.slice(middle), compare);
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    // Taking the left item on a tie preserves stability.
    result.push(compare(left[i], right[j]) <= 0 ? left[i++] : right[j++]);
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}
```

Try it (append to the code above):

```js
const values = [10, 2, -1, 2];
console.log(JSON.stringify([mergeSort(values), values]));
```

Expected output:

```text
[[-1,2,2,10],[10,2,-1,2]]
```

<!-- /example:merge-sort -->

**Cost:** O(n log n) time and O(n) peak auxiliary memory for these temporary arrays, plus an O(log n) call stack and O(n) returned output. It allocates O(n log n) elements across the whole run, though they are not all live at once. The comparator must be consistent.

**Try next:** sort `[{ score: 2, id: "a" }, { score: 1, id: "b" }, { score: 2, id: "c" }]` with `(a, b) => a.score - b.score`; a must precede c. For application code, prefer built-in sorting unless implementing a sort is the exercise; its time and auxiliary space are engine-dependent. Bubble/selection/insertion sort are useful later comparisons, but this first guide focuses on patterns with broader use.

## Hashing: two sum

Find two distinct indices whose values sum to a target. Store each previously processed value and its index. Return a pair, or `null`.

**Invariant:** `seen` contains only earlier indices. Checking before insertion prevents using the same element twice and permits `[3, 3]` to satisfy target 6.

<!-- example:two-sum -->

```js
export function twoSum(values, target) {
  const seen = new Map();
  for (let index = 0; index < values.length; index++) {
    const complement = target - values[index];
    if (seen.has(complement)) return [seen.get(complement), index];
    seen.set(values[index], index);
  }
  return null;
}
```

Try it (append to the code above):

```js
console.log(
  JSON.stringify([
    twoSum([2, 7, 11, 15], 9),
    twoSum([3, 3], 6),
    twoSum([1], 2),
  ]),
);
```

Expected output:

```text
[[0,1],[0,1],null]
```

<!-- /example:two-sum -->

**Cost:** expected O(n) time, O(n) auxiliary space. A nested-loop baseline uses O(n²) time and O(1) space. No input mutation; if there are multiple answers, this code returns the first pair discovered by its scan.

**Try next:** use `[-2, 0, 2]` with targets 0 and 4. Contrast a Map of counts with a Map of indices; they answer different questions.

## Two pointers

Find a target pair in an **ascending sorted** numeric array. Start at opposite ends. If the sum is too small, increase the left value; if it is too large, decrease the right value.

**Invariant:** when the sum is too small, no pair using the current left value and a smaller right value can reach the target. The symmetric argument removes the right boundary for a sum that is too large.

<!-- example:two-pointers -->

```js
export function twoSumSorted(values, target) {
  let left = 0;
  let right = values.length - 1;
  while (left < right) {
    const sum = values[left] + values[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}
```

Try it (append to the code above):

```js
console.log(JSON.stringify(twoSumSorted([1, 2, 4, 6, 9], 10)));
```

Expected output:

```text
[0,4]
```

<!-- /example:two-pointers -->

**Cost:** O(n) time, O(1) auxiliary space. Return indices in the already-sorted input. Sorting first changes positions, so preserve original indices if the problem requires them. No mutation.

**Try next:** compare the result with hashing. Explain why moving a pointer without the sorted-order assumption is invalid.

## Sliding window

Find the maximum sum of exactly k consecutive values. Compute the first window, then subtract the item leaving and add the item entering.

**Invariant:** `sum` always represents the current window of k elements. Initialise `best` from the first real window so all-negative inputs work.

<!-- example:sliding-window -->

```js
export function maxWindowSum(values, k) {
  if (!Number.isInteger(k) || k < 1 || k > values.length) {
    throw new RangeError("k must be an integer between 1 and values.length");
  }
  let sum = 0;
  for (let index = 0; index < k; index++) sum += values[index];
  let best = sum;
  for (let right = k; right < values.length; right++) {
    sum += values[right] - values[right - k];
    best = Math.max(best, sum);
  }
  return best;
}
```

Try it (append to the code above):

```js
console.log(
  JSON.stringify([
    maxWindowSum([2, 1, 5, 1, 3, 2], 3),
    maxWindowSum([-5, -2, -3], 2),
  ]),
);
```

Expected output:

```text
[9,-5]
```

<!-- /example:sliding-window -->

**Cost:** O(n) time and O(1) auxiliary space. No mutation. k must be an integer from 1 to n, otherwise throw `RangeError`.

**Practise:** [max-window-sum](../../practice/dsa/exercises/README.md#max-window-sum). A variable-length window needs its own rule for expanding/shrinking. For example, “shrink while sum > target” is not generally valid when arbitrary negative numbers are allowed.

## Prefix sums

Precompute sums so a later inclusive range `[start, end]` is answered with one subtraction. The prefix has an extra initial zero.

**Invariant:** `prefix[i]` is the sum of the first i input values; therefore the range sum is `prefix[end + 1] - prefix[start]`.

<!-- example:prefix-sums -->

```js
export function buildPrefixSums(values) {
  const prefix = [0];
  for (const value of values) prefix.push(prefix.at(-1) + value);
  return prefix;
}

export function rangeSum(prefix, start, end) {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start ||
    end >= prefix.length - 1
  ) {
    throw new RangeError("Use valid inclusive start and end indices");
  }
  return prefix[end + 1] - prefix[start];
}
```

Try it (append to the code above):

```js
const prefix = buildPrefixSums([2, -1, 4, 3]);
console.log(JSON.stringify([prefix, rangeSum(prefix, 1, 3)]));
```

Expected output:

```text
[[0,2,1,5,8],6]
```

<!-- /example:prefix-sums -->

**Cost:** O(n) time and O(n) space to build/store the prefix; O(1) time and space per query. Updating the original values makes this prefix stale. `rangeSum()` validates indices and assumes a prefix built by `buildPrefixSums()`.

**Try next:** answer every range of a small array and compare with `slice(start, end + 1).reduce(...)`. Use a Fenwick/segment tree later if the problem requires frequent updates and queries.

## Merge intervals

Sort ranges by their start, then merge each one into the last result if they overlap. These are **closed** intervals with finite numeric endpoints and `start <= end`; touching ranges such as `[1, 2]` and `[2, 3]` merge. The code copies pairs to avoid mutating the input.

**Invariant:** the result is sorted, merged, and disjoint. Only its last interval can overlap the next sorted interval.

<!-- example:merge-intervals -->

```js
export function mergeIntervals(intervals) {
  const sorted = intervals
    .map(([start, end]) => [start, end])
    .sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const interval of sorted) {
    const last = result.at(-1);
    if (last === undefined || interval[0] > last[1]) result.push(interval);
    else last[1] = Math.max(last[1], interval[1]);
  }
  return result;
}
```

Try it (append to the code above):

```js
console.log(
  JSON.stringify(
    mergeIntervals([
      [8, 10],
      [1, 3],
      [2, 6],
      [10, 12],
    ]),
  ),
);
```

Expected output:

```text
[[1,6],[8,12]]
```

<!-- /example:merge-intervals -->

**Cost:** O(n log n) time under the usual sorting model and O(n) copied/output storage. Built-in sorting has engine-dependent auxiliary cost. For half-open intervals `[start, end)`, decide explicitly whether touching intervals should merge; change the condition to match that contract.

**Practise:** [merge-intervals](../../practice/dsa/exercises/README.md#merge-intervals). Include unsorted, nested, disjoint, identical, touching, and empty cases.

## BFS and DFS

**BFS** uses a FIFO queue to visit vertices by distance in edges. **DFS** uses a stack to explore deeper branches. Both need a visited set on graphs with cycles.

Input is a well-formed `Map<vertex, Set<vertex>>` with an entry for every neighbour; use [createGraph](../data-structures/data-structures-revision.md#graph) to construct one. These functions visit only the component reachable from `start`. To cover a disconnected graph, start another traversal from each still-unvisited vertex.

**Invariant:** mark a vertex when scheduling it, so it enters the queue/stack once. This DFS is a reachability traversal; its mark-on-push order may differ from recursive DFS on graphs with cross edges. Use explicit frames or recursion when an algorithm needs recursive DFS entry/exit times.

<!-- example:traversal -->

```js
export function bfs(graph, start) {
  if (!graph.has(start)) return [];
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  for (let head = 0; head < queue.length; head++) {
    const vertex = queue[head];
    order.push(vertex);
    for (const neighbour of graph.get(vertex)) {
      if (visited.has(neighbour)) continue;
      visited.add(neighbour); // Mark when enqueued, not when removed.
      queue.push(neighbour);
    }
  }
  return order;
}

export function dfs(graph, start) {
  if (!graph.has(start)) return [];
  const visited = new Set([start]);
  const stack = [start];
  const order = [];
  while (stack.length > 0) {
    const vertex = stack.pop();
    order.push(vertex);
    const neighbours = [...graph.get(vertex)].reverse();
    for (const neighbour of neighbours) {
      if (visited.has(neighbour)) continue;
      visited.add(neighbour);
      stack.push(neighbour);
    }
  }
  return order;
}
```

Try it (append to the code above):

```js
const graph = new Map([
  ["A", new Set(["B", "C"])],
  ["B", new Set(["D"])],
  ["C", new Set()],
  ["D", new Set()],
]);
console.log(JSON.stringify([bfs(graph, "A"), dfs(graph, "A")]));
```

Expected output:

```text
[["A","B","C","D"],["A","B","D","C"]]
```

<!-- /example:traversal -->

**Cost:** O(V + E) time and O(V) auxiliary space over the reachable component. The queue uses a head index instead of `shift()`. Neighbour insertion order affects the output, but not reachability. An absent start returns `[]`. Directed graphs follow edge direction.

**Try next:** add a back-edge D → A and an isolated E. Prove no vertex is returned twice. A tree needs no general visited set if you only follow child links and it has no cycles/shared children.

## Unweighted shortest path

Use BFS to find a route with the fewest edges. Record the parent when first discovering a vertex, then follow parents backwards and reverse the route.

**Invariant:** BFS discovers vertices in nondecreasing distance. The first parent assigned to a vertex lies on a shortest path from the start.

<!-- example:shortest-path -->

```js
export function shortestPath(graph, start, target) {
  if (!graph.has(start) || !graph.has(target)) return null;
  const visited = new Set([start]);
  const parent = new Map();
  const queue = [start];
  for (let head = 0; head < queue.length && !visited.has(target); head++) {
    const vertex = queue[head];
    for (const neighbour of graph.get(vertex)) {
      if (visited.has(neighbour)) continue;
      visited.add(neighbour);
      parent.set(neighbour, vertex);
      queue.push(neighbour);
    }
  }
  if (!visited.has(target)) return null;
  const path = [target];
  while (parent.has(path.at(-1))) path.push(parent.get(path.at(-1)));
  return path.reverse();
}
```

Try it (append to the code above):

```js
const graph = new Map([
  ["A", new Set(["B", "C"])],
  ["B", new Set(["D"])],
  ["C", new Set(["D"])],
  ["D", new Set()],
  ["E", new Set()],
]);
console.log(
  JSON.stringify([
    shortestPath(graph, "A", "D"),
    shortestPath(graph, "A", "E"),
  ]),
);
```

Expected output:

```text
[["A","B","D"],null]
```

<!-- /example:shortest-path -->

**Cost:** O(V + E) time, O(V) auxiliary space, and O(L) output for a route of L vertices. Missing endpoints or unreachable targets return `null`; an existing start equal to the target returns `[start]`. Multiple shortest paths are valid. No input mutation.

**Practise:** [shortest-path](../../practice/dsa/exercises/README.md#shortest-path). BFS assumes equal edge costs. For varying non-negative weights, learn Dijkstra with a priority queue; for negative edges, a different algorithm and negative-cycle handling are needed.

## Backtracking

Build a partial answer, explore a choice, then undo it before trying another. This example enumerates all permutations of **distinct** input values.

**Invariant:** `path` contains exactly the indices marked in `used`. After a recursive branch returns, undo both the appended value and its used flag. Copy completed paths because the working path keeps changing.

<!-- example:backtracking -->

```js
export function permutations(values) {
  const result = [];
  const path = [];
  const used = new Array(values.length).fill(false);
  function visit() {
    if (path.length === values.length) {
      result.push(path.slice());
      return;
    }
    for (let index = 0; index < values.length; index++) {
      if (used[index]) continue;
      used[index] = true;
      path.push(values[index]);
      visit();
      path.pop();
      used[index] = false;
    }
  }
  visit();
  return result;
}
```

Try it (append to the code above):

```js
console.log(JSON.stringify(permutations([1, 2, 3])));
```

Expected output:

```text
[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

<!-- /example:backtracking -->

**Cost:** O(n × n!) time/output space for n >= 1, because n! arrays of length n are returned. Auxiliary path, flags, and recursion use O(n). Empty input gives `[[]]`. Repeated input values produce duplicate permutations in this version; unique permutations need explicit duplicate handling.

**Try next:** implement subsets, then combinations of size k. Explain why forgetting `path.pop()` corrupts later branches. Keep practice inputs small; factorial output grows quickly.

## Dynamic programming

Reuse answers to overlapping subproblems. For unlimited positive integer coins, `dp[total]` is the fewest coins needed to form that total. Unreachable totals remain `Infinity`; return `-1` if the target is unreachable.

**Recurrence:** `dp[total] = min(dp[total - coin] + 1)` for coins no larger than total, with base `dp[0] = 0`. Fill totals from small to large so dependencies are already computed.

<!-- example:dynamic-programming -->

```js
export function minCoins(coins, amount) {
  if (
    !Number.isSafeInteger(amount) ||
    amount < 0 ||
    coins.some((coin) => !Number.isSafeInteger(coin) || coin <= 0)
  ) {
    throw new RangeError(
      "Use positive integer coins and a non-negative integer amount",
    );
  }
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (coin <= total) dp[total] = Math.min(dp[total], dp[total - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

Try it (append to the code above):

```js
console.log(
  JSON.stringify([minCoins([1, 3, 4], 6), minCoins([2], 3), minCoins([], 0)]),
);
```

Expected output:

```text
[2,-1,0]
```

<!-- /example:dynamic-programming -->

**Cost:** O((A + 1) × (c + 1)) time including validation, allocation, and empty-coin cases; this simplifies to O(A × c) when A and c are both at least 1. Auxiliary space is O(A + 1). Amount must be a non-negative safe integer; coins must be positive safe integers. Keep A small enough to allocate the table. This is pseudo-polynomial in the numeric amount, not in its number of digits. No mutation.

**Practise:** [min-coins](../../practice/dsa/exercises/README.md#min-coins). With `[1, 3, 4]` and amount 6, greedy takes `4 + 1 + 1`, while DP finds `3 + 3`. Greedy needs a proof that a locally best choice remains globally optimal; it is not interchangeable with DP.

## Explain your solution

- What contract makes your pointer movement or recurrence valid?
- Which values represent state, and why is that state sufficient?
- What guarantees progress or termination?
- What happens with empty input, duplicates, negatives, missing results, or cycles?
- What is the runtime, extra memory, returned output size, and mutation policy?

Use [time and space complexity](./time-and-space-complexity.md) for additional background and the [exercise order](../../practice/dsa/exercises/README.md) for recall practice.

## Primary references

- [MDN: Array.sort and comparators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN: Map and average access requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Node.js: built-in test runner](https://nodejs.org/docs/latest-v24.x/api/test.html)

[Back to algorithms](./README.md)
