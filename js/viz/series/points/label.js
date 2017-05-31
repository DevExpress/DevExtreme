"use strict";

var $ = require("../../../core/renderer"),
    _format = require("../../core/format"),
    vizUtils = require("../../core/utils"),
    _degreesToRadians = vizUtils.degreesToRadians,
    _patchFontOptions = vizUtils.patchFontOptions,
    _round = Math.round,
    _floor = Math.floor,
    _getCosAndSin = vizUtils.getCosAndSin,
    _rotateBBox = vizUtils.rotateBBox,

    LABEL_BACKGROUND_PADDING_X = 8,
    LABEL_BACKGROUND_PADDING_Y = 4;

function getClosestCoord(point, coords) {
    var closestDistance = Infinity,
        closestCoord;
    $.each(coords, function(_, coord) {
        var x = point[0] - coord[0],
            y = point[1] - coord[1],
            distance = x * x + y * y;
        if(distance < closestDistance) {
            closestDistance = distance;
            closestCoord = coord;
        }
    });
    return closestCoord;
}

// We could always conside center of label as label point (with appropriate connector path clipping). In that case we do not depend neither on background nor on rotation.

var barPointStrategy = {
    // TODO: Use center of label (not left top corner) for checking if label is inside
    isLabelInside: function(labelPoint, figure) {
        return labelPoint.x >= figure.x && labelPoint.x <= figure.x + figure.width && labelPoint.y >= figure.y && labelPoint.y <= figure.y + figure.height;
    },

    prepareLabelPoints: function(points) {
        return points;
    },

    getFigureCenter: function(figure) {
        return [figure.x + figure.width / 2, figure.y + figure.height / 2];
    },

    findFigurePoint: function(figure, labelPoint) {
        var figureCenter = barPointStrategy.getFigureCenter(figure),
            point = getClosestCoord(labelPoint, [
                [figure.x, figureCenter[1]],
                [figureCenter[0], figure.y + figure.height],
                [figure.x + figure.width, figureCenter[1]],
                [figureCenter[0], figure.y]
            ]);
        return [_round(point[0]), _round(point[1])];
    }
};

var symbolPointStrategy = {
    isLabelInside: function() {
        return false;
    },

    prepareLabelPoints: barPointStrategy.prepareLabelPoints,

    getFigureCenter: function(figure) {
        return [figure.x, figure.y];
    },

    findFigurePoint: function(figure, labelPoint) {
        var angle = Math.atan2(figure.y - labelPoint[1], labelPoint[0] - figure.x);
        return [_round(figure.x + figure.r * Math.cos(angle)), _round(figure.y - figure.r * Math.sin(angle))];
    }
};

var piePointStrategy = {
    isLabelInside: function(_0, _1, isOutside) {
        return !isOutside;
    },

    prepareLabelPoints: function(points, center, angle) {
        var rotatedPoints = [],
            x0 = center[0],
            y0 = center[1],
            cosSin = _getCosAndSin(angle || 0);
        $.each(points, function(_, point) {
            rotatedPoints.push([
                _round(((point[0] - x0) * cosSin.cos + (point[1] - y0) * cosSin.sin) + x0),
                _round((-(point[0] - x0) * cosSin.sin + (point[1] - y0) * cosSin.cos) + y0)
            ]);
        });
        return rotatedPoints;
    },

    getFigureCenter: symbolPointStrategy.getFigureCenter,

    findFigurePoint: function(figure, labelPoint) {
        var x = figure.x + (figure.y - labelPoint[1]) / Math.tan(_degreesToRadians(figure.angle)),
            point = [figure.x, figure.y];
        if((figure.x <= x && x <= labelPoint[0]) || (figure.x >= x && x >= labelPoint[0])) {
            point.push(_round(x), labelPoint[1]);
        }
        return point;
    }
};

function selectStrategy(figure) {
    return (figure.angle !== undefined && piePointStrategy) || (figure.r !== undefined && symbolPointStrategy) || barPointStrategy;
}

function disposeItem(obj, field) {
    obj[field] && obj[field].dispose();
    obj[field] = null;
}

function checkBackground(background) {
    return background && ((background.fill && background.fill !== "none") || (background["stroke-width"] > 0 && background.stroke && background.stroke !== "none"));
}

function checkConnector(connector) {
    return connector && connector["stroke-width"] > 0 && connector.stroke && connector.stroke !== "none";
}

function formatText(data, options) {
    data.valueText = _format(data.value, options);
    data.argumentText = _format(data.argument, { format: options.argumentFormat, precision: options.argumentPrecision /* DEPRECATED_16_1 */ });
    if(data.percent !== undefined) {
        data.percentText = _format(data.percent, { format: { type: "percent", precision: (options.format && options.format.percentPrecision) || options.percentPrecision /* DEPRECATED_16_1 */ } });
    }
    if(data.total !== undefined) {
        data.totalText = _format(data.total, options);
    }
    if(data.openValue !== undefined) {
        data.openValueText = _format(data.openValue, options);
    }
    if(data.closeValue !== undefined) {
        data.closeValueText = _format(data.closeValue, options);
    }
    if(data.lowValue !== undefined) {
        data.lowValueText = _format(data.lowValue, options);
    }
    if(data.highValue !== undefined) {
        data.highValueText = _format(data.highValue, options);
    }
    if(data.reductionValue !== undefined) {
        data.reductionValueText = _format(data.reductionValue, options);
    }

    return options.customizeText ? options.customizeText.call(data, data) : data.valueText;
}

function Label(renderSettings) {
    this._renderer = renderSettings.renderer;
    this._container = renderSettings.labelsGroup;
    this._point = renderSettings.point;
}

Label.prototype = {
    constructor: Label,

    _setVisibility: function(value, state) {
        this._group && this._group.attr({ visibility: value });
        this._visible = state;
    },

    // The following method is required because we support partial visibility for labels
    // entire labels group can be hidden and any particular label can be visible at the same time
    // in order to do that label must have visibility:"visible" attribute
    clearVisibility: function() {
        this._setVisibility(null, true);
    },

    hide: function() {
        this._setVisibility("hidden", false);
    },

    show: function() {
        var that = this;
        if(that._point.hasValue()) {
            that._draw();
            that._point.correctLabelPosition(that);
        }
    },

    isVisible: function() {
        return this._visible;
    },

    setColor: function(color) {
        this._color = color;
    },

    setOptions: function(options) {
        this._options = options;
    },

    setData: function(data) {
        this._data = data;
    },

    setDataField: function(fieldName, fieldValue) {
        // Is this laziness really required?
        this._data = this._data || {};
        this._data[fieldName] = fieldValue;
    },

    getData: function() {
        return this._data;
    },

    setFigureToDrawConnector: function(figure) {
        this._figure = figure;
    },

    dispose: function() {
        var that = this;
        disposeItem(that, "_group");
        that._data = that._options = that._textContent = that._visible = that._insideGroup = that._text = that._background = that._connector = that._figure = null;
    },

    _draw: function() {
        var that = this,
            renderer = that._renderer,
            container = that._container,
            options = that._options || {},
            text = that._textContent = formatText(that._data, that._options) || null;
        that.clearVisibility();
        if(text) {
            if(!that._group) {
                that._group = renderer.g().append(container);
                that._insideGroup = renderer.g().append(that._group);
                that._text = renderer.text("", 0, 0).append(that._insideGroup);
            }
            that._text.css(options.attributes ? _patchFontOptions(options.attributes.font) : {});

            if(checkBackground(options.background)) {
                that._background = that._background || renderer.rect().append(that._insideGroup).toBackground();
                that._background.attr(options.background);
                // The following is because "this._options" is shared between all labels and so cannot be modified
                that._color && that._background.attr({ fill: that._color });
            } else {
                disposeItem(that, "_background");
            }

            if(checkConnector(options.connector)) {
                that._connector = that._connector || renderer.path([], "line").sharp().append(that._group).toBackground();
                that._connector.attr(options.connector);
                // The following is because "this._options" is shared between all labels and so cannot be modified
                that._color && that._connector.attr({ stroke: that._color });
            } else {
                disposeItem(that, "_connector");
            }

            that._text.attr({ text: text });
            that._updateBackground(that._text.getBBox());
            that._setVisibility("visible", true);
        } else {
            that.hide();
        }
        return that;
    },

    _updateBackground: function(bBox) {
        var that = this;

        that._textSize = [bBox.width, bBox.height];
        if(that._background) {
            bBox.x -= LABEL_BACKGROUND_PADDING_X;
            bBox.y -= LABEL_BACKGROUND_PADDING_Y;
            bBox.width += 2 * LABEL_BACKGROUND_PADDING_X;
            bBox.height += 2 * LABEL_BACKGROUND_PADDING_Y;
            that._background.attr(bBox);
        }
        if(that._options.rotationAngle) {
            that._insideGroup.rotate(that._options.rotationAngle, bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
            // Angle is transformed from svg to right-handed cartesian space
            bBox = _rotateBBox(bBox, [bBox.x + bBox.width / 2, bBox.y + bBox.height / 2], -that._options.rotationAngle);
        }
        that._bBox = bBox;
    },

    _getConnectorPoints: function() {
        var that = this,
            figure = that._figure,
            strategy = selectStrategy(figure),
            bBox = that.getBoundingRect(),
            labelPoint,
            figurePoint,
            xc,
            yc,
            points = [];
        if(!strategy.isLabelInside(bBox, figure, that._options.position !== "inside")) {
            xc = bBox.x + bBox.width / 2;
            yc = bBox.y + bBox.height / 2;
            points = strategy.prepareLabelPoints([
                    [xc, yc - that._textSize[1] / 2],
                    [xc + that._textSize[0] / 2, yc],
                    [xc, yc + that._textSize[1] / 2],
                    [xc - that._textSize[0] / 2, yc]
            ],
                [xc, yc], -that._options.rotationAngle || 0);
            labelPoint = getClosestCoord(strategy.getFigureCenter(figure), points);
            labelPoint = [_floor(labelPoint[0]), _floor(labelPoint[1])];
            figurePoint = strategy.findFigurePoint(figure, labelPoint);
            points = figurePoint.concat(labelPoint);
        }
        return points;
    },

    // TODO: Should not be called when not invisible (check for "_textContent" is to be removed)
    fit: function(maxWidth) {
        this._text && this._text.applyEllipsis(maxWidth);
        this._updateBackground(this._text.getBBox());
    },
    setTrackerData: function(point) {
        this._text.data({ "chart-data-point": point });
        this._background && this._background.data({ "chart-data-point": point });
    },

    // TODO: Should not be called when not invisible (check for "_textContent" is to be removed)
    shift: function(x, y) {
        var that = this;
        if(that._textContent) {
            that._insideGroup.attr({
                translateX: (that._x = _round(x - that._bBox.x)),
                translateY: (that._y = _round(y - that._bBox.y))
            });
            if(that._connector) {
                that._connector.attr({ points: that._getConnectorPoints() });
            }
        }
        return that;
    },

    // TODO: Should not be called when not invisible (check for "_textContent" is to be removed)
    getBoundingRect: function() {
        var bBox = this._bBox;
        return this._textContent ? {
            x: bBox.x + this._x,
            y: bBox.y + this._y,
            width: bBox.width,
            height: bBox.height
        } : {};
    },

    getLayoutOptions: function() {
        var options = this._options;
        return {
            alignment: options.alignment,
            background: checkBackground(options.background),
            horizontalOffset: options.horizontalOffset,
            verticalOffset: options.verticalOffset,
            radialOffset: options.radialOffset,
            position: options.position
        };
    }
};

exports.Label = Label;

///#DEBUG
Label._DEBUG_formatText = formatText;
///#ENDDEBUG
