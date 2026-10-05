# Runnable DSA practice

[Back to the topic index](../../README.md)

Small JavaScript ES modules with complete implementations, checked examples, and editable exercises. Use JavaScript first to practise the algorithms; add TypeScript types later without changing the algorithm. There are no third-party dependencies, credentials, or external services.

## Ubuntu setup and commands

Use **Node.js 24 or newer** and an existing pnpm installation. From the repository root:

```bash
cd software-engineering/practice/dsa
node --version
pnpm --version
pnpm install --offline
pnpm run check
pnpm run demo all
```

`install --offline` succeeds because this package has no dependencies. If Node.js is unavailable or older, use the [official Node.js installation guide](https://nodejs.org/en/download); no global npm packages are needed for these labs.

| Command | Purpose |
| --- | --- |
| `pnpm run demo list` | List runnable note examples |
| `pnpm run demo queue` | Run one structure demo |
| `pnpm run demo binary-search` | Run one algorithm demo |
| `pnpm test` | Test complete source implementations and all reference solutions |
| `pnpm run exercise list` | List editable exercises |
| `pnpm run exercise valid-brackets` | Check your implementation of one exercise |
| `pnpm run exercise:solution valid-brackets` | Check its complete reference solution |
| `pnpm run notes:check` | Execute every standalone note example and check source/document agreement |
| `pnpm run notes:sync` | Update marked code/example blocks after deliberately editing source or examples |
| `pnpm run check` | Check notes and run the reference tests |

Pass the exercise/demo ID directly after the script name as shown. Start in this package directory; the commands do not depend on other packages in the repository.

## Learn by editing

1. Follow the order and contracts in [exercises/README.md](./exercises/README.md).
2. Edit only `exercises/<id>.js`; each file exports `solve` with the required parameters.
3. Run `pnpm run exercise <id>` until it passes. The initial failure tells you where to implement `solve`.
4. Explain your invariant and complexity, then add one edge case to `exercises/cases.js`.
5. Compare with `solutions/<id>.js` and the linked notes after attempting the problem.
6. Re-solve it from a blank starter later, without copying the answer.

**Important:** `pnpm test` checks the complete references. It does not check unfinished starters. Use the individual exercise command to validate your work; a passing reference test is not evidence that you have solved the exercise.

## Files

| Path | Role |
| --- | --- |
| `src/structures/` | Array, Map/Set, stack, queue, list, BST, heap, graph examples |
| `src/algorithms/` | Search, sort, hashing, windows, ranges, traversal, backtracking, DP |
| `exercises/` | Editable starters and shared assertion cases |
| `solutions/` | Complete answers; some re-export the implementation shown in the notes |
| `tests/` | Structure invariants, edge cases, generated cases, and reference solution checks |
| `scripts/examples.js` | Example inputs and exact expected output |
| `scripts/notes.js` | Synchronise/check marked examples without rewriting explanations |

Tests include brute-force pair/window comparisons, independent all-pairs shortest distances, stable sorting, and queue compaction. They use a fixed seed and the [Node.js test runner](https://nodejs.org/docs/latest-v24.x/api/test.html), so no testing framework is required.

The notes contain standalone implementations and usage blocks; paste both into a `.mjs` file to practise outside this package. Imports in the exercise solutions are relative to this package.

## Boundaries of this first set

Inputs are dense arrays and finite numbers unless a contract says otherwise. These teaching implementations are intentionally small: the BST is unbalanced, the heap is numeric, the graph is unweighted, and permutation inputs should be distinct. See each note for its mutation policy and error behaviour.

This is a first revision set, not a complete competitive-programming library. Learn the included patterns before expanding to weighted graphs, monotonic stacks, tries, union-find, or more advanced DP. Keep [system-design practice](../system-design/README.md) alongside coding practice when preparing for a full-stack or backend interview.
