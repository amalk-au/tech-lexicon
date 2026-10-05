export function solve(text) {
  const matching = new Map([["(", ")"], ["[", "]"], ["{", "}"]]);
  const expected = [];
  for (const character of text) {
    if (matching.has(character)) expected.push(matching.get(character));
    else if (expected.pop() !== character) return false;
  }
  return expected.length === 0;
}
