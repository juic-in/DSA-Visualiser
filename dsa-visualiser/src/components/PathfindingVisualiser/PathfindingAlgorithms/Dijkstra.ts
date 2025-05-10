import type { Animation, Cell, CellIdentifier } from "../PathfindingVisualiser";

export function getDijkstraAnimations(grid: Cell[][], start: CellIdentifier, end: CellIdentifier): Animation[] {
  const animations: Animation[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ];

  // Create a priority queue for Dijkstra's algorithm
  const priorityQueue: Cell[] = [];
  const startNode = grid[start.row][start.col];
  startNode.distance = 0;
  priorityQueue.push(startNode);

  while (priorityQueue.length > 0) {
    // Sort the priority queue by distance (ascending order)
    priorityQueue.sort((a, b) => a.distance - b.distance);

    const currentNode = priorityQueue.shift()!;

    if (currentNode.isVisited) continue;
    currentNode.isVisited = true;

    // If we have reached the end node, stop the search
    if (currentNode === grid[end.row][end.col]) break;

    // Check all neighboring cells
    for (const direction of directions) {
      const neighborRow = currentNode.row + direction.row;
      const neighborCol = currentNode.col + direction.col;

      if (
        neighborRow >= 0 &&
        neighborRow < rows &&
        neighborCol >= 0 &&
        neighborCol < cols &&
        !grid[neighborRow][neighborCol].isWall &&
        !grid[neighborRow][neighborCol].isVisited
      ) {
        const neighbor = grid[neighborRow][neighborCol];
        const newDistance = currentNode.distance + 1;

        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = currentNode;

          priorityQueue.push(neighbor);

          // Mark the neighbor as visited in the animation
          animations.push({ type: 'visit', node: { row: neighbor.row, col: neighbor.col } });
        }
      }
    }
  }

  // Backtrack to find the path from the end to the start
  let currentNode = grid[end.row][end.col];
  while (currentNode !== startNode) {
    if (currentNode.previousNode) {
      const { row, col } = currentNode;
      animations.push({ type: 'path', node: { row, col } });
      currentNode = currentNode.previousNode as Cell;
    }
  }

  animations.push({ type: 'path', node: { row: startNode.row, col: startNode.col } });

  return animations.reverse(); // Reverse to animate the path from start to end
}
