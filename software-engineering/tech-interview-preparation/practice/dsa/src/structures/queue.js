export class Queue {
  #items = [];
  #head = 0;

  get size() { return this.#items.length - this.#head; }
  get isEmpty() { return this.size === 0; }

  enqueue(value) { this.#items.push(value); }
  peek() { return this.#items[this.#head]; }

  dequeue() {
    if (this.isEmpty) return undefined;
    const value = this.#items[this.#head];
    this.#items[this.#head++] = undefined; // Release the old reference.
    if (this.isEmpty) {
      this.#items = [];
      this.#head = 0;
    } else if (this.#head >= 1024 && this.#head * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
    return value;
  }
}
