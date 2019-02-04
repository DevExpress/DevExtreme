import { ensureDefined } from "../../core/utils/common";

let baseZIndex = 1500;
let ZIndexStack = [];

export const base = (ZIndex) => {
    baseZIndex = ensureDefined(ZIndex, baseZIndex);
    return baseZIndex;
};

export const create = (baseIndex = baseZIndex) => {
    const length = ZIndexStack.length;
    const index = (length ? ZIndexStack[length - 1] : baseIndex) + 1;

    ZIndexStack.push(index);

    return index;
};

export const remove = (zIndex) => {
    ZIndexStack.forEach((index, position) => {
        if(index === zIndex) {
            ZIndexStack.splice(position, 1);
            return false;
        }
    });
};

export const clearStack = () => {
    ZIndexStack = [];
};
