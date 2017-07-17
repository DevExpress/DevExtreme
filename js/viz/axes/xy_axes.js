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
    _max = _math.max,

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

function getStripHorizontalAlignmentPosition(alignment) {
    var position = "start";
    if(alignment === "center") {
        position = "center";
    }
    if(alignment === "right") {
        position = "end";
    }
    return position;
}

function getStripVerticalAlignmentPosition(alignment) {
    var position = "start";
    if(alignment === "center") {
        position = "center";
    }
    if(alignment === "bottom") {
        position = "end";
    }
    return position;
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
        return _max(prevValue, act(box));
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

function getMaxConstantLinePadding(constantLines) {
    return constantLines.reduce(function(padding, options) {
        return _max(padding, options.paddingTopBottom);
    }, 0);
}

function getConstantLineLabelMarginForVerticalAlignment(constantLines, alignment, labelHeight) {
    return constantLines.some(function(options) {
        return options.label.verticalAlignment === alignment;
    }) && labelHeight || 0;
}

function getLeftMargin(bBox) {
    return _math.abs(bBox.x) || 0;
}

function getRightMargin(bBox) {
    return _math.abs(bBox.width - _math.abs(bBox.x)) || 0;
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

            return constants.getTicksCountInRange(this._majorTicks, this._isHorizontal ? "x" : "y", maxLabelLength);
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
            return this._renderer.path([], "line");
        },

        _updateAxisElementPosition: function() {
            if(!this._axisElement) {
                return;
            }

            var axisCoord = this._axisPosition,
                canvas = this._getCanvasStartEnd();

            this._axisElement.attr({
                points: this._isHorizontal ? [canvas.start, axisCoord, canvas.end, axisCoord] : [axisCoord, canvas.start, axisCoord, canvas.end]
            });
        },

        _getTranslatedCoord: function(value, offset) {
            return this._translator.translate(value, offset);
        },

        _getCanvasStartEnd: function() {
            var isHorizontal = this._isHorizontal,
                canvas = this._canvas,
                invert = this._translator.getBusinessRange().invert,
                coords = isHorizontal ? [canvas.left, canvas.width - canvas.right] : [canvas.height - canvas.bottom, canvas.top];

            invert && coords.reverse();

            return {
                start: coords[0],
                end: coords[1]
            };
        },

        _getScreenDelta: function() {
            var canvas = this._getCanvasStartEnd();
            return _math.abs(canvas.start - canvas.end);
        },

        _initAxisPositions: function() {
            var that = this,
                position = that._options.position;

            that._axisPosition = that._orthogonalPositions[position === "top" || position === "left" ? "start" : "end"];
        },

        _getTickMarkPoints: function(tick, length) {
            var coords = tick.coords,
                isHorizontal = this._isHorizontal,
                tickCorrection = {
                    left: -1,
                    top: -1,
                    right: 0,
                    bottom: 0,
                    center: -0.5
                }[this._options.tickOrientation || "center"];

            return [
                coords.x + (isHorizontal ? 0 : tickCorrection * length),
                coords.y + (isHorizontal ? tickCorrection * length : 0),
                coords.x + (isHorizontal ? 0 : tickCorrection * length + length),
                coords.y + (isHorizontal ? tickCorrection * length + length : 0)
            ];
        },

        _getTitleCoords: function() {
            var that = this,
                x = that._axisPosition,
                y = that._axisPosition,
                canvas = that._getCanvasStartEnd(),
                center = canvas.start + (canvas.end - canvas.start) / 2;

            if(that._isHorizontal) {
                x = center;
            } else {
                y = center;
            }
            return { x: x, y: y };
        },

        _drawTitleText: function(group, coords) {
            var options = this._options,
                titleOptions = options.title,
                attrs = { opacity: titleOptions.opacity, align: "center" };

            if(!titleOptions.text || !group) {
                return;
            }

            coords = coords || this._getTitleCoords();

            if(!this._isHorizontal) {
                attrs.rotate = options.position === LEFT ? 270 : 90;
            }
            var text = this._renderer
                .text(titleOptions.text, coords.x, coords.y)
                .css(vizUtils.patchFontOptions(titleOptions.font))
                .attr(attrs)
                .append(group);

            return text;
        },

        _updateTitleCoords: function() {
            this._title && this._title.element.attr(this._getTitleCoords());
        },

        _drawTitle: function() {
            var title = this._drawTitleText(this._axisTitleGroup);
            if(title) {
                this._title = {
                    element: title
                };
            }
        },

        _measureTitle: function() {
            if(this._title) {
                this._title.bBox = this._title.element.getBBox();
            }
        },

        _drawDateMarker: function(date, options) {
            var that = this,
                markerOptions = that._options.marker,
                invert = that._translator.getBusinessRange().invert,
                textIndent = markerOptions.width + markerOptions.textLeftIndent,
                text,
                pathElement;

            if(options.x === null) return;

            if(!options.withoutStick) {
                pathElement = that._renderer.path([options.x, options.y, options.x, options.y + markerOptions.separatorHeight], "line")
                    .attr({ "stroke-width": markerOptions.width, stroke: markerOptions.color, "stroke-opacity": markerOptions.opacity, sharp: "h" })
                    .append(that._axisElementsGroup);
            }

            text = String(constants.formatLabel(date, options.labelFormat));

            return {
                date: date,
                x: options.x,
                y: options.y,
                cropped: options.withoutStick,
                label: that._renderer.text(text, options.x, options.y)
                    .css(vizUtils.patchFontOptions(markerOptions.label.font))
                    .append(that._axisElementsGroup),
                line: pathElement,
                getEnd: function() {
                    return this.x + (invert ? -1 : 1) * (textIndent + this.labelBBox.width);
                },
                setTitle: function() {
                    this.title = text;
                },
                hideLabel: function() {
                    this.label.dispose();
                    this.label = null;
                    this.title = text;
                },
                hide: function() {
                    if(pathElement) {
                        pathElement.dispose();
                        pathElement = null;
                    }
                    this.label.dispose();
                    this.label = null;
                    this.hidden = true;
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
                markersAreaTop,
                dateMarker;

            function draw(markerDate, format, withoutStick) {
                return that._drawDateMarker(markerDate, {
                    x: translator.translate(markerDate),
                    y: markersAreaTop,
                    labelFormat: that._getLabelFormatOptions(format),
                    withoutStick: withoutStick
                });
            }

            if(!options.marker.visible || options.argumentType !== "datetime" || options.type === "discrete" || that._majorTicks.length <= 1) {
                return [];
            }

            markersAreaTop = that._axisPosition + options.marker.topIndent;
            tickInterval = dateUtils.getDateUnitInterval(this._tickManager.getTickInterval());
            markerInterval = getMarkerInterval(tickInterval);

            markerDates = getMarkerDates(minBound, that._maxBound, markerInterval);

            if(markerDates.length > 1
                || (markerDates.length === 1 && minBound < markerDates[0])) {

                dateMarkers = markerDates.reduce(function(markers, curDate, i, dates) {
                    var marker = draw(curDate, getMarkerFormat(curDate, dates[i - 1] || (minBound < curDate && minBound), tickInterval, markerInterval));
                    marker && markers.push(marker);
                    return markers;
                }, []);

                if(minBound < markerDates[0]) {
                    dateMarker = draw(minBound, getMarkerFormat(minBound, markerDates[0], tickInterval, markerInterval), true);
                    dateMarker && dateMarkers.unshift(dateMarker);
                }
            }
            return dateMarkers;
        },

        _adjustDateMarkers: function(offset) {
            offset = offset || 0;
            var that = this,
                markerOptions = this._options.marker,
                textIndent = markerOptions.width + markerOptions.textLeftIndent,
                invert = this._translator.getBusinessRange().invert,
                canvas = that._getCanvasStartEnd(),
                dateMarkers = this._dateMarkers;

            if(!dateMarkers.length) {
                return offset;
            }

            if(dateMarkers[0].cropped) {
                if(!this._checkMarkersPosition(invert, dateMarkers[1], dateMarkers[0])) {
                    dateMarkers[0].hideLabel();
                }
            }

            var prevDateMarker;
            dateMarkers.forEach(function(marker, i, markers) {
                if(marker.cropped) {
                    return;
                }

                if(invert ? marker.getEnd() < canvas.end : marker.getEnd() > canvas.end) {
                    marker.hideLabel();
                } else if(that._checkMarkersPosition(invert, marker, prevDateMarker)) {
                    prevDateMarker = marker;
                } else {
                    marker.hide();
                }
            });

            this._dateMarkers.forEach(function(marker) {
                if(marker.label) {
                    var labelBBox = marker.labelBBox,
                        dy = marker.y + markerOptions.textTopIndent - labelBBox.y;

                    marker.label.attr({
                        translateX: invert ? marker.x - textIndent - labelBBox.x - labelBBox.width : marker.x + textIndent - labelBBox.x,
                        translateY: dy + offset
                    });
                }

                if(marker.line) {
                    marker.line.attr({
                        translateY: offset
                    });
                }
            });

            that._initializeMarkersTrackers(offset);

            return offset + markerOptions.topIndent + markerOptions.separatorHeight;
        },

        _checkMarkersPosition: function(invert, dateMarker, prevDateMarker) {
            if(prevDateMarker === undefined) {
                return true;
            }
            return invert ? (dateMarker.x < prevDateMarker.getEnd()) : (dateMarker.x > prevDateMarker.getEnd());
        },

        _initializeMarkersTrackers: function(offset) {
            var that = this,
                separatorHeight = that._options.marker.separatorHeight,
                renderer = that._renderer,
                businessRange = this._translator.getBusinessRange(),
                canvas = that._getCanvasStartEnd(),
                group = that._axisElementsGroup;

            that._markerTrackers = this._dateMarkers
                .filter(function(marker) { return !marker.hidden; })
                .map(function(marker, i, markers) {
                    var nextMarker = markers[i + 1] ||
                        {
                            x: canvas.end,
                            date: businessRange.max
                        },
                        x = marker.x,
                        y = marker.y + offset,
                        markerTracker = renderer.path([
                            x, y,
                            x, y + separatorHeight,
                            nextMarker.x, y + separatorHeight,
                            nextMarker.x, y,
                            x, y
                        ], "area").attr({
                            "stroke-width": 1,
                            stroke: "grey",
                            fill: "grey",
                            opacity: 0.0001
                        }).append(group);

                    markerTracker.data("range", { startValue: marker.date, endValue: nextMarker.date });
                    if(marker.title) {
                        markerTracker.setTitle(marker.title);
                    }

                    return markerTracker;
                });
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

        _adjustConstantLineLabels: function(constantLines) {
            var that = this,
                axisPosition = that._options.position,
                canvas = that.getCanvas(),
                canvasLeft = canvas.left,
                canvasRight = canvas.width - canvas.right,
                canvasTop = canvas.top,
                canvasBottom = canvas.height - canvas.bottom,
                verticalCenter = canvasTop + (canvasBottom - canvasTop) / 2,
                horizontalCenter = canvasLeft + (canvasRight - canvasLeft) / 2,
                maxLabel = 0;

            constantLines.forEach(function(item) {
                var isHorizontal = that._isHorizontal,
                    linesOptions = item.options,
                    paddingTopBottom = linesOptions.paddingTopBottom,
                    paddingLeftRight = linesOptions.paddingLeftRight,
                    labelOptions = linesOptions.label,
                    labelVerticalAlignment = labelOptions.verticalAlignment,
                    labelHorizontalAlignment = labelOptions.horizontalAlignment,
                    labelIsInside = labelOptions.position === "inside",
                    label = item.label,
                    box = item.labelBBox,
                    translateX,
                    translateY;

                if(label === null) {
                    return;
                }

                if(isHorizontal) {
                    if(labelIsInside) {
                        if(labelHorizontalAlignment === LEFT) {
                            translateX = item.coord - paddingLeftRight - box.x - box.width;
                        } else {
                            translateX = item.coord + paddingLeftRight - box.x;
                        }
                        switch(labelVerticalAlignment) {
                            case CENTER:
                                translateY = verticalCenter - box.y - box.height / 2;
                                break;
                            case BOTTOM:
                                translateY = canvasBottom - paddingTopBottom - box.y - box.height;
                                break;
                            default:
                                translateY = canvasTop + paddingTopBottom - box.y;
                                break;
                        }
                    } else {
                        if(axisPosition === labelVerticalAlignment) {
                            maxLabel = _max(maxLabel, box.height + paddingTopBottom);
                        }

                        translateX = item.coord - box.x - box.width / 2;
                        if(labelVerticalAlignment === BOTTOM) {
                            translateY = canvasBottom + paddingTopBottom - box.y;
                        } else {
                            translateY = canvasTop - paddingTopBottom - box.y - box.height;
                        }
                    }
                } else {
                    if(labelIsInside) {
                        if(labelVerticalAlignment === BOTTOM) {
                            translateY = item.coord + paddingTopBottom - box.y;
                        } else {
                            translateY = item.coord - paddingTopBottom - box.y - box.height;
                        }
                        switch(labelHorizontalAlignment) {
                            case CENTER:
                                translateX = horizontalCenter - box.x - box.width / 2;
                                break;
                            case RIGHT:
                                translateX = canvasRight - paddingLeftRight - box.x - box.width;
                                break;
                            default:
                                translateX = canvasLeft + paddingLeftRight - box.x;
                                break;
                        }
                    } else {
                        if(axisPosition === labelHorizontalAlignment) {
                            maxLabel = _max(maxLabel, box.width + paddingLeftRight);
                        }

                        translateY = item.coord - box.y - box.height / 2;
                        if(labelHorizontalAlignment === RIGHT) {
                            translateX = canvasRight + paddingLeftRight - box.x;
                        } else {
                            translateX = canvasLeft - paddingLeftRight - box.x - box.width;
                        }
                    }
                }
                label.attr({
                    translateX: translateX,
                    translateY: translateY
                });
            });

            return maxLabel;
        },

        _drawConstantLinesForEstimating: function(constantLines) {
            var that = this,
                renderer = this._renderer,
                group = renderer.g();

            constantLines.forEach(function(options) {
                that._drawConstantLineLabelText(options.label.text, 0, 0, options.label, group).attr({ align: "center" });
            });

            return group.append(renderer.root);
        },

        _estimateLabelHeight: function(bBox, labelOptions) {
            var height = bBox.height,
                drawingType = labelOptions.drawingType;

            if(this._validateDisplayMode(drawingType) === "stagger" || this._validateOverlappingMode(labelOptions.overlappingBehavior, drawingType) === "stagger") {
                height = height * 2 + labelOptions.staggeringSpacing;
            }

            if(this._validateDisplayMode(drawingType) === "rotate" || this._validateOverlappingMode(labelOptions.overlappingBehavior, drawingType) === "rotate") {
                var sinCos = vizUtils.getCosAndSin(labelOptions.rotationAngle);
                height = height * sinCos.cos + bBox.width * sinCos.sin;
            }

            return height && (height + labelOptions.indentFromAxis || 0) || 0;
        },

        _estimateLabelFormat: function(canvas) {
            this.updateCanvas(canvas);
            this._updateTickManager();
            this._tickManager.getTicks();
            this._correctLabelFormat();
        },

        estimateMargins: function(canvas) {
            this._estimateLabelFormat(canvas);

            var that = this,
                options = this._options,
                constantLineOptions = (options.constantLines || []).filter(function(options) {
                    that._checkAlignmentConstantLineLabels(options.label);
                    return options.label.position === "outside" && options.label.visible;
                }),
                rootElement = that._renderer.root,
                businessRange = that._translator.getBusinessRange(),
                labelIsVisible = options.label.visible && !that._translator.getBusinessRange().stubData,
                labelValue = labelIsVisible && constants.formatLabel(businessRange.axisType === "discrete" ? businessRange.categories[0] : businessRange.max, options.label),
                labelElement = labelIsVisible && that._renderer.text(labelValue, 0, 0)
                    .css(that._textFontStyles)
                    .attr(that._textOptions)
                    .append(rootElement),
                titleElement = that._drawTitleText(rootElement, { x: 0, y: 0 }),
                constantLinesLabelsElement = that._drawConstantLinesForEstimating(constantLineOptions),
                labelBox = labelElement && labelElement.getBBox() || { x: 0, y: 0, width: 0, height: 0 },
                titleBox = titleElement && titleElement.getBBox() || { x: 0, y: 0, width: 0, height: 0 },
                constantLinesBox = constantLinesLabelsElement.getBBox(),
                titleHeight = titleBox.height ? titleBox.height + options.title.margin : 0,
                labelHeight = that._estimateLabelHeight(labelBox, options.label),
                constantLinesHeight = constantLinesBox.height ? constantLinesBox.height + getMaxConstantLinePadding(constantLineOptions) : 0,
                height = labelHeight + titleHeight,
                margins = {
                    left: _max(getLeftMargin(labelBox), getLeftMargin(constantLinesBox)),
                    right: _max(getRightMargin(labelBox), getRightMargin(constantLinesBox)),
                    top: (options.position === "top" ? height : 0) + getConstantLineLabelMarginForVerticalAlignment(constantLineOptions, "top", constantLinesHeight),
                    bottom: (options.position !== "top" ? height : 0) + getConstantLineLabelMarginForVerticalAlignment(constantLineOptions, "bottom", constantLinesHeight)
                };

            labelElement && labelElement.remove();
            titleElement && titleElement.remove();
            constantLinesLabelsElement && constantLinesLabelsElement.remove();

            return margins;
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
                x = value,
                y = value;

            if(that._isHorizontal) {
                y = that._orthogonalPositions[lineLabelOptions.verticalAlignment === "top" ? "start" : "end"];
            } else {
                x = that._orthogonalPositions[lineLabelOptions.horizontalAlignment === "right" ? "end" : "start"];
            }
            return { x: x, y: y };
        },

        _getAdjustedStripLabelCoords: function(strip) {
            var stripOptions = strip.options,
                paddingTopBottom = stripOptions.paddingTopBottom,
                paddingLeftRight = stripOptions.paddingLeftRight,
                horizontalAlignment = stripOptions.label.horizontalAlignment,
                verticalAlignment = stripOptions.label.verticalAlignment,
                box = strip.labelBBox,
                labelHeight = box.height,
                labelWidth = box.width,
                labelCoords = strip.labelCoords,
                y = labelCoords.y - box.y,
                x = labelCoords.x - box.x;

            if(verticalAlignment === TOP) {
                y += paddingTopBottom;
            } else if(verticalAlignment === CENTER) {
                y -= labelHeight / 2;
            } else if(verticalAlignment === BOTTOM) {
                y -= paddingTopBottom + labelHeight;
            }

            if(horizontalAlignment === LEFT) {
                x += paddingLeftRight;
            } else if(horizontalAlignment === CENTER) {
                x -= labelWidth / 2;
            } else if(horizontalAlignment === RIGHT) {
                x -= paddingLeftRight + labelWidth;
            }

            return { translateX: x, translateY: y };
        },

        _adjustTitle: function(offset) {
            offset = offset || 0;
            if(!this._title) {
                return;
            }

            var that = this,
                options = that._options,
                position = options.position,
                margin = options.title.margin,
                title = that._title,
                boxTitle = title.bBox,
                x = boxTitle.x,
                y = boxTitle.y,
                width = boxTitle.width,
                height = boxTitle.height,
                axisPosition = that._axisPosition,
                loCoord = axisPosition - margin - offset,
                hiCoord = axisPosition + margin + offset,
                params = {};

            if(that._isHorizontal) {
                if(position === TOP) {
                    params.translateY = loCoord - (y + height);
                } else {
                    params.translateY = hiCoord - y;
                }
            } else {
                if(position === LEFT) {
                    params.translateX = loCoord - (x + width);
                } else {
                    params.translateX = hiCoord - x;
                }
            }
            title.element.attr(params);
        },

        _checkTitleOverflow: function() {
            if(!this._title) {
                return;
            }

            var canvasLength = this._getScreenDelta(),
                title = this._title,
                boxTitle = title.bBox;

            if((this._isHorizontal ? boxTitle.width : boxTitle.height) > canvasLength) {
                title.element.applyEllipsis(canvasLength) && title.element.setTitle(this._options.title.text);
            }
        },

        coordsIn: function(x, y) {
            var canvas = this.getCanvas(),
                isHorizontal = this._options.isHorizontal,
                position = this._options.position,
                coord = isHorizontal ? y : x;

            if(isHorizontal && position === constants.top || !isHorizontal && position === constants.left) {
                return coord < canvas[position];
            }
            return coord > canvas[isHorizontal ? "height" : "width"] - canvas[position];
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

        _getStripLabelCoords: function(from, to, stripLabelOptions) {
            var that = this,
                orthogonalPositions = that._orthogonalPositions,
                isHorizontal = that._isHorizontal,
                horizontalAlignment = stripLabelOptions.horizontalAlignment,
                verticalAlignment = stripLabelOptions.verticalAlignment,
                x,
                y;

            if(isHorizontal) {
                if(horizontalAlignment === CENTER) {
                    x = from + (to - from) / 2;
                } else if(horizontalAlignment === LEFT) {
                    x = from;
                } else if(horizontalAlignment === RIGHT) {
                    x = to;
                }
                y = orthogonalPositions[getStripVerticalAlignmentPosition(verticalAlignment)];
            } else {
                x = orthogonalPositions[getStripHorizontalAlignmentPosition(horizontalAlignment)];
                if(verticalAlignment === TOP) {
                    y = from;
                } else if(verticalAlignment === CENTER) {
                    y = to + (from - to) / 2;
                } else if(verticalAlignment === BOTTOM) {
                    y = to;
                }
            }

            return { x: x, y: y };
        },

        _getTranslatedValue: function(value, offset) {
            var pos1 = this._translator.translate(value, offset, this._options.type === "semidiscrete" && this._options.tickInterval),
                pos2 = this._axisPosition,
                isHorizontal = this._isHorizontal;
            return {
                x: isHorizontal ? pos1 : pos2,
                y: isHorizontal ? pos2 : pos1
            };
        },

        _getSkippedCategory: function() {
            var skippedCategory,
                categories = this._translator.getVisibleCategories() || this._translator.getBusinessRange().categories;

            if(categories && categories.length && !!this._tickOffset) {
                skippedCategory = categories[categories.length - 1];
            }

            return skippedCategory;
        },

        _getSpiderCategoryOption: noop,

        shift: function(margins) {
            var that = this,
                options = that._options,
                isHorizontal = options.isHorizontal,
                axesSpacing = that.getMultipleAxesSpacing(),
                constantLinesGroups = that._axisConstantLineGroups;

            function shiftGroup(side, group) {
                var attr = {},
                    shift = margins[side] + axesSpacing;
                attr[isHorizontal ? "translateY" : "translateX"] = (side === "left" || side === "top" ? -1 : 1) * shift;
                if(margins[side]) {
                    (group[side] || group).attr(attr);
                    return shift;
                }
            }

            that._axisShift = shiftGroup(options.position, that._axisGroup);

            if(isHorizontal) {
                shiftGroup("top", constantLinesGroups);
                shiftGroup("bottom", constantLinesGroups);
            } else {
                shiftGroup("left", constantLinesGroups);
                shiftGroup("right", constantLinesGroups);
            }
        }
    }
};
