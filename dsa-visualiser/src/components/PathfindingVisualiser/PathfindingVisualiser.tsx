import { startTransition, useEffect, useState } from 'react';
import './PathfindingVisualiser.css';
interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isVisited: boolean;
  distance?: number;
  previousNode: object | null;
}

interface CellIdentifier {
  row: number;
  col: number;
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

  const resetCells = () => {
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

  const handleCellClick = (row: number, col: number) => {
    const newCells = cells.map((row) => row.map((cell) => ({ ...cell })));
    const node = newCells[row][col];
    if (action === 'wall') {
      node.isWall = !node.isWall;
    } else if (action === 'start') {
      setStart({ row, col });
    } else if (action === 'end') {
      setEnd({ row, col });
    }
    setCells(newCells)
  };

  useEffect(() => {
    resetCells();
  }, []);

  function isStart(cell: Cell | null): boolean {
    if (!cell || !start) return false;
    return cell.row === start.row && cell.col === start.col;
  }

  function isEnd(cell: Cell | null): boolean {
    if (!cell || !end) return false;
    return cell.row === end.row && cell.col === end.col;
  }

  return (
    <div className="visualiser-wrapper">
      <div className="cells-container">
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.isWall ? 'wall' : ''} 
                ${isStart(cell) ? 'start' : ''} 
                ${isEnd(cell) ? 'end' : ''}`}
                onClick={() => handleCellClick(cell.row, cell.col)}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="controls">
        <button onClick={() => setAction('start')}>Start Node</button>
        <button onClick={() => setAction('end')}>End Node</button>
        <button onClick={() => setAction('wall')}>Wall</button>
      </div>
    </div>
  );
};
