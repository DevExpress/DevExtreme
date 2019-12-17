var patchFontOptions = require('../core/utils').patchFontOptions,

    SLIDER_MARKER_UPDATE_DELAY = 75,
    POINTER_SIZE = require('./common').consts.pointerSize;

function SliderMarker(renderer, root, isLeftPointer) {
    var that = this;
    that._isLeftPointer = isLeftPointer;
    that._isOverlapped = false;

    that._group = renderer.g().attr({ 'class': 'slider-marker' }).append(root);
    that._area = renderer.path(null, 'area').append(that._group);
    that._label = renderer.text().attr({ align: 'left' }).append(that._group);
    that._tracker = renderer.rect().attr({ 'class': 'slider-marker-tracker', fill: '#000000', opacity: 0.0001 }).css({ cursor: 'pointer' }).append(that._group);
    that._border = renderer.rect(0, 0, 1, 0);
}

SliderMarker.prototype = {
    constructor: SliderMarker,

    _getRectSize: function(textSize) {
        return {
            width: Math.round(2 * this._paddingLeftRight + textSize.width),
            height: Math.round(2 * this._paddingTopBottom + textSize.height)
        };
    },

    _getTextSize: function() {
        var textSize = this._label.getBBox();
        if(!this._textHeight && isFinite(textSize.height)) {
            this._textHeight = textSize.height;
        }
        return {
            width: textSize.width,
            height: this._textHeight,
            y: textSize.y
        };
    },

    _getAreaPointsInfo: function(textSize) {
        var that = this,
            rectSize = that._getRectSize(textSize),
            rectWidth = rectSize.width,
            rectHeight = rectSize.height,
            rectLeftBorder = -rectWidth,
            rectRightBorder = 0,
            pointerRightPoint = POINTER_SIZE,
            pointerCenterPoint = 0,
            pointerLeftPoint = -POINTER_SIZE,
            position = that._position,
            isLeft = that._isLeftPointer,
            correctCloudBorders = function() {
                rectLeftBorder++;
                rectRightBorder++;
                pointerRightPoint++;
                pointerCenterPoint++;
                pointerLeftPoint++;
            },
            checkPointerBorders = function() {
                if(pointerRightPoint > rectRightBorder) {
                    pointerRightPoint = rectRightBorder;
                } else {
                    if(pointerLeftPoint < rectLeftBorder) {
                        pointerLeftPoint = rectLeftBorder;
                    }
                }

                isLeft && correctCloudBorders();
            },
            borderPosition = position;

        if(isLeft) {
            if(position > that._range[1] - rectWidth) {
                rectRightBorder = -position + that._range[1];
                rectLeftBorder = rectRightBorder - rectWidth;
                checkPointerBorders();
                borderPosition += rectLeftBorder;
            } else {
                rectLeftBorder = pointerLeftPoint = 0;
                rectRightBorder = rectWidth;
            }
        } else {
            if(position - that._range[0] < rectWidth) {
                rectLeftBorder = -(position - that._range[0]);
                rectRightBorder = rectLeftBorder + rectWidth;
                checkPointerBorders();
                borderPosition += rectRightBorder;
            } else {
                pointerRightPoint = 0;
                correctCloudBorders();
            }
        }

        that._borderPosition = borderPosition;

        return {
            offset: rectLeftBorder,
            isCut: (!isLeft || pointerCenterPoint !== pointerLeftPoint) && (isLeft || pointerCenterPoint !== pointerRightPoint),
            points: [
                rectLeftBorder, 0,
                rectRightBorder, 0,
                rectRightBorder, rectHeight,
                pointerRightPoint, rectHeight,
                pointerCenterPoint, rectHeight + POINTER_SIZE,
                pointerLeftPoint, rectHeight,
                rectLeftBorder, rectHeight
            ]
        };
    },

    _update: function() {
        var that = this,
            textSize,
            currentTextSize,
            rectSize;

        clearTimeout(that._timeout);

        that._label.attr({ text: that._text || '' });

        currentTextSize = that._getTextSize();
        rectSize = that._getRectSize(currentTextSize);

        textSize = that._textSize || currentTextSize;
        textSize = that._textSize = (currentTextSize.width > textSize.width || currentTextSize.height > textSize.height) ? currentTextSize : textSize;
        that._timeout = setTimeout(function() {
            updateSliderMarker(currentTextSize, rectSize);
            that._textSize = currentTextSize;
        }, SLIDER_MARKER_UPDATE_DELAY);

        function updateSliderMarker(size, rectSize) {
            var points,
                pointsData,
                offset;

            rectSize = rectSize || that._getRectSize(size);
            that._group.attr({ translateY: -(rectSize.height + POINTER_SIZE) });
            pointsData = that._getAreaPointsInfo(size);
            points = pointsData.points;
            offset = pointsData.offset;
            that._area.attr({ points: points });
            that._border.attr({ x: that._isLeftPointer ? points[0] - 1 : points[2], height: pointsData.isCut ? rectSize.height : rectSize.height + POINTER_SIZE });
            that._tracker.attr({ translateX: offset, width: rectSize.width, height: rectSize.height + POINTER_SIZE });
            that._label.attr({ translateX: that._paddingLeftRight + offset, translateY: rectSize.height / 2 - (size.y + size.height / 2) });
        }

        updateSliderMarker(textSize);
    },

    setText: function(value) {
        this._text = value;
    },

    setPosition: function(position) {
        this._position = position;
        this._update();
    },

    applyOptions: function(options, screenRange) {
        var that = this;
        that._range = screenRange;
        that._paddingLeftRight = options.paddingLeftRight;
        that._paddingTopBottom = options.paddingTopBottom;
        that._textHeight = null;
        that._colors = [options.invalidRangeColor, options.color];
        that._area.attr({ fill: options.color });
        that._border.attr({ fill: options.borderColor });
        that._label.css(patchFontOptions(options.font));
        that._update();
    },

    getTracker: function() {
        return this._tracker;
    },

    setValid: function(isValid) {
        this._area.attr({ fill: this._colors[Number(isValid)] });
    },

    setColor: function(color) {
        this._area.attr({ fill: color });
    },

    dispose: function() {
        clearTimeout(this._timeout);
    },

    setOverlapped: function(isOverlapped) {
        var that = this;
        if(that._isOverlapped !== isOverlapped) {
            if(isOverlapped) {
                that._border.append(that._group);
            } else {
                that._isOverlapped && that._border.remove();
            }
            that._isOverlapped = isOverlapped;
        }
    },

    getBorderPosition: function() {
        return this._borderPosition;
    }
};

module.exports = SliderMarker;
