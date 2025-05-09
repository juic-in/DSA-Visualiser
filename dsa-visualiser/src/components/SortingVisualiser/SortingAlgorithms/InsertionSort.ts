import type { Animation } from "../SortingVisualiser";

export function getInsertionSortAnimations(array: number[]) {
  const animations: Animation[] = [];
  const arr = array.slice();

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      animations.push({ type: 'compare', indices: [j, j + 1] });
      animations.push({ type: 'overwrite', index: j + 1, newValue: arr[j] });

      arr[j + 1] = arr[j];
      j--;
    }

    animations.push({ type: 'overwrite', index: j + 1, newValue: key });
    arr[j + 1] = key;
  }

  return animations;
}
