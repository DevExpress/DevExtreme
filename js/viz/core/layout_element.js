const noop = require('../../core/utils/common').noop;
const _round = Math.round;
const objectUtils = require('../../core/utils/object');
const defaultOffset = {
    horizontal: 0,
    vertical: 0
};
const alignFactors = {
    center: 0.5,
    right: 1,
    bottom: 1,
    left: 0,
    top: 0
};

function LayoutElement(options) {
    this._options = options;
}

LayoutElement.prototype = {
    constructor: LayoutElement,
    position: function(options) {
        const that = this;
        const ofBBox = options.of.getLayoutOptions();
        const myBBox = that.getLayoutOptions();
        const at = options.at;
        const my = options.my;
        const offset = options.offset || defaultOffset;
        const shiftX = -alignFactors[my.horizontal] * myBBox.width + ofBBox.x + alignFactors[at.horizontal] * ofBBox.width + parseInt(offset.horizontal);
        const shiftY = -alignFactors[my.vertical] * myBBox.height + ofBBox.y + alignFactors[at.vertical] * ofBBox.height + parseInt(offset.vertical);

        that.shift(_round(shiftX), _round(shiftY));
    },
    getLayoutOptions: noop
};

function WrapperLayoutElement(renderElement, bBox) {
    this._renderElement = renderElement;
    this._cacheBBox = bBox;
}

const wrapperLayoutElementPrototype = WrapperLayoutElement.prototype = objectUtils.clone(LayoutElement.prototype);

wrapperLayoutElementPrototype.constructor = WrapperLayoutElement;

wrapperLayoutElementPrototype.getLayoutOptions = function() {
    return this._cacheBBox || this._renderElement.getBBox();
};
wrapperLayoutElementPrototype.shift = function(shiftX, shiftY) {
    const bBox = this.getLayoutOptions();
    this._renderElement.move(_round(shiftX - bBox.x), _round(shiftY - bBox.y));
};

exports.LayoutElement = LayoutElement;
exports.WrapperLayoutElement = WrapperLayoutElement;
