import test from "node:test";
import assert from "node:assert/strict";
import { linearSearch } from "../src/algorithms/linear-search.js";
import { binarySearch } from "../src/algorithms/binary-search.js";
import { mergeSort } from "../src/algorithms/merge-sort.js";
import { twoSum } from "../src/algorithms/two-sum.js";
import { twoSumSorted } from "../src/algorithms/two-pointers.js";
import { maxWindowSum } from "../src/algorithms/sliding-window.js";
import { buildPrefixSums, rangeSum } from "../src/algorithms/prefix-sums.js";
import { mergeIntervals } from "../src/algorithms/merge-intervals.js";
import { bfs, dfs } from "../src/algorithms/traversal.js";
import { shortestPath } from "../src/algorithms/shortest-path.js";
import { permutations } from "../src/algorithms/backtracking.js";
import { minCoins } from "../src/algorithms/dynamic-programming.js";
import { createGraph } from "../src/structures/graph.js";

// Fixed seed: repeatable cases, without dependencies or timing assumptions.
let seed = 1827;
const next = limit => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return (seed >>> 8) % limit;
};

test("Linear and binary search agree with membership across generated arrays", () => {
  for (let run = 0; run < 200; run++) {
    const values = Array.from({ length: next(35) }, () => next(31) - 15);
    const sorted = values.slice().sort((a, b) => a - b);
    for (let target = -16; target <= 16; target++) {
      assert.equal(linearSearch(values, target), values.indexOf(target));
      const found = binarySearch(sorted, target);
      if (!sorted.includes(target)) assert.equal(found, -1);
      else assert.equal(sorted[found], target);
    }
  }
});

test("Merge sort matches numeric sorting, preserves input, and is stable for equal keys", () => {
  for (let run = 0; run < 200; run++) {
    const values = Array.from({ length: next(40) }, () => next(201) - 100);
    const snapshot = values.slice();
    assert.deepEqual(mergeSort(values), values.slice().sort((a, b) => a - b));
    assert.deepEqual(values, snapshot);
  }
  const records = [{ key: 2, id: "a" }, { key: 1, id: "b" }, { key: 2, id: "c" }];
  assert.deepEqual(mergeSort(records, (a, b) => a.key - b.key).map(item => item.id), ["b", "a", "c"]);
});

test("Hashing and two pointers find exactly the pairs that a brute-force search permits", () => {
  for (let run = 0; run < 200; run++) {
    const values = Array.from({ length: next(15) }, () => next(19) - 9);
    const target = next(35) - 17;
    const exists = values.some((a, i) => values.some((b, j) => i < j && a + b === target));
    for (const [input, solve] of [[values, twoSum], [values.slice().sort((a, b) => a - b), twoSumSorted]]) {
      const pair = solve(input, target);
      assert.equal(pair !== null, exists);
      if (pair !== null) {
        assert.equal(pair[0] < pair[1], true);
        assert.equal(input[pair[0]] + input[pair[1]], target);
      }
    }
  }
});

test("Sliding windows and prefix sums match direct summation, including negative inputs", () => {
  for (let run = 0; run < 100; run++) {
    const values = Array.from({ length: 1 + next(15) }, () => next(21) - 10);
    const prefix = buildPrefixSums(values);
    for (let k = 1; k <= values.length; k++) {
      const sums = Array.from({ length: values.length - k + 1 }, (_, i) =>
        values.slice(i, i + k).reduce((a, b) => a + b, 0));
      assert.equal(maxWindowSum(values, k), Math.max(...sums));
    }
    for (let start = 0; start < values.length; start++) {
      for (let end = start; end < values.length; end++) {
        assert.equal(rangeSum(prefix, start, end), values.slice(start, end + 1).reduce((a, b) => a + b, 0));
      }
    }
  }
  assert.deepEqual(buildPrefixSums([]), [0]);
  assert.throws(() => rangeSum([0], 0, 0), RangeError);
  assert.throws(() => rangeSum([0, 1, 3], 1, 0), RangeError);
  assert.throws(() => maxWindowSum([1], 0), RangeError);
});

test("Interval merging preserves coverage and produces disjoint sorted intervals", () => {
  for (let run = 0; run < 100; run++) {
    const intervals = Array.from({ length: next(12) }, () => {
      const start = next(12) - 6;
      return [start, start + next(7)];
    });
    const snapshot = structuredClone(intervals);
    const merged = mergeIntervals(intervals);
    for (let point = -12; point <= 24; point += 0.5) {
      const covered = list => list.some(([start, end]) => start <= point && point <= end);
      assert.equal(covered(merged), covered(intervals));
    }
    for (let i = 1; i < merged.length; i++) assert.equal(merged[i - 1][1] < merged[i][0], true);
    assert.deepEqual(intervals, snapshot);
  }
});

test("BFS and DFS visit each reachable vertex once on cyclic and disconnected graphs", () => {
  const graph = createGraph([["A", "B"], ["A", "C"], ["B", "D"], ["D", "A"]], { vertices: ["E"] });
  assert.deepEqual(bfs(graph, "A"), ["A", "B", "C", "D"]);
  for (const traverse of [bfs, dfs]) {
    const order = traverse(graph, "A");
    assert.equal(order.length, 4);
    assert.deepEqual(new Set(order), new Set(["A", "B", "C", "D"]));
    assert.deepEqual(traverse(graph, "E"), ["E"]);
    assert.deepEqual(traverse(graph, "missing"), []);
  }
});

test("Shortest paths match independently computed all-pairs distances", () => {
  for (let run = 0; run < 60; run++) {
    const vertices = [0, 1, 2, 3, 4, 5];
    const edges = [];
    for (const a of vertices) for (const b of vertices) if (a !== b && next(4) === 0) edges.push([a, b]);
    const graph = createGraph(edges, { vertices, directed: true });
    const distance = vertices.map(a => vertices.map(b => a === b ? 0 : graph.get(a).has(b) ? 1 : Infinity));
    for (const k of vertices) for (const a of vertices) for (const b of vertices) {
      distance[a][b] = Math.min(distance[a][b], distance[a][k] + distance[k][b]);
    }
    for (const a of vertices) for (const b of vertices) {
      const path = shortestPath(graph, a, b);
      if (distance[a][b] === Infinity) assert.equal(path, null);
      else {
        assert.equal(path.length - 1, distance[a][b]);
        assert.equal(path[0], a);
        assert.equal(path.at(-1), b);
        for (let i = 1; i < path.length; i++) assert.equal(graph.get(path[i - 1]).has(path[i]), true);
      }
    }
  }
  const graph = createGraph([[NaN, "target"]], { directed: true });
  assert.deepEqual(shortestPath(graph, NaN, "target"), [NaN, "target"]);
  assert.deepEqual(shortestPath(graph, NaN, NaN), [NaN]);
});

test("Backtracking returns all distinct permutations and restores its state", () => {
  const values = [1, 2, 3, 4];
  const result = permutations(values);
  assert.equal(result.length, 24);
  assert.equal(new Set(result.map(value => JSON.stringify(value))).size, 24);
  for (const value of result) assert.deepEqual(value.slice().sort((a, b) => a - b), values);
  assert.deepEqual(values, [1, 2, 3, 4]);
  assert.deepEqual(permutations([]), [[]]);
  assert.deepEqual(permutations([1]), [[1]]);
});

test("Coin DP matches a breadth-by-coin-count oracle for small amounts", () => {
  for (const coins of [[], [2], [1, 3, 4], [2, 5], [3, 7]]) {
    for (let amount = 0; amount <= 20; amount++) {
      let level = new Set([0]);
      let answer = -1;
      for (let count = 0; count <= amount; count++) {
        if (level.has(amount)) { answer = count; break; }
        const nextLevel = new Set();
        for (const total of level) for (const coin of coins) if (total + coin <= amount) nextLevel.add(total + coin);
        level = nextLevel;
      }
      assert.equal(minCoins(coins, amount), answer);
    }
  }
});
