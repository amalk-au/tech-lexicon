export class BinarySearchTree {
  #root = null;

  insert(value) {
    const node = { value, left: null, right: null };
    if (this.#root === null) {
      this.#root = node;
      return;
    }
    let current = this.#root;
    while (true) {
      if (value === current.value) return; // Ignore duplicates.
      const side = value < current.value ? "left" : "right";
      if (current[side] === null) {
        current[side] = node;
        return;
      }
      current = current[side];
    }
  }

  has(value) {
    let current = this.#root;
    while (current !== null) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  inOrder() {
    const result = [];
    const stack = [];
    let current = this.#root;
    while (current !== null || stack.length > 0) {
      while (current !== null) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop();
      result.push(current.value);
      current = current.right;
    }
    return result;
  }
}
