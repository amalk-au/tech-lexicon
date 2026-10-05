export function arrayOperations() {
  const values = [10, 2, 3];
  values.push(4);
  const removed = values.pop();
  return {
    values,
    removed,
    copiedRange: values.slice(1),
    sorted: values.toSorted((a, b) => a - b),
  };
}
