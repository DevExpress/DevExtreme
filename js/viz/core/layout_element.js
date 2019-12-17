var noop = require('../../core/utils/common').noop,
    _round = Math.round,
    objectUtils = require('../../core/utils/object'),
    defaultOffset = {
        horizontal: 0,
        vertical: 0
    },
    alignFactors = {
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
        var that = this,
            ofBBox = options.of.getLayoutOptions(),
            myBBox = that.getLayoutOptions(),
            at = options.at,
            my = options.my,
            offset = options.offset || defaultOffset,
            shiftX = -alignFactors[my.horizontal] * myBBox.width + ofBBox.x + alignFactors[at.horizontal] * ofBBox.width + parseInt(offset.horizontal),
            shiftY = -alignFactors[my.vertical] * myBBox.height + ofBBox.y + alignFactors[at.vertical] * ofBBox.height + parseInt(offset.vertical);

        that.shift(_round(shiftX), _round(shiftY));
    },
    getLayoutOptions: noop
};

function WrapperLayoutElement(renderElement, bBox) {
    this._renderElement = renderElement;
    this._cacheBBox = bBox;
}

var wrapperLayoutElementPrototype = WrapperLayoutElement.prototype = objectUtils.clone(LayoutElement.prototype);

wrapperLayoutElementPrototype.constructor = WrapperLayoutElement;

wrapperLayoutElementPrototype.getLayoutOptions = function() {
    return this._cacheBBox || this._renderElement.getBBox();
};
wrapperLayoutElementPrototype.shift = function(shiftX, shiftY) {
    var bBox = this.getLayoutOptions();
    this._renderElement.move(_round(shiftX - bBox.x), _round(shiftY - bBox.y));
};

exports.LayoutElement = LayoutElement;
exports.WrapperLayoutElement = WrapperLayoutElement;
