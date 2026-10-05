import { exercises } from "../exercises/cases.js";

const args = process.argv.slice(2);
const solution = args.includes("--solution");
const id = args.find(arg => arg !== "--solution") ?? "list";
if (id === "list") {
  for (const [key, exercise] of Object.entries(exercises)) console.log(`${key}: ${exercise.title}`);
} else {
  const exercise = Object.hasOwn(exercises, id) ? exercises[id] : undefined;
  if (!exercise) {
    console.error(`Unknown exercise: ${id}. Use pnpm run exercise list.`);
    process.exitCode = 1;
  } else {
    try {
      const folder = solution ? "solutions" : "exercises";
      const { solve } = await import(new URL(`../${folder}/${id}.js`, import.meta.url));
      exercise.run(solve);
      console.log(`PASS ${id}${solution ? " (reference solution)" : ""}`);
    } catch (error) {
      console.error(`FAIL ${id}: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
