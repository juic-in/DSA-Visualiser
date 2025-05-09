import type { Animation } from "../SortingVisualiser";

export function getBubbleSortAnimations(array: number[]) {
  const animations: Animation[] = [];
  const arr = array.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push({ type: 'compare', indices: [j, j + 1] });

      if (arr[j] > arr[j + 1]) {
        animations.push({ type: 'overwrite', index: j, newValue: arr[j + 1] });
        animations.push({ type: 'overwrite', index: j + 1, newValue: arr[j] });

        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return animations;
}
