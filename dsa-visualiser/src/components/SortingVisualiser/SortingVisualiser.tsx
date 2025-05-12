import { useEffect, useRef, useState } from 'react';
import './SortingVisualiser.css';
import { getMergeSortAnimations } from './SortingAlgorithms/MergeSort';
import { getBubbleSortAnimations } from './SortingAlgorithms/BubbleSort';
import { getInsertionSortAnimations } from './SortingAlgorithms/InsertionSort';
import { getQuickSortAnimations } from './SortingAlgorithms/QuickSort';
import { AlgorithmHeader } from '../AlgoHeader/AlgorithmHeader';

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
  const [isSorted, setIsSorted] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('');

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const resetArray = () => {
    if (isAnimating) {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }
    setIsAnimating(false);
    setIsSorted(false);
    setCurrentAlgorithm('');
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

  const animateSort = (
    type: 'merge' | 'bubble' | 'insertion' | 'quick' | 'bogo' | 'selection'
  ) => {
    if (isSorted) {
      resetArray();
    }

    if (isAnimating) return;

    setIsAnimating(true);
    let animations: Animation[] = [];

    switch (type) {
      case 'merge':
        animations = getMergeSortAnimations(renderingArray.slice());
        setCurrentAlgorithm('Merge-Sort');
        break;
      case 'bubble':
        animations = getBubbleSortAnimations(renderingArray.slice());
        setCurrentAlgorithm('Bubble-Sort');
        break;
      case 'insertion':
        animations = getInsertionSortAnimations(renderingArray.slice());
        setCurrentAlgorithm('Insertion-Sort');
        break;
      case 'quick':
        animations = getQuickSortAnimations(renderingArray.slice());
        setCurrentAlgorithm('Quick-Sort');
        break;
    }

    playAnimations(animations);
  };

  const playAnimations = (animations: Animation[]) => {
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

        if (i === animations.length - 1) {
          setIsSorted(true);
        }
      }, i * animationSpeed);
      timeoutsRef.current.push(timerId);
    }
  };

  const containerWidth = windowWidth - 40; // minus padding
  const barWidth = containerWidth / renderingArray.length - 2; // account for margin

  return (
    <div className="sorting-container">
      <AlgorithmHeader currentAlgorithm={currentAlgorithm} />
      <div className="visualiser-wrapper">
        <div className="array-container">
          {renderingArray.map((value, index) => (
            <div
              key={index}
              className={`array-bar ${
                activeIndices.includes(index) ? 'compare' : ''
              } ${isSorted ? 'sorted' : ''}`}
              style={{
                height: `${value}px`,
                width: `${barWidth}px`,
                margin: '0 1px',
              }}
            ></div>
          ))}
        </div>

        <div className="controls">
          <button onClick={() => resetArray()}>Generate New Array</button>
          <button onClick={() => animateSort('merge')}>Merge Sort</button>
          <button onClick={() => animateSort('quick')}>Quick Sort</button>
          <button onClick={() => animateSort('bubble')}>Bubble Sort</button>
          <button onClick={() => animateSort('selection')}>
            Selection Sort
          </button>
          <button onClick={() => animateSort('insertion')}>
            Insertion Sort
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

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
