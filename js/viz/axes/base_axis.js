"use strict";

var $ = require("../../core/renderer"),
    vizUtils = require("../core/utils"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    constants = require("./axes_constants"),
    parseUtils = require("../components/parse_utils"),
    tickManagerModule = require("./base_tick_manager"),
    Translator2DModule = require("../translators/translator2d"),
    rangeModule = require("../translators/range"),
    tick = require("./tick").tick,
    formatLabel = constants.formatLabel,
    convertTicksToValues = constants.convertTicksToValues,

    _isDefined = commonUtils.isDefined,
    _isNumber = commonUtils.isNumeric,
    _getSignificantDigitPosition = vizUtils.getSignificantDigitPosition,
    _roundValue = vizUtils.roundValue,
    patchFontOptions = vizUtils.patchFontOptions,

    _math = Math,
    _abs = _math.abs,
    _max = _math.max,
    _min = _math.min,

    _each = $.each,
    _noop = commonUtils.noop,

    DEFAULT_AXIS_LABEL_SPACING = 5,
    MAX_GRID_BORDER_ADHENSION = 4,

    TOP = constants.top,
    BOTTOM = constants.bottom,
    LEFT = constants.left,
    RIGHT = constants.right,
    CENTER = constants.center,

    Axis;

function createMajorTick(axis, renderer) {
    var options = axis.getOptions();

    return tick(
        axis,
        renderer,
        options.tick,
        options.grid,
        axis._getSkippedCategory(),
        axis._translator.getBusinessRange().stubData
    );
}

function createMinorTick(axis, renderer) {
    var options = axis.getOptions();

    return tick(
        axis,
        renderer,
        options.minorTick,
        options.minorGrid
    );
}

function createBoundaryTick(axis, renderer, isFirst) {
    var options = axis.getOptions();

    return tick(
        axis,
        renderer,
        extend({}, options.tick, { visible: options.showCustomBoundaryTicks }),
        options.grid,
        undefined,
        false,
        isFirst ? -1 : 1
    );
}

function callAction(ticks, action, actionArgument) {
    ticks.forEach(function(tick) { tick[action](actionArgument); });
}

function initTickCoords(ticks) {
    callAction(ticks, "initCoords");
}

function drawTickMarks(ticks) {
    callAction(ticks, "drawMark");
}

function drawGrids(ticks, drawLine) {
    callAction(ticks, "drawGrid", drawLine);
}

function updateTicksPosition(ticks) {
    callAction(ticks, "updateTickPosition");
}

function updateGridsPosition(ticks) {
    callAction(ticks, "updateGridPosition");
}

function measureLabels(items) {
    items.forEach(function(item) {
        item.labelBBox = item.label ? item.label.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
    });
}

function isEmptyArray(categories) {
    return categories && categories.length;
}

function getMarginValue(range, margin) {
    return (_abs(range.max - range.min) * margin) || 0;
}

function getAddFunction(range) {
    if(range.dataType === "datetime") {
        return function(rangeValue, marginValue) {
            return new Date(rangeValue.getTime() + marginValue);
        };
    }
    return function(rangeValue, marginValue) {
        return rangeValue + marginValue;
    };
}

function validateAxisOptions(options) {
    var labelOptions = options.label,
        position = options.position,
        defaultPosition = options.isHorizontal ? BOTTOM : LEFT,
        secondaryPosition = options.isHorizontal ? TOP : RIGHT;

    if(position !== defaultPosition && position !== secondaryPosition) {
        position = defaultPosition;
    }

    if(position === RIGHT && !labelOptions.userAlignment) {
        labelOptions.alignment = LEFT;
    }

    options.position = position;
    options.hoverMode = options.hoverMode ? options.hoverMode.toLowerCase() : "none";
    labelOptions.minSpacing = _isDefined(labelOptions.minSpacing) ? labelOptions.minSpacing : DEFAULT_AXIS_LABEL_SPACING;
}

function getOptimalAngle(boxes, labelOpt) {
    var angle = _math.asin((boxes[0].height + labelOpt.minSpacing) / (boxes[1].x - boxes[0].x)) * 180 / _math.PI;
    return angle < 45 ? -45 : -90;
}

function updateLabels(ticks, step, func) {
    ticks.forEach(function(tick, index) {
        if(tick.label) {
            if(index % step !== 0) {
                tick.label.remove();
            } else if(func) {
                func(tick, index);
            }
        }
    });
}

Axis = exports.Axis = function(renderSettings) {
    var that = this;

    that._renderer = renderSettings.renderer;
    that._incidentOccurred = renderSettings.incidentOccurred;

    that._stripsGroup = renderSettings.stripsGroup;
    that._labelAxesGroup = renderSettings.labelAxesGroup;
    that._constantLinesGroup = renderSettings.constantLinesGroup;
    that._axesContainerGroup = renderSettings.axesContainerGroup;
    that._gridContainerGroup = renderSettings.gridGroup;
    that._axisCssPrefix = renderSettings.widgetClass + "-" + (renderSettings.axisClass ? renderSettings.axisClass + "-" : "");

    that._setType(renderSettings.axisType, renderSettings.drawingType);
    that._createAxisGroups();
    that._tickManager = that._createTickManager();
    that._translator = that._createTranslator();
};

Axis.prototype = {
    constructor: Axis,

    //private
    _updateIntervalAndBounds: function() {
        //TODO ??? Why we need interval calculation from ticks
        var that = this,
            i,
            ticks,
            length,
            minInterval,
            translator = that._translator,
            businessRange = translator.getBusinessRange(),
            bounds;

        if(!isEmptyArray(businessRange.categories)) {
            ticks = that._majorTicks;
            length = ticks.length;
            if(!businessRange.isSynchronized) {
                bounds = this._tickManager.getTickBounds();
            }
            if(length > 1) {
                minInterval = _abs(ticks[0].value - ticks[1].value);
                for(i = 1; i < length - 1; i++) {
                    minInterval = _min(_abs(ticks[i].value - ticks[i + 1].value), minInterval);
                }
                bounds = extend({ interval: minInterval }, bounds);
            }

            if(bounds) {
                businessRange.addRange(bounds);
                translator.reinit();
            }
        }
    },

    _drawAxis: function() {
        var options = this._options;

        if(!options.visible) {
            return;
        }

        this._axisElement = this._createAxisElement();
        this._updateAxisElementPosition();

        this._axisElement.attr({ "stroke-width": options.width, stroke: options.color, "stroke-opacity": options.opacity })
            .sharp(this._getSharpParam(true))
            .append(this._axisLineGroup);
    },

    _correctMinForTicks: function(min, max, screenDelta) {
        var diff = _abs(max - min) / screenDelta,
            digitPosition = commonUtils.isExponential(diff) && diff < 1
                ? vizUtils.getPrecision(diff)
                : _getSignificantDigitPosition(diff),
            newMin = _roundValue(Number(min), digitPosition),
            correctingValue;

        if(newMin < min) {
            correctingValue = _math.pow(10, -digitPosition);
            newMin = vizUtils.applyPrecisionByMinDelta(newMin, correctingValue, newMin + correctingValue);
        }
        if(newMin > max) {
            newMin = min;
        }

        return newMin;
    },

    _getTickManagerData: function() {
        var that = this,
            options = that._options,
            screenDelta = that._getScreenDelta(),
            min = that._minBound,
            max = that._maxBound,
            categories = that._translator.getVisibleCategories() || that._translator.getBusinessRange().categories,
            customTicks = options.customTicks || (isEmptyArray(categories) ? categories : that._majorTicks && that._majorTicks.length && convertTicksToValues(that._majorTicks)),
            customMinorTicks = options.customMinorTicks || (that._minorTicks && that._minorTicks.length && convertTicksToValues(that._minorTicks));

        if(_isNumber(min) && options.type !== constants.logarithmic) {
            min = that._correctMinForTicks(min, max, screenDelta);
        }

        return {
            min: min,
            max: max,
            customTicks: customTicks,
            customMinorTicks: customMinorTicks,
            customBoundTicks: options.customBoundTicks,
            screenDelta: screenDelta
        };
    },

    _getTickManagerTypes: function() {
        return {
            axisType: this._options.type,
            dataType: this._options.dataType
        };
    },

    _getTicksOptions: function() {
        var options = this._options;
        return {
            base: options.type === constants.logarithmic ? options.logarithmBase : undefined,
            tickInterval: this._translator.getBusinessRange().stubData ? null : options.tickInterval,
            gridSpacingFactor: options.axisDivisionFactor,
            minorGridSpacingFactor: options.minorAxisDivisionFactor,
            numberMultipliers: options.numberMultipliers,
            incidentOccurred: options.incidentOccurred,
            setTicksAtUnitBeginning: options.setTicksAtUnitBeginning,
            showMinorTicks: options.minorTick.visible || options.minorGrid.visible,
            minorTickInterval: options.minorTickInterval,
            minorTickCount: options.minorTickCount,
            showCalculatedTicks: options.tick.showCalculatedTicks, //DEPRECATED IN 15_2
            showMinorCalculatedTicks: options.minorTick.showCalculatedTicks //DEPRECATED IN 15_2
        };
    },

    _createTickManager: function() {
        return new tickManagerModule.TickManager({}, {});
    },

    _getMarginsOptions: function() {
        var range = this._translator.getBusinessRange();
        return {
            stick: range.stick || this._options.stick,
            minStickValue: range.minStickValue,
            maxStickValue: range.maxStickValue,
            percentStick: range.percentStick,
            minSpaceCorrection: range.minSpaceCorrection,
            maxSpaceCorrection: range.maxSpaceCorrection
        };
    },

    _getLabelOptions: function() {
        return {
            hasLabelFormat: this._hasLabelFormat,
            isMarkersVisible: this._options.type === "discrete" ? false : this._options.marker.visible,
            addMinMax: this._options.showCustomBoundaryTicks ? this._boundaryTicksVisibility : undefined,
            forceUserTickInterval: this._options.label.overlappingBehavior.mode === "ignore" ? true : this._options.forceUserTickInterval
        };
    },

    _updateTickManager: function() {
        var that = this,
            options = extend(true, that._getMarginsOptions(), that._getTicksOptions(), that._getLabelOptions());
        this._tickManager.update(that._getTickManagerTypes(), that._getTickManagerData(), options);
    },

    _correctLabelFormat: function() {
        var labelFormat = this._tickManager.getOptions().labelFormat;
        if(labelFormat) {
            this._options.label.format = labelFormat;
        }
    },

    _createPathElement: function(points, attr) {
        return this._renderer.path(points, "line").attr(attr).sharp(this._getSharpParam());
    },

    _getGridLineDrawer: function(borderOptions) {
        var that = this,
            isHorizontal = that._isHorizontal;

        return function(tick, gridStyle) {
            that.borderOptions = borderOptions;
            var canvasStart = isHorizontal ? LEFT : TOP,
                canvasEnd = isHorizontal ? RIGHT : BOTTOM,
                axisCanvas = that.getCanvas(),
                canvas = {
                    left: axisCanvas.left,
                    right: axisCanvas.width - axisCanvas.right,
                    top: axisCanvas.top,
                    bottom: axisCanvas.height - axisCanvas.bottom
                },
                firstBorderLinePosition = (borderOptions.visible && borderOptions[canvasStart]) ? canvas[canvasStart] : undefined,
                lastBorderLinePosition = (borderOptions.visible && borderOptions[canvasEnd]) ? canvas[canvasEnd] : undefined,
                tickPositionField = isHorizontal ? "x" : "y",
                minDelta = MAX_GRID_BORDER_ADHENSION + firstBorderLinePosition,
                maxDelta = lastBorderLinePosition - MAX_GRID_BORDER_ADHENSION,
                element;

            if(tick.coords[tickPositionField] === undefined || (tick.coords[tickPositionField] < minDelta || tick.coords[tickPositionField] > maxDelta)) {
                return;
            }
            var grid = that._getGridPoints(tick.coords);

            if(grid.points) {
                element = that._createPathElement(grid.points, gridStyle);
            }
            return element;
        };
    },

    _getGridPoints: function(coords) {
        var isHorizontal = this._isHorizontal,
            tickPositionField = isHorizontal ? "x" : "y",
            orthogonalPositions = this._orthogonalPositions,
            positionFrom = orthogonalPositions.start,
            positionTo = orthogonalPositions.end;

        return {
            points: isHorizontal
                ? (coords[tickPositionField] !== null ? [coords[tickPositionField], positionFrom, coords[tickPositionField], positionTo] : null)
                : (coords[tickPositionField] !== null ? [positionFrom, coords[tickPositionField], positionTo, coords[tickPositionField]] : null)
        };
    },

    _getConstantLinePos: function(lineValue, canvasStart, canvasEnd) {
        var parsedValue = this._validateUnit(lineValue, "E2105", "constantLine"),
            value = this._getTranslatedCoord(parsedValue);

        if(!_isDefined(value) || value < _min(canvasStart, canvasEnd) || value > _max(canvasStart, canvasEnd)) {
            return {};
        }

        return { value: value, parsedValue: parsedValue };
    },

    _getConstantLineGraphicAttributes: function(value) {
        var positionFrom = this._orthogonalPositions.start,
            positionTo = this._orthogonalPositions.end;

        return {
            points: this._isHorizontal ? [value, positionFrom, value, positionTo] : [positionFrom, value, positionTo, value]
        };
    },

    _createConstantLine: function(value, attr) {
        return this._createPathElement(this._getConstantLineGraphicAttributes(value).points, attr);
    },

    _drawConstantLinesAndLabels: function(position, lineOptions, canvasStart, canvasEnd) {
        if(!_isDefined(lineOptions.value)) {
            return { line: null, label: null, options: lineOptions };
        }
        var that = this,
            pos = that._getConstantLinePos(lineOptions.value, canvasStart, canvasEnd),
            labelOptions = lineOptions.label || {},
            value = pos.value,
            attr = { stroke: lineOptions.color, "stroke-width": lineOptions.width, dashStyle: lineOptions.dashStyle },
            group = that._axisConstantLineGroups[position],
            side;

        if(!group) {
            side = that._isHorizontal ? labelOptions.verticalAlignment : labelOptions.horizontalAlignment;
            group = that._axisConstantLineGroups[side];
        }

        if(!_isDefined(value)) {
            return { line: null, label: null, options: lineOptions };
        }

        return {
            line: that._createConstantLine(value, attr).append(that._axisConstantLineGroups.inside),
            label: labelOptions.visible ? that._drawConstantLineLabels(pos.parsedValue, labelOptions, value, group) : null,
            options: lineOptions,
            labelOptions: labelOptions,
            coord: value
        };
    },

    _drawConstantLines: function(position) {
        var that = this,
            canvas = that._getCanvasStartEnd();

        if(that._translator.getBusinessRange().stubData) {
            return [];
        }

        return (that._options.constantLines || []).reduce(function(result, constantLine) {
            var labelPos = constantLine.label.position;
            if(labelPos === position || (!labelPos && position === "inside")) {
                result.push(that._drawConstantLinesAndLabels(position, constantLine, canvas.start, canvas.end));
            }
            return result;
        }, []);
    },

    _drawConstantLineLabelText: function(text, x, y, constantLineLabelOptions, group) {
        var that = this,
            options = that._options,
            labelOptions = options.label;

        return that._renderer.text(text, x, y)
            .css(patchFontOptions(extend({}, labelOptions.font, constantLineLabelOptions.font)))
            .append(group);
    },

    _drawConstantLineLabels: function(parsedValue, lineLabelOptions, value, group) {
        var that = this,
            text = lineLabelOptions.text,
            options = that._options,
            labelOptions = options.label,
            coords;

        that._checkAlignmentConstantLineLabels(lineLabelOptions);

        text = _isDefined(text) ? text : formatLabel(parsedValue, labelOptions);
        coords = that._getConstantLineLabelsCoords(value, lineLabelOptions);

        return that._drawConstantLineLabelText(text, coords.x, coords.y, lineLabelOptions, group);
    },

    _getStripPos: function(startValue, endValue, canvasStart, canvasEnd, range) {
        var isContinuous = !!(range.minVisible || range.maxVisible),
            categories = range.categories || [],
            start,
            end,
            swap,
            startCategoryIndex,
            endCategoryIndex,
            min = range.minVisible;

        if(!isContinuous) {
            if(_isDefined(startValue) && _isDefined(endValue)) {
                startCategoryIndex = inArray(startValue, categories);
                endCategoryIndex = inArray(endValue, categories);
                if(startCategoryIndex === -1 || endCategoryIndex === -1) {
                    return { from: 0, to: 0 };
                }
                if(startCategoryIndex > endCategoryIndex) {
                    swap = endValue;
                    endValue = startValue;
                    startValue = swap;
                }
            }
        }

        if(_isDefined(startValue)) {
            startValue = this._validateUnit(startValue, "E2105", "strip");
            start = this._getTranslatedCoord(startValue, -1);
            if(!_isDefined(start) && isContinuous) {
                start = (startValue < min) ? canvasStart : canvasEnd;
            }
        } else {
            start = canvasStart;
        }

        if(_isDefined(endValue)) {
            endValue = this._validateUnit(endValue, "E2105", "strip");
            end = this._getTranslatedCoord(endValue, 1);
            if(!_isDefined(end) && isContinuous) {
                end = (endValue > min) ? canvasEnd : canvasStart;
            }
        } else {
            end = canvasEnd;
        }

        return (start < end) ? { from: start, to: end } : { from: end, to: start };
    },

    _getStripGraphicAttributes: function(fromPoint, toPoint) {
        var x,
            y,
            width,
            height,
            orthogonalPositions = this._orthogonalPositions,
            positionFrom = orthogonalPositions.start,
            positionTo = orthogonalPositions.end;

        if(this._isHorizontal) {
            x = fromPoint;
            y = _min(positionFrom, positionTo);
            width = toPoint - fromPoint;
            height = _abs(positionFrom - positionTo);
        } else {
            x = _min(positionFrom, positionTo);
            y = fromPoint;
            width = _abs(positionFrom - positionTo);
            height = _abs(fromPoint - toPoint);
        }

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    },

    _createStrip: function(fromPoint, toPoint, attr) {
        var attrs = this._getStripGraphicAttributes(fromPoint, toPoint);

        return this._renderer.rect(attrs.x, attrs.y, attrs.width, attrs.height).attr(attr);
    },

    _drawStrips: function() {
        var that = this,
            options = that._options,
            stripData = options.strips,
            canvas = this._getCanvasStartEnd(),
            i,
            stripOptions,
            stripPos,
            stripLabelOptions,
            attr,
            range = that._translator.getBusinessRange(),
            labelCoords,
            strips = [];

        if(!stripData || range.stubData) {
            return [];
        }

        for(i = 0; i < stripData.length; i++) {
            stripOptions = stripData[i];
            stripLabelOptions = stripOptions.label || {};
            attr = { fill: stripOptions.color };

            if((_isDefined(stripOptions.startValue) || _isDefined(stripOptions.endValue)) && _isDefined(stripOptions.color)) {
                stripPos = that._getStripPos(stripOptions.startValue, stripOptions.endValue, canvas.start, canvas.end, range);
                labelCoords = stripLabelOptions.text ? that._getStripLabelCoords(stripPos.from, stripPos.to, stripLabelOptions) : null;

                if((stripPos.to - stripPos.from === 0) || (!_isDefined(stripPos.to)) || (!_isDefined(stripPos.from))) {
                    continue;
                }
                strips.push({
                    rect: that._createStrip(stripPos.from, stripPos.to, attr).append(that._axisStripGroup),
                    options: stripOptions,
                    label: stripLabelOptions.text ? that._drawStripLabel(stripLabelOptions, labelCoords) : null,
                    labelCoords: labelCoords
                });
            }
        }

        return strips;
    },

    _drawStripLabel: function(stripLabelOptions, coords) {
        return this._renderer
            .text(stripLabelOptions.text, coords.x, coords.y)
            .css(patchFontOptions(extend({}, this._options.label.font, stripLabelOptions.font)))
            .append(this._axisStripLabelGroup);
    },

    _adjustStripLabels: function() {
        var that = this;

        this._strips.forEach(function(strip) {
            if(strip.label) {
                strip.label.attr(that._getAdjustedStripLabelCoords(strip));
            }
        });
    },

    _adjustLabels: function(offset) {
        var that = this,
            maxSize = that._majorTicks.reduce(function(size, tick) {
                var bBox = tick.labelRotationAngle ? vizUtils.rotateBBox(tick.labelBBox, [tick.labelCoords.x, tick.labelCoords.y], -tick.labelRotationAngle) : tick.labelBBox;
                return {
                    width: _max(size.width || 0, bBox.width),
                    height: _max(size.height || 0, bBox.height),
                    offset: _max(size.offset || 0, tick.labelOffset || 0)
                };
            }, {}),
            additionalOffset = that._isHorizontal ? maxSize.height : maxSize.width;

        that._majorTicks.forEach(function(tick) {
            if(tick.label) {
                tick.label.attr(that._getLabelAdjustedCoord(tick, offset + (tick.labelOffset || 0), maxSize.width));
            }
        });

        return offset + additionalOffset + (additionalOffset && that._options.label.indentFromAxis) + maxSize.offset;
    },

    _getLabelAdjustedCoord: function(tick, offset, maxWidth) {
        offset = offset || 0;
        var that = this,
            options = that._options,
            box = vizUtils.rotateBBox(tick.labelBBox, [tick.labelCoords.x, tick.labelCoords.y], -tick.labelRotationAngle || 0),
            position = options.position,
            textAlign = tick.labelAlignment || options.label.alignment,
            indentFromAxis = options.label.indentFromAxis,
            axisPosition = that._axisPosition,
            labelCoords = tick.labelCoords,
            labelX = labelCoords.x,
            translateX,
            translateY;

        if(that._isHorizontal) {
            if(position === BOTTOM) {
                translateY = axisPosition + indentFromAxis - box.y + offset;
            } else {
                translateY = axisPosition - indentFromAxis - (box.y + box.height) - offset;
            }

            if(textAlign === RIGHT) {
                translateX = labelX - box.x - box.width;
            } else if(textAlign === LEFT) {
                translateX = labelX - box.x;
            } else {
                translateX = labelX - box.x - box.width / 2;
            }
        } else {
            translateY = labelCoords.y - box.y - box.height / 2;
            if(position === LEFT) {
                if(textAlign === LEFT) {
                    translateX = axisPosition - indentFromAxis - maxWidth - box.x;
                } else if(textAlign === CENTER) {
                    translateX = axisPosition - indentFromAxis - maxWidth / 2 - box.x - box.width / 2;
                } else {
                    translateX = axisPosition - indentFromAxis - box.x - box.width;
                }
                translateX -= offset;
            } else {
                if(textAlign === RIGHT) {
                    translateX = axisPosition + indentFromAxis + maxWidth - box.x - box.width;
                } else if(textAlign === CENTER) {
                    translateX = axisPosition + indentFromAxis + maxWidth / 2 - box.x - box.width / 2;
                } else {
                    translateX = axisPosition + indentFromAxis - box.x;
                }
                translateX += offset;
            }
        }

        return {
            translateX: translateX,
            translateY: translateY
        };
    },

    _createAxisGroups: function() {
        var that = this,
            renderer = that._renderer,
            classSelector = that._axisCssPrefix,
            constantLinesClass = classSelector + "constant-lines",
            insideGroup,
            outsideGroup1,
            outsideGroup2;

        that._axisGroup = renderer.g().attr({ "class": classSelector + "axis" });
        that._axisStripGroup = renderer.g().attr({ "class": classSelector + "strips" });
        that._axisGridGroup = renderer.g().attr({ "class": classSelector + "grid" });
        that._axisElementsGroup = renderer.g().attr({ "class": classSelector + "elements" }).append(that._axisGroup);
        that._axisLineGroup = renderer.g().attr({ "class": classSelector + "line" }).append(that._axisGroup);
        that._axisTitleGroup = renderer.g().attr({ "class": classSelector + "title" }).append(that._axisGroup);

        insideGroup = renderer.g().attr({ "class": constantLinesClass });
        outsideGroup1 = renderer.g().attr({ "class": constantLinesClass });
        outsideGroup2 = renderer.g().attr({ "class": constantLinesClass });

        that._axisConstantLineGroups = {
            inside: insideGroup,
            outside1: outsideGroup1,
            left: outsideGroup1,
            top: outsideGroup1,
            outside2: outsideGroup2,
            right: outsideGroup2,
            bottom: outsideGroup2
        };

        that._axisStripLabelGroup = renderer.g().attr({ "class": classSelector + "axis-labels" });
    },

    _clearAxisGroups: function() {
        var that = this;

        that._axisGroup.remove();
        that._axisStripGroup.remove();
        that._axisStripLabelGroup.remove();
        that._axisConstantLineGroups.inside.remove();
        that._axisConstantLineGroups.outside1.remove();
        that._axisConstantLineGroups.outside2.remove();

        that._axisGridGroup.remove();

        that._axisTitleGroup.clear();
        that._axisElementsGroup.clear();

        that._axisLineGroup && that._axisLineGroup.clear();
        that._axisStripGroup && that._axisStripGroup.clear();
        that._axisGridGroup && that._axisGridGroup.clear();
        that._axisConstantLineGroups.inside.clear();
        that._axisConstantLineGroups.outside1.clear();
        that._axisConstantLineGroups.outside2.clear();
        that._axisStripLabelGroup && that._axisStripLabelGroup.clear();
    },

    _formatTickLabel: function(value) {
        return formatLabel(value, this._options.label, { min: this._minBound, max: this._maxBound });
    },

    _setTickOffset: function() {
        var options = this._options,
            discreteAxisDivisionMode = options.discreteAxisDivisionMode;
        this._tickOffset = +(discreteAxisDivisionMode !== "crossLabels" || !discreteAxisDivisionMode);
    },

    getMargins: function() {
        var that = this,
            canvas = that.getCanvas(),
            cLeft = canvas.left,
            cTop = canvas.top,
            cRight = canvas.width - canvas.right,
            cBottom = canvas.height - canvas.bottom,
            placeholderSize = that._options.placeholderSize,
            boxes = [that._axisElementsGroup, that._axisConstantLineGroups.outside1, that._axisConstantLineGroups.outside2]
                .map(function(group) { return group && group.getBBox(); })
                .concat((function(group) {
                    var box = group && group.getBBox();

                    if(!box || box.isEmpty) {
                        return box;
                    }
                    if(that._isHorizontal) {
                        box.x = cLeft;
                        box.width = cRight - cLeft;
                    } else {
                        box.y = cTop;
                        box.height = cBottom - cTop;
                    }
                    return box;
                })(that._axisTitleGroup)),
            margins = boxes
                .reduce(function(margins, bBox) {
                    if(!bBox || bBox.isEmpty) {
                        return margins;
                    }
                    return {
                        left: _max(margins.left, cLeft - bBox.x),
                        top: _max(margins.top, cTop - bBox.y),
                        right: _max(margins.right, bBox.x + bBox.width - cRight),
                        bottom: _max(margins.bottom, bBox.y + bBox.height - cBottom)
                    };
                }, {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                });

        if(placeholderSize) {
            margins[that._options.position] = placeholderSize;
        }

        return margins;
    },

    _validateUnit: function(unit, idError, parameters) {
        var that = this;
        unit = that.parser(unit);
        if(unit === undefined && idError) {
            that._incidentOccurred(idError, [parameters]);
        }
        return unit;
    },

    _setType: function(axisType, drawingType) {
        var that = this,
            axisTypeMethods;

        switch(axisType) {
            case "xyAxes":
                axisTypeMethods = require("./xy_axes");
                break;
            case "polarAxes":
                axisTypeMethods = require("./polar_axes");
                break;
        }

        _each(axisTypeMethods[drawingType], function(methodName, method) {
            that[methodName] = method;
        });
    },

    _getSharpParam: function() {
        return true;
    },

    //public
    dispose: function() {
        var that = this;
        that._axisElementsGroup && that._axisElementsGroup.dispose();

        that._strips = null;
        that._title = null;
        that._axisStripGroup = that._axisConstantLineGroups = that._axisStripLabelGroup = null;
        that._axisLineGroup = that._axisElementsGroup = that._axisGridGroup = null;
        that._axisGroup = that._axisTitleGroup = null;
        that._axesContainerGroup = that._stripsGroup = that._constantLinesGroup = null;

        that._renderer = that._options = that._textOptions = that._textFontStyles = null;
        that._translator = null;
        that._majorTicks = that._minorTicks = null;
        that._tickManager = null;
    },

    getOptions: function() {
        return this._options;
    },

    setPane: function(pane) {
        this.pane = pane;
        this._options.pane = pane;
    },

    setTypes: function(type, axisType, typeSelector) {
        this._options.type = type || this._options.type;
        this._options[typeSelector] = axisType || this._options[typeSelector];
    },

    resetTypes: function(typeSelector) {
        this._options.type = this._initTypes.type;
        this._options[typeSelector] = this._initTypes[typeSelector];
    },

    getTranslator: function() {
        return this._translator;
    },

    updateOptions: function(options) {
        var that = this,
            labelOpt = options.label;

        that._options = options;

        options.tick = options.tick || {};
        options.minorTick = options.minorTick || {};
        options.grid = options.grid || {};
        options.minorGrid = options.minorGrid || {};
        options.title = options.title || {};
        options.marker = options.marker || {};

        that._initTypes = {
            type: options.type,
            argumentType: options.argumentType,
            valueType: options.valueType
        };

        validateAxisOptions(options);
        that._setTickOffset();

        that._isHorizontal = options.isHorizontal;
        that.pane = options.pane;
        that.name = options.name;
        that.priority = options.priority;

        that._hasLabelFormat = labelOpt.format !== "" && _isDefined(labelOpt.format);
        that._textOptions = {
            opacity: labelOpt.opacity,
            align: that._getAlignment()
        };
        that._textFontStyles = vizUtils.patchFontOptions(labelOpt.font);

        if(options.type === constants.logarithmic) {
            if(options.logarithmBaseError) {
                that._incidentOccurred("E2104");
                delete options.logarithmBaseError;
            }
            that.calcInterval = function(value, prevValue) {
                return vizUtils.getLog(value / prevValue, options.logarithmBase);
            };
        }


        that._updateTranslator();
    },

    _processCanvas: function(canvas) {
        return canvas;
    },

    updateCanvas: function(canvas) {
        var positions = this._orthogonalPositions = {
            start: !this._isHorizontal ? canvas.left : canvas.top,
            end: !this._isHorizontal ? canvas.width - canvas.right : canvas.height - canvas.bottom
        };

        this._canvas = canvas;

        positions.center = positions.start + (positions.end - positions.start) / 2;

        this._translator.updateCanvas(this._processCanvas(canvas));

        this._initAxisPositions();
    },

    getCanvas: function() {
        return this._canvas;
    },

    hideTitle: function() {
        var that = this;

        if(that._options.title.text) {
            that._incidentOccurred("W2105", [that._isHorizontal ? "horizontal" : "vertical"]);
            that._axisTitleGroup.clear();
        }
    },

    hideOuterElements: function() {
        var that = this,
            options = that._options,
            constantLineLabels = that._outsideConstantLines.map(function(line) { return line.label; });

        if((options.label.visible || constantLineLabels.length) && !that._translator.getBusinessRange().stubData) {
            that._incidentOccurred("W2106", [that._isHorizontal ? "horizontal" : "vertical"]);
            that._axisElementsGroup.clear();
            constantLineLabels.forEach(function(label) { label && label.remove(); });
        }
    },

    _saveBusinessRange: function() {
        this._storedBusinessRange = new rangeModule.Range(this._translator.getBusinessRange());
    },

    restoreBusinessRange: function() {
        var zoomArgs = this._zoomArgs,
            range = new rangeModule.Range(this._storedBusinessRange);

        if(zoomArgs) {
            this.zoom(zoomArgs.min, zoomArgs.max, zoomArgs.stick);
        } else {
            this._updateBusinessRange(range);
        }
    },

    _applyMargins: function(range) {
        var options = this._options,
            minMarginValue = getMarginValue(range, options.minValueMargin),
            maxMarginValue = getMarginValue(range, options.maxValueMargin),
            valueMarginsEnabled = options.valueMarginsEnabled && range.axisType !== "logarithmic" && range.axisType !== "discrete",
            add = getAddFunction(range);

        if(valueMarginsEnabled) {
            range.min = add(range.min, -minMarginValue);
            range.max = add(range.max, maxMarginValue);
        }
    },

    setBusinessRange: function(range) {
        this._applyMargins(range);
        this._updateBusinessRange(range);
        this._saveBusinessRange(range);
    },

    _updateBusinessRange: function(range) {
        var that = this;

        that._translator.updateBusinessRange(range);

        that._minBound = range.minVisible;
        that._maxBound = range.maxVisible;
    },

    getLabelsPosition: function() {
        var that = this,
            options = that._options,
            position = options.position,
            labelShift = options.label.indentFromAxis + (that._axisShift || 0) + that._constantLabelOffset,
            axisPosition = that._axisPosition;

        return position === TOP || position === LEFT ? axisPosition - labelShift : axisPosition + labelShift;
    },

    getFormattedValue: function(value, options, point) {
        var labelOptions = this._options.label;

        return _isDefined(value) ? formatLabel(value, extend(true, {}, labelOptions, options), undefined, point) : null;
    },

    _getBoundaryTicks: function() {
        var categories = this._translator.getVisibleCategories() || this._translator.getBusinessRange().categories;

        return isEmptyArray(categories) && this._tickOffset ? [categories[0], categories[categories.length - 1]] : this._tickManager.getBoundaryTicks();
    },

    setPercentLabelFormat: function() {
        if(!this._hasLabelFormat) {
            this._options.label.format = "percent";
        }
    },

    resetAutoLabelFormat: function() {
        if(!this._hasLabelFormat) {
            delete this._options.label.format;
        }
    },

    getMultipleAxesSpacing: function() {
        return this._options.multipleAxesSpacing || 0;
    },

    getTicksValues: function() {
        return {
            majorTicksValues: convertTicksToValues(this._majorTicks),
            minorTicksValues: convertTicksToValues(this._minorTicks)
        };
    },

    setTicks: function(ticks) {
        this._majorTicks = (ticks.majorTicks || []).map(createMajorTick(this, this._renderer));
        this._minorTicks = (ticks.minorTicks || []).map(createMinorTick(this, this._renderer));

        this._updateTickManager();
    },

    createTicks: function(canvas) {
        var that = this,
            renderer = that._renderer,
            tickManager = that._tickManager,
            boundaryTicks;

        if(!canvas) {
            that._updateIntervalAndBounds();
            return;
        }

        that.updateCanvas(canvas);

        that._majorTicks = that._minorTicks = null;
        that._updateTickManager();

        that._majorTicks = tickManager.getTicks().map(createMajorTick(this, renderer));
        that._minorTicks = tickManager.getMinorTicks().map(createMinorTick(this, renderer));

        that.correctTicksOnDeprecated();

        boundaryTicks = that._getBoundaryTicks();
        if(this._options.showCustomBoundaryTicks && boundaryTicks.length) {
            that._boundaryTicks = [boundaryTicks[0]].map(createBoundaryTick(this, renderer, true));
            if(boundaryTicks.length > 1) {
                that._boundaryTicks = that._boundaryTicks.concat([boundaryTicks[1]].map(createBoundaryTick(this, renderer, false)));
            }
        }

        that._correctLabelFormat();

        that._updateIntervalAndBounds();
    },

    //DEPRECATED IN 15_2
    correctTicksOnDeprecated: function() {
        var behavior = this._options.label.overlappingBehavior,
            majorTicks = this._majorTicks,
            length = majorTicks.length;

        if(length) {
            majorTicks[0].withoutLabel = behavior.hideFirstLabel;
            majorTicks[length - 1].withoutLabel = behavior.hideLastLabel;
            majorTicks[0].withoutPath = behavior.hideFirstTick;
            majorTicks[length - 1].withoutPath = behavior.hideLastTick;
        }
    },

    draw: function(canvas, borderOptions) {
        var that = this,
            drawGridLine = that._getGridLineDrawer(borderOptions || { visible: false });

        that.createTicks(canvas);
        that._clearAxisGroups();

        initTickCoords(that._majorTicks);
        initTickCoords(that._minorTicks);
        initTickCoords(that._boundaryTicks || []);

        that._drawAxis();
        that._drawTitle();
        drawTickMarks(that._majorTicks);
        drawTickMarks(that._minorTicks);
        drawTickMarks(that._boundaryTicks || []);
        drawGrids(that._majorTicks, drawGridLine);
        drawGrids(that._minorTicks, drawGridLine);
        callAction(that._majorTicks, "drawLabel");
        that._outsideConstantLines = that._drawConstantLines("outside");
        that._insideConstantLines = that._drawConstantLines("inside");
        that._strips = that._drawStrips();
        that._dateMarkers = that._drawDateMarkers() || [];

        that._axisGroup.append(that._axesContainerGroup);
        that._labelAxesGroup && that._axisStripLabelGroup.append(that._labelAxesGroup);
        that._gridContainerGroup && that._axisGridGroup.append(that._gridContainerGroup);
        that._stripsGroup && that._axisStripGroup.append(that._stripsGroup);

        if(that._constantLinesGroup) {
            that._axisConstantLineGroups.inside.append(that._constantLinesGroup);
            that._axisConstantLineGroups.outside1.append(that._constantLinesGroup);
            that._axisConstantLineGroups.outside2.append(that._constantLinesGroup);
        }

        that._measureTitle();
        measureLabels(that._majorTicks);
        measureLabels(that._outsideConstantLines);
        measureLabels(that._insideConstantLines);
        measureLabels(that._strips);
        measureLabels(that._dateMarkers);

        that._adjustConstantLineLabels(that._insideConstantLines);
        that._adjustStripLabels();

        var offset = that._constantLabelOffset = that._adjustConstantLineLabels(that._outsideConstantLines);

        if(!that._translator.getBusinessRange().stubData) {
            that._setLabelsPlacement();
            offset = that._adjustLabels(offset);
        }

        offset = that._adjustDateMarkers(offset);
        that._adjustTitle(offset);
    },

    _measureTitle: _noop,

    updateSize: function(canvas) {
        var that = this;

        that.updateCanvas(canvas);

        var canvasStartEnd = that._getCanvasStartEnd();

        initTickCoords(that._majorTicks);
        initTickCoords(that._minorTicks);
        initTickCoords(that._boundaryTicks || []);

        that._updateAxisElementPosition();

        updateTicksPosition(that._majorTicks);
        updateTicksPosition(that._minorTicks);
        updateTicksPosition(that._boundaryTicks || []);

        callAction(that._majorTicks, "updateLabelPosition");

        that._outsideConstantLines.concat(that._insideConstantLines || []).forEach(function(item) {
            var coord = that._getConstantLinePos(item.options.value, canvasStartEnd.start, canvasStartEnd.end).value;

            item.label && item.label.attr(that._getConstantLineLabelsCoords(coord, item.labelOptions));

            item.line && item.line.attr(that._getConstantLineGraphicAttributes(coord));
        });

        (that._strips || []).forEach(function(item) {
            var range = that._translator.getBusinessRange(),
                stripPos = that._getStripPos(item.options.startValue, item.options.endValue, canvasStartEnd.start, canvasStartEnd.end, range);

            item.label && item.label.attr(that._getStripLabelCoords(stripPos.from, stripPos.to, item.options.label));

            item.rect && item.rect.attr(that._getStripGraphicAttributes(stripPos.from, stripPos.to));
        });

        that._updateTitleCoords();
        that._checkTitleOverflow();

        updateGridsPosition(that._majorTicks);
        updateGridsPosition(that._minorTicks);
    },

    applyClipRects: function(elementsClipID, canvasClipID) {
        this._axisGroup.attr({ "clip-path": canvasClipID });
        this._axisStripGroup.attr({ "clip-path": elementsClipID });
    },

    validate: function(isArgumentAxis) {
        var that = this,
            options = that._options,
            dataType = isArgumentAxis ? options.argumentType : options.valueType,
            parser = dataType ? parseUtils.getParser(dataType) : function(unit) { return unit; };

        that.parser = parser;
        options.dataType = dataType;

        if(options.min !== undefined) {
            options.min = that._validateUnit(options.min, "E2106");
        }
        if(options.max !== undefined) {
            options.max = that._validateUnit(options.max, "E2106");
        }

        if(that._minBound !== undefined) {
            that._minBound = that._validateUnit(that._minBound);
        }

        if(that._maxBound !== undefined) {
            that._maxBound = that._validateUnit(that._maxBound);
        }
    },

    zoom: function(min, max, skipAdjusting) {
        var that = this,
            minOpt = that._options.min,
            maxOpt = that._options.max,
            stick = skipAdjusting,
            businessRange = new rangeModule.Range(this._storedBusinessRange),
            translatorRange = this._translator.getBusinessRange(),
            isDiscrete = that._options.type === constants.discrete;

        skipAdjusting = skipAdjusting || isDiscrete;

        min = that._validateUnit(min);
        max = that._validateUnit(max);

        if(!isDiscrete && _isDefined(min) && _isDefined(max) && min > max) {
            max = [min, min = max][0];
        }

        if(!skipAdjusting) {
            if(minOpt !== undefined) {
                min = minOpt > min ? minOpt : min;
                max = minOpt > max ? minOpt : max;
            }
            if(maxOpt !== undefined) {
                max = maxOpt < max ? maxOpt : max;
                min = maxOpt < min ? maxOpt : min;
            }
        }

        that._zoomArgs = { min: min, max: max, stick: stick };

        businessRange.minVisible = min;
        businessRange.maxVisible = max;

        if(stick && !isDiscrete) {
            businessRange.min = translatorRange.min;
            businessRange.max = translatorRange.max;
            businessRange.stick = stick;
        }

        this._updateBusinessRange(businessRange);

        return that._zoomArgs;
    },

    resetZoom: function() {
        this._zoomArgs = null;
    },

    getViewport: function() {
        var that = this,
            minOpt = that._options.min,
            maxOpt = that._options.max;

        if(that._zoomArgs) {
            return that._zoomArgs;
        }

        if(_isDefined(minOpt) || _isDefined(maxOpt)) {
            return {
                min: minOpt,
                max: maxOpt
            };
        }
    },

    getRangeData: function() {
        var that = this,
            options = that._options,
            minMax = that._getMinMax(),
            min = minMax.min,
            max = minMax.max,
            zoomArgs = that._zoomArgs || {},
            type = options.type,
            rangeMin,
            rangeMax,
            rangeMinVisible,
            rangeMaxVisible;

        if(type === constants.logarithmic) {
            min = min <= 0 ? undefined : min;
            max = max <= 0 ? undefined : max;
        }

        if(type !== constants.discrete) {
            rangeMin = min;
            rangeMax = max;
            if(_isDefined(min) && _isDefined(max)) {
                rangeMin = min < max ? min : max;
                rangeMax = max > min ? max : min;
            }
            rangeMinVisible = _isDefined(zoomArgs.min) ? zoomArgs.min : rangeMin;
            rangeMaxVisible = _isDefined(zoomArgs.max) ? zoomArgs.max : rangeMax;
        } else {
            rangeMinVisible = _isDefined(zoomArgs.min) ? zoomArgs.min : min;
            rangeMaxVisible = _isDefined(zoomArgs.max) ? zoomArgs.max : max;
        }

        return {
            min: rangeMin,
            max: rangeMax,
            stick: that._getStick(),
            categories: options.categories,
            dataType: options.dataType,
            axisType: type,
            base: options.logarithmBase,
            invert: options.inverted,
            addSpiderCategory: that._getSpiderCategoryOption(),
            minVisible: rangeMinVisible,
            maxVisible: rangeMaxVisible
        };
    },

    getFullTicks: function() {
        return this._tickManager.getFullTicks();
    },

    measureLabels: function(withIndents) {
        var that = this,
            options = that._options,
            widthAxis = options.visible ? options.width : 0,
            ticks,
            maxText,
            text,
            box,
            indent = withIndents ? options.label.indentFromAxis + (options.tick.length * 0.5) : 0;

        if(!options.label.visible || !that._axisElementsGroup) {
            return { height: widthAxis, width: widthAxis, x: 0, y: 0 };
        }

        ticks = that._tickManager.getTicks();
        maxText = ticks.reduce(function(prevValue, tick, index) {
            var label = that._formatTickLabel(tick);
            if(prevValue[0].length < label.length) {
                return [label, tick];
            } else {
                return prevValue;
            }
        }, [that._formatTickLabel(ticks[0]), ticks[0]]);

        text = that._renderer.text(maxText[0], 0, 0).css(that._textFontStyles).attr(that._textOptions).append(that._renderer.root);
        box = text.getBBox();

        text.remove();
        return { x: box.x, y: box.y, width: box.width + indent, height: box.height + indent };
    },

    _setLabelsPlacement: function() {
        if(!this._options.label.visible) {
            return;
        }
        var that = this,
            labelOpt = that._options.label,
            displayMode = that._validateDisplayMode(labelOpt.displayMode),
            overlappingMode = that._validateOverlappingMode(labelOpt.overlappingBehavior.mode, displayMode),
            rotationAngle = labelOpt.overlappingBehavior.rotationAngle, //DEPRECATED 17_1
            staggeringSpacing = labelOpt.overlappingBehavior.staggeringSpacing, //DEPRECATED 17_1
            ignoreOverlapping = overlappingMode === "none" || overlappingMode === "ignore",
            behavior = {
                rotationAngle: _isDefined(rotationAngle) ? rotationAngle : labelOpt.rotationAngle,
                staggeringSpacing: _isDefined(staggeringSpacing) ? staggeringSpacing : labelOpt.staggeringSpacing
            },
            notRecastStep,
            boxes = that._majorTicks.map(function(tick) { return tick.labelBBox; }),
            step;

        step = that._getStep(boxes);
        switch(displayMode) {
            case "rotate":
                if(ignoreOverlapping) {
                    notRecastStep = true;
                    step = 1;
                }
                that._applyLabelMode(displayMode, step, boxes, labelOpt, notRecastStep);
                break;
            case "stagger":
                if(ignoreOverlapping) {
                    step = 2;
                }
                that._applyLabelMode(displayMode, _max(step, 2), boxes, labelOpt);
                break;
            default:
                that._applyLabelOverlapping(boxes, overlappingMode, step, behavior);
        }
    },

    _applyLabelOverlapping: function(boxes, mode, step, behavior) {
        var that = this,
            labelOpt = that._options.label,
            majorTicks = that._majorTicks;

        if(mode === "none" || mode === "ignore") {
            return;
        }
        var checkLabels = function(box, index, array) {
            if(index === 0) {
                return false;
            }
            return constants.areLabelsOverlap(box, array[index - 1], labelOpt.minSpacing, labelOpt.alignment);
        };
        if(step > 1 && boxes.some(checkLabels)) {
            that._applyLabelMode(mode, step, boxes, behavior);
        }
        if(mode === "hide") {
            that._checkBoundedLabelsOverlapping(step, majorTicks, boxes);
        }
    },

    _applyLabelMode: function(mode, step, boxes, behavior, notRecastStep) {
        var that = this,
            majorTicks = that._majorTicks,
            labelOpt = that._options.label,
            angle = behavior.rotationAngle,
            labelHeight,
            alignment,
            func;
        switch(mode) {
            case "rotate":
                if(!labelOpt.userAlignment) {
                    alignment = angle < 0 ? RIGHT : LEFT;
                    if(angle % 90 === 0) {
                        alignment = CENTER;
                    }
                }
                step = notRecastStep ? step : that._getStep(boxes, angle);
                func = function(tick) {
                    tick.label.rotate(angle);
                    tick.labelRotationAngle = angle;
                    alignment && (tick.labelAlignment = alignment);
                };
                updateLabels(majorTicks, step, func);
                break;
            case "stagger":
                labelHeight = that._getMaxLabelHeight(that._options.position === TOP, boxes, behavior.staggeringSpacing);

                func = function(tick, index) {
                    if((index / (step - 1)) % 2 !== 0) {
                        tick.labelOffset = labelHeight;
                    }
                };
                updateLabels(majorTicks, step - 1, func);
                break;
            case "auto":
            case "_auto":
                if(step === 2) {
                    that._applyLabelMode("stagger", step, boxes, behavior);
                } else {
                    that._applyLabelMode("rotate", step, boxes, { rotationAngle: getOptimalAngle(boxes, labelOpt) });
                }
                break;
            default:
                updateLabels(majorTicks, step);
                break;
        }
    },

    getMarkerTrackers: _noop,

    _drawDateMarkers: _noop,

    _adjustDateMarkers: _noop,

    coordsIn: _noop,

    _getSkippedCategory: _noop,

    _initAxisPositions: _noop,

    _drawTitle: _noop,

    _updateTitleCoords: _noop,

    _adjustConstantLineLabels: _noop,

    _createTranslator: function() {
        return new Translator2DModule.Translator2D({}, {}, {});
    },

    _updateTranslator: function() {
        this._translator.update({}, {}, {
            isHorizontal: this._isHorizontal,
            interval: this._options.semiDiscreteInterval
        });
    },

    _adjustTitle: _noop,

    _checkTitleOverflow: _noop,

    getSpiderTicks: _noop,

    setSpiderTicks: _noop,

    _checkBoundedLabelsOverlapping: _noop,

    _getAlignment: _noop,

    ///#DEBUG
    _getTickMarkPoints: _noop,
    _validateOverlappingMode: _noop,
    _getStep: _noop,
    _validateDisplayMode: _noop,
    shift: _noop
    ///#ENDDEBUG
};
