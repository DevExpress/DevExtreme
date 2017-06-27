"use strict";

var vizUtils = require("../core/utils"),
    commonUtils = require("../../core/utils/common"),
    isNumeric = require("../../core/utils/type").isNumeric,
    extend = require("../../core/utils/extend").extend,
    constants = require("./axes_constants"),
    circularAxes,
    xyAxesLinear = require("./xy_axes").linear,
    polarAxes,
    _map = vizUtils.map,

    _math = Math,
    _abs = _math.abs,
    _round = _math.round,
    convertPolarToXY = vizUtils.convertPolarToXY,

    _extend = extend,
    _noop = commonUtils.noop,

    HALF_PI_ANGLE = 90;

function getPolarQuarter(angle) {
    var quarter;

    angle = vizUtils.normalizeAngle(angle);

    if((angle >= 315 && angle <= 360) || (angle < 45 && angle >= 0)) {
        quarter = 1;
    } else if(angle >= 45 && angle < 135) {
        quarter = 2;
    } else if(angle >= 135 && angle < 225) {
        quarter = 3;
    } else if(angle >= 225 && angle < 315) {
        quarter = 4;
    }

    return quarter;
}

polarAxes = exports;

circularAxes = polarAxes.circular = {
    _createAxisElement: function() {
        var additionalTranslator = this._additionalTranslator;
        return this._renderer.circle(additionalTranslator.getCenter().x, additionalTranslator.getCenter().y, additionalTranslator.getRadius());
    },

    _setBoundingRect: function() {
        this.boundingRect = { width: 0, height: 0 };
    },

    _boundaryTicksVisibility: {
        min: true
    },

    _getSpiderCategoryOption: function() { //TODO rename spider
        return this._options.firstPointOnStartAngle;
    },

    _getMinMax: function() {
        var options = this._options,
            min = isNumeric(options.originValue) ? options.originValue : undefined,
            max;

        if(options.period > 0 && options.argumentType === constants.numeric) {
            min = min || 0;
            max = min + options.period;
        }

        return { min: min, max: max };
    },

    _getStick: function() {
        return this._options.firstPointOnStartAngle || (this._options.type !== constants.discrete);
    },

    _getTranslatedCoord: function(value, offset) {
        return this._translator.translate(value, offset) - HALF_PI_ANGLE;
    },

    _getCanvasStartEnd: function() {
        return {
            start: 0 - HALF_PI_ANGLE,
            end: 360 - HALF_PI_ANGLE
        };
    },

    _createStrip: function(fromAngle, toAngle, attr) {
        var center = this._additionalTranslator.getCenter(),
            r = this._additionalTranslator.getRadius();

        return this._renderer.arc(center.x, center.y, 0, r, -toAngle, -fromAngle).attr(attr);
    },

    _getStripLabelCoords: function(_, stripFrom, stripTo) {
        var that = this,
            angle = stripFrom + (stripTo - stripFrom) / 2,
            cosSin = vizUtils.getCosAndSin(-angle),
            halfRad = that._additionalTranslator.getRadius() / 2,
            center = that._additionalTranslator.getCenter(),
            x = _round(center.x + halfRad * cosSin.cos),
            y = _round(center.y - halfRad * cosSin.sin);

        return { x: x, y: y, align: constants.center };
    },

    _createConstantLine: function(value, attr) {
        var center = this._additionalTranslator.getCenter(),
            r = this._additionalTranslator.getRadius();

        return this._createPathElement([center.x, center.y, center.x + r, center.y], attr)
            .rotate(value, center.x, center.y);
    },

    _getConstantLineLabelsCoords: function(value) {
        var that = this,
            cosSin = vizUtils.getCosAndSin(-value),
            halfRad = that._additionalTranslator.getRadius() / 2,
            center = that._additionalTranslator.getCenter(),
            x = _round(center.x + halfRad * cosSin.cos),
            y = _round(center.y - halfRad * cosSin.sin);

        return { x: x, y: y, align: constants.center };
    },

    _checkAlignmentConstantLineLabels: _noop,

    _getScreenDelta: function() {
        var tr = this._additionalTranslator,
            angles = tr.getAngles();
        return _abs(angles[0] - angles[1]) * tr.getRadius() * Math.PI / 180;
    },

    _getTickCoord: function(tick) {
        var center = this._additionalTranslator.getCenter(),
            r = this._additionalTranslator.getRadius(),
            corrections = {
                inside: -1,
                center: -0.5,
                outside: 0
            },
            tickCorrection = tick.length * corrections[this._options.tickOrientation || "center"],
            radiusWithTicks = r + tickCorrection;
        return {
            x1: center.x + radiusWithTicks, y1: center.y,
            x2: center.x + radiusWithTicks + tick.length, y2: center.y, angle: tick.angle
        };
    },

    _getLabelAdjustedCoord: function(tick) {
        var that = this,
            pos = tick.labelPos,
            cosSin = vizUtils.getCosAndSin(pos.angle),
            cos = cosSin.cos,
            sin = cosSin.sin,
            box = tick.label.getBBox(),
            halfWidth = box.width / 2,
            halfHeight = box.height / 2,
            indentFromAxis = that._options.label.indentFromAxis || 0,
            x = pos.x + indentFromAxis * cos,
            y = pos.y + (pos.y - box.y - halfHeight) + indentFromAxis * sin;

        switch(getPolarQuarter(pos.angle)) {
            case 1:
                x += halfWidth;
                y += halfHeight * sin;
                break;
            case 2:
                x += halfWidth * cos;
                y += halfHeight;
                break;
            case 3:
                x += -halfWidth;
                y += halfHeight * sin;
                break;
            case 4:
                x += halfWidth * cos;
                y += -halfHeight;
                break;
        }

        return { x: x, y: y };
    },

    _getGridLineDrawer: function() {
        var that = this,
            r = that._additionalTranslator.getRadius(),
            center = that._additionalTranslator.getCenter();

        return function(tick) {
            return that._createPathElement([center.x, center.y, center.x + r, center.y], tick.gridStyle)
                .rotate(tick.angle, center.x, center.y);
        };
    },

    _getTranslatedValue: function(value, _, offset) {
        var additionalTranslator = this._additionalTranslator,
            startAngle = additionalTranslator.getAngles()[0],
            angle = this._translator.translate(value, -offset),
            coords = convertPolarToXY(additionalTranslator.getCenter(), startAngle, angle, additionalTranslator.translate(constants.canvasPositionBottom));

        return { x: coords.x, y: coords.y, angle: angle + startAngle - HALF_PI_ANGLE };
    },

    _getAdjustedStripLabelCoords: function(strip) {
        var box = strip.label.getBBox();

        return {
            x: 0,
            y: strip.label.attr("y") - box.y - box.height / 2
        };
    },

    coordsIn: function(x, y) {
        return vizUtils.convertXYToPolar(this._additionalTranslator.getCenter(), x, y).r > this._additionalTranslator.getRadius();
    },

    _rotateTick: function(tick, angle) {
        var center = this._additionalTranslator.getCenter();
        tick.graphic.rotate(angle, center.x, center.y);
    },

    _validateOverlappingMode: function(mode) {
        return constants.validateOverlappingMode(mode);
    },

    _validateDisplayMode: function() {
        return "standard";
    },

    _getStep: function(boxes) {
        var that = this,
            radius = that._additionalTranslator.getRadius() + that._options.label.indentFromAxis,
            maxLabelBox = boxes.reduce(function(prevValue, box) {
                var curValue = prevValue;
                if(prevValue.width < box.width) {
                    curValue.width = box.width;
                }
                if(prevValue.height < box.height) {
                    curValue.height = box.height;
                }
                return curValue;
            }, { width: 0, height: 0 }),
            angle1 = _abs(2 * (_math.atan(maxLabelBox.height / (2 * radius - maxLabelBox.width))) * 180 / _math.PI),
            angle2 = _abs(2 * (_math.atan(maxLabelBox.width / (2 * radius - maxLabelBox.height))) * 180 / _math.PI);

        return constants.getTicksCountInRange(that._majorTicks, "angle", _math.max(angle1, angle2));
    },

    _checkBoundedLabelsOverlapping: function(step, majorTicks, boxes) {
        var lastVisibleLabelIndex = _math.floor((boxes.length - 1) / step) * step,
            labelOpt = this._options.label;
        if(!lastVisibleLabelIndex) {
            return;
        }
        if(constants.areLabelsOverlap(boxes[0], boxes[lastVisibleLabelIndex], labelOpt.minSpacing)) {
            labelOpt.overlappingBehavior.hideFirstOrLast === "first" ? majorTicks[0].label.remove() : majorTicks[lastVisibleLabelIndex].label.remove();
        }
    }
};

exports.circularSpider = _extend({}, circularAxes, {
    _createAxisElement: function() {
        var points = _map(this.getSpiderTicks(), function(tick) {
            return { x: tick.posX, y: tick.posY };
        });

        return this._renderer.path(points, "area");
    },

    _getStick: function() {
        return true;
    },

    _getSpiderCategoryOption: function() {
        return true;
    },

    getSpiderTicks: function() {
        var that = this;

        that._spiderTicks = constants.convertValuesToTicks(that._tickManager.getFullTicks());
        that._initTicks(that._spiderTicks, { tickStyle: {}, gridStyle: {} }, false, that._getSkippedCategory(), that._tickOffset);
        return that._spiderTicks;
    },

    _createStrip: function(fromAngle, toAngle, attr) {
        var center = this._additionalTranslator.getCenter(),
            spiderTicks = this.getSpiderTicks(),
            firstTick,
            lastTick,
            nextTick,
            tick,
            points = [],
            i = 0,
            len = spiderTicks.length;

        while(i < len) {
            tick = spiderTicks[i];
            if(tick.angle >= fromAngle && tick.angle <= toAngle) {
                if(!firstTick) {
                    firstTick = spiderTicks[i - 1] || spiderTicks[spiderTicks.length - 1];
                    points.push((tick.posX + firstTick.posX) / 2, (tick.posY + firstTick.posY) / 2);
                }
                points.push(tick.posX, tick.posY);
                nextTick = spiderTicks[i + 1] || spiderTicks[0];
                lastTick = ({ x: (tick.posX + nextTick.posX) / 2, y: (tick.posY + nextTick.posY) / 2 });
            }
            i++;
        }


        points.push(lastTick.x, lastTick.y);
        points.push(center.x, center.y);
        return this._renderer.path(points, "area").attr(attr);
    },

    _getTranslatedCoord: function(value, offset) {
        return this._translator.translate(value, offset) - HALF_PI_ANGLE;
    },

    _setTickOffset: function() {
        this._tickOffset = false;
    }
});

polarAxes.linear = {
    _getMinMax: circularAxes._getMinMax,
    _getStick: xyAxesLinear._getStick,
    _getSpiderCategoryOption: commonUtils.noop,

    _createAxisElement: function() {
        var additionalTranslator = this._additionalTranslator,
            centerCoord = additionalTranslator.getCenter(),
            points = [centerCoord.x, centerCoord.y, centerCoord.x + additionalTranslator.getRadius(), centerCoord.y];

        return this._renderer.path(points, "line").rotate(additionalTranslator.getAngles()[0] - HALF_PI_ANGLE, centerCoord.x, centerCoord.y);
    },

    _setBoundingRect: circularAxes._setBoundingRect,

    _getScreenDelta: function() {
        return this._additionalTranslator.getRadius();
    },

    _getTickCoord: function(tick) {
        return { x1: tick.posX - tick.length / 2, y1: tick.posY, x2: tick.posX + tick.length / 2, y2: tick.posY, angle: tick.angle + HALF_PI_ANGLE };
    },

    _getLabelAdjustedCoord: function(tick) {
        var that = this,
            pos = tick.labelPos,
            cosSin = vizUtils.getCosAndSin(pos.angle),
            indentFromAxis = that._options.label.indentFromAxis || 0,
            box = tick.label.getBBox(),
            x,
            y;

        x = pos.x - _abs(indentFromAxis * cosSin.sin) + _abs(box.width / 2 * cosSin.cos);
        y = pos.y + (pos.y - box.y) - _abs(box.height / 2 * cosSin.sin) + _abs(indentFromAxis * cosSin.cos);

        return { x: x, y: y };
    },

    _getGridLineDrawer: function() {
        var that = this,
            pos = that._additionalTranslator.getCenter();

        return function(tick) {
            return that._renderer.circle(pos.x, pos.y, vizUtils.getDistance(pos.x, pos.y, tick.posX, tick.posY))
                .attr(tick.gridStyle)
                .sharp();
        };
    },

    _getTranslatedValue: function(value, _, offset) {
        var additionalTranslator = this._additionalTranslator,
            startAngle = additionalTranslator.getAngles()[0],
            angle = additionalTranslator.translate(constants.canvasPositionStart),
            xy = convertPolarToXY(additionalTranslator.getCenter(), startAngle, angle, this._translator.translate(value, offset));

        return { x: xy.x, y: xy.y, angle: angle + startAngle - HALF_PI_ANGLE };
    },

    _getTranslatedCoord: function(value, offset) {
        return this._translator.translate(value, offset);
    },

    _getCanvasStartEnd: function() {
        return {
            start: 0,
            end: this._additionalTranslator.getRadius()
        };
    },

    _createStrip: function(fromPoint, toPoint, attr) {
        var center = this._additionalTranslator.getCenter();

        return this._renderer.arc(center.x, center.y, fromPoint, toPoint, 0, 360).attr(attr);
    },

    _getAdjustedStripLabelCoords: circularAxes._getAdjustedStripLabelCoords,

    _getStripLabelCoords: function(_, stripFrom, stripTo) {
        var that = this,
            labelPos = stripFrom + (stripTo - stripFrom) / 2,
            center = that._additionalTranslator.getCenter(),
            y = _round(center.y - labelPos);

        return { x: center.x, y: y, align: constants.center };
    },

    _createConstantLine: function(value, attr) {
        var center = this._additionalTranslator.getCenter();

        return this._renderer.circle(center.x, center.y, value).attr(attr).sharp();
    },

    _getConstantLineLabelsCoords: function(value) {
        var that = this,
            center = that._additionalTranslator.getCenter(),
            y = _round(center.y - value);

        return { x: center.x, y: y, align: constants.center };
    },

    _checkAlignmentConstantLineLabels: _noop,

    _rotateTick: function(tick, angle) {
        tick.graphic.rotate(angle, tick.posX, tick.posY);
    },

    _validateOverlappingMode: circularAxes._validateOverlappingMode,

    _validateDisplayMode: circularAxes._validateDisplayMode,

    _getStep: function(boxes) {
        var quarter = getPolarQuarter(this._additionalTranslator.getAngles()[0]),
            spacing = this._options.label.minSpacing,
            func = (quarter === 2 || quarter === 4) ? function(box) { return box.width + spacing; } : function(box) { return box.height; },
            maxLabelLength = boxes.reduce(function(prevValue, box) {
                return _math.max(prevValue, func(box));
            }, 0);

        return constants.getTicksCountInRange(this._majorTicks, (quarter === 2 || quarter === 4) ? "posX" : "posY", maxLabelLength);
    }
};

polarAxes.linearSpider = _extend({}, polarAxes.linear, {
    _createPathElement: function(points, attr) {
        return this._renderer.path(points, "area").attr(attr).sharp();
    },

    setSpiderTicks: function(ticks) {
        this._spiderTicks = ticks;
    },

    _getGridLineDrawer: function() {
        var that = this,
            pos = that._additionalTranslator.getCenter();

        return function(tick) {
            var radius = vizUtils.getDistance(pos.x, pos.y, tick.posX, tick.posY);
            return that._createPathElement(that._getGridPoints(pos, radius), tick.gridStyle);
        };
    },

    _getGridPoints: function(pos, radius) {
        return _map(this._spiderTicks, function(tick) {
            var cosSin = vizUtils.getCosAndSin(tick.angle);
            return { x: _round(pos.x + radius * cosSin.cos), y: _round(pos.y + radius * cosSin.sin) };
        });
    },

    _createStrip: function(fromPoint, toPoint, attr) {
        var center = this._additionalTranslator.getCenter(),
            innerPoints = this._getGridPoints(center, toPoint),
            outerPoints = this._getGridPoints(center, fromPoint);

        return this._renderer.path([outerPoints, innerPoints.reverse()], "area").attr(attr);
    },

    _createConstantLine: function(value, attr) {
        var center = this._additionalTranslator.getCenter(),
            points = this._getGridPoints(center, value);

        return this._createPathElement(points, attr);
    }
});
