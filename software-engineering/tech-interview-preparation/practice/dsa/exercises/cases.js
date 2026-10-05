import assert from "node:assert/strict";

const graph = () => new Map([
  ["A", new Set(["B", "C"])], ["B", new Set(["A", "D"])],
  ["C", new Set(["A", "D"])], ["D", new Set(["B", "C"])],
  ["E", new Set()],
]);

export const exercises = {
  "frequency-count": { title: "Count each value with a Map", run(solve) {
    assert.deepEqual(solve([]), new Map());
    assert.deepEqual(solve(["x", "y", "x"]), new Map([["x", 2], ["y", 1]]));
    const object = {};
    const other = {};
    const counts = solve([object, object, other, NaN, NaN]);
    assert.equal(counts instanceof Map, true);
    assert.equal(counts.size, 3);
    assert.equal(counts.get(object), 2);
    assert.equal(counts.get(other), 1);
    assert.equal(counts.get(NaN), 2);
    assert.deepEqual(solve([0, "0", false]), new Map([[0, 1], ["0", 1], [false, 1]]));
  } },
  "valid-brackets": { title: "Match nested brackets using a stack", run(solve) {
    for (const text of ["", "()", "([]{})", "[({})]", "()[]{}"]) assert.equal(solve(text), true);
    for (const text of ["(", ")", "([)]", "(()", "())", "}{"]) assert.equal(solve(text), false);
  } },
  "reverse-list": { title: "Reverse an acyclic singly linked list in place", run(solve) {
    assert.equal(solve(null), null);
    const single = { value: 1, next: null };
    assert.equal(solve(single), single);
    assert.equal(single.next, null);
    const nodes = [1, 2, 3, 4].map(value => ({ value, next: null }));
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
    let node = solve(nodes[0]);
    for (const expected of nodes.slice().reverse()) {
      assert.equal(node, expected, "Reuse the original node objects");
      node = node.next;
    }
    assert.equal(node, null, "The old head must become the tail");
  } },
  "binary-search": { title: "Find a value in an ascending sorted array", run(solve) {
    for (const values of [[], [1], [-3, 0, 1, 1, 9]].map(values => Object.freeze(values))) {
      for (const target of [-4, -3, 0, 1, 2, 9, 10]) {
        const index = solve(values, target);
        if (!values.includes(target)) assert.equal(index, -1);
        else {
          assert.equal(Number.isInteger(index), true);
          assert.equal(values[index], target);
        }
      }
    }
  } },
  "max-window-sum": { title: "Find the largest sum of k consecutive values", run(solve) {
    assert.equal(solve([2, 1, 5, 1, 3, 2], 3), 9);
    assert.equal(solve([-5, -2, -3], 2), -5);
    assert.equal(solve([4], 1), 4);
    assert.equal(solve([1, 2, 3], 3), 6);
    for (const k of [0, -1, 4, 1.5]) assert.throws(() => solve([1, 2, 3], k), RangeError);
    assert.throws(() => solve([], 1), RangeError);
  } },
  "shortest-path": { title: "Return a shortest unweighted path with BFS", run(solve) {
    const input = graph();
    const snapshot = [...input].map(([key, edges]) => [key, [...edges]]);
    const path = solve(input, "A", "D");
    assert.equal(path.length, 3);
    assert.equal(path[0], "A");
    assert.equal(path.at(-1), "D");
    for (let i = 1; i < path.length; i++) assert.equal(input.get(path[i - 1]).has(path[i]), true);
    assert.deepEqual(solve(input, "A", "A"), ["A"]);
    assert.equal(solve(input, "A", "E"), null);
    assert.equal(solve(input, "missing", "D"), null);
    assert.deepEqual([...input].map(([key, edges]) => [key, [...edges]]), snapshot);
  } },
  "min-coins": { title: "Minimise the number of coins with tabulation", run(solve) {
    assert.equal(solve([1, 3, 4], 6), 2); // Greedy would use three coins.
    assert.equal(solve([2], 3), -1);
    assert.equal(solve([], 0), 0);
    assert.equal(solve([], 5), -1);
    assert.equal(solve([2, 2, 5], 10), 2);
    for (const coins of [[0], [-1], [1.5]]) assert.throws(() => solve(coins, 3), RangeError);
    assert.throws(() => solve([1], -1), RangeError);
  } },
  "merge-intervals": { title: "Merge overlapping closed intervals without mutation", run(solve) {
    const input = [[8, 10], [1, 3], [2, 6], [10, 12], [2, 4]];
    const snapshot = structuredClone(input);
    assert.deepEqual(solve(input), [[1, 6], [8, 12]]);
    assert.deepEqual(input, snapshot);
    assert.deepEqual(solve([]), []);
    assert.deepEqual(solve([[1, 2], [2, 3]]), [[1, 3]]);
    assert.deepEqual(solve([[1, 1], [3, 3]]), [[1, 1], [3, 3]]);
  } },
  "k-smallest": { title: "Extract the k smallest values with a heap", run(solve) {
    const values = [5, 1, 4, 1, -2];
    assert.deepEqual(solve(values, 3), [-2, 1, 1]);
    assert.deepEqual(values, [5, 1, 4, 1, -2]);
    assert.deepEqual(solve(values, 0), []);
    assert.deepEqual(solve([], 0), []);
    assert.deepEqual(solve(values, 5), [-2, 1, 1, 4, 5]);
    for (const k of [-1, 6, 1.5]) assert.throws(() => solve(values, k), RangeError);
  } },
};
