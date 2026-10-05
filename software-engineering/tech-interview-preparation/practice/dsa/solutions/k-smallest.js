import { MinHeap } from "../src/structures/min-heap.js";

export function solve(values, k) {
  if (!Number.isInteger(k) || k < 0 || k > values.length) {
    throw new RangeError("k must be an integer between 0 and values.length");
  }
  const heap = new MinHeap();
  for (const value of values) heap.push(value);
  const result = [];
  for (let i = 0; i < k; i++) result.push(heap.pop());
  return result;
}
