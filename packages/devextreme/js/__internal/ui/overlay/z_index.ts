import { ensureDefined } from '@js/core/utils/common';

let baseZIndex = 1500;
let zIndexStack: number[] = [];

export const base = (zIndex?: number): number => {
  baseZIndex = ensureDefined(zIndex, baseZIndex);

  return baseZIndex;
};

export const create = (baseIndex = baseZIndex): number => {
  const { length } = zIndexStack;
  const index: number = (length ? zIndexStack[length - 1] : baseIndex) + 1;

  zIndexStack.push(index);

  return index;
};

export const remove = (zIndex: number): void => {
  const position = zIndexStack.indexOf(zIndex);

  if (position >= 0) {
    zIndexStack.splice(position, 1);
  }
};

export const isLastZIndexInStack = (zIndex: number): boolean => {
  if (zIndexStack.length) {
    return zIndexStack[zIndexStack.length - 1] === zIndex;
  }

  return false;
};

export const clearStack = (): void => {
  zIndexStack = [];
};
