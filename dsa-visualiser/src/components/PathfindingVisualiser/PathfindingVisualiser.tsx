import { useState, useEffect, useRef } from 'react';
import './PathfindingVisualiser.css';
import { Cell } from './Cell';
import { getDijkstraAnimations } from './PathfindingAlgorithms/Dijkstra';
import { getDfsAnimations } from './PathfindingAlgorithms/Dfs';
import { AlgorithmHeader } from '../AlgoHeader/AlgorithmHeader';

export interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isVisited: boolean;
  distance: number;
  previousNode: object | null;
}

export interface CellIdentifier {
  row: number;
  col: number;
}

export interface Animation {
  type: 'visit' | 'path';
  node: CellIdentifier;
}

interface Props {
  maxRows: number;
  maxCols: number;
}

function createNode(row: number, col: number): Cell {
  return {
    row,
    col,
    isWall: false,
    isVisited: false,
    distance: Infinity,
    previousNode: null,
  };
}

export const PathfindingVisualiser = ({ maxRows, maxCols }: Props) => {
  const [cells, setCells] = useState<Cell[][]>([]);
  const [start, setStart] = useState<CellIdentifier | null>(null);
  const [end, setEnd] = useState<CellIdentifier | null>(null);
  const [action, setAction] = useState('start');
  const [currentAlgorithm, setCurrentAlgorithm] = useState('');
  const [isAnimating, setisAnimating] = useState(false);
  const [isPathfindingComplete, setIsPathfindingComplete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(20);
  const [path, setPath] = useState<CellIdentifier[]>([]);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const resetCells = () => {
    if (isAnimating) {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    setisAnimating(false);
    setIsPathfindingComplete(false);
    setPath([]);
    setCurrentAlgorithm('');
    setAction('start');
    setStart(null);
    setEnd(null);

    const cells: Cell[][] = [];
    for (let row = 0; row < maxRows; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < maxCols; col++) {
        currentRow.push(createNode(row, col));
      }
      cells.push(currentRow);
    }
    setCells(cells);
  };

  useEffect(() => {
    resetCells();
  }, []);
  const handleCellClick = (row: number, col: number) => {
    if (isAnimating || isPathfindingComplete) return;

    const newCells = cells.map((row) => row.map((cell) => ({ ...cell })));
    const node = newCells[row][col];
    if (action === 'wall') {
      if (!isStart({ row, col }) && !isEnd({ row, col })) {
        node.isWall = !node.isWall;
      }
    } else if (action === 'start') {
      if (!node.isWall && !isEnd({ row, col })) {
        setStart({ row, col });
      }
    } else if (action === 'end') {
      if (!node.isWall && !isStart({ row, col })) {
        setEnd({ row, col });
      }
    }
    setCells(newCells);
  };

  // To check if the node is the start or end
  function isStart(cell: CellIdentifier | null): boolean {
    if (!cell || !start) return false;
    return cell.row === start.row && cell.col === start.col;
  }

  function isEnd(cell: CellIdentifier | null): boolean {
    if (!cell || !end) return false;
    return cell.row === end.row && cell.col === end.col;
  }

  const clearVisitedAndPath = () => {
    setCells((prevCells) =>
      prevCells.map((row) =>
        row.map((cell) => ({
          ...cell,
          isVisited: false,
          distance: Infinity,
          previousNode: null,
        }))
      )
    );
    setPath([]);
    setIsPathfindingComplete(false);
  };

  // Pathfinding Animation Logic
  const animatePathfinding = (type: 'dijkstra' | 'aStar' | 'bfs' | 'dfs') => {
    if (!start || !end || isAnimating) return;

    // Only clear visited/path markers, not the whole grid
    clearVisitedAndPath();

    setisAnimating(true);
    let animations: Animation[] = [];

    switch (type) {
      case 'dijkstra':
        animations = getDijkstraAnimations(cells, start, end);
        setCurrentAlgorithm('Dijkstra');
        break;
      case 'dfs':
        animations = getDfsAnimations(cells, start, end);
        setCurrentAlgorithm('Dfs');
        break;
      case 'bfs':
        // Place holder until weighted grids are added, since dijkstra behaves the same as bfs in unweighted graphs
        animations = getDijkstraAnimations(cells, start, end);
        setCurrentAlgorithm('Bfs');
        break;
      default:
        return;
    }

    playPathfindingAnimations(animations);
  };

  const playPathfindingAnimations = (animations: Animation[]) => {
    const visitAnimations = animations.filter((a) => a.type === 'visit');
    const pathAnimations = animations.filter((a) => a.type === 'path');

    for (let i = 0; i < visitAnimations.length; i++) {
      const timerId = setTimeout(() => {
        const animation = visitAnimations[i];

        setCells((prevCells) => {
          const newCells = prevCells.map((row) =>
            row.map((cell) => ({ ...cell }))
          );
          newCells[animation.node.row][animation.node.col].isVisited = true;
          return newCells;
        });
        console.log('visited:', animation.node);
      }, i * animationSpeed);
      timeoutsRef.current.push(timerId);
    }

    const delay = visitAnimations.length * animationSpeed;
    pathAnimations.forEach((animation, i) => {
      const timerId = setTimeout(() => {
        setPath((prev) => [...prev, animation.node]);

        if (i === pathAnimations.length - 1) {
          setIsPathfindingComplete(true);
          setisAnimating(false);
        }
      }, delay + i * animationSpeed);
      timeoutsRef.current.push(timerId);
    });
  };

  return (
    <div className="pathfinding-container">
      <AlgorithmHeader currentAlgorithm={currentAlgorithm} />
      <div className="visualiser-wrapper">
        <div className="cells-container">
          {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <Cell
                  key={colIndex}
                  row={cell.row}
                  col={cell.col}
                  isWall={cell.isWall}
                  isStart={isStart(cell)}
                  isEnd={isEnd(cell)}
                  isVisited={cell.isVisited}
                  isPath={path.some(
                    (p) => p.row === cell.row && p.col === cell.col
                  )}
                  onClick={handleCellClick}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="controls">
          <button onClick={() => setAction('start')}>Start Node</button>
          <button onClick={() => setAction('end')}>End Node</button>
          <button onClick={() => setAction('wall')}>Wall</button>

          {/* Algorithm Selection */}
          <button
            onClick={() => animatePathfinding('dijkstra')}
            disabled={isAnimating}
          >
            Dijkstra
          </button>
          <button
            onClick={() => animatePathfinding('bfs')}
            disabled={isAnimating}
          >
            BFS
          </button>
          <button
            onClick={() => animatePathfinding('dfs')}
            disabled={isAnimating}
          >
            DFS
          </button>

          {/* Reset */}
          <button onClick={resetCells} disabled={isAnimating}>
            Reset Grid
          </button>
          <div className="speed-slider-container">
            <label htmlFor="animationSpeed">Animation Speed: </label>
            <input
              id="animationSpeed"
              type="range"
              min="1"
              max="100"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            />
            <span>{animationSpeed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
