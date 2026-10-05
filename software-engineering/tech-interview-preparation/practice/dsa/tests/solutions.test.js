import test from "node:test";
import { exercises } from "../exercises/cases.js";

for (const [id, exercise] of Object.entries(exercises)) {
  test(`Reference exercise solution: ${id}`, async () => {
    const { solve } = await import(new URL(`../solutions/${id}.js`, import.meta.url));
    exercise.run(solve);
  });
}
