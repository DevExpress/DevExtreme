import { ensureDefined } from '@js/core/utils/common';

let baseZIndex = 1500;
let zIndexStack: number[] = [];
let globalInstanceZIndex = baseZIndex;

export const base = (zIndex?: number): number => {
  baseZIndex = ensureDefined(zIndex, baseZIndex);

  if (globalInstanceZIndex < baseZIndex) {
    globalInstanceZIndex = baseZIndex;
  }

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
    globalInstanceZIndex -= 1;
  }
};

export const isLastZIndexInStack = (zIndex: number): boolean => {
  if (zIndexStack.length) {
    return zIndexStack[zIndexStack.length - 1] === zIndex;
  }

  return false;
};

export const reset = (): void => {
  zIndexStack = [];
  globalInstanceZIndex = baseZIndex;
};

export const createInstanceZIndex = (baseIndex = baseZIndex): number => {
  const { length } = zIndexStack;
  const maxFromStack = length ? zIndexStack[length - 1] : baseIndex;

  if (globalInstanceZIndex < maxFromStack) {
    globalInstanceZIndex = maxFromStack;
  }

  if (globalInstanceZIndex < baseIndex) {
    globalInstanceZIndex = baseIndex;
  }

  globalInstanceZIndex += 1;

  return globalInstanceZIndex;
};

export const push = (zIndex: number): void => {
  if (zIndexStack.includes(zIndex)) {
    return;
  }

  const position = zIndexStack.findIndex((value) => value > zIndex);

  if (position === -1) {
    zIndexStack.push(zIndex);
  } else {
    zIndexStack.splice(position, 0, zIndex);
  }
};
