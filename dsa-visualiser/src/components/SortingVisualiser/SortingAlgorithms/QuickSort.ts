import type { Animation } from '../SortingVisualiser';

export function getQuickSortAnimations(array: number[]) {
  const animations: Animation[] = [];
  const arr = array.slice();

  function quickSort(start: number, end: number) {
    if (start >= end) return;

    let pivotIdx = partition(start, end);
    quickSort(start, pivotIdx - 1);
    quickSort(pivotIdx + 1, end);
  }

  function partition(start: number, end: number): number {
    const pivot = arr[end];
    let i = start;

    for (let j = start; j < end; j++) {
      animations.push({ type: 'compare', indices: [j, end] });

      if (arr[j] < pivot) {
        animations.push({ type: 'overwrite', index: i, newValue: arr[j] });
        animations.push({ type: 'overwrite', index: j, newValue: arr[i] });

        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        i++;
      }
    }

    animations.push({ type: 'overwrite', index: i, newValue: arr[end] });
    animations.push({ type: 'overwrite', index: end, newValue: arr[i] });

    const temp = arr[i];
    arr[i] = arr[end];
    arr[end] = temp;

    return i;
  }

  quickSort(0, arr.length - 1);
  return animations;
}
