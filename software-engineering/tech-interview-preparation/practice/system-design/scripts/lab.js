import { scenarios } from "./scenarios.js";

const id = process.argv[2] ?? "all";
if (id === "list") console.log(Object.keys(scenarios).join("\n"));
else if (id === "all") {
  for (const [name, run] of Object.entries(scenarios)) console.log(`${name}: ${JSON.stringify(run())}`);
} else if (Object.hasOwn(scenarios, id)) console.log(`${id}: ${JSON.stringify(scenarios[id]())}`);
else {
  console.error(`Unknown lab: ${id}. Use pnpm run lab list.`);
  process.exitCode = 1;
}
