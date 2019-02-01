import $ from "../../core/renderer";
import { getWindow } from "../../core/utils/window";

const WINDOW_HEIGHT_PERCENT = 0.9;

let BASE_ZINDEX = 1500;
let ZIndexStack = [];

const getElementMaxHeightByWindow = $element => {
    const window = getWindow(),
        offsetTop = $element.offset().top - $(window).scrollTop(),
        offsetBottom = $(window).innerHeight() - offsetTop - $element.outerHeight();

    return Math.max(offsetTop, offsetBottom) * WINDOW_HEIGHT_PERCENT;
};

const baseZIndex = (ZIndex) => {
    if(!ZIndex) {
        return BASE_ZINDEX;
    }
    BASE_ZINDEX = ZIndex;
};

const createNewZIndex = (baseIndex) => {
    const length = ZIndexStack.length;
    const index = length ? ZIndexStack[length - 1] + 1 : (baseIndex || baseZIndex()) + 1;

    ZIndexStack.push(index);

    return index;
};

const removeZIndex = (zIndex) => {
    ZIndexStack.forEach(function(index, position) {
        if(index === zIndex) {
            ZIndexStack.splice(position, 1);
            return false;
        }
    });
};

const clearZIndexStack = () => {
    ZIndexStack = [];
};

export { getElementMaxHeightByWindow, createNewZIndex, baseZIndex, clearZIndexStack, removeZIndex };
