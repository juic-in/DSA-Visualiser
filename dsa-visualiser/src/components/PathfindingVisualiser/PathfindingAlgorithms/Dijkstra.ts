import type { Animation, Cell, CellIdentifier } from "../PathfindingVisualiser";

export function getDijkstraAnimations(
  grid: Cell[][],
  start: CellIdentifier,
  end: CellIdentifier
): Animation[] {
  const animations: Animation[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ];

  const priorityQueue: Cell[] = [];
  const startNode = grid[start.row][start.col];
  startNode.distance = 0;
  priorityQueue.push(startNode);

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const currentNode = priorityQueue.shift()!;
    
    // Push visit animation (deferred isVisited update)
    animations.push({ type: 'visit', node: { row: currentNode.row, col: currentNode.col } });

    if (currentNode.isVisited) continue;
    currentNode.isVisited = true;

    if (currentNode === grid[end.row][end.col]) break;

    for (const direction of directions) {
      const neighborRow = currentNode.row + direction.row;
      const neighborCol = currentNode.col + direction.col;

      if (
        neighborRow >= 0 &&
        neighborRow < rows &&
        neighborCol >= 0 &&
        neighborCol < cols
      ) {
        const neighbor = grid[neighborRow][neighborCol];
        if (neighbor.isWall || neighbor.isVisited) continue;

        const newDistance = currentNode.distance + 1;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = currentNode;
          priorityQueue.push(neighbor);
        }
      }
    }
  }

  // Reconstruct shortest path
  const path: Animation[] = [];
  let currentNode = grid[end.row][end.col];
  while (currentNode.previousNode && currentNode !== startNode) {
    path.push({ type: 'path', node: { row: currentNode.row, col: currentNode.col } });
    currentNode = currentNode.previousNode as Cell;
  }

  // Include the start node in the path
  path.push({ type: 'path', node: { row: startNode.row, col: startNode.col } });

  return [...animations, ...path.reverse()];
}
