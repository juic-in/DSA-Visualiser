import { useEffect, useState } from 'react';
import './PathfindingVisualiser.css';
interface Cell {
  row: Number;
  col: Number;
  isStart: Boolean;
  isEnd: Boolean;
  isWall: Boolean;
  isVisited: Boolean;
  distance?: Number;
  previousNode: Object | null;
}
interface Props {
  maxRows: number;
  maxCols: number;
}

function createNode(row: number, col: number): Cell {
  return {
    row,
    col,
    isStart: false,
    isEnd: false,
    isWall: false,
    isVisited: false,
    distance: Infinity,
    previousNode: null,
  };
}

export const PathfindingVisualiser = ({ maxRows, maxCols }: Props) => {
  const [cells, setCells] = useState<Cell[][]>([]);
  const [start, setStart] = useState<Cell | null>(null);
  const [end, setEnd] = useState<Cell | null>(null);

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

  useEffect(() => {
    resetCells();
  }, []);

  return (
    <div className="cells-container">
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell ${cell.isWall ? 'wall' : ''} ${
                cell.isStart ? 'start' : ''
              } ${cell.isEnd ? 'end' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
