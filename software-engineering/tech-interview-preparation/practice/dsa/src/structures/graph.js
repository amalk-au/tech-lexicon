export function createGraph(edges, { vertices = [], directed = false } = {}) {
  const graph = new Map(vertices.map(vertex => [vertex, new Set()]));
  for (const [from, to] of edges) {
    if (!graph.has(from)) graph.set(from, new Set());
    if (!graph.has(to)) graph.set(to, new Set());
    graph.get(from).add(to);
    if (!directed) graph.get(to).add(from);
  }
  return graph;
}
