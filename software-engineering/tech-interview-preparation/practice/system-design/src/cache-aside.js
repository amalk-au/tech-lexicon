export class Catalog {
  #rows = new Map();
  #cache = new Map();
  #databaseReads = 0;
  #clock;
  #ttlMs;
  #invalidate;

  constructor({ clock = Date.now, ttlMs = 1000, invalidateOnWrite = true } = {}) {
    if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new RangeError("ttlMs must be positive");
    this.#clock = clock;
    this.#ttlMs = ttlMs;
    this.#invalidate = invalidateOnWrite;
  }

  get databaseReads() { return this.#databaseReads; }

  save(id, value) {
    this.#rows.set(id, structuredClone(value));
    if (this.#invalidate) this.#cache.delete(id);
  }

  read(id) {
    const now = this.#clock();
    const cached = this.#cache.get(id);
    if (cached && now < cached.expiresAt) return structuredClone(cached.value);
    this.#cache.delete(id);
    this.#databaseReads++;
    if (!this.#rows.has(id)) return undefined;
    const value = structuredClone(this.#rows.get(id));
    this.#cache.set(id, { value, expiresAt: now + this.#ttlMs });
    return structuredClone(value);
  }
}
