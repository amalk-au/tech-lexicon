import test from "node:test";
import assert from "node:assert/strict";
import { frequencyMap, uniqueValues } from "../src/structures/arrays-hashing.js";
import { Stack } from "../src/structures/stack.js";
import { Queue } from "../src/structures/queue.js";
import { SinglyLinkedList } from "../src/structures/linked-list.js";
import { BinarySearchTree } from "../src/structures/binary-search-tree.js";
import { MinHeap } from "../src/structures/min-heap.js";
import { createGraph } from "../src/structures/graph.js";

test("Map/Set preserve key identity, insertion order, and SameValueZero equality", () => {
  const a = {};
  const b = {};
  const values = [a, b, a, NaN, NaN, 0, -0, "0"];
  const counts = frequencyMap(values);
  assert.equal(counts.size, 5);
  assert.equal(counts.get(a), 2);
  assert.equal(counts.get(b), 1);
  assert.equal(counts.get(NaN), 2);
  assert.equal(counts.get(0), 2);
  assert.equal(counts.get("0"), 1);
  assert.deepEqual(uniqueValues(values), [a, b, NaN, 0, "0"]);
  assert.deepEqual(frequencyMap([]), new Map());
});

test("Stack is LIFO, handles empty reads, and keeps explicit size", () => {
  const stack = new Stack();
  assert.equal(stack.pop(), undefined);
  assert.equal(stack.peek(), undefined);
  for (let i = 0; i < 500; i++) stack.push(i);
  for (let i = 499; i >= 0; i--) {
    assert.equal(stack.peek(), i);
    assert.equal(stack.pop(), i);
  }
  assert.equal(stack.isEmpty, true);
  stack.push(undefined);
  assert.equal(stack.size, 1);
  stack.pop();
  assert.equal(stack.size, 0);
});

test("Queue stays FIFO across compaction, reuse, and an undefined payload", () => {
  const queue = new Queue();
  assert.equal(queue.dequeue(), undefined);
  for (let i = 0; i < 5000; i++) queue.enqueue(i);
  for (let i = 0; i < 3500; i++) assert.equal(queue.dequeue(), i);
  for (let i = 5000; i < 6000; i++) queue.enqueue(i);
  assert.equal(queue.size, 2500);
  assert.equal(queue.peek(), 3500);
  for (let i = 3500; i < 6000; i++) assert.equal(queue.dequeue(), i);
  assert.equal(queue.isEmpty, true);
  assert.equal(queue.peek(), undefined);
  queue.enqueue(undefined);
  assert.equal(queue.size, 1);
  queue.dequeue();
  queue.enqueue("reused");
  assert.equal(queue.dequeue(), "reused");
  assert.equal(queue.size, 0);
});

test("Linked list maintains head/tail when removing the first, last, or only node", () => {
  const list = new SinglyLinkedList();
  assert.equal(list.removeFirst(1), false);
  list.append(2);
  list.prepend(1);
  list.append(2);
  list.append(3);
  const detached = list.find(2);
  assert.equal(list.removeFirst(2), true);
  assert.equal(detached.next, null);
  assert.deepEqual(list.toArray(), [1, 2, 3]);
  assert.equal(list.removeFirst(1), true);
  assert.equal(list.removeFirst(3), true);
  assert.equal(list.head, list.tail);
  assert.equal(list.tail.value, 2);
  assert.equal(list.removeFirst(2), true);
  assert.equal(list.head, null);
  assert.equal(list.tail, null);
  assert.equal(list.find(9), null);
  list.prepend(8);
  assert.equal(list.head, list.tail);
});

test("Unbalanced BST ignores duplicates and handles a degenerate insertion order", () => {
  const tree = new BinarySearchTree();
  assert.deepEqual(tree.inOrder(), []);
  for (let i = 0; i < 600; i++) tree.insert(i);
  tree.insert(10);
  assert.equal(tree.has(599), true);
  assert.equal(tree.has(-1), false);
  assert.deepEqual(tree.inOrder(), Array.from({ length: 600 }, (_, i) => i));
});

test("MinHeap matches a sorted reference during interleaved insertion and removal", () => {
  const heap = new MinHeap();
  const reference = [];
  assert.equal(heap.pop(), undefined);
  for (let i = 0; i < 1000; i++) {
    const value = (i * 73) % 101 - 50;
    heap.push(value);
    reference.push(value);
    reference.sort((a, b) => a - b);
    assert.equal(heap.peek(), reference[0]);
    if (i % 3 === 0) assert.equal(heap.pop(), reference.shift());
    assert.equal(heap.size, reference.length);
  }
  while (reference.length) assert.equal(heap.pop(), reference.shift());
  assert.equal(heap.peek(), undefined);
});

test("Graph construction deduplicates edges and preserves directed edges and isolated vertices", () => {
  const directed = createGraph([["A", "B"], ["A", "B"]], { vertices: ["C"], directed: true });
  assert.deepEqual([...directed.get("A")], ["B"]);
  assert.equal(directed.get("B").size, 0);
  assert.equal(directed.get("C").size, 0);
  const undirected = createGraph([["A", "B"], ["A", "A"]]);
  assert.equal(undirected.get("B").has("A"), true);
  assert.deepEqual([...undirected.get("A")], ["B", "A"]);
});
