export function solve(head) {
  let previous = null;
  let current = head;
  while (current !== null) {
    const next = current.next; // Save before overwriting.
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}
