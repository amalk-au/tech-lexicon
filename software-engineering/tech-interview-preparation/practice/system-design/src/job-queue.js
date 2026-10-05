export class LeaseQueue {
  #jobs = new Map();
  #clock;
  #leaseMs;
  #nextToken = 1;

  constructor({ clock = Date.now, leaseMs = 1000 } = {}) {
    if (!Number.isFinite(leaseMs) || leaseMs <= 0) throw new RangeError("leaseMs must be positive");
    this.#clock = clock;
    this.#leaseMs = leaseMs;
  }

  enqueue(id, payload) {
    if (this.#jobs.has(id)) throw new Error("Duplicate job id");
    this.#jobs.set(id, { id, payload: structuredClone(payload), state: "ready", attempts: 0 });
  }

  claim(worker) {
    const now = this.#clock();
    for (const job of this.#jobs.values()) {
      if (job.state === "done" || (job.state === "leased" && now < job.leaseUntil)) continue;
      Object.assign(job, {
        state: "leased", worker, token: this.#nextToken++,
        leaseUntil: now + this.#leaseMs, attempts: job.attempts + 1,
      });
      return structuredClone(job);
    }
    return null;
  }

  ack(id, token) {
    const job = this.#jobs.get(id);
    if (!job || job.state !== "leased" || job.token !== token || this.#clock() >= job.leaseUntil) return false;
    job.state = "done";
    return true;
  }

  inspect(id) { return structuredClone(this.#jobs.get(id)); }
}

export class DedupeSink {
  #completed = new Set();
  #effects = [];

  deliver(key, payload) {
    if (this.#completed.has(key)) return false;
    const effect = { key, payload: structuredClone(payload) };
    this.#effects.push(effect);
    this.#completed.add(key);
    return true;
  }

  get effects() { return structuredClone(this.#effects); }
}
