export function permutations(values) {
  const result = [];
  const path = [];
  const used = new Array(values.length).fill(false);
  function visit() {
    if (path.length === values.length) {
      result.push(path.slice());
      return;
    }
    for (let index = 0; index < values.length; index++) {
      if (used[index]) continue;
      used[index] = true;
      path.push(values[index]);
      visit();
      path.pop();
      used[index] = false;
    }
  }
  visit();
  return result;
}
