import rangeModule from '../translators/range';
import { getDateFormatByDifferences } from '../../format_helper';
import dateUtils from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import { generateDateBreaks } from './datetime_breaks';
import { noop } from '../../core/utils/common';
import vizUtils from '../core/utils';
import { isDefined } from '../../core/utils/type';
import constants from './axes_constants';

const getNextDateUnit = dateUtils.getNextDateUnit;
const correctDateWithUnitBeginning = dateUtils.correctDateWithUnitBeginning;
const _math = Math;
const _max = _math.max;
const TOP = constants.top;
const BOTTOM = constants.bottom;
const LEFT = constants.left;
const RIGHT = constants.right;
const CENTER = constants.center;
const SCALE_BREAK_OFFSET = 3;
const RANGE_RATIO = 0.3;
const WAVED_LINE_CENTER = 2;
const WAVED_LINE_TOP = 0;
const WAVED_LINE_BOTTOM = 4;
const WAVED_LINE_LENGTH = 24;

const TICKS_CORRECTIONS = {
    left: -1,
    top: -1,
    right: 0,
    bottom: 0,
    center: -0.5
};

function prepareDatesDifferences(datesDifferences, tickInterval) {
    let dateUnitInterval;
    let i;

    if(tickInterval === 'week') {
        tickInterval = 'day';
    }
    if(tickInterval === 'quarter') {
        tickInterval = 'month';
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

function sortingBreaks(breaks) {
    return breaks.sort(function(a, b) { return a.from - b.from; });
}

function filterBreaks(breaks, viewport, breakStyle) {
    const minVisible = viewport.minVisible;
    const maxVisible = viewport.maxVisible;
    const breakSize = breakStyle ? breakStyle.width : 0;

    return breaks.reduce(function(result, currentBreak) {
        let from = currentBreak.from;
        let to = currentBreak.to;
        const lastResult = result[result.length - 1];
        let newBreak;

        if(!isDefined(from) || !isDefined(to)) {
            return result;
        }
        if(from > to) {
            to = [from, from = to][0];
        }
        if(result.length && from < lastResult.to) {
            if(to > lastResult.to) {
                lastResult.to = to > maxVisible ? maxVisible : to;
                if(lastResult.gapSize) {
                    lastResult.gapSize = undefined;
                    lastResult.cumulativeWidth += breakSize;
                }
            }
        } else {
            if(((from >= minVisible && from < maxVisible) || (to <= maxVisible && to > minVisible)) && to - from < maxVisible - minVisible) {
                from = from >= minVisible ? from : minVisible;
                to = to <= maxVisible ? to : maxVisible;
                newBreak = {
                    from: from,
                    to: to,
                    cumulativeWidth: (lastResult ? lastResult.cumulativeWidth : 0) + breakSize
                };
                if(currentBreak.gapSize) {
                    newBreak.gapSize = dateUtils.convertMillisecondsToDateUnits(to - from);
                    newBreak.cumulativeWidth = lastResult ? lastResult.cumulativeWidth : 0;
                }
                result.push(newBreak);
            }
        }
        return result;
    }, []);
}

function getMarkerDates(min, max, markerInterval) {
    const origMin = min;
    let dates;

    min = correctDateWithUnitBeginning(min, markerInterval);
    max = correctDateWithUnitBeginning(max, markerInterval);

    dates = dateUtils.getSequenceByInterval(min, max, markerInterval);
    if(dates.length && origMin > dates[0]) {
        dates = dates.slice(1);
    }
    return dates;
}

function getStripHorizontalAlignmentPosition(alignment) {
    let position = 'start';
    if(alignment === 'center') {
        position = 'center';
    }
    if(alignment === 'right') {
        position = 'end';
    }
    return position;
}

function getStripVerticalAlignmentPosition(alignment) {
    let position = 'start';
    if(alignment === 'center') {
        position = 'center';
    }
    if(alignment === 'bottom') {
        position = 'end';
    }
    return position;
}

function getMarkerInterval(tickInterval) {
    let markerInterval = getNextDateUnit(tickInterval);
    if(markerInterval === 'quarter') {
        markerInterval = getNextDateUnit(markerInterval);
    }
    return markerInterval;
}

function getMarkerFormat(curDate, prevDate, tickInterval, markerInterval) {
    let format = markerInterval;
    const datesDifferences = prevDate && dateUtils.getDatesDifferences(prevDate, curDate);
    if(prevDate && tickInterval !== 'year') {
        prepareDatesDifferences(datesDifferences, tickInterval);
        format = getDateFormatByDifferences(datesDifferences);
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
    const a = rotationAngle * (_math.PI / 180);

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

function generateRangesOnPoints(points, edgePoints, getRange) {
    let i;
    let length;
    let maxRange = null;
    const ranges = [];
    let curValue;
    let prevValue;
    let curRange;

    for(i = 1, length = points.length; i < length; i++) {
        curValue = points[i];
        prevValue = points[i - 1];
        curRange = getRange(curValue, prevValue);

        if(edgePoints.indexOf(curValue) >= 0) {
            if(!maxRange || curRange > maxRange.length) {
                maxRange = { start: curValue, end: prevValue, length: curRange };
            }
        } else {
            if(maxRange && curRange < maxRange.length) {
                ranges.push(maxRange);
            } else {
                ranges.push({ start: curValue, end: prevValue, length: curRange });
            }
            maxRange = null;
        }
    }
    if(maxRange) {
        ranges.push(maxRange);
    }
    return ranges;
}

function generateAutoBreaks({ logarithmBase, type, maxAutoBreakCount }, series, { minVisible, maxVisible }) {
    const breaks = [];
    const getRange = type === 'logarithmic' ?
        (min, max) => { return vizUtils.getLog(max / min, logarithmBase); } :
        (min, max) => { return max - min; };

    let visibleRange = getRange(minVisible, maxVisible);
    const points = series.reduce((result, s) => {
        const points = s.getPointsInViewPort();
        result[0] = result[0].concat(points[0]);
        result[1] = result[1].concat(points[1]);
        return result;
    }, [[], []]);

    const sortedAllPoints = points[0].concat(points[1]).sort((a, b) => b - a);
    const edgePoints = points[1].filter(p => points[0].indexOf(p) < 0);

    let minDiff = RANGE_RATIO * visibleRange;

    const ranges = generateRangesOnPoints(sortedAllPoints, edgePoints, getRange).sort((a, b) => b.length - a.length);
    const epsilon = _math.min.apply(null, ranges.map(r => r.length)) / 1000;
    const _maxAutoBreakCount = isDefined(maxAutoBreakCount) ? _math.min(maxAutoBreakCount, ranges.length) : ranges.length;

    for(let i = 0; i < _maxAutoBreakCount; i++) {
        if(ranges[i].length >= minDiff) {
            if(visibleRange <= ranges[i].length) {
                break;
            }
            visibleRange -= ranges[i].length;
            if(visibleRange > epsilon || visibleRange < -epsilon) {
                breaks.push({ from: ranges[i].start, to: ranges[i].end });
                minDiff = RANGE_RATIO * visibleRange;
            }
        } else {
            break;
        }
    }

    sortingBreaks(breaks);

    return breaks;
}

module.exports = {
    linear: {
        _getStep: function(boxes, rotationAngle) {
            const spacing = this._options.label.minSpacing;
            const func = this._isHorizontal ?
                function(box) { return box.width + spacing; }
                : function(box) { return box.height; };
            let maxLabelLength = getMaxSide(func, boxes);

            if(rotationAngle) {
                maxLabelLength = getDistanceByAngle({ width: maxLabelLength, height: this._getMaxLabelHeight(boxes, 0) }, rotationAngle);
            }

            return constants.getTicksCountInRange(this._majorTicks, this._isHorizontal ? 'x' : 'y', maxLabelLength);
        },

        _getMaxLabelHeight: function(boxes, spacing) {
            return getMaxSide(function(box) { return box.height; }, boxes) + spacing;
        },

        _validateOverlappingMode: function(mode, displayMode) {
            if(this._isHorizontal && (displayMode === 'rotate' || displayMode === 'stagger') || !this._isHorizontal) {
                return constants.validateOverlappingMode(mode);
            }
            return mode;
        },

        _validateDisplayMode: function(mode) {
            return this._isHorizontal ? mode : 'standard';
        },

        getMarkerTrackers: function() {
            return this._markerTrackers;
        },

        _getSharpParam: function(opposite) {
            return this._isHorizontal ^ opposite ? 'h' : 'v';
        },

        _createAxisElement: function() {
            return this._renderer.path([], 'line');
        },

        _updateAxisElementPosition: function() {
            const axisCoord = this._axisPosition;
            const canvas = this._getCanvasStartEnd();

            this._axisElement.attr({
                points: this._isHorizontal ? [canvas.start, axisCoord, canvas.end, axisCoord] : [axisCoord, canvas.start, axisCoord, canvas.end]
            });
        },

        _getTranslatedCoord: function(value, offset) {
            return this._translator.translate(value, offset);
        },

        _initAxisPositions: function() {
            const that = this;
            const position = that._options.position;

            that._axisPosition = that._orthogonalPositions[position === 'top' || position === 'left' ? 'start' : 'end'];
        },

        _getTickMarkPoints(coords, length, tickOptions) {
            const isHorizontal = this._isHorizontal;
            const options = this._options;
            let tickStartCoord;

            if(isDefined(options.tickOrientation)) {
                tickStartCoord = TICKS_CORRECTIONS[options.tickOrientation] * length;
            } else {
                let shift = tickOptions.shift || 0;
                if(options.position === 'left' || options.position === 'top') {
                    shift = -shift;
                }
                tickStartCoord = shift + this.getTickStartPositionShift(length);
            }
            return [
                coords.x + (isHorizontal ? 0 : tickStartCoord),
                coords.y + (isHorizontal ? tickStartCoord : 0),
                coords.x + (isHorizontal ? 0 : tickStartCoord + length),
                coords.y + (isHorizontal ? tickStartCoord + length : 0)
            ];
        },

        getTickStartPositionShift(length) {
            const options = this._options;
            return (length % 2 === 1 ?
                (options.width % 2 === 0 && (options.position === 'left' || options.position === 'top') ||
                options.width % 2 === 1 && (options.position === 'right' || options.position === 'bottom') ? Math.floor(-length / 2) : -Math.floor(length / 2)) :
                (-length / 2 + (options.width % 2 === 0 ? 0 : (options.position === 'bottom' || options.position === 'right' ? -1 : 1))));
        },

        _getTitleCoords: function() {
            const that = this;
            const horizontal = that._isHorizontal;
            let x = that._axisPosition;
            let y = that._axisPosition;
            const align = that._options.title.alignment;
            const canvas = that._getCanvasStartEnd();
            const fromStartToEnd = horizontal || that._options.position === LEFT;
            const canvasStart = fromStartToEnd ? canvas.start : canvas.end;
            const canvasEnd = fromStartToEnd ? canvas.end : canvas.start;
            const coord = align === LEFT ? canvasStart : align === RIGHT ? canvasEnd : (canvas.start + (canvas.end - canvas.start) / 2);

            if(horizontal) {
                x = coord;
            } else {
                y = coord;
            }
            return { x: x, y: y };
        },

        _drawTitleText: function(group, coords) {
            const options = this._options;
            const titleOptions = options.title;
            const attrs = { opacity: titleOptions.opacity, align: titleOptions.alignment, 'class': titleOptions.cssClass };

            if(!titleOptions.text || !group) {
                return;
            }

            coords = coords || this._getTitleCoords();
            if(!this._isHorizontal) {
                attrs.rotate = options.position === LEFT ? 270 : 90;
            }
            const text = this._renderer
                .text(titleOptions.text, coords.x, coords.y)
                .css(vizUtils.patchFontOptions(titleOptions.font))
                .attr(attrs)
                .append(group);

            this._checkTitleOverflow(text);

            return text;
        },

        _updateTitleCoords: function() {
            this._title && this._title.element.attr(this._getTitleCoords());
        },

        _drawTitle: function() {
            const title = this._drawTitleText(this._axisTitleGroup);
            if(title) {
                this._title = {
                    element: title
                };
            }
        },

        _measureTitle: function() {
            if(this._title) {
                if(this._title.bBox && !this._title.originalSize) {
                    this._title.originalSize = this._title.bBox;
                }
                this._title.bBox = this._title.element.getBBox();
            }
        },

        _drawDateMarker: function(date, options, range) {
            const that = this;
            const markerOptions = that._options.marker;
            const invert = that._translator.getBusinessRange().invert;
            const textIndent = markerOptions.width + markerOptions.textLeftIndent;
            let text;
            let pathElement;

            if(options.x === null) return;

            if(!options.withoutStick) {
                pathElement = that._renderer.path([options.x, options.y, options.x, options.y + markerOptions.separatorHeight], 'line')
                    .attr({ 'stroke-width': markerOptions.width, stroke: markerOptions.color, 'stroke-opacity': markerOptions.opacity, sharp: 'h' })
                    .append(that._axisElementsGroup);
            }

            text = String(that.formatLabel(date, options.labelOptions, range));

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
            const that = this;
            const options = that._options;
            const translator = that._translator;
            const viewport = that._getViewportRange();
            const minBound = viewport.minVisible;
            let tickInterval;
            let markerInterval;
            let markerDates;
            let dateMarkers = [];
            let markersAreaTop;
            let dateMarker;

            function draw(markerDate, format, withoutStick) {
                return that._drawDateMarker(markerDate, {
                    x: translator.translate(markerDate),
                    y: markersAreaTop,
                    labelOptions: that._getLabelFormatOptions(format),
                    withoutStick: withoutStick
                }, viewport);
            }

            if(viewport.isEmpty() || !options.marker.visible || options.argumentType !== 'datetime' || options.type === 'discrete' || that._majorTicks.length <= 1) {
                return [];
            }

            markersAreaTop = that._axisPosition + options.marker.topIndent;
            tickInterval = dateUtils.getDateUnitInterval(this._tickInterval);
            markerInterval = getMarkerInterval(tickInterval);

            markerDates = getMarkerDates(minBound, viewport.maxVisible, markerInterval);

            if(markerDates.length > 1
                || (markerDates.length === 1 && minBound < markerDates[0])) {

                dateMarkers = markerDates.reduce(function(markers, curDate, i, dates) {
                    const marker = draw(curDate, getMarkerFormat(curDate, dates[i - 1] || (minBound < curDate && minBound), tickInterval, markerInterval));
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
            const that = this;
            const markerOptions = this._options.marker;
            const textIndent = markerOptions.width + markerOptions.textLeftIndent;
            const invert = this._translator.getBusinessRange().invert;
            const canvas = that._getCanvasStartEnd();
            const dateMarkers = this._dateMarkers;

            if(!dateMarkers.length) {
                return offset;
            }

            if(dateMarkers[0].cropped) {
                if(!this._checkMarkersPosition(invert, dateMarkers[1], dateMarkers[0])) {
                    dateMarkers[0].hideLabel();
                }
            }

            let prevDateMarker;
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
                    const labelBBox = marker.labelBBox;
                    const dy = marker.y + markerOptions.textTopIndent - labelBBox.y;

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
            const that = this;
            const separatorHeight = that._options.marker.separatorHeight;
            const renderer = that._renderer;
            const businessRange = this._translator.getBusinessRange();
            const canvas = that._getCanvasStartEnd();
            const group = that._axisElementsGroup;

            that._markerTrackers = this._dateMarkers
                .filter(function(marker) { return !marker.hidden; })
                .map(function(marker, i, markers) {
                    const nextMarker = markers[i + 1] ||
                        {
                            x: canvas.end,
                            date: businessRange.max
                        };
                    const x = marker.x;
                    const y = marker.y + offset;
                    const markerTracker = renderer.path([
                        x, y,
                        x, y + separatorHeight,
                        nextMarker.x, y + separatorHeight,
                        nextMarker.x, y,
                        x, y
                    ], 'area').attr({
                        'stroke-width': 1,
                        stroke: 'grey',
                        fill: 'grey',
                        opacity: 0.0001
                    }).append(group);

                    markerTracker.data('range', { startValue: marker.date, endValue: nextMarker.date });
                    if(marker.title) {
                        markerTracker.setTitle(marker.title);
                    }

                    return markerTracker;
                });
        },

        _getLabelFormatOptions: function(formatString) {
            const that = this;
            let markerLabelOptions = that._markerLabelOptions;

            if(!markerLabelOptions) {
                that._markerLabelOptions = markerLabelOptions = extend(true, {}, that._options.marker.label);
            }

            if(!isDefined(that._options.marker.label.format)) {
                markerLabelOptions.format = formatString;
            }

            return markerLabelOptions;
        },

        _adjustConstantLineLabels: function(constantLines) {
            const that = this;
            const axisPosition = that._options.position;
            const canvas = that.getCanvas();
            const canvasLeft = canvas.left;
            const canvasRight = canvas.width - canvas.right;
            const canvasTop = canvas.top;
            const canvasBottom = canvas.height - canvas.bottom;
            const verticalCenter = canvasTop + (canvasBottom - canvasTop) / 2;
            const horizontalCenter = canvasLeft + (canvasRight - canvasLeft) / 2;
            let maxLabel = 0;

            constantLines.forEach(function(item) {
                const isHorizontal = that._isHorizontal;
                const linesOptions = item.options;
                const paddingTopBottom = linesOptions.paddingTopBottom;
                const paddingLeftRight = linesOptions.paddingLeftRight;
                const labelOptions = linesOptions.label;
                const labelVerticalAlignment = labelOptions.verticalAlignment;
                const labelHorizontalAlignment = labelOptions.horizontalAlignment;
                const labelIsInside = labelOptions.position === 'inside';
                const label = item.label;
                const box = item.labelBBox;
                let translateX;
                let translateY;

                if(label === null || box.isEmpty) {
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
            const that = this;
            const renderer = this._renderer;
            const group = renderer.g();

            constantLines.forEach(function(options) {
                that._drawConstantLineLabelText(options.label.text, 0, 0, options.label, group).attr({ align: 'center' });
            });

            return group.append(renderer.root);
        },

        _estimateLabelHeight: function(bBox, labelOptions) {
            let height = bBox.height;
            const drawingType = labelOptions.drawingType;

            if(this._validateDisplayMode(drawingType) === 'stagger' || this._validateOverlappingMode(labelOptions.overlappingBehavior, drawingType) === 'stagger') {
                height = height * 2 + labelOptions.staggeringSpacing;
            }

            if(this._validateDisplayMode(drawingType) === 'rotate' || this._validateOverlappingMode(labelOptions.overlappingBehavior, drawingType) === 'rotate') {
                const sinCos = vizUtils.getCosAndSin(labelOptions.rotationAngle);
                height = height * sinCos.cos + bBox.width * sinCos.sin;
            }

            return height && (height + labelOptions.indentFromAxis || 0) || 0;
        },

        estimateMargins: function(canvas) {
            this.updateCanvas(canvas);
            const that = this;
            const range = that._getViewportRange();
            const ticksData = this._createTicksAndLabelFormat(range);
            const ticks = ticksData.ticks;
            const tickInterval = ticksData.tickInterval;
            const options = this._options;
            const constantLineOptions = that._outsideConstantLines.filter(l => l.labelOptions.visible).map(l => l.options);
            const rootElement = that._renderer.root;
            const labelIsVisible = options.label.visible && !range.isEmpty() && ticks.length;
            const labelValue = labelIsVisible && that.formatLabel(ticks[ticks.length - 1], options.label, undefined, undefined, tickInterval, ticks);
            const labelElement = labelIsVisible && that._renderer.text(labelValue, 0, 0)
                .css(that._textFontStyles)
                .attr(that._textOptions)
                .append(rootElement);
            const titleElement = that._drawTitleText(rootElement, { x: 0, y: 0 });
            const constantLinesLabelsElement = that._drawConstantLinesForEstimating(constantLineOptions);
            const labelBox = labelElement && labelElement.getBBox() || { x: 0, y: 0, width: 0, height: 0 };
            const titleBox = titleElement && titleElement.getBBox() || { x: 0, y: 0, width: 0, height: 0 };
            const constantLinesBox = constantLinesLabelsElement.getBBox();
            const titleHeight = titleBox.height ? titleBox.height + options.title.margin : 0;
            const labelHeight = that._estimateLabelHeight(labelBox, options.label);
            const constantLinesHeight = constantLinesBox.height ? constantLinesBox.height + getMaxConstantLinePadding(constantLineOptions) : 0;
            const height = labelHeight + titleHeight;
            const margins = {
                left: _max(getLeftMargin(labelBox), getLeftMargin(constantLinesBox)),
                right: _max(getRightMargin(labelBox), getRightMargin(constantLinesBox)),
                top: (options.position === 'top' ? height : 0) + getConstantLineLabelMarginForVerticalAlignment(constantLineOptions, 'top', constantLinesHeight),
                bottom: (options.position !== 'top' ? height : 0) + getConstantLineLabelMarginForVerticalAlignment(constantLineOptions, 'bottom', constantLinesHeight)
            };

            labelElement && labelElement.remove();
            titleElement && titleElement.remove();
            constantLinesLabelsElement && constantLinesLabelsElement.remove();

            return margins;
        },

        _checkAlignmentConstantLineLabels: function(labelOptions) {
            const position = labelOptions.position;
            let verticalAlignment = (labelOptions.verticalAlignment || '').toLowerCase();
            let horizontalAlignment = (labelOptions.horizontalAlignment || '').toLowerCase();

            if(this._isHorizontal) {
                if(position === 'outside') {
                    verticalAlignment = verticalAlignment === BOTTOM ? BOTTOM : TOP;
                    horizontalAlignment = CENTER;
                } else {
                    verticalAlignment = verticalAlignment === CENTER ? CENTER : (verticalAlignment === BOTTOM ? BOTTOM : TOP);
                    horizontalAlignment = horizontalAlignment === LEFT ? LEFT : RIGHT;
                }
            } else {
                if(position === 'outside') {
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
            const that = this;
            let x = value;
            let y = value;

            if(that._isHorizontal) {
                y = that._orthogonalPositions[lineLabelOptions.verticalAlignment === 'top' ? 'start' : 'end'];
            } else {
                x = that._orthogonalPositions[lineLabelOptions.horizontalAlignment === 'right' ? 'end' : 'start'];
            }
            return { x: x, y: y };
        },

        _getAdjustedStripLabelCoords: function(strip) {
            const stripOptions = strip.options;
            const paddingTopBottom = stripOptions.paddingTopBottom;
            const paddingLeftRight = stripOptions.paddingLeftRight;
            const horizontalAlignment = stripOptions.label.horizontalAlignment;
            const verticalAlignment = stripOptions.label.verticalAlignment;
            const box = strip.labelBBox;
            const labelHeight = box.height;
            const labelWidth = box.width;
            const labelCoords = strip.labelCoords;
            let y = labelCoords.y - box.y;
            let x = labelCoords.x - box.x;

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

            const that = this;
            const options = that._options;
            const position = options.position;
            const margin = options.title.margin;
            const title = that._title;
            const boxTitle = title.bBox;
            const x = boxTitle.x;
            const y = boxTitle.y;
            const width = boxTitle.width;
            const height = boxTitle.height;
            const axisPosition = that._axisPosition;
            const loCoord = axisPosition - margin - offset;
            const hiCoord = axisPosition + margin + offset;
            const params = {};

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

        _checkTitleOverflow: function(titleElement) {
            if(!this._title && !titleElement) {
                return;
            }

            const canvasLength = this._getScreenDelta();
            const title = titleElement ? { bBox: titleElement.getBBox(), element: titleElement } : this._title;
            const titleOptions = this._options.title;
            const boxTitle = title.bBox;

            if((this._isHorizontal ? boxTitle.width : boxTitle.height) > canvasLength) {
                title.element.setMaxSize(canvasLength, undefined, {
                    wordWrap: titleOptions.wordWrap || 'none',
                    textOverflow: titleOptions.textOverflow || 'ellipsis'
                });
                this._wrapped = (titleOptions.wordWrap && titleOptions.wordWrap !== 'none');
            } else {
                const moreThanOriginalSize = title.originalSize && canvasLength > (this._isHorizontal ? title.originalSize.width : title.originalSize.height);
                !this._wrapped && moreThanOriginalSize && title.element.restoreText();
            }
        },

        coordsIn: function(x, y) {
            const canvas = this.getCanvas();
            const isHorizontal = this._options.isHorizontal;
            const position = this._options.position;
            const coord = isHorizontal ? y : x;

            if(isHorizontal && (x < canvas.left || x > (canvas.width - canvas.right))
                || !isHorizontal && (y < canvas.top || y > (canvas.height - canvas.bottom))) {
                return false;
            }
            if(isHorizontal && position === constants.top || !isHorizontal && position === constants.left) {
                return coord < canvas[position];
            }
            return coord > canvas[isHorizontal ? 'height' : 'width'] - canvas[position];
        },

        _boundaryTicksVisibility: {
            min: true,
            max: true
        },

        adjust(alignToBounds) {
            const that = this;
            const seriesData = that._seriesData;
            let viewport = { min: seriesData.min, max: seriesData.max };

            if(!alignToBounds) {
                viewport = that._series.filter(s => s.isVisible()).reduce((range, s) => {
                    const seriesRange = s.getViewport();
                    range.min = isDefined(seriesRange.min) ? (range.min < seriesRange.min ? range.min : seriesRange.min) : range.min;
                    range.max = isDefined(seriesRange.max) ? (range.max > seriesRange.max ? range.max : seriesRange.max) : range.max;
                    if(s.showZero) {
                        range = new rangeModule.Range(range);
                        range.correctValueZeroLevel();
                    }
                    return range;
                }, {});
            }

            if(isDefined(viewport.min) && isDefined(viewport.max)) {
                seriesData.minVisible = viewport.min;
                seriesData.maxVisible = viewport.max;
            }

            that._translator.updateBusinessRange(that.adjustViewport(seriesData));

            that._breaks = that._getScaleBreaks(that._options, {
                minVisible: seriesData.minVisible,
                maxVisible: seriesData.maxVisible
            }, that._series, that.isArgumentAxis);
        },

        hasWrap() {
            return this._wrapped;
        },
        getAxisPosition() {
            return this._axisPosition;
        },

        _getStick: function() {
            return !this._options.valueMarginsEnabled;
        },

        _getStripLabelCoords: function(from, to, stripLabelOptions) {
            const that = this;
            const orthogonalPositions = that._orthogonalPositions;
            const isHorizontal = that._isHorizontal;
            const horizontalAlignment = stripLabelOptions.horizontalAlignment;
            const verticalAlignment = stripLabelOptions.verticalAlignment;
            let x;
            let y;

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
            const pos1 = this._translator.translate(value, offset, this._options.type === 'semidiscrete' && this._options.tickInterval);
            const pos2 = this._axisPosition;
            const isHorizontal = this._isHorizontal;
            return {
                x: isHorizontal ? pos1 : pos2,
                y: isHorizontal ? pos2 : pos1
            };
        },

        areCoordsOutsideAxis: function(coords) {
            const coord = this._isHorizontal ? coords.x : coords.y;

            const visibleArea = this.getVisibleArea();
            if(coord < visibleArea[0] || coord > visibleArea[1]) {
                return true;
            }
            return false;
        },

        _getSkippedCategory: function(ticks) {
            let skippedCategory;

            if(this._options.type === constants.discrete && this._tickOffset && ticks.length !== 0) {
                skippedCategory = ticks[ticks.length - 1];
            }

            return skippedCategory;
        },

        _getScaleBreaks: function(axisOptions, viewport, series, isArgumentAxis) {
            const that = this;
            let breaks = (axisOptions.breaks || []).map(function(b) {
                return {
                    from: that.parser(b.startValue),
                    to: that.parser(b.endValue)
                };
            });
            if(axisOptions.type !== 'discrete' && axisOptions.dataType === 'datetime' && axisOptions.workdaysOnly) {
                breaks = breaks.concat(generateDateBreaks(viewport.minVisible,
                    viewport.maxVisible,
                    axisOptions.workWeek,
                    axisOptions.singleWorkdays,
                    axisOptions.holidays));
            }
            if(!isArgumentAxis && axisOptions.type !== 'discrete' && axisOptions.dataType !== 'datetime'
                && axisOptions.autoBreaksEnabled && axisOptions.maxAutoBreakCount !== 0) {
                breaks = breaks.concat(generateAutoBreaks(axisOptions, series, viewport));
            }
            return filterBreaks(sortingBreaks(breaks), viewport, axisOptions.breakStyle);
        },

        _drawBreak: function(translatedEnd, positionFrom, positionTo, width, options, group) {
            const that = this;
            const breakStart = translatedEnd - (!that._translator.isInverted() ? width + 1 : 0);
            const attr = {
                'stroke-width': 1,
                stroke: options.borderColor,
                sharp: !options.isWaved ? options.isHorizontal ? 'h' : 'v' : undefined
            };
            const spaceAttr = {
                stroke: options.color,
                'stroke-width': width
            };
            const getPoints = that._isHorizontal ? rotateLine : function(p) { return p; };
            const drawer = getLineDrawer(that._renderer, group, getPoints, positionFrom, breakStart, positionTo, options.isWaved);

            drawer(width / 2, spaceAttr);
            drawer(0, attr);
            drawer(width, attr);
        },

        _createBreakClipRect: function(from, to) {
            const that = this;
            const canvas = that._canvas;
            const clipWidth = to - from;
            let clipRect;

            if(that._isHorizontal) {
                clipRect = that._renderer.clipRect(canvas.left, from, canvas.width, clipWidth);
            } else {
                clipRect = that._renderer.clipRect(from, canvas.top, clipWidth, canvas.height);
            }

            that._breaksElements = that._breaksElements || [];
            that._breaksElements.push(clipRect);

            return clipRect.id;
        },

        _createBreaksGroup: function(clipFrom, clipTo) {
            const that = this;
            const group = that._renderer.g().attr({
                'class': that._axisCssPrefix + 'breaks',
                'clip-path': that._createBreakClipRect(clipFrom, clipTo)
            }).append(that._scaleBreaksGroup);

            that._breaksElements = that._breaksElements || [];
            that._breaksElements.push(group);
            return group;
        },

        _disposeBreaksGroup: function() {
            (this._breaksElements || []).forEach(function(clipRect) {
                clipRect.dispose();
            });

            this._breaksElements = null;
        },

        drawScaleBreaks: function(customCanvas) {
            const that = this;
            const options = that._options;
            const breakStyle = options.breakStyle;
            const position = options.position;
            let positionFrom;
            let positionTo;
            const breaks = that._translator.getBusinessRange().breaks || [];
            let additionGroup;
            let additionBreakFrom;
            let additionBreakTo;
            let mainGroup;
            let breakOptions;

            that._disposeBreaksGroup();

            if(!(breaks && breaks.length)) {
                return;
            }

            breakOptions = {
                color: that._options.containerColor,
                borderColor: breakStyle.color,
                isHorizontal: that._isHorizontal,
                isWaved: breakStyle.line.toLowerCase() !== 'straight'
            };

            if(customCanvas) {
                positionFrom = customCanvas.start;
                positionTo = customCanvas.end;
            } else {
                positionFrom = that._orthogonalPositions.start - (options.visible && !that._axisShift && (position === 'left' || position === 'top') ? SCALE_BREAK_OFFSET : 0);
                positionTo = that._orthogonalPositions.end + (options.visible && (position === 'right' || position === 'bottom') ? SCALE_BREAK_OFFSET : 0);
            }

            mainGroup = that._createBreaksGroup(positionFrom, positionTo);

            if(that._axisShift && options.visible) {
                additionBreakFrom = that._axisPosition - that._axisShift - SCALE_BREAK_OFFSET;
                additionBreakTo = additionBreakFrom + SCALE_BREAK_OFFSET * 2;
                additionGroup = that._createBreaksGroup(additionBreakFrom, additionBreakTo);
            }

            breaks.forEach(function(br) {
                if(!br.gapSize) {
                    const breakCoord = that._getTranslatedCoord(br.to);
                    that._drawBreak(breakCoord, positionFrom, positionTo, breakStyle.width, breakOptions, mainGroup);
                    if(that._axisShift && options.visible) {
                        that._drawBreak(breakCoord, additionBreakFrom, additionBreakTo, breakStyle.width, breakOptions, additionGroup);
                    }
                }
            });
        },

        _getSpiderCategoryOption: noop,

        shift: function(margins) {
            const that = this;
            const options = that._options;
            const isHorizontal = options.isHorizontal;
            const axesSpacing = that.getMultipleAxesSpacing();
            const constantLinesGroups = that._axisConstantLineGroups;

            function shiftGroup(side, group) {
                const attr = {
                    translateX: 0,
                    translateY: 0
                };
                const shift = margins[side] ? margins[side] + axesSpacing : 0;

                attr[isHorizontal ? 'translateY' : 'translateX'] = (side === 'left' || side === 'top' ? -1 : 1) * shift;

                (group[side] || group).attr(attr);
                return shift;
            }

            that._axisShift = shiftGroup(options.position, that._axisGroup);

            (isHorizontal ? ['top', 'bottom'] : ['left', 'right']).forEach(side => {
                shiftGroup(side, constantLinesGroups.above);
                shiftGroup(side, constantLinesGroups.under);
            });
        }
    }
};

function getLineDrawer(renderer, root, rotatePoints, positionFrom, breakStart, positionTo, isWaved) {
    const elementType = isWaved ? 'bezier' : 'line';
    const group = renderer.g().append(root);

    return function(offset, attr) {
        renderer.path(rotatePoints(getPoints(positionFrom, breakStart, positionTo, offset, isWaved)), elementType).attr(attr).append(group);
    };
}

function getPoints(positionFrom, breakStart, positionTo, offset, isWaved) {
    if(!isWaved) {
        return [positionFrom, breakStart + offset, positionTo, breakStart + offset];
    }

    breakStart += offset;

    let currentPosition;
    const topPoint = breakStart + WAVED_LINE_TOP;
    const centerPoint = breakStart + WAVED_LINE_CENTER;
    const bottomPoint = breakStart + WAVED_LINE_BOTTOM;
    const points = [[positionFrom, centerPoint]];

    for(currentPosition = positionFrom; currentPosition < positionTo + WAVED_LINE_LENGTH; currentPosition += WAVED_LINE_LENGTH) {
        points.push([
            currentPosition + 6, topPoint,
            currentPosition + 6, topPoint,
            currentPosition + 12, centerPoint,
            currentPosition + 18, bottomPoint,
            currentPosition + 18, bottomPoint,
            currentPosition + 24, centerPoint
        ]);
    }
    return [].concat.apply([], points);
}

function rotateLine(lineCoords) {
    const points = [];
    let i;

    for(i = 0; i < lineCoords.length; i += 2) {
        points.push(lineCoords[i + 1]);
        points.push(lineCoords[i]);
    }
    return points;
}
