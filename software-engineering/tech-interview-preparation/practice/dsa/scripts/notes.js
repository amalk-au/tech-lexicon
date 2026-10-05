import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { examples } from "./examples.js";

const root = new URL("../", import.meta.url);
const documents = {
  structures: new URL("../../software-engineering-theory/data-structures/data-structures-revision.md", root),
  algorithms: new URL("../../software-engineering-theory/algorithms/algorithms-revision.md", root),
};

export async function runExample(example) {
  const source = await readFile(new URL(`src/${example.group}/${example.file}`, root), "utf8");
  const result = spawnSync(process.execPath, ["--input-type=module"], {
    input: `${source}\n${example.usage}\n`, encoding: "utf8", timeout: 5000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${example.id}: ${result.error?.message ?? result.stderr}`);
  }
  if (result.stdout.trimEnd() !== example.output) {
    throw new Error(`${example.id}: unexpected output ${result.stdout.trimEnd()}`);
  }
  return source.trimEnd();
}

// Imported by demo.js without changing Markdown files.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes("--check");
  for (const [group, path] of Object.entries(documents)) {
    const original = await readFile(path, "utf8");
    let updated = original;
    for (const example of examples.filter(item => item.group === group)) {
      const source = await runExample(example);
      const start = `<!-- example:${example.id} -->`;
      const end = `<!-- /example:${example.id} -->`;
      const first = updated.indexOf(start);
      const last = updated.indexOf(end);
      if (first < 0 || last < first || updated.indexOf(start, first + 1) >= 0) {
        throw new Error(`Missing or repeated marker: ${example.id}`);
      }
      const block = `${start}\n\n\`\`\`js\n${source}\n\`\`\`\n\nTry it (append to the code above):\n\n\`\`\`js\n${example.usage}\n\`\`\`\n\nExpected output:\n\n\`\`\`text\n${example.output}\n\`\`\`\n\n${end}`;
      updated = updated.slice(0, first) + block + updated.slice(last + end.length);
    }
    if (check && original !== updated) throw new Error(`Examples out of sync: ${fileURLToPath(path)}`);
    if (!check && original !== updated) await writeFile(path, updated);
  }
  console.log(`${examples.length} standalone examples executed; notes ${check ? "match" : "synchronised"}.`);
}
