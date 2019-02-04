let BASE_ZINDEX = 1500;
let ZIndexStack = [];

export const baseZIndex = (ZIndex) => {
    BASE_ZINDEX = ZIndex || BASE_ZINDEX;
    return BASE_ZINDEX;
};

export const createNewZIndex = (baseIndex) => {
    const length = ZIndexStack.length;
    const index = length ? ZIndexStack[length - 1] + 1 : (baseIndex || baseZIndex()) + 1;

    ZIndexStack.push(index);

    return index;
};

export const removeZIndex = (zIndex) => {
    ZIndexStack.forEach((index, position) => {
        if(index === zIndex) {
            ZIndexStack.splice(position, 1);
            return false;
        }
    });
};

export const clearZIndexStack = () => {
    ZIndexStack = [];
};
