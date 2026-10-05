export function mergeIntervals(intervals) {
  const sorted = intervals.map(([start, end]) => [start, end])
    .sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const interval of sorted) {
    const last = result.at(-1);
    if (last === undefined || interval[0] > last[1]) result.push(interval);
    else last[1] = Math.max(last[1], interval[1]);
  }
  return result;
}
