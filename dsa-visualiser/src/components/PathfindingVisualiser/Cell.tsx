import React from 'react';
import './Cell.css'; // Make sure to style the cell component

interface Props {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  onClick: (row: number, col: number) => void;
}

export const Cell: React.FC<Props> = ({
  row,
  col,
  isWall,
  isStart,
  isEnd,
  isVisited,
  isPath,
  onClick,
}) => {
  const getCellClass = () => {
    if (isStart) return 'cell start';
    if (isEnd) return 'cell end';
    if (isWall) return 'cell wall';
    if (isPath) return 'cell path';
    if (isVisited) return 'cell visited';
    return 'cell';
  };

  return (
    <div
      className={getCellClass()}
      onClick={() => onClick(row, col)}
    />
  );
};
