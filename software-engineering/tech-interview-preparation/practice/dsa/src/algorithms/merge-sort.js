export function mergeSort(values, compare = (a, b) => a - b) {
  if (values.length < 2) return values.slice();
  const middle = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, middle), compare);
  const right = mergeSort(values.slice(middle), compare);
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    // Taking the left item on a tie preserves stability.
    result.push(compare(left[i], right[j]) <= 0 ? left[i++] : right[j++]);
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}
