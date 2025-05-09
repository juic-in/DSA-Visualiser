import { useEffect, useState } from 'react';

interface Props {
  arraySize: number;
  min: number;
  max: number;
}

export const SortingVisualiser = ({ arraySize, min, max }: Props) => {
  const [renderingArray, setRenderingArray] = useState<number[]>([]);

  const resetArray = () => {
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(min, max));
    }
    setRenderingArray(newArray);
  };

  useEffect(() => {
    resetArray()

  }, [min, max, arraySize])


  return <>{renderingArray.map((val, idx) => (
    <div className="array-bar" key={idx}>
      {val}
    </div>
  ))}</>;
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
