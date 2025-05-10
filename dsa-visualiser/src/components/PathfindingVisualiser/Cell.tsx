import React from 'react';

interface CellProps {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  onClick: (row: number, col: number) => void;
}

export const Cell = ({ row, col, isWall, isStart, isEnd, onClick }: CellProps) => {
  return (
    <div
      className={`cell ${isWall ? 'wall' : ''} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
      onClick={() => onClick(row, col)}
    />
  );
};
