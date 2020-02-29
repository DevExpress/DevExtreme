import { ensureDefined } from '../../core/utils/common';

let baseZIndex = 1500;
let zIndexStack = [];

export const base = (ZIndex) => {
    baseZIndex = ensureDefined(ZIndex, baseZIndex);
    return baseZIndex;
};

export const create = (baseIndex = baseZIndex) => {
    const length = zIndexStack.length;
    const index = (length ? zIndexStack[length - 1] : baseIndex) + 1;

    zIndexStack.push(index);

    return index;
};

export const remove = (zIndex) => {
    const position = zIndexStack.indexOf(zIndex);
    if(position >= 0) {
        zIndexStack.splice(position, 1);
    }
};

export const clearStack = () => {
    zIndexStack = [];
};
