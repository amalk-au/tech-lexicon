export function maxWindowSum(values, k) {
  if (!Number.isInteger(k) || k < 1 || k > values.length) {
    throw new RangeError("k must be an integer between 1 and values.length");
  }
  let sum = 0;
  for (let index = 0; index < k; index++) sum += values[index];
  let best = sum;
  for (let right = k; right < values.length; right++) {
    sum += values[right] - values[right - k];
    best = Math.max(best, sum);
  }
  return best;
}
