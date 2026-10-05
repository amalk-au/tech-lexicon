export function twoSum(values, target) {
  const seen = new Map();
  for (let index = 0; index < values.length; index++) {
    const complement = target - values[index];
    if (seen.has(complement)) return [seen.get(complement), index];
    seen.set(values[index], index);
  }
  return null;
}
