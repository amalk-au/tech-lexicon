export function buildPrefixSums(values) {
  const prefix = [0];
  for (const value of values) prefix.push(prefix.at(-1) + value);
  return prefix;
}

export function rangeSum(prefix, start, end) {
  if (!Number.isInteger(start) || !Number.isInteger(end) ||
      start < 0 || end < start || end >= prefix.length - 1) {
    throw new RangeError("Use valid inclusive start and end indices");
  }
  return prefix[end + 1] - prefix[start];
}
