import { ensureDefined } from '@js/core/utils/common';

let baseZIndex = 1500;
let zIndexStack: number[] = [];

export const base = (ZIndex?: number) => {
  baseZIndex = ensureDefined(ZIndex, baseZIndex);
  return baseZIndex;
};

export const create = (baseIndex = baseZIndex) => {
  const { length } = zIndexStack;
  const index: number = (length ? zIndexStack[length - 1] : baseIndex) + 1;

  zIndexStack.push(index);

  return index;
};

export const remove = (zIndex) => {
  const position = zIndexStack.indexOf(zIndex);
  if (position >= 0) {
    zIndexStack.splice(position, 1);
  }
};

export const isLastZIndexInStack = (zIndex) => zIndexStack.length && zIndexStack[zIndexStack.length - 1] === zIndex;

export const clearStack = () => {
  zIndexStack = [];
};
