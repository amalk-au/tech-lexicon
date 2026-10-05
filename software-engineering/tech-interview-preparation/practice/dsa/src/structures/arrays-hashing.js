export function frequencyMap(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

export function uniqueValues(values) {
  return [...new Set(values)];
}
