import { ensureDefined } from "../../core/utils/common";

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
    for(let i = 0; i < zIndexStack.length; i++) {
        if(zIndexStack[i] === zIndex) {
            zIndexStack.splice(i, 1);
            break;
        }
    }
};

export const clearStack = () => {
    zIndexStack = [];
};
