"use strict";

var formatHelper = require("../../format_helper"),
    dateUtils = require("../../core/utils/date"),
    extend = require("../../core/utils/extend").extend,
    getNextDateUnit = dateUtils.getNextDateUnit,
    correctDateWithUnitBeginning = dateUtils.correctDateWithUnitBeginning,
    noop = require("../../core/utils/common").noop,
    vizUtils = require("../core/utils"),
    _isDefined = require("../../core/utils/type").isDefined,
    constants = require("./axes_constants"),
    _extend = extend,
    _math = Math,

    CANVAS_POSITION_PREFIX = constants.canvasPositionPrefix,
    TOP = constants.top,
    BOTTOM = constants.bottom,
    LEFT = constants.left,
    RIGHT = constants.right,
    CENTER = constants.center;

function prepareDatesDifferences(datesDifferences, tickInterval) {
    var dateUnitInterval,
        i;

    if(tickInterval === "week") {
        tickInterval = "day";
    }
    if(tickInterval === "quarter") {
        tickInterval = "month";
    }
    if(datesDifferences[tickInterval]) {
        for(i = 0; i < dateUtils.dateUnitIntervals.length; i++) {
            dateUnitInterval = dateUtils.dateUnitIntervals[i];
            if(datesDifferences[dateUnitInterval]) {
                datesDifferences[dateUnitInterval] = false;
                datesDifferences.count--;
            }
            if(dateUnitInterval === tickInterval) {
                break;
            }
        }
    }
}

function getMarkerDates(min, max, markerInterval) {
    var origMin = min,
        dates;
    min = correctDateWithUnitBeginning(min, markerInterval);
    max = correctDateWithUnitBeginning(max, markerInterval);

    dates = dateUtils.getSequenceByInterval(min, max, markerInterval);
    if(dates.length && origMin > dates[0]) {
        dates = dates.slice(1);
    }
    return dates;
}

function getMarkerInterval(tickInterval) {
    var markerInterval = getNextDateUnit(tickInterval);
    if(markerInterval === "quarter") {
        markerInterval = getNextDateUnit(markerInterval);
    }
    return markerInterval;
}

function getMarkerFormat(curDate, prevDate, tickInterval, markerInterval) {
    var format = markerInterval,
        datesDifferences = prevDate && dateUtils.getDatesDifferences(prevDate, curDate);
    if(prevDate && tickInterval !== "year") {
        prepareDatesDifferences(datesDifferences, tickInterval);
        format = formatHelper.getDateFormatByDifferences(datesDifferences);
    }
    return format;
}

function getMaxSide(act, boxes) {
    return boxes.reduce(function(prevValue, box) {
        return _math.max(prevValue, act(box));
    }, 0);
}

function getDistanceByAngle(bBox, rotationAngle) {
    rotationAngle = _math.abs(rotationAngle);
    rotationAngle = (rotationAngle % 180) >= 90 ? (90 - (rotationAngle % 90)) : (rotationAngle % 90);
    var a = rotationAngle * (_math.PI / 180);

    if(a >= _math.atan(bBox.height / bBox.width)) {
        return bBox.height / _math.abs(_math.sin(a));
    } else {
        return bBox.width;
    }
}

module.exports = {
    linear: {
        _getStep: function(boxes, rotationAngle) {
            var spacing = this._options.label.minSpacing,
                func = this._isHorizontal ?
                    function(box) { return box.width + spacing; }
                    : function(box) { return box.height; },
                maxLabelLength = getMaxSide(func, boxes);

            if(rotationAngle) {
                maxLabelLength = getDistanceByAngle({ width: maxLabelLength, height: this._getMaxLabelHeight(false, boxes, 0) }, rotationAngle);
            }

            return constants.getTicksCountInRange(this._majorTicks, "posX", maxLabelLength);
        },

        _getMaxLabelHeight: function(isNegative, boxes, spacing) {
            return (isNegative ? -1 : 1) * (getMaxSide(function(box) { return box.height; }, boxes) + spacing);
        },

        _validateOverlappingMode: function(mode, displayMode) {
            if(this._isHorizontal && (displayMode === "rotate" || displayMode === "stagger") || !this._isHorizontal) {
                return constants.validateOverlappingMode(mode);
            }
            return mode;
        },

        _validateDisplayMode: function(mode) {
            return this._isHorizontal ? mode : "standard";
        },

        getMarkerTrackers: function() {
            return this._markerTrackers;
        },

        _getSharpParam: function(opposite) {
            return this._isHorizontal ^ opposite ? "h" : "v";
        },

        _createAxisElement: function() {
            var axisCoord = this._axisPosition,
                canvas = this._getCanvasStartEnd(),
                points = this._isHorizontal ? [canvas.start, axisCoord, canvas.end, axisCoord] : [axisCoord, canvas.start, axisCoord, canvas.end];

            return this._renderer.path(points, "line");
        },

        _getTranslatedCoord: function(value, offset) {
            return this._translator.translate(value, offset);
        },

        _getCanvasStartEnd: function() {
            return {
                start: this._translator.translateSpecialCase(constants.canvasPositionStart),
                end: this._translator.translateSpecialCase(constants.canvasPositionEnd)
            };
        },

        _getScreenDelta: function() {
            return _math.abs(this._translator.translateSpecialCase(constants.canvasPositionStart) - this._translator.translateSpecialCase(constants.canvasPositionEnd));
        },

        _initAxisPositions: function() {
            var that = this,
                position = that._options.position,
                delta = 0;

            if(that.delta) {
                delta = that.delta[position] || 0;
            }
            that._axisPosition = that._additionalTranslator.translateSpecialCase(CANVAS_POSITION_PREFIX + position) + delta;
        },

        _getTickCoord: function(tick) {
            var coords,
                corrections = {
                    top: -1,
                    middle: -0.5,
                    bottom: 0,
                    left: -1,
                    center: -0.5,
                    right: 0
                },
                tickCorrection = corrections[this._options.tickOrientation || "center"];

            if(_isDefined(tick.posX) && _isDefined(tick.posY)) {
                coords = { x1: tick.posX, y1: tick.posY + tickCorrection * tick.length, x2: tick.posX, y2: tick.posY + tickCorrection * tick.length + tick.length };
            } else {
                coords = null;
            }

            return coords;
        },

        _drawTitle: function() {
            var that = this,
                options = that._options,
                titleOptions = options.title,
                attr = {
                    opacity: titleOptions.opacity,
                    align: CENTER
                };

            if(!titleOptions.text || !that._axisTitleGroup) {
                return;
            }
            that._title = that._renderer.text(titleOptions.text, 0, 0).css(vizUtils.patchFontOptions(titleOptions.font)).attr(attr).append(that._axisTitleGroup);
        },

        _drawDateMarker: function(date, options) {
            var that = this,
                markerOptions = that._options.marker,
                labelPosX,
                labelPosY,
                textElement,
                text,
                textSize,
                textIndent,
                pathElement;

            if(options.x === null) return;

            if(!options.withoutStick) {
                pathElement = that._renderer.path([options.x, options.y, options.x, options.y + markerOptions.separatorHeight], "line")
                    .attr({ "stroke-width": markerOptions.width, stroke: markerOptions.color, "stroke-opacity": markerOptions.opacity, sharp: "h" })
                    .append(that._axisElementsGroup);
            }

            text = String(constants.formatLabel(date, options.labelFormat));
            textElement = that._renderer.text(text, 0, 0)
                .attr({ align: "left" })
                .css(vizUtils.patchFontOptions(markerOptions.label.font))
                .append(that._axisElementsGroup);

            textSize = textElement.getBBox();
            textIndent = markerOptions.width + markerOptions.textLeftIndent;

            labelPosX = this._translator.getBusinessRange().invert ? options.x - textIndent - textSize.width : options.x + textIndent;
            labelPosY = options.y + markerOptions.textTopIndent + (textSize.height / 2);
            textElement.move(labelPosX, labelPosY);

            return {
                labelStartPosX: labelPosX - textIndent,
                labelEndPosX: labelPosX + textSize.width,
                date: date,
                dateMarkerStartPosX: options.x,
                setTitle: function() {
                    this.title = text;
                },
                dispose: function(onlyLabel) {
                    if(!onlyLabel && pathElement) {
                        pathElement.dispose();
                        pathElement = null;
                    }
                    textElement.dispose();
                    textElement = null;
                }
            };
        },

        _drawDateMarkers: function() {
            var that = this,
                options = that._options,
                translator = that._translator,
                minBound = that._minBound,
                tickInterval,
                markerInterval,
                markerDates,
                dateMarkers = [],
                prevDateMarker,
                markersAreaTop,
                invert = translator.getBusinessRange().invert,
                xBound = translator.translateSpecialCase("canvas_position_end"),
                dateMarker,
                curDate,
                i = 1;

            function draw(markerDate, format, withoutStick) {
                return that._drawDateMarker(markerDate, {
                    x: translator.translate(markerDate),
                    y: markersAreaTop,
                    labelFormat: that._getLabelFormatOptions(format),
                    withoutStick: withoutStick
                });
            }

            if(options.argumentType !== "datetime" || options.type === "discrete" || that._majorTicks.length <= 1) {
                return;
            }

            markersAreaTop = that._axisPosition + this._axisElementsGroup.getBBox().height + options.label.indentFromAxis + options.marker.topIndent;
            tickInterval = dateUtils.getDateUnitInterval(this._tickManager.getTickInterval());
            markerInterval = getMarkerInterval(tickInterval);

            markerDates = getMarkerDates(minBound, that._maxBound, markerInterval);

            if(markerDates.length > 1
                || (markerDates.length === 1 && minBound < markerDates[0])) {
                for(i = 0; i < markerDates.length; i++) {
                    curDate = markerDates[i];
                    dateMarker = draw(curDate, getMarkerFormat(curDate, markerDates[i - 1] || (minBound < curDate && minBound), tickInterval, markerInterval));

                    if(dateMarker) {
                        if(invert ? dateMarker.labelStartPosX < xBound : dateMarker.labelEndPosX > xBound) {
                            dateMarkers.push(dateMarker);
                            dateMarker.dispose(true);
                            dateMarker.setTitle();
                        } else if(that._checkMarkersPosition(dateMarker, prevDateMarker)) {
                            dateMarkers.push(dateMarker);
                            prevDateMarker = dateMarker;
                        } else {
                            dateMarker.dispose();
                        }
                    }
                }

                if(minBound < markerDates[0]) {
                    dateMarker = draw(minBound, getMarkerFormat(minBound, markerDates[0], tickInterval, markerInterval), true);
                    if(dateMarker) {
                        if(!that._checkMarkersPosition(dateMarker, dateMarkers[0])) {
                            dateMarker.dispose();
                            dateMarker.setTitle();
                        }
                        dateMarkers.unshift(dateMarker);
                    }
                }
            }

            that._initializeMarkersTrackers(dateMarkers, that._axisElementsGroup, that._axisGroup.getBBox().width, markersAreaTop);
        },

        _initializeMarkersTrackers: function(dateMarkers, group, axisWidth, markersAreaTop) {
            var that = this,
                separatorHeight = that._options.marker.separatorHeight,
                renderer = that._renderer,
                markerTracker,
                nextMarker,
                i,
                x,
                businessRange = this._translator.getBusinessRange(),
                currentMarker;

            that._markerTrackers = [];

            for(i = 0; i < dateMarkers.length; i++) {
                currentMarker = dateMarkers[i];
                nextMarker = dateMarkers[i + 1] ||
                    {
                        dateMarkerStartPosX: businessRange.invert ? this._translator.translateSpecialCase("canvas_position_end") : axisWidth,
                        date: businessRange.max
                    };

                x = currentMarker.dateMarkerStartPosX;

                markerTracker = renderer.path([
                    x, markersAreaTop,
                    x, markersAreaTop + separatorHeight,
                    nextMarker.dateMarkerStartPosX, markersAreaTop + separatorHeight,
                    nextMarker.dateMarkerStartPosX, markersAreaTop,
                    x, markersAreaTop
                ]).attr({
                    "stroke-width": 1,
                    stroke: "grey",
                    fill: "grey",
                    "fill-opacity": 0.0001,
                    "stroke-opacity": 0.0001
                }).append(group);

                markerTracker.data("range", { startValue: currentMarker.date, endValue: nextMarker.date });
                if(currentMarker.title) {
                    markerTracker.setTitle(currentMarker.title);
                }
                that._markerTrackers.push(markerTracker);
            }
        },

        _checkMarkersPosition: function(dateMarker, prevDateMarker) {
            return (prevDateMarker === undefined || (dateMarker.labelStartPosX > prevDateMarker.labelEndPosX || dateMarker.labelEndPosX < prevDateMarker.labelStartPosX));
        },

        _getLabelFormatOptions: function(formatString) {
            var that = this,
                markerLabelOptions = that._markerLabelOptions;

            if(!markerLabelOptions) {
                that._markerLabelOptions = markerLabelOptions = _extend(true, {}, that._options.marker.label);
            }

            if(!_isDefined(that._options.marker.label.format)) {
                markerLabelOptions.format = formatString;
            }

            return markerLabelOptions;
        },

        _adjustConstantLineLabels: function() {
            var that = this,
                options = that._options,
                isHorizontal = that._isHorizontal,
                lines = that._constantLines,
                labels = that._constantLineLabels,
                label,
                line,
                lineBox,
                linesOptions,
                labelOptions,
                box,
                x,
                y,
                i,
                padding = isHorizontal ? { top: 0, bottom: 0 } : { left: 0, right: 0 },
                paddingTopBottom,
                paddingLeftRight,
                labelVerticalAlignment,
                labelHorizontalAlignment,
                labelIsInside,
                labelHeight,
                labelWidth,
                delta = 0;

            if(labels === undefined && lines === undefined) {
                return;
            }

            for(i = 0; i < labels.length; i++) {
                x = y = 0;
                linesOptions = options.constantLines[i];
                paddingTopBottom = linesOptions.paddingTopBottom;
                paddingLeftRight = linesOptions.paddingLeftRight;
                labelOptions = linesOptions.label;
                labelVerticalAlignment = labelOptions.verticalAlignment;
                labelHorizontalAlignment = labelOptions.horizontalAlignment;
                labelIsInside = labelOptions.position === "inside";

                label = labels[i];
                if(label !== null) {
                    line = lines[i];
                    box = label.getBBox();
                    lineBox = line.getBBox();
                    labelHeight = box.height;
                    labelWidth = box.width;

                    if(isHorizontal) {
                        if(labelIsInside) {
                            if(labelHorizontalAlignment === LEFT) {
                                x -= paddingLeftRight;
                            } else {
                                x += paddingLeftRight;
                            }
                            switch(labelVerticalAlignment) {
                                case CENTER:
                                    y += lineBox.y + lineBox.height / 2 - box.y - labelHeight / 2;
                                    break;
                                case BOTTOM:
                                    y += lineBox.y + lineBox.height - box.y - labelHeight - paddingTopBottom;
                                    break;
                                default:
                                    y += lineBox.y - box.y + paddingTopBottom;
                                    break;
                            }
                        } else {
                            if(labelVerticalAlignment === BOTTOM) {
                                delta = that.delta && that.delta[BOTTOM] || 0;
                                y += paddingTopBottom - box.y + that._additionalTranslator.translateSpecialCase(CANVAS_POSITION_PREFIX + BOTTOM) + delta;
                                if(padding[BOTTOM] < labelHeight + paddingTopBottom) {
                                    padding[BOTTOM] = labelHeight + paddingTopBottom;
                                }
                            } else {
                                delta = that.delta && that.delta[TOP] || 0;
                                y -= paddingTopBottom + box.y + labelHeight - that._additionalTranslator.translateSpecialCase(CANVAS_POSITION_PREFIX + TOP) - delta;
                                if(padding[TOP] < paddingTopBottom + labelHeight) {
                                    padding[TOP] = paddingTopBottom + labelHeight;
                                }
                            }
                        }
                    } else {
                        if(labelIsInside) {
                            switch(labelHorizontalAlignment) {
                                case CENTER:
                                    x += lineBox.x + lineBox.width / 2 - box.x - labelWidth / 2;
                                    break;
                                case RIGHT:
                                    x -= paddingLeftRight;
                                    break;
                                default:
                                    x += paddingLeftRight;
                                    break;
                            }
                            if(labelVerticalAlignment === BOTTOM) {
                                y += lineBox.y - box.y + paddingTopBottom;
                            } else {
                                y += lineBox.y - box.y - labelHeight - paddingTopBottom;
                            }
                        } else {
                            y += lineBox.y + lineBox.height / 2 - box.y - labelHeight / 2;
                            if(labelHorizontalAlignment === RIGHT) {
                                x += paddingLeftRight;
                                if(padding[RIGHT] < paddingLeftRight + labelWidth) {
                                    padding[RIGHT] = paddingLeftRight + labelWidth;
                                }
                            } else {
                                x -= paddingLeftRight;
                                if(padding[LEFT] < paddingLeftRight + labelWidth) {
                                    padding[LEFT] = paddingLeftRight + labelWidth;
                                }
                            }
                        }
                    }
                    label.move(x, y);
                }
            }

            that.padding = padding;
        },

        _checkAlignmentConstantLineLabels: function(labelOptions) {
            var position = labelOptions.position,
                verticalAlignment = (labelOptions.verticalAlignment || "").toLowerCase(),
                horizontalAlignment = (labelOptions.horizontalAlignment || "").toLowerCase();

            if(this._isHorizontal) {
                if(position === "outside") {
                    verticalAlignment = verticalAlignment === BOTTOM ? BOTTOM : TOP;
                    horizontalAlignment = CENTER;
                } else {
                    verticalAlignment = verticalAlignment === CENTER ? CENTER : (verticalAlignment === BOTTOM ? BOTTOM : TOP);
                    horizontalAlignment = horizontalAlignment === LEFT ? LEFT : RIGHT;
                }
            } else {
                if(position === "outside") {
                    verticalAlignment = CENTER;
                    horizontalAlignment = horizontalAlignment === LEFT ? LEFT : RIGHT;
                } else {
                    verticalAlignment = verticalAlignment === BOTTOM ? BOTTOM : TOP;
                    horizontalAlignment = horizontalAlignment === RIGHT ? RIGHT : (horizontalAlignment === CENTER ? CENTER : LEFT);
                }
            }

            labelOptions.verticalAlignment = verticalAlignment;
            labelOptions.horizontalAlignment = horizontalAlignment;
        },

        _getConstantLineLabelsCoords: function(value, lineLabelOptions) {
            var that = this,
                additionalTranslator = that._additionalTranslator,
                align = CENTER,
                x = value,
                y = value;
            if(that._isHorizontal) {
                y = additionalTranslator.translateSpecialCase(CANVAS_POSITION_PREFIX + lineLabelOptions.verticalAlignment);
            } else {
                x = additionalTranslator.translateSpecialCase(CANVAS_POSITION_PREFIX + lineLabelOptions.horizontalAlignment);
            }
            switch(lineLabelOptions.horizontalAlignment) {
                case LEFT:
                    align = !that._isHorizontal && lineLabelOptions.position === "inside" ? LEFT : RIGHT;
                    break;
                case CENTER:
                    align = CENTER;
                    break;
                case RIGHT:
                    align = !that._isHorizontal && lineLabelOptions.position === "inside" ? RIGHT : LEFT;
                    break;
            }
            return { x: x, y: y, align: align };
        },

        _getAdjustedStripLabelCoords: function(strip) {
            var x = 0,
                y = 0,
                stripOptions = strip.options,
                horizontalAlignment = stripOptions.label.horizontalAlignment,
                verticalAlignment = stripOptions.label.verticalAlignment,
                box = strip.label.getBBox(),
                rectBox = strip.rect.getBBox();

            if(horizontalAlignment === LEFT) {
                x += stripOptions.paddingLeftRight;
            } else if(horizontalAlignment === RIGHT) {
                x -= stripOptions.paddingLeftRight;
            }

            if(verticalAlignment === TOP) {
                y += rectBox.y - box.y + stripOptions.paddingTopBottom;
            } else if(verticalAlignment === CENTER) {
                y += rectBox.y + rectBox.height / 2 - box.y - box.height / 2;
            } else if(verticalAlignment === BOTTOM) {
                y -= stripOptions.paddingTopBottom;
            }
            return { x: x, y: y };
        },

        _adjustTitle: function() {
            var that = this,
                options = that._options,
                position = options.position,
                title = that._title,
                margin = options.title.margin,
                boxGroup,
                boxTitle,
                params,
                centerPosition = that._translator.translateSpecialCase(CANVAS_POSITION_PREFIX + CENTER),
                axisElementsGroup = that._axisElementsGroup,
                heightTitle,
                axisPosition = that._axisPosition,
                noLabels;

            if(!title || !axisElementsGroup) {
                return;
            }

            boxTitle = title.getBBox();
            boxGroup = axisElementsGroup.getBBox();
            noLabels = boxGroup.isEmpty;
            heightTitle = boxTitle.height;

            if(that._isHorizontal) {
                if(position === BOTTOM) {
                    params = { y: (noLabels ? axisPosition : boxGroup.y + boxGroup.height) - boxTitle.y + margin, x: centerPosition };
                } else {
                    params = { y: (noLabels ? axisPosition : boxGroup.y) - heightTitle - boxTitle.y - margin, x: centerPosition };
                }
            } else {
                if(position === LEFT) {
                    params = { x: (noLabels ? axisPosition : boxGroup.x) - heightTitle - boxTitle.y - margin, y: centerPosition };
                } else {
                    params = { x: (noLabels ? axisPosition : boxGroup.x + boxGroup.width) + heightTitle + boxTitle.y + margin, y: centerPosition };
                }
                params.rotate = options.position === LEFT ? 270 : 90;
            }
            title.attr(params);
        },

        coordsIn: function(x, y) {
            var rect = this.getBoundingRect();
            return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
        },

        _boundaryTicksVisibility: {
            min: true,
            max: true
        },


        _getMinMax: function() {
            return { min: this._options.min, max: this._options.max };
        },

        _getStick: function() {
            return !this._options.valueMarginsEnabled;
        },

        _getStripLabelCoords: function(stripLabelOptions, stripFrom, stripTo) {
            var that = this,
                additionalTranslator = that._additionalTranslator,
                isHorizontal = that._isHorizontal,
                align = isHorizontal ? CENTER : LEFT,
                x,
                y;

            if(isHorizontal) {
                if(stripLabelOptions.horizontalAlignment === CENTER) {
                    x = stripFrom + (stripTo - stripFrom) / 2;
                    align = CENTER;
                } else if(stripLabelOptions.horizontalAlignment === LEFT) {
                    x = stripFrom;
                    align = LEFT;
                } else if(stripLabelOptions.horizontalAlignment === RIGHT) {
                    x = stripTo;
                    align = RIGHT;
                }
                y = additionalTranslator.translateSpecialCase(CANVAS_POSITION_PREFIX + stripLabelOptions.verticalAlignment);
            } else {
                x = additionalTranslator.translateSpecialCase(CANVAS_POSITION_PREFIX + stripLabelOptions.horizontalAlignment);
                align = stripLabelOptions.horizontalAlignment;
                if(stripLabelOptions.verticalAlignment === TOP) {
                    y = stripFrom;
                } else if(stripLabelOptions.verticalAlignment === CENTER) {
                    y = stripTo + (stripFrom - stripTo) / 2;
                } else if(stripLabelOptions.verticalAlignment === BOTTOM) {
                    y = stripTo;
                }
            }

            return { x: x, y: y, align: align };
        },

        _getTranslatedValue: function(value, y, offset) {
            return { x: this._translator.translate(value, offset, this._options.type === "semidiscrete" && this._options.tickInterval), y: y };
        },

        _getSkippedCategory: function() {
            var skippedCategory,
                categories = this._translator.getVisibleCategories() || this._translator.getBusinessRange().categories;

            if(categories && categories.length && !!this._tickOffset) {
                skippedCategory = categories[categories.length - 1];
            }

            return skippedCategory;
        },

        _getSpiderCategoryOption: noop
    }
};
