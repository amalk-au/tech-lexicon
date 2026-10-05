export function shortestPath(graph, start, target) {
  if (!graph.has(start) || !graph.has(target)) return null;
  const visited = new Set([start]);
  const parent = new Map();
  const queue = [start];
  for (let head = 0; head < queue.length && !visited.has(target); head++) {
    const vertex = queue[head];
    for (const neighbour of graph.get(vertex)) {
      if (visited.has(neighbour)) continue;
      visited.add(neighbour);
      parent.set(neighbour, vertex);
      queue.push(neighbour);
    }
  }
  if (!visited.has(target)) return null;
  const path = [target];
  while (parent.has(path.at(-1))) path.push(parent.get(path.at(-1)));
  return path.reverse();
}
