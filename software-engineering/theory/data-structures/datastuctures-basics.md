# Data structures basics

[Back to the topic index](./README.md)

A **data structure** is a specialized format for organizing, processing, retrieving, and storing data. Choosing the right data structure is crucial for writing efficient algorithms and scalable software.

## Basic Data Structures

These are foundational and widely used in programming:

- **Array**: Stores elements of the same type in contiguous memory. Fast access by index, but fixed size and costly insertions/deletions except at the end[^1] [^5] [^9].
- **Linked List**: Consists of nodes where each node contains data and a reference to the next node. Allows efficient insertions/deletions but slower access by index[^1] [^5] [^9].
- **Stack**: Follows Last-In, First-Out (LIFO) order. Supports push (insert) and pop (remove) operations at one end only. Used in function call management, undo features, and parsing[^1] [^5] [^9].
- **Queue**: Follows First-In, First-Out (FIFO) order. Supports enqueue (insert) at the rear and dequeue (remove) from the front. Used in scheduling, buffering, and breadth-first search[^1] [^5] [^9].
- **Hash Table**: Maps keys to values for fast lookup, insertion, and deletion. Used in caching, indexing, and associative arrays[^1] [^9].

## Advanced Data Structures

These structures handle complex scenarios and large datasets:

- **Trees**: Hierarchical structures with nodes connected by edges.
  - **Binary Tree**: Each node has up to two children.
  - **Binary Search Tree (BST)**: Maintains sorted order for efficient search, insert, and delete.
  - **AVL Tree**: A self-balancing BST, ensuring O(log n) operations.
  - **B-Tree/B+ Tree**: Multi-way, balanced trees used in databases and filesystems for efficient indexing[^1] [^2].
  - **Trie**: Also called a prefix tree, used for efficient retrieval of strings, as in autocomplete systems[^1] [^2].
- **Heap**: A specialized tree for maintaining the maximum or minimum element at the root. Used in priority queues and heap sort[^9].
- **Graphs**: Collections of nodes (vertices) connected by edges. Used to model networks, maps, and relationships[^1] [^2] [^9].
- **Disjoint Set (Union-Find)**: Manages a collection of non-overlapping sets, supporting efficient union and find operations. Used in network connectivity and Kruskal’s algorithm [^2].
- **Specialized Trees**: Such as segment trees, interval trees, k-d trees, and R-trees, used for range queries, multidimensional data, and spatial indexing [^2].

## Data Structure Classifications

- **Linear vs. Non-linear**: Linear structures (arrays, lists, stacks, queues) arrange data sequentially. Non-linear structures (trees, graphs) organize data hierarchically or in networks[^1] [^4] [^5] [^6].
- **Static vs. Dynamic**: Static structures have fixed size (arrays), while dynamic structures can grow or shrink at runtime (linked lists, dynamic arrays)[^1] [^4].
- **Homogeneous vs. Non-homogeneous**: Homogeneous structures store the same data type (arrays), while non-homogeneous can store different types (structures, classes) [^1].

## Practical Applications

- **Arrays**: Used for storing and accessing data quickly by index.
- **Linked Lists**: Useful for dynamic memory allocation and implementing other data structures.
- **Stacks/Queues**: Essential for managing tasks, parsing, and scheduling.
- **Trees/Graphs**: Core to file systems, databases, compilers, and network analysis.
- **Hash Tables**: Power fast lookups in dictionaries, caches, and symbol tables.

Understanding both **basic** and **advanced data structures** is essential for efficient algorithm design, system performance, and solving complex software engineering problems[^1] [^2] [^9].

[^1]: https://www.simplilearn.com/tutorials/data-structure-tutorial/what-is-data-structure
[^2]: https://en.wikipedia.org/wiki/List_of_data_structures
[^3]: https://www.coursera.org/articles/types-of-data-structures
[^4]: https://www.geeksforgeeks.org/what-is-data-structure-types-classifications-and-applications/
[^5]: https://www.programiz.com/dsa/data-structure-types
[^6]: https://www.w3schools.com/dsa/dsa_intro.php
[^7]: https://www.stratascratch.com/blog/basic-data-structure-types-you-must-know/
[^8]: https://www.altexsoft.com/blog/data-structure/
[^9]: https://www.godaddy.com/resources/in/web-pro-in/8-basic-data-structures-every-programmer-should-know
[^10]: https://www.geeksforgeeks.org/dsa/data-structures/
