import { examples } from "./examples.js";
import { runExample } from "./notes.js";

const id = process.argv[2] ?? "all";
if (id === "list") {
  console.log(examples.map(example => example.id).join("\n"));
} else {
  const selected = examples.filter(example => id === "all" || example.id === id);
  if (selected.length === 0) {
    console.error(`Unknown demo: ${id}. Use pnpm run demo list.`);
    process.exitCode = 1;
  }
  for (const example of selected) {
    await runExample(example);
    console.log(`${example.id}:\n${example.output}\n`);
  }
}
