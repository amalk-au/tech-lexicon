export class Stack {
  #items = [];

  get size() { return this.#items.length; }
  get isEmpty() { return this.size === 0; }

  push(value) { this.#items.push(value); }
  peek() { return this.#items.at(-1); }
  pop() { return this.#items.pop(); }
}
