import { useEffect, useRef, useState } from 'react';
import './SortingVisualiser.css';
import { getMergeSortAnimations } from './SortingAlgorithms/MergeSort';
import { getBubbleSortAnimations } from './SortingAlgorithms/BubbleSort';
import { getInsertionSortAnimations } from './SortingAlgorithms/InsertionSort';
import { getQuickSortAnimations } from './SortingAlgorithms/QuickSort';

export type Animation =
  | { type: 'compare'; indices: [number, number] }
  | { type: 'overwrite'; index: number; newValue: number };

interface Props {
  arraySize: number;
  min: number;
  max: number;
}

export const SortingVisualiser = ({ arraySize, min, max }: Props) => {
  const [renderingArray, setRenderingArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAnimating, setIsAnimating] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const barMargin = 2;
  const barWidth = Math.floor(windowWidth / arraySize) - barMargin;

  const resetArray = () => {
    if (isAnimating) {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }
    setIsAnimating(false)
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(min, max));
    }
    setRenderingArray(newArray);
    setActiveIndices([]);
  };

  useEffect(() => {
    resetArray();
  }, [min, max, arraySize]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animateSort = (type: 'merge' | 'bubble' | 'insertion' | 'quick' | 'bogo' | 'selection') => {
    if (isAnimating) return;
    setIsAnimating(true);
    let animations: Animation[] = [];

    switch (type) {
      case 'merge':
        animations = getMergeSortAnimations(renderingArray.slice());
        break;
      case 'bubble':
        animations = getBubbleSortAnimations(renderingArray.slice());
        break;
      case 'insertion':
        animations = getInsertionSortAnimations(renderingArray.slice());
        break;
      case 'quick':
        animations = getQuickSortAnimations(renderingArray.slice());
        break;
    }

    playAnimations(animations);
  };

  const playAnimations = (animations: Animation[]) => {
    const animationSpeed = 100;

    for (let i = 0; i < animations.length; i++) {
      const timerId = setTimeout(() => {
        // if (!isAnimating) return;
        const animation = animations[i];

        if (animation.type === 'compare') {
          setActiveIndices(animation.indices);

          // Clear the active indices after a short delay
          setTimeout(() => setActiveIndices([]), animationSpeed / 2);
        } else if (animation.type === 'overwrite') {
          setRenderingArray((prev) => {
            const newArr = [...prev];
            newArr[animation.index] = animation.newValue;
            return newArr;
          });
        }
      }, i * animationSpeed);
      timeoutsRef.current.push(timerId)
    }
  };

  return (
    <>
      <div className="array-container">
        {renderingArray.map((value, index) => (
          <div
            key={index}
            className={`array-bar ${
              activeIndices.includes(index) ? 'compare' : ''
            }`}
            style={{
              height: `${value}px`,
              width: `${barWidth}px`, // Dynamic width
              margin: '0 1px',
            }}
          ></div>
        ))}
        <button onClick={() => resetArray()}>Generate New Array</button>
        <button onClick={() => animateSort('merge')}>Merge Sort</button>
        <button onClick={() => animateSort('quick')}>Quick Sort</button>
        <button onClick={() => animateSort('bubble')}>Bubble Sort</button>
        <button onClick={() => animateSort('selection')}>Selection Sort</button>
        <button onClick={() => animateSort('insertion')}>Insertion Sort</button>
        <button onClick={() => animateSort('bogo')}>Bogo Sort</button>
      </div>
    </>
  );
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
