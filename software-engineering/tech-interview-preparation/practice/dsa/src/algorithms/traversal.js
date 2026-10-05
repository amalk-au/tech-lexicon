export function bfs(graph, start) {
  if (!graph.has(start)) return [];
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  for (let head = 0; head < queue.length; head++) {
    const vertex = queue[head];
    order.push(vertex);
    for (const neighbour of graph.get(vertex)) {
      if (visited.has(neighbour)) continue;
      visited.add(neighbour); // Mark when enqueued, not when removed.
      queue.push(neighbour);
    }
  }
  return order;
}

export function dfs(graph, start) {
  if (!graph.has(start)) return [];
  const visited = new Set([start]);
  const stack = [start];
  const order = [];
  while (stack.length > 0) {
    const vertex = stack.pop();
    order.push(vertex);
    const neighbours = [...graph.get(vertex)].reverse();
    for (const neighbour of neighbours) {
      if (visited.has(neighbour)) continue;
      visited.add(neighbour);
      stack.push(neighbour);
    }
  }
  return order;
}
