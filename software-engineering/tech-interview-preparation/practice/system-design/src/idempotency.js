export class KeyConflict extends Error {
  constructor() { super("The same idempotency key was reused for a different request"); }
}

export class InventoryService {
  #stock;
  #requests = new Map();
  #nextId = 1;

  constructor(stock = new Map([["widget", 5]])) {
    if ([...stock.values()].some(value => !Number.isSafeInteger(value) || value < 0)) {
      throw new RangeError("Stock must contain non-negative integers");
    }
    this.#stock = new Map(stock);
  }

  remaining(sku) { return this.#stock.get(sku) ?? 0; }

  reserve({ key, sku, quantity }) {
    if (typeof key !== "string" || key.length === 0 || typeof sku !== "string" ||
        sku.length === 0 || !Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new RangeError("Use a nonempty key/sku and positive integer quantity");
    }
    const fingerprint = JSON.stringify([sku, quantity]);
    const previous = this.#requests.get(key);
    if (previous) {
      if (previous.fingerprint !== fingerprint) throw new KeyConflict();
      return structuredClone(previous.response);
    }
    let response;
    if (!this.#stock.has(sku)) {
      response = { status: 404, body: { error: "unknown-sku" } };
    } else if (this.remaining(sku) < quantity) {
      response = { status: 409, body: { error: "insufficient-stock" } };
    } else {
      this.#stock.set(sku, this.remaining(sku) - quantity);
      response = { status: 201, body: { reservationId: `reservation-${this.#nextId++}`, sku, quantity } };
    }
    // Synchronous state changes are atomic only within this one process.
    this.#requests.set(key, { fingerprint, response });
    return structuredClone(response);
  }
}
