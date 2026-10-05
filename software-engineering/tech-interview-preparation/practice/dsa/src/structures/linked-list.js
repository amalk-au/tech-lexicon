export class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export class SinglyLinkedList {
  head = null;
  tail = null;

  prepend(value) {
    this.head = new ListNode(value, this.head);
    if (this.tail === null) this.tail = this.head;
  }

  append(value) {
    const node = new ListNode(value);
    if (this.tail === null) this.head = node;
    else this.tail.next = node;
    this.tail = node;
  }

  find(value) {
    for (let node = this.head; node !== null; node = node.next) {
      if (node.value === value) return node;
    }
    return null;
  }

  removeFirst(value) {
    let previous = null;
    let node = this.head;
    while (node !== null && node.value !== value) {
      previous = node;
      node = node.next;
    }
    if (node === null) return false;
    if (previous === null) this.head = node.next;
    else previous.next = node.next;
    if (this.tail === node) this.tail = previous;
    node.next = null;
    return true;
  }

  toArray() {
    const values = [];
    for (let node = this.head; node !== null; node = node.next) {
      values.push(node.value);
    }
    return values;
  }
}
