"use strict";

var $ = require("jquery"),
    vizUtils = require("../core/utils"),
    commonUtils = require("../../core/utils/common"),
    constants = require("./axes_constants"),
    parseUtils = require("../components/parse_utils"),
    tickManagerModule = require("./base_tick_manager"),
    formatLabel = constants.formatLabel,
    convertTicksToValues = constants.convertTicksToValues,
    convertValuesToTicks = constants.convertValuesToTicks,

    _isDefined = commonUtils.isDefined,
    _isNumber = commonUtils.isNumber,
    _getSignificantDigitPosition = vizUtils.getSignificantDigitPosition,
    _roundValue = vizUtils.roundValue,
    patchFontOptions = vizUtils.patchFontOptions,

    _math = Math,
    _abs = _math.abs,
    _round = _math.round,

    _extend = $.extend,
    _each = $.each,
    _noop = $.noop,

    DEFAULT_AXIS_LABEL_SPACING = 5,
    MAX_GRID_BORDER_ADHENSION = 4,

    LABEL_BACKGROUND_PADDING_X = 8,
    LABEL_BACKGROUND_PADDING_Y = 4,

    Axis;

function hasCategories(range) {
    return range.categories && range.categories.length;
}

function validateAxisOptions(options) {
    var labelOptions = options.label,
        position = options.position,
        defaultPosition = options.isHorizontal ? constants.bottom : constants.left,
        secondaryPosition = options.isHorizontal ? constants.top : constants.right;

    if(position !== defaultPosition && position !== secondaryPosition) {
        position = defaultPosition;
    }

    if(position === constants.right && !labelOptions.userAlignment) {
        labelOptions.alignment = constants.left;
    }

    options.position = position;
    options.hoverMode = options.hoverMode ? options.hoverMode.toLowerCase() : "none";
    labelOptions.minSpacing = _isDefined(labelOptions.minSpacing) ? labelOptions.minSpacing : DEFAULT_AXIS_LABEL_SPACING;
}

function findSkippedIndexCategory(ticks, skippedCategory) {
    var i = ticks.length;
    if(skippedCategory !== undefined) {
        while(i--) {
            if(ticks[i].value === skippedCategory) {
                return i;
            }
        }
    }

    return -1;
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
};

Axis.prototype = {
    constructor: Axis,

    //private
    _updateIntervalAndBounds: function() {
        var that = this,
            i,
            ticks,
            length,
            minInterval,
            translator = that._translator,
            businessRange = translator.getBusinessRange(),
            bounds;

        if(!hasCategories(businessRange)) {
            ticks = that.getMajorTicks(true);
            length = ticks.length;
            if(!businessRange.isSynchronized) {
                bounds = this._tickManager.getTickBounds();
            }
            if(length > 1) {
                minInterval = _abs(ticks[0].value - ticks[1].value);
                for(i = 1; i < length - 1; i++) {
                    minInterval = Math.min(_abs(ticks[i].value - ticks[i + 1].value), minInterval);
                }
                bounds = _extend({ interval: minInterval }, bounds);
            }

            if(bounds) {
                businessRange.addRange(bounds);
                translator.reinit();
            }
        }
    },

    _createAllTicks: function(businessRange) {

        var that = this;
        that._boundaryTicks = that._getBoundaryTicks();
        that._majorTicks = that.getMajorTicks(that._options.withoutOverlappingBehavior);
        that._decimatedTicks = hasCategories(businessRange) || that._options.type === "semidiscrete" ? that.getDecimatedTicks() : [];
        that._minorTicks = that.getMinorTicks();
    },

    _drawAxis: function() {
        var that = this,
            options = that._options,
            axis = that._createAxis({ "stroke-width": options.width, stroke: options.color, "stroke-opacity": options.opacity });

        axis.append(that._axisLineGroup);
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
            customTicks = options.customTicks || (hasCategories({ categories: categories }) ? categories : that._majorTicks && that._majorTicks.length && convertTicksToValues(that._majorTicks)),
            customMinorTicks = options.customMinorTicks || (that._minorTicks && that._minorTicks.length && convertTicksToValues(that._minorTicks));

        if(_isNumber(min) && options.type !== constants.logarithmic) {
            min = that._correctMinForTicks(min, max, screenDelta);
        }

        return { min: min, max: max, customTicks: customTicks, customMinorTicks: customMinorTicks, customBoundTicks: options.customBoundTicks, screenDelta: screenDelta };
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
            useTicksAutoArrangement: options.useTicksAutoArrangement,
            showCalculatedTicks: options.tick.showCalculatedTicks, //DEPRECATED IN 15_2
            showMinorCalculatedTicks: options.minorTick.showCalculatedTicks //DEPRECATED IN 15_2
        };
    },

    _getBoundaryTicks: function() {
        var categories = this._translator.getVisibleCategories() || this._translator.getBusinessRange().categories,
            boundaryValues = hasCategories({ categories: categories }) && this._tickOffset ? [categories[0], categories[categories.length - 1]] : this._tickManager.getBoundaryTicks();

        return convertValuesToTicks(boundaryValues);
    },

    _createTickManager: function() {
        return new tickManagerModule.TickManager({}, {}, { overlappingBehaviorType: this._overlappingBehaviorType });
    },

    _getMarginsOptions: function() {
        var range = this._translator.getBusinessRange();
        return {
            stick: range.stick || this._options.stick,
            minStickValue: range.minStickValue,
            maxStickValue: range.maxStickValue,
            percentStick: range.percentStick,
            minValueMargin: this._options.minValueMargin,
            maxValueMargin: this._options.maxValueMargin,
            minSpaceCorrection: range.minSpaceCorrection,
            maxSpaceCorrection: range.maxSpaceCorrection
        };
    },

    _updateTickManager: function() {
        var overlappingOptions = this._getOverlappingBehaviorOptions(),
            options;

        options = _extend(true, this._getMarginsOptions(), overlappingOptions, this._getTicksOptions());
        this._tickManager.update(this._getTickManagerTypes(), this._getTickManagerData(), options);
    },

    _correctLabelAlignment: function() {
        var that = this,
            labelOptions = that._options.label,
            overlappingBehavior = that._tickManager.getOverlappingBehavior();

        if(overlappingBehavior && overlappingBehavior.mode === "rotate") {
            that._textOptions.rotate = overlappingBehavior.rotationAngle;
            if(!labelOptions.userAlignment) {
                that._textOptions.align = constants.left;
            }
        } else {
            if(!labelOptions.userAlignment) {
                that._textOptions.align = labelOptions.alignment;
            }
        }
    },

    _correctLabelFormat: function() {
        this._options.label = this._tickManager.getOptions().labelOptions;
    },


    _deleteLabels: function() {
        this._axisElementsGroup && this._axisElementsGroup.clear();
    },

    _drawTicks: function(ticks) {
        var that = this,
            group = that._axisLineGroup;

        _each(ticks || [], function(_, tick) {
            var coord = that._getTickCoord(tick),
                points;

            if(coord) {
                points = that._isHorizontal ? [coord.x1, coord.y1, coord.x2, coord.y2] : [coord.y1, coord.x1, coord.y2, coord.x2];

                tick.graphic = that._createPathElement(points, tick.tickStyle).append(group);
                coord.angle && that._rotateTick(tick, coord.angle);
            }
        });
    },

    _createPathElement: function(points, attr) {
        return this._renderer.path(points, "line").attr(attr).sharp(this._getSharpParam());
    },

    _createAxis: function(options) {
        return this._createAxisElement().attr(options).sharp(this._getSharpParam(true));
    },

    _drawLabels: function() {
        var that = this,
            renderer = that._renderer,
            group = that._axisElementsGroup,
            emptyStrRegExp = /^\s+$/;

        _each(that._majorTicks, function(_, tick) {
            var text = tick.labelText,
                xCoord,
                yCoord;

            if(_isDefined(text) && text !== "" && !emptyStrRegExp.test(text)) {
                xCoord = that._isHorizontal ? tick.labelPos.x : tick.labelPos.y;
                yCoord = that._isHorizontal ? tick.labelPos.y : tick.labelPos.x;
                if(!tick.label) {
                    tick.label = renderer.text(text, xCoord, yCoord).css(tick.labelFontStyle).attr(tick.labelStyle).append(group);
                } else {
                    tick.label.css(tick.labelFontStyle).attr(tick.labelStyle).attr({ text: text, x: xCoord, y: yCoord });
                }

                tick.label.data({ "chart-data-argument": tick.value });
            }
        });
    },

    _getGridLineDrawer: function(borderOptions) {
        var that = this,
            translator = that._translator,
            additionalTranslator = that._additionalTranslator,
            isHorizontal = that._isHorizontal,
            canvasStart = isHorizontal ? constants.left : constants.top,
            canvasEnd = isHorizontal ? constants.right : constants.bottom,
            positionFrom = additionalTranslator.translateSpecialCase(constants.canvasPositionStart),
            positionTo = additionalTranslator.translateSpecialCase(constants.canvasPositionEnd),
            firstBorderLinePosition = (borderOptions.visible && borderOptions[canvasStart]) ? translator.translateSpecialCase(constants.canvasPositionPrefix + canvasStart) : undefined,
            lastBorderLinePosition = (borderOptions.visible && borderOptions[canvasEnd]) ? translator.translateSpecialCase(constants.canvasPositionPrefix + canvasEnd) : undefined,
            getPoints = isHorizontal ? function(tick) { return tick.posX !== null ? [tick.posX, positionFrom, tick.posX, positionTo] : null; } : function(tick) { return tick.posX !== null ? [positionFrom, tick.posX, positionTo, tick.posX] : null; },
            minDelta = MAX_GRID_BORDER_ADHENSION + firstBorderLinePosition,
            maxDelta = lastBorderLinePosition - MAX_GRID_BORDER_ADHENSION;

        return function(tick) {
            if(tick.posX === undefined || (tick.posX < minDelta || tick.posX > maxDelta)) return;
            var points = getPoints(tick);
            return points && that._createPathElement(points, tick.gridStyle);
        };
    },

    _drawGrids: function(ticks, borderOptions) {
        var that = this,
            group = that._axisGridGroup,
            tick,
            i = 0,
            length = ticks.length,
            drawLine = that._getGridLineDrawer(borderOptions || { visible: false });

        for(i; i < length; i++) {
            tick = ticks[i];
            tick.grid = drawLine(tick);
            tick.grid && tick.grid.append(group);
        }
    },

    _getConstantLinePos: function(lineValue, canvasStart, canvasEnd) {
        var parsedValue = this._validateUnit(lineValue, "E2105", "constantLine"),
            value = this._getTranslatedCoord(parsedValue);

        if(!_isDefined(value) || value < _math.min(canvasStart, canvasEnd) || value > _math.max(canvasStart, canvasEnd)) {
            return {};
        }

        return { value: value, parsedValue: parsedValue };
    },

    _createConstantLine: function(value, attr) {
        var that = this,
            additionalTranslator = this._additionalTranslator,
            positionFrom = additionalTranslator.translateSpecialCase(constants.canvasPositionStart),
            positionTo = additionalTranslator.translateSpecialCase(constants.canvasPositionEnd),
            points = this._isHorizontal ? [value, positionTo, value, positionFrom] : [positionFrom, value, positionTo, value];

        return that._createPathElement(points, attr);
    },

    _drawConstantLinesAndLabels: function(lineOptions, canvasStart, canvasEnd) {
        if(!_isDefined(lineOptions.value)) {
            return;
        }
        var that = this,
            pos = that._getConstantLinePos(lineOptions.value, canvasStart, canvasEnd),
            labelOptions = lineOptions.label || {},
            value = pos.value,
            attr = { stroke: lineOptions.color, "stroke-width": lineOptions.width, dashStyle: lineOptions.dashStyle };

        if(!_isDefined(value)) {
            that._constantLines.push(null);
            if(labelOptions.visible) {
                that._constantLineLabels.push(null);
            }
            return;
        }

        that._constantLines.push(that._createConstantLine(value, attr).append(that._axisConstantLineGroup));
        that._constantLineLabels.push(labelOptions.visible ? that._drawConstantLineLabels(pos.parsedValue, labelOptions, value) : null);
    },

    _drawConstantLine: function() {
        var that = this,
            options = that._options,
            data = options.constantLines,
            canvas = that._getCanvasStartEnd();

        if(that._translator.getBusinessRange().stubData) {
            return;
        }

        that._constantLines = [];
        that._constantLineLabels = [];
        _each(data, function(_, dataItem) {
            that._drawConstantLinesAndLabels(dataItem, canvas.start, canvas.end);
        });
    },

    _drawConstantLineLabels: function(parsedValue, lineLabelOptions, value) {
        var that = this,
            text = lineLabelOptions.text,
            options = that._options,
            labelOptions = options.label,
            coords;

        that._checkAlignmentConstantLineLabels(lineLabelOptions);

        text = _isDefined(text) ? text : formatLabel(parsedValue, labelOptions);
        coords = that._getConstantLineLabelsCoords(value, lineLabelOptions);

        return that._renderer.text(text, coords.x, coords.y).css(patchFontOptions(_extend({}, labelOptions.font, lineLabelOptions.font))).attr({ align: coords.align }).append(that._axisConstantLineGroup);
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
                startCategoryIndex = $.inArray(startValue, categories);
                endCategoryIndex = $.inArray(endValue, categories);
                if(startCategoryIndex === -1 || endCategoryIndex === -1) {
                    return { stripFrom: 0, stripTo: 0 };
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

        return (start < end) ? { stripFrom: start, stripTo: end } : { stripFrom: end, stripTo: start };
    },

    _createStrip: function(fromPoint, toPoint, attr) {
        var x,
            y,
            width,
            height,
            additionalTranslator = this._additionalTranslator,
            positionFrom = additionalTranslator.translateSpecialCase(constants.canvasPositionStart),
            positionTo = additionalTranslator.translateSpecialCase(constants.canvasPositionEnd);

        if(this._isHorizontal) {
            x = fromPoint;
            y = _math.min(positionFrom, positionTo);
            width = toPoint - fromPoint;
            height = _abs(positionFrom - positionTo);
        } else {
            x = _math.min(positionFrom, positionTo);
            y = fromPoint;
            width = _abs(positionFrom - positionTo);
            height = _abs(fromPoint - toPoint);
        }

        return this._renderer.rect(x, y, width, height).attr(attr);
    },

    _drawStrip: function() {
        var that = this,
            options = that._options,
            stripData = options.strips,
            canvas = this._getCanvasStartEnd(),
            i,
            stripOptions,
            stripPos,
            stripLabelOptions,
            attr,
            range = that._translator.getBusinessRange();

        if(range.stubData) {
            return;
        }

        that._strips = [];

        for(i = 0; i < stripData.length; i++) {
            stripOptions = stripData[i];
            stripLabelOptions = stripOptions.label || {};
            attr = { fill: stripOptions.color };

            if((_isDefined(stripOptions.startValue) || _isDefined(stripOptions.endValue)) && _isDefined(stripOptions.color)) {
                stripPos = that._getStripPos(stripOptions.startValue, stripOptions.endValue, canvas.start, canvas.end, range);

                if((stripPos.stripTo - stripPos.stripFrom === 0) || (!_isDefined(stripPos.stripTo)) || (!_isDefined(stripPos.stripFrom))) {
                    continue;
                }
                that._strips.push({
                    rect: that._createStrip(stripPos.stripFrom, stripPos.stripTo, attr).append(that._axisStripGroup),
                    options: stripOptions,
                    label: stripLabelOptions.text ? that._drawStripLabel(stripLabelOptions, stripPos.stripFrom, stripPos.stripTo) : null
                });
            }
        }
    },

    _drawStripLabel: function(stripLabelOptions, stripFrom, stripTo) {
        var that = this,
            options = that._options,
            coords = that._getStripLabelCoords(stripLabelOptions, stripFrom, stripTo);

        return that._renderer.text(stripLabelOptions.text, coords.x, coords.y).css(patchFontOptions(_extend({}, options.label.font, stripLabelOptions.font))).attr({ align: coords.align }).append(that._axisLabelGroup);
    },

    _adjustStripLabels: function() {
        var strips = this._strips,
            label,
            i,
            coords;

        if(strips === undefined) {
            return;
        }

        for(i = 0; i < strips.length; i++) {
            label = strips[i].label;
            if(label) {
                coords = this._getAdjustedStripLabelCoords(strips[i]);
                label.move(coords.x, coords.y);
            }
        }
    },

    _adjustLabels: function() {
        var that = this,
            options = that._options,
            majorTicks = that._majorTicks,
            majorTicksLength = majorTicks.length,
            isHorizontal = that._isHorizontal,
            overlappingBehavior = that._tickManager ? that._tickManager.getOverlappingBehavior() : options.label.overlappingBehavior,
            position = options.position,
            label,
            labelHeight,
            isNeedLabelAdjustment,
            staggeringSpacing,
            i,
            box,
            hasLabels = false,
            boxAxis = that._axisElementsGroup && that._axisElementsGroup.getBBox() || {};

        _each(majorTicks, function(_, tick) {
            if(tick.label) {
                tick.label.attr(that._getLabelAdjustedCoord(tick, boxAxis));
                hasLabels = true;
            }
        });

        isNeedLabelAdjustment = hasLabels && isHorizontal && overlappingBehavior && overlappingBehavior.mode === "stagger";

        if(isNeedLabelAdjustment) {
            labelHeight = 0;
            for(i = 0; i < majorTicksLength; i = i + 2) {
                label = majorTicks[i].label;
                box = label && label.getBBox() || {};
                if(box.height > labelHeight) {
                    labelHeight = box.height;
                }
            }
            staggeringSpacing = overlappingBehavior.staggeringSpacing;

            labelHeight = _round(labelHeight) + staggeringSpacing;
            for(i = 1; i < majorTicksLength; i = i + 2) {
                label = majorTicks[i].label;
                if(label) {
                    if(position === constants.bottom) {
                        label.move(0, labelHeight);
                    } else if(position === constants.top) {
                        label.move(0, -labelHeight);
                    }
                }
            }
            for(i = 0; i < majorTicksLength; i++) {
                majorTicks[i].label && majorTicks[i].label.rotate(0);
            }
        }
    },

    _getLabelAdjustedCoord: function(tick, boxAxis) {
        var that = this,
            options = that._options,
            box = tick.label.getBBox(),
            x,
            y,
            isHorizontal = that._isHorizontal,
            position = options.position,
            shift = that.padding && that.padding[position] || 0,
            textOptions = that._textOptions,
            labelSettingsY = tick.label.attr("y");

        if(isHorizontal && position === constants.bottom) {
            y = 2 * labelSettingsY - box.y + shift;
        } else if(!isHorizontal) {
            if(position === constants.left) {
                if(textOptions.align === constants.right) {
                    x = box.x + box.width - shift;
                } else if(textOptions.align === constants.center) {
                    x = box.x + box.width / 2 - shift - (boxAxis.width / 2 || 0);
                } else {
                    x = box.x - shift - (boxAxis.width || 0);
                }
            } else {
                if(textOptions.align === constants.center) {
                    x = box.x + box.width / 2 + (boxAxis.width / 2 || 0) + shift;
                } else if(textOptions.align === constants.right) {
                    x = box.x + box.width + (boxAxis.width || 0) + shift;
                } else {
                    x = box.x + shift;
                }
            }
            y = labelSettingsY + ~~(labelSettingsY - box.y - box.height / 2);
        } else if(isHorizontal && position === constants.top) {
            y = 2 * labelSettingsY - box.y - box.height - shift;
        }

        return { x: x, y: y };
    },

    _createAxisGroups: function() {
        var that = this,
            renderer = that._renderer,
            classSelector = that._axisCssPrefix;

        that._axisGroup = renderer.g().attr({ "class": classSelector + "axis" });
        that._axisStripGroup = renderer.g().attr({ "class": classSelector + "strips" });
        that._axisGridGroup = renderer.g().attr({ "class": classSelector + "grid" });
        that._axisElementsGroup = renderer.g().attr({ "class": classSelector + "elements" }).append(that._axisGroup);
        that._axisLineGroup = renderer.g().attr({ "class": classSelector + "line" }).append(that._axisGroup);
        that._axisTitleGroup = renderer.g().attr({ "class": classSelector + "title" }).append(that._axisGroup);
        that._axisConstantLineGroup = renderer.g().attr({ "class": classSelector + "constant-lines" });
        that._axisLabelGroup = renderer.g().attr({ "class": classSelector + "axis-labels" });
    },

    _clearAxisGroups: function(adjustAxis) {
        var that = this,
            classSelector = that._axisCssPrefix;

        that._axisGroup.remove();
        that._axisStripGroup.remove();
        that._axisLabelGroup.remove();
        that._axisConstantLineGroup.remove();
        that._axisGridGroup.remove();

        if(that._axisTitleGroup) {
            that._axisTitleGroup.clear();
        } else {
            if(!adjustAxis) {
                that._axisTitleGroup = that._renderer.g().attr({ "class": classSelector + "title" }).append(that._axisGroup);
            }
        }

        if(that._axisElementsGroup) {
            that._axisElementsGroup.clear();
        } else {
            if(!adjustAxis) {
                that._axisElementsGroup = that._renderer.g().attr({ "class": classSelector + "elements" }).append(that._axisGroup);
            }
        }

        that._axisLineGroup && that._axisLineGroup.clear();
        that._axisStripGroup && that._axisStripGroup.clear();
        that._axisGridGroup && that._axisGridGroup.clear();
        that._axisConstantLineGroup && that._axisConstantLineGroup.clear();
        that._axisLabelGroup && that._axisLabelGroup.clear();
    },

    _initTickCoord: function(tick, offset) {
        var coord = this._getTranslatedValue(tick.value, this._axisPosition, offset);
        tick.posX = coord.x;
        tick.posY = coord.y;
        tick.angle = coord.angle;
    },

    _initTickStyle: function(tick, style) {
        tick.length = style.length;
        tick.tickStyle = tick.withoutPath ? { stroke: "none", "stroke-width": 0, "stroke-opacity": 0 } : style.tickStyle;
        tick.gridStyle = style.gridStyle;
    },

    _initTickLabel: function(tick, position) {
        var that = this,
            customizeColor = that._options.label.customizeColor;

        tick.labelText = formatLabel(tick.value, that._options.label, { min: that._minBound, max: that._maxBound });
        tick.labelPos = that._getTranslatedValue(tick.value, position);
        tick.labelStyle = that._textOptions;
        tick.labelFontStyle = _extend({}, that._textFontStyles);
        if(customizeColor && customizeColor.call) {
            tick.labelFontStyle.fill = customizeColor.call(tick, tick);
        }
        tick.labelHint = constants.formatHint(tick.value, that._options.label, { min: that._minBound, max: that._maxBound });
    },

    _getTickStyle: function(tickOptions, gridOptions) {
        return {
            tickStyle: { stroke: tickOptions.color, "stroke-width": tickOptions.width, "stroke-opacity": tickOptions.opacity },
            gridStyle: { stroke: gridOptions.color, "stroke-width": gridOptions.width, "stroke-opacity": gridOptions.opacity },
            length: tickOptions.length
        };
    },

    _initTicks: function(ticks, style, withLabels, skippedCategory, offset, labelPosition) {
        var that = this,
            i = 0,
            length = ticks.length,
            indexSkippedCategory = findSkippedIndexCategory(ticks, skippedCategory),
            tick;

        for(i; i < length; i++) {
            tick = ticks[i];
            (i !== indexSkippedCategory) && that._initTickCoord(tick, offset);
            that._initTickStyle(tick, style);
            withLabels && !tick.withoutLabel && that._initTickLabel(tick, labelPosition);
        }
    },

    _initAllTicks: function() {
        var that = this,
            options = that._options,
            majorTickStyle = that._getTickStyle(options.tick, options.grid),
            minorTickStyle = that._getTickStyle(options.minorTick, options.minorGrid),
            skippedCategory = that._getSkippedCategory(),
            boundaryTicks = this._boundaryTicks,
            withLabels = options.label.visible && that._axisElementsGroup && !that._translator.getBusinessRange().stubData,
            labelPosition = that.getLabelsPosition(),
            offset = that._tickOffset;

        that._initTicks(that._majorTicks, majorTickStyle, withLabels, skippedCategory, offset, labelPosition);
        that._initTicks(that._minorTicks, minorTickStyle, false, undefined, offset);
        that._initTicks(that._decimatedTicks, majorTickStyle, false, skippedCategory, offset);

        if(options.showCustomBoundaryTicks && boundaryTicks.length) {
            that._initTicks([boundaryTicks[0]], majorTickStyle, false, -1, -1);
            boundaryTicks.length > 1 && that._initTicks([boundaryTicks[1]], majorTickStyle, false, -1, 1);
        }
    },

    _buildTicks: function() {
        var that = this;
        that._createAllTicks(that._translator.getBusinessRange());
        that._correctLabelAlignment();
        that._correctLabelFormat();
    },

    _setTickOffset: function() {
        var options = this._options,
            discreteAxisDivisionMode = options.discreteAxisDivisionMode;
        this._tickOffset = +(discreteAxisDivisionMode !== "crossLabels" || !discreteAxisDivisionMode);
    },

    _createHints: function() {
        var that = this;

        _each(that._majorTicks || [], function(_, tick) {
            var labelHint = tick.labelHint;
            if(_isDefined(labelHint) && labelHint !== "") {
                tick.label.setTitle(labelHint);
            }
        });
    },

    _setBoundingRect: function() {
        var that = this,
            options = that._options,
            axisBox = that._axisElementsGroup ? that._axisElementsGroup.getBBox() : { x: 0, y: 0, width: 0, height: 0, isEmpty: true },
            lineBox = that._axisLineGroup.getBBox(),
            placeholderSize = options.placeholderSize,
            start,
            isHorizontal = that._isHorizontal,
            coord = isHorizontal ? "y" : "x",
            side = isHorizontal ? "height" : "width",
            shiftCoords = options.crosshairEnabled ? (isHorizontal ? LABEL_BACKGROUND_PADDING_Y : LABEL_BACKGROUND_PADDING_X) : 0,
            axisTitleBox = (that._title && that._axisTitleGroup) ? that._axisTitleGroup.getBBox() : axisBox;

        if(axisBox.isEmpty && axisTitleBox.isEmpty && !placeholderSize) {
            that.boundingRect = axisBox;
            return;
        }

        start = lineBox[coord] || that._axisPosition;

        if(options.position === (isHorizontal && constants.bottom || constants.right)) {
            axisBox[side] = (placeholderSize || (axisTitleBox[coord] + axisTitleBox[side]) - start + shiftCoords);
            axisBox[coord] = start;
        } else {
            axisBox[side] = (placeholderSize || (lineBox[side] + start - axisTitleBox[coord]) + shiftCoords);
            axisBox[coord] = (axisTitleBox.isEmpty ? start : axisTitleBox[coord] - shiftCoords);
        }
        that.boundingRect = axisBox;
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
        that._axisStripGroup = that._axisConstantLineGroup = that._axisLabelGroup = null;
        that._axisLineGroup = that._axisElementsGroup = that._axisGridGroup = null;
        that._axisGroup = that._axisTitleGroup = null;
        that._axesContainerGroup = that._stripsGroup = that._constantLinesGroup = null;

        that._renderer = that._options = that._textOptions = that._textFontStyles = null;
        that._translator = that._additionalTranslator = null;
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
            align: labelOpt.alignment,
            opacity: labelOpt.opacity
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
    },

    updateSize: function(clearAxis) {
        var that = this,
            options = that._options,
            direction = that._isHorizontal ? "horizontal" : "vertical";

        if(options.title.text && that._axisTitleGroup) {
            that._incidentOccurred("W2105", [direction]);
            that._axisTitleGroup.dispose();
            that._axisTitleGroup = null;
        }
        if(clearAxis && that._axisElementsGroup && options.label.visible && !that._translator.getBusinessRange().stubData) {
            that._incidentOccurred("W2106", [direction]);
            that._axisElementsGroup.dispose();
            that._axisElementsGroup = null;
        }
        that._setBoundingRect();
    },

    setTranslator: function(translator, additionalTranslator) {
        var that = this,
            range = translator.getBusinessRange();

        this._minBound = range.minVisible;
        this._maxBound = range.maxVisible;

        that._translator = translator;
        that._additionalTranslator = additionalTranslator;

        that.resetTicks();
        that._updateIntervalAndBounds();
        that._buildTicks();
    },

    resetTicks: function() {
        this._deleteLabels();
        this._majorTicks = this._minorTicks = null;
    },

    getLabelsPosition: function() {
        var options = this._options,
            position = options.position,
            labelOffset = options.label.indentFromAxis,
            axisPosition = this._axisPosition;

        return position === constants.top || position === constants.left ? axisPosition - labelOffset : axisPosition + labelOffset;
    },

    getFormattedValue: function(value, options, point) {
        var labelOptions = this._options.label;

        return _isDefined(value) ? formatLabel(value, _extend(true, {}, labelOptions, options), undefined, point) : null;
    },

    getTicksValues: function() {
        return {
            majorTicksValues: convertTicksToValues(this._majorTicks || this.getMajorTicks()),
            minorTicksValues: convertTicksToValues(this._minorTicks || this.getMinorTicks())
        };
    },

    getMajorTicks: function(withoutOverlappingBehavior) {
        var that = this,
            overlappingBehavior = that._options.label.overlappingBehavior,
            majorTicks,
            boundedOverlappedTicks;

        that._updateTickManager();
        that._textOptions.rotate = 0;

        majorTicks = convertValuesToTicks(that._tickManager.getTicks(withoutOverlappingBehavior));
        if(majorTicks.length) {
            //DEPRECATED IN 15_2. START
            if(overlappingBehavior.hideFirstTick || overlappingBehavior.hideLastTick || overlappingBehavior.hideFirstLabel || overlappingBehavior.hideLastLabel) {
                overlappingBehavior.hideFirstLabel && (majorTicks[0].withoutLabel = true);
                overlappingBehavior.hideLastLabel && (majorTicks[majorTicks.length - 1].withoutLabel = true);
                overlappingBehavior.hideFirstTick && (majorTicks[0].withoutPath = true);
                overlappingBehavior.hideLastTick && (majorTicks[majorTicks.length - 1].withoutPath = true);
                //DEPRECATED IN 15_2. END
            } else if(!withoutOverlappingBehavior && overlappingBehavior.mode !== "ignore") {
                boundedOverlappedTicks = that._tickManager.checkBoundedTicksOverlapping();
                boundedOverlappedTicks.overlappedDates && (majorTicks[1].withoutLabel = true);
                if(boundedOverlappedTicks.overlappedStartEnd) {
                    overlappingBehavior.hideFirstOrLast === "first" ? (majorTicks[0].withoutLabel = true) : (majorTicks[majorTicks.length - 1].withoutLabel = true);
                }
            }
        }
        that._addBoundaryTick(majorTicks);

        return majorTicks;
    },

    getMinorTicks: function() {
        return convertValuesToTicks(this._tickManager.getMinorTicks());
    },

    getDecimatedTicks: function() {
        return convertValuesToTicks(this._tickManager.getDecimatedTicks());
    },

    setTicks: function(ticks) {
        this.resetTicks();
        this._majorTicks = convertValuesToTicks(ticks.majorTicks);
        this._minorTicks = convertValuesToTicks(ticks.minorTicks);
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

    drawGrids: function(borderOptions) {
        var that = this,
            options = that._options;

        borderOptions = borderOptions || {};

        that._axisGridGroup.append(that._gridContainerGroup);
        if(options.grid.visible) {
            that._drawGrids(that._majorTicks.concat(that._decimatedTicks), borderOptions);
        }
        options.minorGrid.visible && that._drawGrids(that._minorTicks, borderOptions);
    },

    draw: function(adjustAxis) {
        var that = this,
            options = that._options,
            areLabelsVisible;

        that._axisGroup && that._clearAxisGroups(adjustAxis);

        areLabelsVisible = options.label.visible && that._axisElementsGroup && !that._translator.getBusinessRange().stubData;

        that._updateIntervalAndBounds();
        that._buildTicks();

        that._initAxisPositions();
        that._initAllTicks();

        options.visible && that._drawAxis();

        if(options.tick.visible) {
            that._drawTicks(that._majorTicks);
            that._drawTicks(that._decimatedTicks);
        }
        options.minorTick.visible && that._drawTicks(that._minorTicks);

        areLabelsVisible && that._drawLabels();

        options.showCustomBoundaryTicks && this._drawTicks(that._boundaryTicks);

        that._drawTitle();

        options.strips && that._drawStrip();
        options.constantLines && that._drawConstantLine();

        that._stripsGroup && that._axisStripGroup.append(that._stripsGroup);
        that._constantLinesGroup && that._axisConstantLineGroup.append(that._constantLinesGroup);
        that._axisGroup.append(that._axesContainerGroup);
        that._labelAxesGroup && that._axisLabelGroup.append(that._labelAxesGroup);

        that._adjustConstantLineLabels();
        areLabelsVisible && that._adjustLabels();

        options.marker.visible && that._drawDateMarkers();

        that._createHints();
        that._adjustStripLabels();
        that._adjustTitle();

        that._setBoundingRect();
    },

    getBoundingRect: function() {
        return this._axisElementsGroup ? this.boundingRect : { x: 0, y: 0, width: 0, height: 0 };
    },

    shift: function(x, y) {
        this._axisGroup.attr({ translateX: x, translateY: y });
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
            maxOpt = that._options.max;

        skipAdjusting = skipAdjusting || that._options.type === constants.discrete;

        min = that._validateUnit(min);
        max = that._validateUnit(max);

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

        that._zoomArgs = { min: min, max: max };

        return that._zoomArgs;
    },

    resetZoom: function() {
        this._zoomArgs = null;
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

    _addBoundaryTick: _noop,

    getMarkerTrackers: _noop,

    measureLabels: _noop,

    _drawDateMarkers: _noop,

    coordsIn: _noop,

    _getSkippedCategory: _noop,

    _initAxisPositions: _noop,

    _drawTitle: _noop,

    _adjustConstantLineLabels: _noop,

    _adjustTitle: _noop,

    getSpiderTicks: _noop,

    setSpiderTicks: _noop,

    ///#DEBUG
    _getTickCoord: _noop
    ///#ENDDEBUG

};
