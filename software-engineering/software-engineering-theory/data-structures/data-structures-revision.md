# Data structures: JavaScript revision

[Back to the topic index](./README.md)

Use this page to choose a structure, explain its invariant, and implement its operations. Keep [algorithms](../algorithms/algorithms-revision.md) beside it for the patterns that use these structures. Two focused pages make the lookup tables quick to scan while keeping complete examples available below.

## Quick lookup

`n` = stored items, `h` = tree height, `V` = vertices, `E` = edges. Costs describe these implementations under the usual dense-array and hash-table interview model. JavaScript does not promise these exact costs for every engine. **Amortized** spreads occasional expensive operations across a sequence; **expected** describes the hash-table assumption, not a guaranteed worst case.

| Structure            | Choose it for                               | Main operations                                         | Storage / caution                                         |
| -------------------- | ------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Array                | Ordered items, index access                 | Index O(1); append/pop amortized O(1); scan O(n)        | O(n); inserting/removing at the front can move O(n) items |
| Map / Set            | Counts, lookup, membership, deduplication   | Expected O(1) lookup/update                             | O(n); object keys compare by identity                     |
| Stack                | Nested brackets, undo, DFS                  | Push/pop amortized O(1); peek O(1)                      | O(n); last in, first out                                  |
| Queue                | Scheduling, BFS                             | Enqueue/dequeue amortized O(1); peek O(1)               | O(n); first in, first out                                 |
| Singly linked list   | Inserting at the head or after a known node | Prepend/append O(1) here; search/remove by value O(n)   | O(n); finding a position still takes time                 |
| Binary search tree   | Ordered search and traversal                | Insert/search O(h)                                      | O(n); this unbalanced tree can have h = n                 |
| Min-heap             | Repeated minimum / priority selection       | Peek O(1); push/pop O(log n)                            | O(n); the backing array is not fully sorted               |
| Adjacency-list graph | Relationships, routes, dependencies         | Add edge / membership expected O(1); traversal O(V + E) | O(V + E); represent directed edges explicitly             |

## How to practise

1. Read the table and say why a structure fits a problem.
2. Copy one implementation and its “Try it” block into the **same** `practice.mjs` file. Run `node practice.mjs` on Ubuntu with Node.js 24 or newer.
3. Change an input; predict the output before running it.
4. Close the example and implement the linked exercise from memory.

The [pnpm practice package](../../practice/dsa/README.md) needs no third-party dependencies. Its `pnpm run check` command executes all note examples, checks that they match the source files, and tests the reference implementations. The exercise starters are intentionally incomplete until you edit them.

Jump to: [Arrays](#arrays) · [Map and Set](#map-and-set) · [Stack](#stack) · [Queue](#queue) · [Linked list](#singly-linked-list) · [Trees](#binary-search-tree) · [Heap](#min-heap) · [Graph](#graph)

## Arrays

An array stores an ordered sequence accessed by zero-based index. JavaScript arrays are resizable and can contain mixed types; the examples use dense arrays with consistent values so the algorithm contracts stay clear.

| Operation                        | What changes                        | Usual cost                                |
| -------------------------------- | ----------------------------------- | ----------------------------------------- |
| `values[i]`                      | Read/write an index                 | O(1)                                      |
| `push(value)` / `pop()`          | Append/remove the last item         | Amortized O(1)                            |
| `shift()` / `unshift(value)`     | Remove/add the first item           | O(n) model; avoid for a large BFS queue   |
| `slice(start, end)`              | Copy a range; end is excluded       | O(k) time and space for k copied elements |
| `splice(start, count, ...items)` | Mutate a range                      | O(n) worst case                           |
| `sort((a, b) => a - b)`          | Mutate into ascending numeric order | Engine-dependent time and auxiliary space |

Default `sort()` compares string representations: `[10, 2].sort()` gives `[10, 2]`. Use a numeric comparator; use `toSorted((a, b) => a - b)` for a new array. A spread or `slice()` copy is shallow: nested objects remain shared. Sparse arrays and Unicode string indexing have additional rules; do not silently treat a string index as a complete user-visible character.

<!-- example:array -->

```js
export function arrayOperations() {
  const values = [10, 2, 3];
  values.push(4);
  const removed = values.pop();
  return {
    values,
    removed,
    copiedRange: values.slice(1),
    sorted: values.toSorted((a, b) => a - b),
  };
}
```

Try it (append to the code above):

```js
console.log(JSON.stringify(arrayOperations()));
```

Expected output:

```text
{"values":[10,2,3],"removed":4,"copiedRange":[2,3],"sorted":[2,3,10]}
```

<!-- /example:array -->

**Practise:** change `slice(1)` to `slice(0, 2)` and predict the copied range. Replace `toSorted()` with `sort()` and observe that the original `values` now changes too.

**Try next:** [linear search](../algorithms/algorithms-revision.md#linear-search), then [sliding windows](../algorithms/algorithms-revision.md#sliding-window).

## Map and Set

`Map` associates a key with a value; `Set` stores unique values. Both preserve insertion order. Use `Map` for counts and `Set` for visited vertices or deduplication. An ordinary object is useful for records, but its keys are strings/symbols and it has a prototype unless you use `Object.create(null)`.

**Invariant:** the count for a key equals the number of times that key has been processed. `Map`/`Set` use SameValueZero equality: `NaN` equals itself, `0` and `-0` are the same key, and distinct object instances are different keys. They do not compare objects by their contents.

<!-- example:arrays-hashing -->

```js
export function frequencyMap(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

export function uniqueValues(values) {
  return [...new Set(values)];
}
```

Try it (append to the code above):

```js
console.log(JSON.stringify([...frequencyMap(["a", "b", "a"])]));
console.log(JSON.stringify(uniqueValues([3, 1, 3, 2])));
```

Expected output:

```text
[["a",2],["b",1]]
[3,1,2]
```

<!-- /example:arrays-hashing -->

**Cost:** expected O(n) time and O(u) extra space for u unique values. The language specification requires average sublinear access for `Map`; exact O(1) lookup is an interview model, not a specification guarantee.

**Practise:** [frequency-count](../../practice/dsa/exercises/README.md#frequency-count). Change the input to `[0, "0", NaN, NaN]`; explain the four inputs and three keys. Then try two different `{}` objects.

## Stack

A stack returns the most recently added item first: **LIFO**. Use it for matched delimiters, undo history, and iterative DFS. The top is the array’s final item.

**Invariant:** every pop removes the current top, leaving older items in their original order.

<!-- example:stack -->

```js
export class Stack {
  #items = [];

  get size() {
    return this.#items.length;
  }
  get isEmpty() {
    return this.size === 0;
  }

  push(value) {
    this.#items.push(value);
  }
  peek() {
    return this.#items.at(-1);
  }
  pop() {
    return this.#items.pop();
  }
}
```

Try it (append to the code above):

```js
const stack = new Stack();
stack.push("first");
stack.push("second");
console.log(
  JSON.stringify([stack.peek(), stack.pop(), stack.pop(), stack.isEmpty]),
);
```

Expected output:

```text
["second","second","first",true]
```

<!-- /example:stack -->

**Cost:** push/pop amortized O(1), peek O(1), storage O(n). Empty `pop()`/`peek()` return `undefined`; use `isEmpty` if `undefined` itself may be stored.

**Practise:** [valid-brackets](../../practice/dsa/exercises/README.md#valid-brackets). Explain why `([)]` fails even though the bracket counts match.

## Queue

A queue returns the oldest item first: **FIFO**. Use it for BFS and work scheduling. A head index avoids repeatedly shifting the remaining array.

**Invariant:** live items occupy the range from `head` to the end. Clearing consumed slots releases references; occasional compaction prevents storage from growing with the entire history of operations.

<!-- example:queue -->

```js
export class Queue {
  #items = [];
  #head = 0;

  get size() {
    return this.#items.length - this.#head;
  }
  get isEmpty() {
    return this.size === 0;
  }

  enqueue(value) {
    this.#items.push(value);
  }
  peek() {
    return this.#items[this.#head];
  }

  dequeue() {
    if (this.isEmpty) return undefined;
    const value = this.#items[this.#head];
    this.#items[this.#head++] = undefined; // Release the old reference.
    if (this.isEmpty) {
      this.#items = [];
      this.#head = 0;
    } else if (this.#head >= 1024 && this.#head * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
    return value;
  }
}
```

Try it (append to the code above):

```js
const queue = new Queue();
queue.enqueue("first");
queue.enqueue("second");
console.log(JSON.stringify([queue.dequeue(), queue.peek(), queue.size]));
```

Expected output:

```text
["first","second",1]
```

<!-- /example:queue -->

**Cost:** enqueue/dequeue amortized O(1); a compaction can take O(n) for n live items. Peek is O(1). Storage is O(n + 1), allowing a fixed threshold of unused slots. This is not a fixed-capacity circular buffer.

**Practise:** enqueue three values, dequeue two, enqueue another, then drain it. Predict the order and size after every operation. Use the same FIFO idea in [shortest-path](../../practice/dsa/exercises/README.md#shortest-path).

## Singly linked list

Each node contains a value and a reference to the next node. `head` starts the chain; `tail` lets this implementation append without walking it. Lists avoid shifting elements, but have no direct index access and allocate a node per item.

**Invariant:** an empty list has both head and tail equal to `null`; otherwise tail’s `next` is `null`. These examples assume an acyclic list. Comparing values uses `===`.

<!-- example:linked-list -->

```js
export class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export class SinglyLinkedList {
  head = null;
  tail = null;

  prepend(value) {
    this.head = new ListNode(value, this.head);
    if (this.tail === null) this.tail = this.head;
  }

  append(value) {
    const node = new ListNode(value);
    if (this.tail === null) this.head = node;
    else this.tail.next = node;
    this.tail = node;
  }

  find(value) {
    for (let node = this.head; node !== null; node = node.next) {
      if (node.value === value) return node;
    }
    return null;
  }

  removeFirst(value) {
    let previous = null;
    let node = this.head;
    while (node !== null && node.value !== value) {
      previous = node;
      node = node.next;
    }
    if (node === null) return false;
    if (previous === null) this.head = node.next;
    else previous.next = node.next;
    if (this.tail === node) this.tail = previous;
    node.next = null;
    return true;
  }

  toArray() {
    const values = [];
    for (let node = this.head; node !== null; node = node.next) {
      values.push(node.value);
    }
    return values;
  }
}
```

Try it (append to the code above):

```js
const list = new SinglyLinkedList();
list.append(2);
list.prepend(1);
list.append(3);
list.removeFirst(2);
console.log(JSON.stringify([list.toArray(), list.tail.value, list.find(9)]));
```

Expected output:

```text
[[1,3],3,null]
```

<!-- /example:linked-list -->

**Cost:** prepend/append O(1), find/remove-first-by-value O(n), `toArray()` O(n) time and output space; stored nodes O(n). Insertion after an already-known node is O(1), but locating that node is O(n).

**Practise:** [reverse-list](../../practice/dsa/exercises/README.md#reverse-list). Save `next` before rewiring a link. The exercise accepts a bare head node; if you reverse an entire list wrapper, update its head **and** tail.

## Binary search tree

A **binary tree** has at most two children per node. A **binary search tree (BST)** additionally puts smaller values on the left and larger values on the right. This implementation accepts finite numbers and ignores duplicates. It does not balance itself.

**Invariant:** every value in a left subtree is smaller than its root; every value in a right subtree is larger. In-order traversal visits left, root, right and therefore returns sorted values.

<!-- example:bst -->

```js
export class BinarySearchTree {
  #root = null;

  insert(value) {
    const node = { value, left: null, right: null };
    if (this.#root === null) {
      this.#root = node;
      return;
    }
    let current = this.#root;
    while (true) {
      if (value === current.value) return; // Ignore duplicates.
      const side = value < current.value ? "left" : "right";
      if (current[side] === null) {
        current[side] = node;
        return;
      }
      current = current[side];
    }
  }

  has(value) {
    let current = this.#root;
    while (current !== null) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  inOrder() {
    const result = [];
    const stack = [];
    let current = this.#root;
    while (current !== null || stack.length > 0) {
      while (current !== null) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop();
      result.push(current.value);
      current = current.right;
    }
    return result;
  }
}
```

Try it (append to the code above):

```js
const tree = new BinarySearchTree();
for (const value of [4, 2, 6, 1, 3, 4]) tree.insert(value);
console.log(JSON.stringify([tree.inOrder(), tree.has(3), tree.has(5)]));
```

Expected output:

```text
[[1,2,3,4,6],true,false]
```

<!-- /example:bst -->

**Cost:** insert/search O(h). A balanced tree has h = O(log n), but sorted insertions into this tree give h = O(n). In-order traversal takes O(n) time, O(h) stack space, plus O(n) returned output. Stored nodes use O(n).

**Practise:** insert `[1, 2, 3, 4, 5]` and sketch the shape. Compare its height with a tree built from `[3, 1, 5, 2, 4]`. Do not claim every BST provides logarithmic search.

## Min-heap

A heap keeps the minimum at the root while maintaining a **complete binary tree** shape in an array. It suits priority queues and repeated smallest-item selection. A BST maintains a stronger global ordering; a heap only orders parents against children.

For index i: parent = `Math.floor((i - 1) / 2)`, left child = `2 * i + 1`, right child = `2 * i + 2`.

**Invariant:** each parent is less than or equal to its children. Push sifts up; pop replaces the root with the final element and sifts down. Inputs are finite numbers; duplicates are allowed.

<!-- example:min-heap -->

```js
export class MinHeap {
  #items = [];

  get size() {
    return this.#items.length;
  }
  peek() {
    return this.#items[0];
  }

  push(value) {
    this.#items.push(value);
    let index = this.size - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.#items[parent] <= this.#items[index]) break;
      [this.#items[parent], this.#items[index]] = [
        this.#items[index],
        this.#items[parent],
      ];
      index = parent;
    }
  }

  pop() {
    if (this.size === 0) return undefined;
    const minimum = this.#items[0];
    const last = this.#items.pop();
    if (this.size === 0) return minimum;
    this.#items[0] = last;
    let index = 0;
    while (true) {
      const left = 2 * index + 1;
      const right = left + 1;
      let smallest = index;
      if (left < this.size && this.#items[left] < this.#items[smallest])
        smallest = left;
      if (right < this.size && this.#items[right] < this.#items[smallest])
        smallest = right;
      if (smallest === index) break;
      [this.#items[index], this.#items[smallest]] = [
        this.#items[smallest],
        this.#items[index],
      ];
      index = smallest;
    }
    return minimum;
  }
}
```

Try it (append to the code above):

```js
const heap = new MinHeap();
for (const value of [5, 1, 4, 1]) heap.push(value);
const sorted = [];
while (heap.size > 0) sorted.push(heap.pop());
console.log(JSON.stringify(sorted));
```

Expected output:

```text
[1,1,4,5]
```

<!-- /example:min-heap -->

**Cost:** peek O(1), push/pop O(log n), stored values O(n), auxiliary space per operation O(1). Building this heap by n pushes costs O(n log n); a separate bottom-up heapify algorithm can build a heap in O(n). Empty peek/pop return `undefined`.

**Practise:** [k-smallest](../../practice/dsa/exercises/README.md#k-smallest). First use this min-heap. As a later extension, maintain a max-heap of size k to process a stream in O(n log k) time and O(k) space for k >= 2.

## Graph

A graph models vertices connected by edges. A `Map` of neighbour `Set`s is an adjacency list: it stores actual edges rather than a V × V adjacency matrix. Sets deduplicate parallel edges here; this representation is unweighted.

**Invariant:** every vertex, including every edge endpoint, has an entry. Undirected edges are stored in both directions; directed edges are stored only from source to destination. Pass isolated vertices explicitly.

<!-- example:graph -->

```js
export function createGraph(edges, { vertices = [], directed = false } = {}) {
  const graph = new Map(vertices.map((vertex) => [vertex, new Set()]));
  for (const [from, to] of edges) {
    if (!graph.has(from)) graph.set(from, new Set());
    if (!graph.has(to)) graph.set(to, new Set());
    graph.get(from).add(to);
    if (!directed) graph.get(to).add(from);
  }
  return graph;
}
```

Try it (append to the code above):

```js
const graph = createGraph(
  [
    ["A", "B"],
    ["A", "C"],
    ["B", "C"],
  ],
  { vertices: ["D"] },
);
console.log(
  JSON.stringify(
    [...graph].map(([vertex, neighbours]) => [vertex, [...neighbours]]),
  ),
);
```

Expected output:

```text
[["D",[]],["A",["B","C"]],["B",["A","C"]],["C",["A","B"]]]
```

<!-- /example:graph -->

**Cost:** construction and traversal O(V + E) under the hash-table model; storage O(V + E). An undirected edge is stored twice, which does not change the asymptotic cost. Adjacency-matrix storage is O(V²), but edge membership can be checked by index.

**Practise:** add `{ directed: true }` and compare the neighbours of B. Then run [BFS/DFS](../algorithms/algorithms-revision.md#bfs-and-dfs) and [shortest-path](../../practice/dsa/exercises/README.md#shortest-path). BFS gives a shortest path by edge count when every edge has the same cost; it does not solve arbitrary weighted shortest paths.

## Recall without looking

- Which structure lets you revisit the newest unfinished task? The oldest?
- Why do object keys need identity rather than deep equality in a Map?
- What makes a BST slow on sorted insertions?
- Why does a heap give the minimum quickly without sorting every item?
- How do a queue’s storage and runtime change if you keep using `shift()`?
- Can your traversal stop cycles and still include isolated vertices when required?

## Primary references

- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

[Back to data structures](./README.md)
