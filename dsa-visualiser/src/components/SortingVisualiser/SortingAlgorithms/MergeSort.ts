import type { Animation } from "../SortingVisualiser";

export function getMergeSortAnimations(array: number[]) {
  const animations: Animation[] = [];
  const auxArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxArray, animations);
  return animations;
}

function mergeSortHelper(
  mainArray: number[],
  start: number,
  end: number,
  auxArray: number[],
  animations: Animation[]
) {
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);
  mergeSortHelper(auxArray, start, mid, mainArray, animations);
  mergeSortHelper(auxArray, mid + 1, end, mainArray, animations);
  merge(mainArray, start, mid, end, auxArray, animations);
}

function merge(
  mainArray: number[],
  start: number,
  mid: number,
  end: number,
  auxArray: number[],
  animations: Animation[]
) {
  let k = start, i = start, j = mid + 1;

  while (i <= mid && j <= end) {
    animations.push({ type: 'compare', indices: [i, j] });

    if (auxArray[i] <= auxArray[j]) {
      animations.push({ type: 'overwrite', index: k, newValue: auxArray[i] });
      mainArray[k++] = auxArray[i++];
    } else {
      animations.push({ type: 'overwrite', index: k, newValue: auxArray[j] });
      mainArray[k++] = auxArray[j++];
    }
  }

  while (i <= mid) {
    animations.push({ type: 'compare', indices: [i, i] });
    animations.push({ type: 'overwrite', index: k, newValue: auxArray[i] });
    mainArray[k++] = auxArray[i++];
  }

  while (j <= end) {
    animations.push({ type: 'compare', indices: [j, j] });
    animations.push({ type: 'overwrite', index: k, newValue: auxArray[j] });
    mainArray[k++] = auxArray[j++];
  }
}
