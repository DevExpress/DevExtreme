import { ensureDefined } from "../../core/utils/common";

let base_ZIndex = 1500;
let ZIndexStack = [];

export const base = (ZIndex) => {
    base_ZIndex = ensureDefined(ZIndex, base_ZIndex);
    return base_ZIndex;
};

export const create = (baseIndex) => {
    const length = ZIndexStack.length;
    const index = length ? ZIndexStack[length - 1] + 1 : (baseIndex || base()) + 1;

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
