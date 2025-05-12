import type { Animation, Cell, CellIdentifier } from '../PathfindingVisualiser';

export const getDfsAnimations = (
  grid: Cell[][],
  start: CellIdentifier,
  end: CellIdentifier
): Animation[] => {
  const animations: Animation[] = [];
  const startNode = grid[start.row][start.col];
  const endNode = grid[end.row][end.col];

  function dfsRec(row: number, col: number): boolean {
    const rows = grid.length;
    const cols = grid[0].length;

    // Bounds and visited/wall check
    if (
      row < 0 || col < 0 || row >= rows || col >= cols ||
      grid[row][col].isVisited || grid[row][col].isWall
    ) {
      return false;
    }

    const node = grid[row][col];
    node.isVisited = true;
    animations.push({ type: 'visit', node: { row, col } });

    // Found end node
    if (row === end.row && col === end.col) return true;

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 && newCol >= 0 &&
        newRow < rows && newCol < cols &&
        !grid[newRow][newCol].isVisited &&
        !grid[newRow][newCol].isWall
      ) {
        grid[newRow][newCol].previousNode = node;

        if (dfsRec(newRow, newCol)) {
          return true;
        }
      }
    }

    return false;
  }

  dfsRec(start.row, start.col);

  // Reconstruct path
  const path: Animation[] = [];
  let currentNode: Cell | null = endNode;

  while (currentNode !== null && currentNode !== startNode) {
    path.push({
      type: 'path',
      node: { row: currentNode.row, col: currentNode.col },
    });
    currentNode = (currentNode.previousNode || null) as Cell
  }

  // Include start node
  if (currentNode === startNode) {
    path.push({
      type: 'path',
      node: { row: startNode.row, col: startNode.col },
    });
  }

  return [...animations, ...path.reverse()];
};
