export class MinHeap {
  #items = [];

  get size() { return this.#items.length; }
  peek() { return this.#items[0]; }

  push(value) {
    this.#items.push(value);
    let index = this.size - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.#items[parent] <= this.#items[index]) break;
      [this.#items[parent], this.#items[index]] =
        [this.#items[index], this.#items[parent]];
      index = parent;
    }
  }

  pop() {
    if (this.size === 0) return undefined;
    const minimum = this.#items[0];
    const last = this.#items.pop();
    if (this.size === 0) return minimum;
    this.#items[0] = last;
    let index = 0;
    while (true) {
      const left = 2 * index + 1;
      const right = left + 1;
      let smallest = index;
      if (left < this.size && this.#items[left] < this.#items[smallest]) smallest = left;
      if (right < this.size && this.#items[right] < this.#items[smallest]) smallest = right;
      if (smallest === index) break;
      [this.#items[index], this.#items[smallest]] =
        [this.#items[smallest], this.#items[index]];
      index = smallest;
    }
    return minimum;
  }
}
