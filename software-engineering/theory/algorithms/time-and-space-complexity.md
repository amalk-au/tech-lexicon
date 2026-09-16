# Time and space complexity

[Back to the topic index](./README.md)

**Time complexity** and **space complexity** are fundamental concepts in algorithm analysis that measure an algorithm’s efficiency in terms of time and memory usage, respectively.

## Time Complexity

- **Definition:** Time complexity describes how the runtime of an algorithm grows as a function of the input size $n$. It estimates the number of basic operations or steps the algorithm performs, independent of hardware or implementation details.
- **Purpose:** It helps evaluate how scalable and efficient an algorithm is, especially for large inputs.
- **Notation:** Expressed using Big O notation, which gives an upper bound on the growth rate:
  - **O(1):** Constant time — execution time does not depend on input size.
  - **O($\log n$)**: Logarithmic time — e.g., binary search.
  - **O(n):** Linear time — e.g., simple search.
  - **O(n²):** Quadratic time — common in nested loops.
  - **O(2^n):** Exponential time — often in brute-force combinatorial algorithms.
- **Cases:** Worst-case time complexity is most commonly used to guarantee maximum runtime.

### Space Complexity

- **Definition:** Space complexity measures the amount of memory an algorithm requires relative to the input size. This includes space for input data, auxiliary variables, data structures, and function call stacks.
- **Purpose:** Important for understanding memory usage, especially in memory-constrained environments.
- **Notation:** Also expressed in Big O notation:
  - **O(1):** Constant space — fixed amount of memory regardless of input size.
  - **O(n):** Linear space — memory grows linearly with input size.
  - **O(n²):** Quadratic space — e.g., algorithms using 2D arrays.
- **Components:** Includes static space (fixed code and variables) and dynamic space (memory allocated during execution, like recursion stacks).

### Relationship and Trade-offs

- Often, optimizing for time may increase space usage (e.g., caching results to speed up computation), and reducing space may increase time.
- Choosing the right balance depends on application constraints like processing power and available memory.

### Summary Table

| Aspect       | Time Complexity                       | Space Complexity                       |
| :----------- | :------------------------------------ | :------------------------------------- |
| Measures     | Number of steps or operations         | Amount of memory used                  |
| Expressed as | Big O notation (e.g., O(n), O(log n)) | Big O notation (e.g., O(1), O(n))      |
| Key concern  | How fast the algorithm runs           | How much memory the algorithm consumes |
| Examples     | Binary search: O(log n)               | Storing an array: O(n)                 |
| Trade-off    | Faster algorithms may use more memory | Less memory may require more time      |

Understanding both complexities is essential for designing efficient algorithms and writing performant software, especially in contexts like web development with JavaScript and Node.js, where responsiveness and resource usage matter[^1] [^2] [^3].

[^1]: https://www.shiksha.com/online-courses/articles/difference-between-time-complexity-and-space-complexity-blogId-151433
[^2]: https://www.simplilearn.com/tutorials/data-structure-tutorial/time-and-space-complexity
[^3]: https://www.geeksforgeeks.org/dsa/time-complexity-and-space-complexity/
[^4]: https://www.hackerearth.com/practice/basic-programming/complexity-analysis/time-and-space-complexity/tutorial/
[^5]: https://dev.to/emmanuelayinde/mastering-time-and-space-complexity-a-beginners-guide-to-big-o-notation-33ae
[^6]: https://en.wikipedia.org/wiki/Time_complexity
[^7]: https://launchschool.com/books/dsa/read/space_complexity
[^8]: https://dev.to/veldakiara/big-o-notation-time-and-space-complexity-14kk
