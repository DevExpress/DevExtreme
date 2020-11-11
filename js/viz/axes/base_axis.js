import { smartFormatter as _format, formatRange } from './smart_formatter';
import {
    patchFontOptions,
    getVizRangeObject,
    getLogExt as getLog,
    raiseToExt as raiseTo,
    valueOf,
    rotateBBox,
    getCategoriesInfo,
    adjustVisualRange,
    getAddFunction,
    convertVisualRangeObject
} from '../core/utils';
import { isDefined, isFunction, isPlainObject, type } from '../../core/utils/type';
import constants from './axes_constants';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import formatHelper from '../../format_helper';
import { getParser } from '../components/parse_utils';
import { tickGenerator } from './tick_generator';
import { Translator2D } from '../translators/translator2d';
import { Range } from '../translators/range';
import { tick } from './tick';
import { adjust } from '../../core/utils/math';
import dateUtils from '../../core/utils/date';
import { noop as _noop } from '../../core/utils/common';
import xyMethods from './xy_axes';
import * as polarMethods from './polar_axes';
import createConstantLine from './constant_line';
import createStrip from './strip';
import { Deferred, when } from '../../core/utils/deferred';

const convertTicksToValues = constants.convertTicksToValues;
const _math = Math;
const _abs = _math.abs;
const _max = _math.max;
const _min = _math.min;
const _isArray = Array.isArray;

const DEFAULT_AXIS_LABEL_SPACING = 5;
const MAX_GRID_BORDER_ADHENSION = 4;

const TOP = constants.top;
const BOTTOM = constants.bottom;
const LEFT = constants.left;
const RIGHT = constants.right;
const CENTER = constants.center;

const KEEP = 'keep';
const SHIFT = 'shift';
const RESET = 'reset';

const ROTATE = 'rotate';

const DEFAULT_AXIS_DIVISION_FACTOR = 50;
const DEFAULT_MINOR_AXIS_DIVISION_FACTOR = 15;

const SCROLL_THRESHOLD = 5;
const MIN_BAR_MARGIN = 5;
const MAX_MARGIN_VALUE = 0.8;

const dateIntervals = {
    day: 86400000,
    week: 604800000
};

function getTickGenerator(options, incidentOccurred, skipTickGeneration, rangeIsEmpty, adjustDivisionFactor, { allowNegatives, linearThreshold }) {
    return tickGenerator({
        axisType: options.type,
        dataType: options.dataType,
        logBase: options.logarithmBase,
        allowNegatives,
        linearThreshold,

        axisDivisionFactor: adjustDivisionFactor(options.axisDivisionFactor || DEFAULT_AXIS_DIVISION_FACTOR),
        minorAxisDivisionFactor: adjustDivisionFactor(options.minorAxisDivisionFactor || DEFAULT_MINOR_AXIS_DIVISION_FACTOR),
        numberMultipliers: options.numberMultipliers,
        calculateMinors: options.minorTick.visible || options.minorGrid.visible || options.calculateMinors,

        allowDecimals: options.allowDecimals,
        endOnTick: options.endOnTick,

        incidentOccurred: incidentOccurred,

        firstDayOfWeek: options.workWeek?.[0],
        skipTickGeneration: skipTickGeneration,
        skipCalculationLimits: options.skipCalculationLimits,

        generateExtraTick: options.generateExtraTick,

        minTickInterval: options.minTickInterval,
        rangeIsEmpty
    });
}

function createMajorTick(axis, renderer, skippedCategory) {
    const options = axis.getOptions();

    return tick(
        axis,
        renderer,
        options.tick,
        options.grid,
        skippedCategory,
        false
    );
}

function createMinorTick(axis, renderer) {
    const options = axis.getOptions();

    return tick(
        axis,
        renderer,
        options.minorTick,
        options.minorGrid
    );
}

function createBoundaryTick(axis, renderer, isFirst) {
    const options = axis.getOptions();

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

function callAction(elements, action, actionArgument1, actionArgument2) {
    (elements || []).forEach(e => e[action](actionArgument1, actionArgument2));
}

function initTickCoords(ticks) {
    callAction(ticks, 'initCoords');
}

function drawTickMarks(ticks, options) {
    callAction(ticks, 'drawMark', options);
}

function drawGrids(ticks, drawLine) {
    callAction(ticks, 'drawGrid', drawLine);
}

function updateTicksPosition(ticks, options, animate) {
    callAction(ticks, 'updateTickPosition', options, animate);
}

function updateGridsPosition(ticks, animate) {
    callAction(ticks, 'updateGridPosition', animate);
}
export const measureLabels = function(items) {
    items.forEach(function(item) {
        const label = item.getContentContainer();
        item.labelBBox = label ? label.getBBox() : { x: 0, y: 0, width: 0, height: 0 };
    });
};

function cleanUpInvalidTicks(ticks) {
    let i = ticks.length - 1;
    for(i; i >= 0; i--) {
        if(!removeInvalidTick(ticks, i)) {
            break;
        }
    }
    for(i = 0; i < ticks.length; i++) {
        if(removeInvalidTick(ticks, i)) {
            i--;
        } else {
            break;
        }
    }
}

function removeInvalidTick(ticks, i) {
    if(ticks[i].coords.x === null || ticks[i].coords.y === null) {
        ticks.splice(i, 1);
        return true;
    }
    return false;
}

function validateAxisOptions(options) {
    const labelOptions = options.label;
    let position = options.position;
    const defaultPosition = options.isHorizontal ? BOTTOM : LEFT;
    const secondaryPosition = options.isHorizontal ? TOP : RIGHT;

    let labelPosition = labelOptions.position;

    if(position !== defaultPosition && position !== secondaryPosition) {
        position = defaultPosition;
    }

    if(!labelPosition || labelPosition === 'outside') {
        labelPosition = position;
    } else if(labelPosition === 'inside') {
        labelPosition = {
            [TOP]: BOTTOM,
            [BOTTOM]: TOP,
            [LEFT]: RIGHT,
            [RIGHT]: LEFT
        }[position];
    }
    if(labelPosition !== defaultPosition && labelPosition !== secondaryPosition) {
        labelPosition = position;
    }

    if(labelOptions.alignment !== CENTER && !labelOptions.userAlignment) {
        labelOptions.alignment = {
            [TOP]: CENTER,
            [BOTTOM]: CENTER,
            [LEFT]: RIGHT,
            [RIGHT]: LEFT
        }[labelPosition];
    }

    options.position = position;
    labelOptions.position = labelPosition;
    options.hoverMode = options.hoverMode ? options.hoverMode.toLowerCase() : 'none';
    labelOptions.minSpacing = labelOptions.minSpacing ?? DEFAULT_AXIS_LABEL_SPACING;

    options.type && (options.type = options.type.toLowerCase());
    options.argumentType && (options.argumentType = options.argumentType.toLowerCase());
    options.valueType && (options.valueType = options.valueType.toLowerCase());
}

function getOptimalAngle(boxes, labelOpt) {
    const angle = _math.asin((boxes[0].height + labelOpt.minSpacing) / (boxes[1].x - boxes[0].x)) * 180 / _math.PI;
    return angle < 45 ? -45 : -90;
}

function updateLabels(ticks, step, func) {
    ticks.forEach(function(tick, index) {
        if(tick.getContentContainer()) {
            if(index % step !== 0) {
                tick.removeLabel();
            } else if(func) {
                func(tick, index);
            }
        }
    });
}

function getZoomBoundValue(optionValue, dataValue) {
    if(optionValue === undefined) {
        return dataValue;
    } else if(optionValue === null) {
        return undefined;
    } else {
        return optionValue;
    }
}

function configureGenerator(options, axisDivisionFactor, viewPort, screenDelta, minTickInterval) {
    const tickGeneratorOptions = extend({}, options, {
        endOnTick: true,
        axisDivisionFactor,
        skipCalculationLimits: true,
        generateExtraTick: true,
        minTickInterval
    });

    return function(tickInterval, skipTickGeneration, min, max, breaks) {
        return getTickGenerator(tickGeneratorOptions, _noop, skipTickGeneration, viewPort.isEmpty(), v => v, viewPort)(
            {
                min: min,
                max: max,
                categories: viewPort.categories,
                isSpacedMargin: viewPort.isSpacedMargin
            },
            screenDelta,
            tickInterval,
            isDefined(tickInterval),
            undefined,
            undefined,
            undefined,
            breaks
        );
    };
}

function getConstantLineSharpDirection(coord, axisCanvas) {
    return Math.max(axisCanvas.start, axisCanvas.end) !== coord ? 1 : -1;
}

export const calculateCanvasMargins = function(bBoxes, canvas) {
    const cLeft = canvas.left;
    const cTop = canvas.top;
    const cRight = canvas.width - canvas.right;
    const cBottom = canvas.height - canvas.bottom;
    return bBoxes
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
};

export const Axis = function(renderSettings) {
    const that = this;

    that._renderer = renderSettings.renderer;
    that._incidentOccurred = renderSettings.incidentOccurred;
    that._eventTrigger = renderSettings.eventTrigger;

    that._stripsGroup = renderSettings.stripsGroup;
    that._labelAxesGroup = renderSettings.labelAxesGroup;
    that._constantLinesGroup = renderSettings.constantLinesGroup;
    that._scaleBreaksGroup = renderSettings.scaleBreaksGroup;
    that._axesContainerGroup = renderSettings.axesContainerGroup;
    that._gridContainerGroup = renderSettings.gridGroup;
    that._axisCssPrefix = renderSettings.widgetClass + '-' + (renderSettings.axisClass ? renderSettings.axisClass + '-' : '');

    that._setType(renderSettings.axisType, renderSettings.drawingType);
    that._createAxisGroups();
    that._translator = that._createTranslator();
    that.isArgumentAxis = renderSettings.isArgumentAxis;
    that._viewport = {};

    that._firstDrawing = true;

    that._initRange = {};
    that._getTemplate = renderSettings.getTemplate;
};

Axis.prototype = {
    constructor: Axis,

    _drawAxis() {
        const options = this._options;

        if(!options.visible) {
            return;
        }

        this._axisElement = this._createAxisElement();
        this._updateAxisElementPosition();

        this._axisElement.attr({ 'stroke-width': options.width, stroke: options.color, 'stroke-opacity': options.opacity })
            .sharp(this._getSharpParam(true), this.getAxisSharpDirection())
            .append(this._axisLineGroup);
    },

    _createPathElement(points, attr, sharpDirection) {
        return this.sharp(this._renderer.path(points, 'line').attr(attr), sharpDirection);
    },

    sharp(svgElement, sharpDirection = 1) {
        return svgElement.sharp(this._getSharpParam(), sharpDirection);
    },

    customPositionIsAvailable() {
        return false;
    },

    getOrthogonalAxis: _noop,

    getCustomPosition: _noop,

    getCustomBoundaryPosition: _noop,

    resolveOverlappingForCustomPositioning: _noop,

    hasCustomPosition() {
        return false;
    },

    customPositionIsBoundaryOrthogonalAxis() {
        return false;
    },

    getResolvedBoundaryPosition() {
        return this.getOptions().position;
    },

    getAxisSharpDirection() {
        const position = this.getResolvedBoundaryPosition();
        return this.hasCustomPosition() || position !== BOTTOM && position !== RIGHT ? 1 : -1;
    },

    getSharpDirectionByCoords(coords) {
        const canvas = this._getCanvasStartEnd();
        const maxCoord = Math.max(canvas.start, canvas.end);

        return this.getRadius ? 0 : (maxCoord !== coords[(this._isHorizontal ? 'x' : 'y')] ? 1 : -1);
    },

    _getGridLineDrawer: function() {
        const that = this;

        return function(tick, gridStyle) {
            const grid = that._getGridPoints(tick.coords);

            if(grid.points) {
                return that._createPathElement(grid.points, gridStyle, that.getSharpDirectionByCoords(tick.coords));
            }
            return null;
        };
    },

    _getGridPoints: function(coords) {
        const that = this;
        const isHorizontal = this._isHorizontal;
        const tickPositionField = isHorizontal ? 'x' : 'y';
        const orthogonalPositions = this._orthogonalPositions;
        const positionFrom = orthogonalPositions.start;
        const positionTo = orthogonalPositions.end;

        const borderOptions = that.borderOptions;

        const canvasStart = isHorizontal ? LEFT : TOP;
        const canvasEnd = isHorizontal ? RIGHT : BOTTOM;
        const axisCanvas = that.getCanvas();
        const canvas = {
            left: axisCanvas.left,
            right: axisCanvas.width - axisCanvas.right,
            top: axisCanvas.top,
            bottom: axisCanvas.height - axisCanvas.bottom
        };
        const firstBorderLinePosition = (borderOptions.visible && borderOptions[canvasStart]) ? canvas[canvasStart] : undefined;
        const lastBorderLinePosition = (borderOptions.visible && borderOptions[canvasEnd]) ? canvas[canvasEnd] : undefined;
        const minDelta = MAX_GRID_BORDER_ADHENSION + firstBorderLinePosition;
        const maxDelta = lastBorderLinePosition - MAX_GRID_BORDER_ADHENSION;

        if(that.areCoordsOutsideAxis(coords) ||
            coords[tickPositionField] === undefined ||
            (coords[tickPositionField] < minDelta || coords[tickPositionField] > maxDelta)) {
            return { points: null };
        }

        return {
            points: isHorizontal
                ? (coords[tickPositionField] !== null ? [coords[tickPositionField], positionFrom, coords[tickPositionField], positionTo] : null)
                : (coords[tickPositionField] !== null ? [positionFrom, coords[tickPositionField], positionTo, coords[tickPositionField]] : null)
        };
    },

    _getConstantLinePos: function(parsedValue, canvasStart, canvasEnd) {
        const value = this._getTranslatedCoord(parsedValue);

        if(!isDefined(value) || value < _min(canvasStart, canvasEnd) || value > _max(canvasStart, canvasEnd)) {
            return undefined;
        }

        return value;
    },

    _getConstantLineGraphicAttributes: function(value) {
        const positionFrom = this._orthogonalPositions.start;
        const positionTo = this._orthogonalPositions.end;

        return {
            points: this._isHorizontal ? [value, positionFrom, value, positionTo] : [positionFrom, value, positionTo, value]
        };
    },

    _createConstantLine: function(value, attr) {
        return this._createPathElement(this._getConstantLineGraphicAttributes(value).points, attr, getConstantLineSharpDirection(value, this._getCanvasStartEnd()));
    },

    _drawConstantLineLabelText: function(text, x, y, { font, cssClass }, group) {
        return this._renderer.text(text, x, y)
            .css(patchFontOptions(extend({}, this._options.label.font, font)))
            .attr({ align: 'center', 'class': cssClass })
            .append(group);
    },

    _drawConstantLineLabels: function(parsedValue, lineLabelOptions, value, group) {
        const that = this;
        let text = lineLabelOptions.text;
        const options = that._options;
        const labelOptions = options.label;

        that._checkAlignmentConstantLineLabels(lineLabelOptions);

        text = text ?? that.formatLabel(parsedValue, labelOptions);
        const coords = that._getConstantLineLabelsCoords(value, lineLabelOptions);

        return that._drawConstantLineLabelText(text, coords.x, coords.y, lineLabelOptions, group);
    },

    _getStripPos: function(startValue, endValue, canvasStart, canvasEnd, range) {
        const isContinuous = !!(range.minVisible || range.maxVisible);
        const categories = (range.categories || []).reduce(function(result, cat) {
            result.push(cat.valueOf());
            return result;
        }, []);
        let start;
        let end;
        let swap;
        let startCategoryIndex;
        let endCategoryIndex;

        if(!isContinuous) {
            if(isDefined(startValue) && isDefined(endValue)) {
                const parsedStartValue = this.parser(startValue);
                const parsedEndValue = this.parser(endValue);
                startCategoryIndex = inArray(isDefined(parsedStartValue) ? parsedStartValue.valueOf() : undefined, categories);
                endCategoryIndex = inArray(isDefined(parsedEndValue) ? parsedEndValue.valueOf() : undefined, categories);
                if(startCategoryIndex === -1 || endCategoryIndex === -1) {
                    return { from: 0, to: 0, outOfCanvas: true };
                }
                if(startCategoryIndex > endCategoryIndex) {
                    swap = endValue;
                    endValue = startValue;
                    startValue = swap;
                }
            }
        }

        if(isDefined(startValue)) {
            startValue = this.validateUnit(startValue, 'E2105', 'strip');
            start = this._getTranslatedCoord(startValue, -1);
        } else {
            start = canvasStart;
        }

        if(isDefined(endValue)) {
            endValue = this.validateUnit(endValue, 'E2105', 'strip');
            end = this._getTranslatedCoord(endValue, 1);
        } else {
            end = canvasEnd;
        }

        const stripPosition = (start < end) ? { from: start, to: end } : { from: end, to: start };
        const visibleArea = this.getVisibleArea();

        if(stripPosition.from <= visibleArea[0] && stripPosition.to <= visibleArea[0] || stripPosition.from >= visibleArea[1] && stripPosition.to >= visibleArea[1]) {
            stripPosition.outOfCanvas = true;
        }
        return stripPosition;
    },

    _getStripGraphicAttributes: function(fromPoint, toPoint) {
        let x;
        let y;
        let width;
        let height;
        const orthogonalPositions = this._orthogonalPositions;
        const positionFrom = orthogonalPositions.start;
        const positionTo = orthogonalPositions.end;

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

    _createStrip: function(attrs) {
        return this._renderer.rect(attrs.x, attrs.y, attrs.width, attrs.height);
    },

    _adjustStripLabels: function() {
        const that = this;

        this._strips.forEach(function(strip) {
            if(strip.label) {
                strip.label.attr(that._getAdjustedStripLabelCoords(strip));
            }
        });
    },

    _adjustLabelsCoord(offset, maxWidth, checkCanvas) {
        const that = this;
        const getContainerAttrs = tick => this._getLabelAdjustedCoord(tick, offset + (tick.labelOffset || 0), maxWidth, checkCanvas);
        that._majorTicks.forEach(function(tick) {
            if(tick.label) {
                tick.updateMultilineTextAlignment();
                tick.label.attr(getContainerAttrs(tick));
            } else {
                tick.templateContainer && tick.templateContainer.attr(getContainerAttrs(tick));
            }
        });
    },

    _adjustLabels: function(offset) {
        const that = this;
        const options = that.getOptions();
        const positionsAreConsistent = options.position === options.label.position;
        const maxSize = that._majorTicks.reduce(function(size, tick) {
            if(!tick.getContentContainer()) return size;
            const bBox = tick.labelRotationAngle ? rotateBBox(tick.labelBBox, [tick.labelCoords.x, tick.labelCoords.y], -tick.labelRotationAngle) : tick.labelBBox;
            return {
                width: _max(size.width || 0, bBox.width),
                height: _max(size.height || 0, bBox.height),
                offset: _max(size.offset || 0, tick.labelOffset || 0)
            };
        }, {});
        const additionalOffset = positionsAreConsistent ? (that._isHorizontal ? maxSize.height : maxSize.width) : 0;

        that._adjustLabelsCoord(offset, maxSize.width);

        return offset + additionalOffset + (additionalOffset && that._options.label.indentFromAxis) + (positionsAreConsistent ? maxSize.offset : 0);
    },

    _getLabelAdjustedCoord: function(tick, offset, maxWidth) {
        offset = offset || 0;
        const that = this;
        const options = that._options;
        const templateBox = tick.templateContainer && tick.templateContainer.getBBox();
        const box = templateBox || rotateBBox(tick.labelBBox, [ tick.labelCoords.x, tick.labelCoords.y ], -tick.labelRotationAngle || 0);
        const textAlign = tick.labelAlignment || options.label.alignment;
        const isDiscrete = that._options.type === 'discrete';
        const isFlatLabel = tick.labelRotationAngle % 90 === 0;
        const indentFromAxis = options.label.indentFromAxis;
        const labelPosition = options.label.position;
        const axisPosition = that._axisPosition;
        const labelCoords = tick.labelCoords;
        const labelX = labelCoords.x;
        let translateX;
        let translateY;

        if(that._isHorizontal) {
            if(labelPosition === BOTTOM) {
                translateY = axisPosition + indentFromAxis - box.y + offset;
            } else {
                translateY = axisPosition - indentFromAxis - (box.y + box.height) - offset;
            }

            if(textAlign === RIGHT) {
                translateX = isDiscrete && isFlatLabel ? tick.coords.x - (box.x + box.width) : labelX - box.x - box.width;
            } else if(textAlign === LEFT) {
                translateX = isDiscrete && isFlatLabel ? labelX - box.x - (tick.coords.x - labelX) : labelX - box.x;
            } else {
                translateX = labelX - box.x - box.width / 2;
            }
        } else {
            translateY = labelCoords.y - box.y - box.height / 2;
            if(labelPosition === LEFT) {
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

    _createAxisConstantLineGroups: function() {
        const that = this;
        const renderer = that._renderer;
        const classSelector = that._axisCssPrefix;
        const constantLinesClass = classSelector + 'constant-lines';

        const insideGroup = renderer.g().attr({ 'class': constantLinesClass });
        const outsideGroup1 = renderer.g().attr({ 'class': constantLinesClass });
        const outsideGroup2 = renderer.g().attr({ 'class': constantLinesClass });

        return {
            inside: insideGroup,
            outside1: outsideGroup1,
            left: outsideGroup1,
            top: outsideGroup1,
            outside2: outsideGroup2,
            right: outsideGroup2,
            bottom: outsideGroup2,
            remove: function() {
                this.inside.remove();
                this.outside1.remove();
                this.outside2.remove();
            },
            clear: function() {
                this.inside.clear();
                this.outside1.clear();
                this.outside2.clear();
            }
        };
    },

    _createAxisGroups: function() {
        const that = this;
        const renderer = that._renderer;
        const classSelector = that._axisCssPrefix;

        that._axisGroup = renderer.g().attr({ 'class': classSelector + 'axis' }).enableLinks();
        that._axisStripGroup = renderer.g().attr({ 'class': classSelector + 'strips' });
        that._axisGridGroup = renderer.g().attr({ 'class': classSelector + 'grid' });
        that._axisElementsGroup = renderer.g().attr({ 'class': classSelector + 'elements' }).linkOn(that._axisGroup, 'axisElements').linkAppend();
        that._axisLineGroup = renderer.g().attr({ 'class': classSelector + 'line' }).linkOn(that._axisGroup, 'axisLine').linkAppend();
        that._axisTitleGroup = renderer.g().attr({ 'class': classSelector + 'title' }).append(that._axisGroup);

        that._axisConstantLineGroups = {
            above: that._createAxisConstantLineGroups(),
            under: that._createAxisConstantLineGroups(),
        };

        that._axisStripLabelGroup = renderer.g().attr({ 'class': classSelector + 'axis-labels' });
    },

    _clearAxisGroups: function() {
        const that = this;

        that._axisGroup.remove();
        that._axisStripGroup.remove();
        that._axisStripLabelGroup.remove();
        that._axisConstantLineGroups.above.remove();
        that._axisConstantLineGroups.under.remove();
        that._axisGridGroup.remove();

        that._axisTitleGroup.clear();
        (!that._options.label.template || !that.isRendered()) && that._axisElementsGroup.clear(); // for react async templates

        that._axisLineGroup && that._axisLineGroup.clear();
        that._axisStripGroup && that._axisStripGroup.clear();
        that._axisGridGroup && that._axisGridGroup.clear();
        that._axisConstantLineGroups.above.clear();
        that._axisConstantLineGroups.under.clear();
        that._axisStripLabelGroup && that._axisStripLabelGroup.clear();
    },

    _getLabelFormatObject: function(value, labelOptions, range, point, tickInterval, ticks) {
        range = range || this._getViewportRange();

        const formatObject = {
            value: value,
            valueText: _format(value, {
                labelOptions: labelOptions,
                ticks: ticks || convertTicksToValues(this._majorTicks),
                tickInterval: tickInterval ?? this._tickInterval,
                dataType: this._options.dataType,
                logarithmBase: this._options.logarithmBase,
                type: this._options.type,
                showTransition: !this._options.marker.visible,
                point: point
            }) || '',

            // B252346
            min: range.minVisible,
            max: range.maxVisible
        };

        // for crosshair's customizeText
        if(point) {
            formatObject.point = point;
        }

        return formatObject;
    },

    formatLabel: function(value, labelOptions, range, point, tickInterval, ticks) {
        const formatObject = this._getLabelFormatObject(value, labelOptions, range, point, tickInterval, ticks);

        return isFunction(labelOptions.customizeText) ? labelOptions.customizeText.call(formatObject, formatObject) : formatObject.valueText;
    },

    formatHint: function(value, labelOptions, range) {
        const formatObject = this._getLabelFormatObject(value, labelOptions, range);

        return isFunction(labelOptions.customizeHint) ? labelOptions.customizeHint.call(formatObject, formatObject) : undefined;
    },

    formatRange(startValue, endValue, interval) {
        return formatRange(startValue, endValue, interval, this.getOptions());
    },

    _setTickOffset: function() {
        const options = this._options;
        const discreteAxisDivisionMode = options.discreteAxisDivisionMode;
        this._tickOffset = +(discreteAxisDivisionMode !== 'crossLabels' || !discreteAxisDivisionMode);
    },

    resetApplyingAnimation: function(isFirstDrawing) {
        this._resetApplyingAnimation = true;
        if(isFirstDrawing) {
            this._firstDrawing = true;
        }
    },

    getMargins: function() {
        const that = this;
        if(that.hasCustomPosition()) {
            return {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
        }

        const options = that._options;
        const position = options.position;
        const placeholderSize = options.placeholderSize;
        const canvas = that.getCanvas();
        const cLeft = canvas.left;
        const cTop = canvas.top;
        const cRight = canvas.width - canvas.right;
        const cBottom = canvas.height - canvas.bottom;
        const edgeMarginCorrection = _max(options.grid.visible && options.grid.width || 0, options.tick.visible && options.tick.width || 0);
        const constantLineAboveSeries = that._axisConstantLineGroups.above;
        const constantLineUnderSeries = that._axisConstantLineGroups.under;
        const boxes = [that._axisElementsGroup,
            constantLineAboveSeries.outside1, constantLineAboveSeries.outside2,
            constantLineUnderSeries.outside1, constantLineUnderSeries.outside2,
            that._axisLineGroup
        ]
            .map(group => group && group.getBBox())
            .concat((function(group) {
                const box = group && group.getBBox();

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
            })(that._axisTitleGroup));

        const margins = calculateCanvasMargins(boxes, canvas);

        margins[position] += options.crosshairMargin;

        if(placeholderSize) {
            margins[position] = placeholderSize;
        }

        if(edgeMarginCorrection) {
            if(that._isHorizontal && canvas.right < edgeMarginCorrection && margins.right < edgeMarginCorrection) {
                margins.right = edgeMarginCorrection;
            }
            if(!that._isHorizontal && canvas.bottom < edgeMarginCorrection && margins.bottom < edgeMarginCorrection) {
                margins.bottom = edgeMarginCorrection;
            }
        }

        return margins;
    },

    validateUnit: function(unit, idError, parameters) {
        const that = this;
        unit = that.parser(unit);
        if(unit === undefined && idError) {
            that._incidentOccurred(idError, [parameters]);
        }
        return unit;
    },

    _setType: function(axisType, drawingType) {
        const that = this;
        let axisTypeMethods;

        switch(axisType) {
            case 'xyAxes':
                axisTypeMethods = xyMethods;
                break;
            case 'polarAxes':
                axisTypeMethods = polarMethods;
                break;
        }

        extend(that, axisTypeMethods[drawingType]);
    },

    _getSharpParam: function() {
        return true;
    },

    _disposeBreaksGroup: _noop,

    // public
    dispose: function() {
        const that = this;

        [that._axisElementsGroup, that._axisStripGroup, that._axisGroup].forEach(function(g) { g.dispose(); });

        that._strips = that._title = null;

        that._axisStripGroup = that._axisConstantLineGroups = that._axisStripLabelGroup = that._axisBreaksGroup = null;
        that._axisLineGroup = that._axisElementsGroup = that._axisGridGroup = null;
        that._axisGroup = that._axisTitleGroup = null;
        that._axesContainerGroup = that._stripsGroup = that._constantLinesGroup = null;

        that._renderer = that._options = that._textOptions = that._textFontStyles = null;
        that._translator = null;
        that._majorTicks = that._minorTicks = null;
        that._disposeBreaksGroup();
        that._templatesRendered && that._templatesRendered.reject();
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

        this._updateTranslator();
    },

    resetTypes: function(typeSelector) {
        this._options.type = this._initTypes.type;
        this._options[typeSelector] = this._initTypes[typeSelector];
    },

    getTranslator: function() {
        return this._translator;
    },

    updateOptions: function(options) {
        const that = this;
        const labelOpt = options.label;

        validateAxisOptions(options);
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
        that._setTickOffset();

        that._isHorizontal = options.isHorizontal;
        that.pane = options.pane;
        that.name = options.name;
        that.priority = options.priority;

        that._hasLabelFormat = labelOpt.format !== '' && isDefined(labelOpt.format);
        that._textOptions = {
            opacity: labelOpt.opacity,
            align: 'center',
            'class': labelOpt.cssClass
        };
        that._textFontStyles = patchFontOptions(labelOpt.font);

        if(options.type === constants.logarithmic) {
            if(options.logarithmBaseError) {
                that._incidentOccurred('E2104');
                delete options.logarithmBaseError;
            }
        }

        that._updateTranslator();
        that._createConstantLines();
        that._strips = (options.strips || []).map(o => createStrip(that, o));
        that._majorTicks = that._minorTicks = null;
        that._firstDrawing = true;
    },

    calculateInterval: function(value, prevValue) {
        const options = this._options;

        if(!options || (options.type !== constants.logarithmic)) {
            return _abs(value - prevValue);
        }
        const { allowNegatives, linearThreshold } = new Range(this.getTranslator().getBusinessRange());
        return _abs(getLog(value, options.logarithmBase, allowNegatives, linearThreshold) - getLog(prevValue, options.logarithmBase, allowNegatives, linearThreshold));
    },

    getCanvasRange() {
        const translator = this._translator;
        return {
            startValue: translator.from(translator.translate('canvas_position_start')),
            endValue: translator.from(translator.translate('canvas_position_end'))
        };
    },

    _processCanvas: function(canvas) {
        return canvas;
    },

    updateCanvas: function(canvas, canvasRedesign) {
        if(!canvasRedesign) {
            const positions = this._orthogonalPositions = {
                start: !this._isHorizontal ? canvas.left : canvas.top,
                end: !this._isHorizontal ? canvas.width - canvas.right : canvas.height - canvas.bottom
            };

            positions.center = positions.start + (positions.end - positions.start) / 2;
        } else {
            this._orthogonalPositions = null;
        }

        this._canvas = canvas;
        this._translator.updateCanvas(this._processCanvas(canvas));

        this._initAxisPositions();
    },

    getCanvas: function() {
        return this._canvas;
    },

    getAxisShift() {
        return this._axisShift || 0;
    },

    hideTitle: function() {
        const that = this;

        if(that._options.title.text) {
            that._incidentOccurred('W2105', [that._isHorizontal ? 'horizontal' : 'vertical']);
            that._axisTitleGroup.clear();
        }
    },

    getTitle: function() {
        return this._title;
    },

    hideOuterElements: function() {
        const that = this;
        const options = that._options;

        if((options.label.visible || that._outsideConstantLines.length) && !that._translator.getBusinessRange().isEmpty()) {
            that._incidentOccurred('W2106', [that._isHorizontal ? 'horizontal' : 'vertical']);
            that._axisElementsGroup.clear();
            callAction(that._outsideConstantLines, 'removeLabel');
        }
    },

    _resolveLogarithmicOptionsForRange(range) {
        const options = this._options;
        if(options.type === constants.logarithmic) {
            range.addRange({
                allowNegatives: options.allowNegatives !== undefined ? options.allowNegatives : (range.min <= 0)
            });
            if(!isNaN(options.linearThreshold)) {
                range.linearThreshold = options.linearThreshold;
            }
        }
    },

    adjustViewport(businessRange) {
        const that = this;
        const options = that._options;
        const isDiscrete = options.type === constants.discrete;
        let categories = that._seriesData && that._seriesData.categories || [];
        const wholeRange = that.adjustRange(getVizRangeObject(options.wholeRange));
        const visualRange = that.getViewport() || {};

        const result = new Range(businessRange);
        that._addConstantLinesToRange(result, 'minVisible', 'maxVisible');

        let minDefined = isDefined(visualRange.startValue);
        let maxDefined = isDefined(visualRange.endValue);

        if(!isDiscrete) {
            minDefined = minDefined && (!isDefined(wholeRange.endValue) || visualRange.startValue < wholeRange.endValue);
            maxDefined = maxDefined && (!isDefined(wholeRange.startValue) || visualRange.endValue > wholeRange.startValue);
        }

        const minVisible = minDefined ? visualRange.startValue : result.minVisible;
        const maxVisible = maxDefined ? visualRange.endValue : result.maxVisible;

        if(!isDiscrete) {
            result.min = wholeRange.startValue ?? result.min;
            result.max = wholeRange.endValue ?? result.max;
        } else {
            const categoriesInfo = getCategoriesInfo(categories, wholeRange.startValue, wholeRange.endValue);

            categories = categoriesInfo.categories;
            result.categories = categories;
        }

        const adjustedVisualRange = adjustVisualRange({
            axisType: options.type,
            dataType: options.dataType,
            base: options.logarithmBase
        }, {
            startValue: minDefined ? visualRange.startValue : undefined,
            endValue: maxDefined ? visualRange.endValue : undefined,
            length: visualRange.length
        }, {
            categories,
            min: wholeRange.startValue,
            max: wholeRange.endValue
        }, {
            categories,
            min: minVisible,
            max: maxVisible
        });

        result.minVisible = adjustedVisualRange.startValue;
        result.maxVisible = adjustedVisualRange.endValue;

        !isDefined(result.min) && (result.min = result.minVisible);
        !isDefined(result.max) && (result.max = result.maxVisible);
        result.addRange({}); // controlValuesByVisibleBounds
        that._resolveLogarithmicOptionsForRange(result);

        return result;
    },

    adjustRange(range) {
        range = range || {};
        const isDiscrete = this._options.type === constants.discrete;
        const isLogarithmic = this._options.type === constants.logarithmic;

        const disabledNegatives = this._options.allowNegatives === false;
        if(isLogarithmic) {
            range.startValue = disabledNegatives && range.startValue <= 0 ? null : range.startValue;
            range.endValue = disabledNegatives && range.endValue <= 0 ? null : range.endValue;
        }
        if(!isDiscrete && isDefined(range.startValue) && isDefined(range.endValue) && range.startValue > range.endValue) {
            const tmp = range.endValue;
            range.endValue = range.startValue;
            range.startValue = tmp;
        }

        return range;
    },

    _getVisualRangeUpdateMode(viewport, newRange, oppositeValue) {
        let value = this._options.visualRangeUpdateMode;
        const translator = this._translator;
        const range = this._seriesData;

        if(this.isArgumentAxis) {
            if([SHIFT, KEEP, RESET].indexOf(value) === -1) {
                if(range.axisType === constants.discrete) {
                    const categories = range.categories;
                    const newCategories = newRange.categories;
                    const visualRange = this.visualRange();
                    if(categories &&
                        newCategories &&
                        categories.length &&
                        newCategories.map(c => c.valueOf()).join(',').indexOf(categories.map(c => c.valueOf()).join(',')) !== -1 &&
                        (visualRange.startValue.valueOf() !== categories[0].valueOf() ||
                            visualRange.endValue.valueOf() !== categories[categories.length - 1].valueOf())
                    ) {
                        value = KEEP;
                    } else {
                        value = RESET;
                    }
                } else {
                    const minPoint = translator.translate(range.min);
                    const minVisiblePoint = translator.translate(viewport.startValue);

                    const maxPoint = translator.translate(range.max);
                    const maxVisiblePoint = translator.translate(viewport.endValue);

                    if(minPoint === minVisiblePoint && maxPoint === maxVisiblePoint) {
                        value = RESET;
                    } else if(minPoint !== minVisiblePoint && maxPoint === maxVisiblePoint) {
                        value = SHIFT;
                    } else {
                        value = KEEP;
                    }
                }
            }
        } else {
            if([KEEP, RESET].indexOf(value) === -1) {
                if(oppositeValue === KEEP) {
                    value = KEEP;
                } else {
                    value = RESET;
                }
            }
        }

        return value;
    },

    _handleBusinessRangeChanged(oppositeVisualRangeUpdateMode, axisReinitialized, newRange) {
        const that = this;
        const visualRange = this.visualRange();

        if(axisReinitialized || that._translator.getBusinessRange().isEmpty()) {
            return;
        }

        let visualRangeUpdateMode = that._lastVisualRangeUpdateMode = that._getVisualRangeUpdateMode(visualRange, newRange, oppositeVisualRangeUpdateMode);
        if(!that.isArgumentAxis) {
            const viewport = that.getViewport();
            if(!isDefined(viewport.startValue) &&
                !isDefined(viewport.endValue) &&
                !isDefined(viewport.length)) {
                visualRangeUpdateMode = RESET;
            }
        }

        that._prevDataWasEmpty && (visualRangeUpdateMode = KEEP);

        if(visualRangeUpdateMode === KEEP) {
            that._setVisualRange([visualRange.startValue, visualRange.endValue]);
        }
        if(visualRangeUpdateMode === RESET) {
            that._setVisualRange([null, null]);
        }
        if(visualRangeUpdateMode === SHIFT) {
            that._setVisualRange({ length: that.getVisualRangeLength() });
        }
    },

    getVisualRangeLength(range) {
        const currentBusinessRange = range || this._translator.getBusinessRange();
        const { type } = this._options;
        let length;
        if(type === constants.logarithmic) {
            length = adjust(this.calculateInterval(currentBusinessRange.maxVisible, currentBusinessRange.minVisible));
        } else if(type === constants.discrete) {
            const categoriesInfo = getCategoriesInfo(currentBusinessRange.categories, currentBusinessRange.minVisible, currentBusinessRange.maxVisible);
            length = categoriesInfo.categories.length;
        } else {
            length = currentBusinessRange.maxVisible - currentBusinessRange.minVisible;
        }
        return length;
    },

    getVisualRangeCenter(range) {
        const businessRange = this._translator.getBusinessRange();
        const currentBusinessRange = range || businessRange;
        const { type, logarithmBase } = this._options;
        let center;

        if(!isDefined(currentBusinessRange.minVisible) || !isDefined(currentBusinessRange.maxVisible)) {
            return;
        }

        if(type === constants.logarithmic) {
            const { allowNegatives, linearThreshold, minVisible, maxVisible } = currentBusinessRange;
            center = raiseTo(adjust(getLog(maxVisible, logarithmBase, allowNegatives, linearThreshold) + getLog(minVisible, logarithmBase, allowNegatives, linearThreshold)) / 2, logarithmBase, allowNegatives, linearThreshold);
        } else if(type === constants.discrete) {
            const categoriesInfo = getCategoriesInfo(currentBusinessRange.categories, currentBusinessRange.minVisible, currentBusinessRange.maxVisible);
            const index = Math.ceil(categoriesInfo.categories.length / 2) - 1;
            center = businessRange.categories.indexOf(categoriesInfo.categories[index]);
        } else {
            center = (currentBusinessRange.maxVisible.valueOf() + currentBusinessRange.minVisible.valueOf()) / 2;
        }
        return center;
    },

    setBusinessRange(range, axisReinitialized, oppositeVisualRangeUpdateMode, argCategories) {
        const that = this;
        const options = that._options;
        const isDiscrete = options.type === constants.discrete;

        that._handleBusinessRangeChanged(oppositeVisualRangeUpdateMode, axisReinitialized, range);
        that._seriesData = new Range(range);
        const dataIsEmpty = that._seriesData.isEmpty();
        that._prevDataWasEmpty = dataIsEmpty;

        that._seriesData.addRange({
            categories: options.categories,
            dataType: options.dataType,
            axisType: options.type,
            base: options.logarithmBase,
            invert: options.inverted
        });

        that._resolveLogarithmicOptionsForRange(that._seriesData);

        if(!isDiscrete) {
            if(!isDefined(that._seriesData.min) && !isDefined(that._seriesData.max)) {
                const visualRange = that.getViewport();
                visualRange && that._seriesData.addRange({
                    min: visualRange.startValue,
                    max: visualRange.endValue
                });
            }
            const synchronizedValue = options.synchronizedValue;
            if(isDefined(synchronizedValue)) {
                that._seriesData.addRange({
                    min: synchronizedValue,
                    max: synchronizedValue
                });
            }
        }

        that._seriesData.minVisible = that._seriesData.minVisible ?? that._seriesData.min;
        that._seriesData.maxVisible = that._seriesData.maxVisible ?? that._seriesData.max;

        if(!that.isArgumentAxis && options.showZero) {
            that._seriesData.correctValueZeroLevel();
        }
        that._seriesData.sortCategories(that.getCategoriesSorter(argCategories));

        that._seriesData.userBreaks = that._getScaleBreaks(options, that._seriesData, that._series, that.isArgumentAxis);

        that._translator.updateBusinessRange(that._getViewportRange());
    },

    _addConstantLinesToRange(dataRange, minValueField, maxValueField) {
        this._outsideConstantLines.concat(this._insideConstantLines || []).forEach(cl => {
            if(cl.options.extendAxis) {
                const value = cl.getParsedValue();
                dataRange.addRange({
                    [minValueField]: value,
                    [maxValueField]: value
                });
            }
        });
    },

    setGroupSeries: function(series) {
        this._series = series;
    },

    getLabelsPosition: function() {
        const that = this;
        const options = that._options;
        const position = options.position;
        const labelShift = options.label.indentFromAxis + (that._axisShift || 0) + that._constantLabelOffset;
        const axisPosition = that._axisPosition;

        return position === TOP || position === LEFT ? axisPosition - labelShift : axisPosition + labelShift;
    },

    getFormattedValue: function(value, options, point) {
        const labelOptions = this._options.label;

        return isDefined(value) ? this.formatLabel(value, extend(true, {}, labelOptions, options), undefined, point) : null;
    },

    _getBoundaryTicks: function(majors, viewPort) {
        const that = this;
        const length = majors.length;
        const options = that._options;
        const customBounds = options.customBoundTicks;
        const min = viewPort.minVisible;
        const max = viewPort.maxVisible;
        const addMinMax = options.showCustomBoundaryTicks ? that._boundaryTicksVisibility : {};
        let boundaryTicks = [];

        if(options.type === constants.discrete) {
            if(that._tickOffset && majors.length !== 0) {
                boundaryTicks = [majors[0], majors[majors.length - 1]];
            }
        } else {
            if(customBounds) {
                if(addMinMax.min && isDefined(customBounds[0])) {
                    boundaryTicks.push(customBounds[0]);
                }

                if(addMinMax.max && isDefined(customBounds[1])) {
                    boundaryTicks.push(customBounds[1]);
                }
            } else {
                if(addMinMax.min && (length === 0 || majors[0] > min)) {
                    boundaryTicks.push(min);
                }

                if(addMinMax.max && (length === 0 || majors[length - 1] < max)) {
                    boundaryTicks.push(max);
                }
            }
        }
        return boundaryTicks;
    },

    setPercentLabelFormat: function() {
        if(!this._hasLabelFormat) {
            this._options.label.format = 'percent';
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

    estimateTickInterval: function(canvas) {
        const that = this;
        that.updateCanvas(canvas);
        return that._tickInterval !== that._getTicks(that._getViewportRange(), _noop, true).tickInterval;
    },

    setTicks: function(ticks) {
        const majors = ticks.majorTicks || [];
        this._majorTicks = majors.map(createMajorTick(this, this._renderer, this._getSkippedCategory(majors)));
        this._minorTicks = (ticks.minorTicks || []).map(createMinorTick(this, this._renderer));
        this._isSynchronized = true;
    },

    _adjustDivisionFactor: function(val) {
        return val;
    },

    _getTicks: function(viewPort, incidentOccurred, skipTickGeneration) {
        const that = this;
        const options = that._options;
        const customTicks = options.customTicks;
        const customMinorTicks = options.customMinorTicks;

        return getTickGenerator(options, incidentOccurred || that._incidentOccurred, skipTickGeneration, that._translator.getBusinessRange().isEmpty(), that._adjustDivisionFactor.bind(that), viewPort)(
            {
                min: viewPort.minVisible,
                max: viewPort.maxVisible,
                categories: viewPort.categories,
                isSpacedMargin: viewPort.isSpacedMargin
            },
            that._getScreenDelta(),
            options.tickInterval,
            options.label.overlappingBehavior === 'ignore' || options.forceUserTickInterval,
            {
                majors: customTicks,
                minors: customMinorTicks
            },
            options.minorTickInterval,
            options.minorTickCount,
            that._initialBreaks
        );
    },

    _createTicksAndLabelFormat: function(range, incidentOccurred) {
        const options = this._options;
        const ticks = this._getTicks(range, incidentOccurred, false);

        if(!range.isEmpty() && options.type === constants.discrete && options.dataType === 'datetime' && !this._hasLabelFormat && ticks.ticks.length) {
            options.label.format = formatHelper.getDateFormatByTicks(ticks.ticks);
        }

        return ticks;
    },

    getAggregationInfo(useAllAggregatedPoints, range) {
        const that = this;
        const options = that._options;
        const marginOptions = that._marginOptions;
        const businessRange = new Range(that.getTranslator().getBusinessRange()).addRange(range);
        const visualRange = that.getViewport();
        const minVisible = visualRange?.startValue ?? businessRange.minVisible;
        const maxVisible = visualRange?.endValue ?? businessRange.maxVisible;
        let ticks = [];

        if(options.type === constants.discrete && options.aggregateByCategory) {
            return {
                aggregateByCategory: true
            };
        }

        const aggregationInterval = options.aggregationInterval;
        let aggregationGroupWidth = options.aggregationGroupWidth;

        if(!aggregationGroupWidth && marginOptions) {
            if(marginOptions.checkInterval) {
                aggregationGroupWidth = options.axisDivisionFactor;
            }
            if(marginOptions.sizePointNormalState) {
                aggregationGroupWidth = Math.min(marginOptions.sizePointNormalState, options.axisDivisionFactor);
            }
        }

        const minInterval = !options.aggregationGroupWidth && !aggregationInterval && range.interval;

        const generateTicks = configureGenerator(options, aggregationGroupWidth, businessRange, that._getScreenDelta(), minInterval);
        const tickInterval = generateTicks(aggregationInterval, true, minVisible, maxVisible, that._seriesData?.breaks).tickInterval;

        if(options.type !== constants.discrete) {
            const min = useAllAggregatedPoints ? businessRange.min : minVisible;
            const max = useAllAggregatedPoints ? businessRange.max : maxVisible;
            if(isDefined(min) && isDefined(max)) {
                const add = getAddFunction({
                    base: options.logarithmBase,
                    axisType: options.type,
                    dataType: options.dataType
                }, false);

                let start = min;
                let end = max;
                if(!useAllAggregatedPoints) {
                    const maxMinDistance = Math.max(that.calculateInterval(max, min), options.dataType === 'datetime' ? dateUtils.dateToMilliseconds(tickInterval) : tickInterval);
                    start = add(min, maxMinDistance, -1);
                    end = add(max, maxMinDistance);
                }
                start = start < businessRange.min ? businessRange.min : start;
                end = end > businessRange.max ? businessRange.max : end;
                const breaks = that._getScaleBreaks(options, {
                    minVisible: start,
                    maxVisible: end
                }, that._series, that.isArgumentAxis);
                const filteredBreaks = that._filterBreaks(breaks, {
                    minVisible: start,
                    maxVisible: end
                }, options.breakStyle);
                ticks = generateTicks(tickInterval, false, start, end, filteredBreaks).ticks;
            }
        }

        that._aggregationInterval = tickInterval;

        return {
            interval: tickInterval,
            ticks: ticks
        };
    },

    createTicks: function(canvas) {
        const that = this;
        const renderer = that._renderer;
        const options = that._options;

        if(!canvas) {
            return;
        }

        that._isSynchronized = false;
        that.updateCanvas(canvas);

        const range = that._getViewportRange();
        that._initialBreaks = range.breaks = this._seriesData.breaks = that._filterBreaks(this._seriesData.userBreaks, range, options.breakStyle);

        that._estimatedTickInterval = that._getTicks(that.adjustViewport(this._seriesData), _noop, true).tickInterval; // tickInterval calculation

        const margins = this._calculateValueMargins();

        range.addRange({
            minVisible: margins.minValue,
            maxVisible: margins.maxValue,
            isSpacedMargin: margins.isSpacedMargin
        });

        const ticks = that._createTicksAndLabelFormat(range);

        const boundaryTicks = that._getBoundaryTicks(ticks.ticks, that._getViewportRange());
        if(options.showCustomBoundaryTicks && boundaryTicks.length) {
            that._boundaryTicks = [boundaryTicks[0]].map(createBoundaryTick(that, renderer, true));
            if(boundaryTicks.length > 1) {
                that._boundaryTicks = that._boundaryTicks.concat([boundaryTicks[1]].map(createBoundaryTick(that, renderer, false)));
            }
        } else {
            that._boundaryTicks = [];
        }

        const minors = (ticks.minorTicks || []).filter(function(minor) {
            return !boundaryTicks.some(function(boundary) {
                return valueOf(boundary) === valueOf(minor);
            });
        });

        that._tickInterval = ticks.tickInterval;
        that._minorTickInterval = ticks.minorTickInterval;

        const oldMajorTicks = that._majorTicks || [];
        const majorTicksByValues = oldMajorTicks.reduce((r, t) => {
            r[t.value.valueOf()] = t;
            return r;
        }, {});

        const sameType = type(ticks.ticks[0]) === type(oldMajorTicks[0] && oldMajorTicks[0].value);
        const skippedCategory = that._getSkippedCategory(ticks.ticks);
        const majorTicks = ticks.ticks.map(v => {
            const tick = majorTicksByValues[v.valueOf()];
            if(tick && sameType) {
                delete majorTicksByValues[v.valueOf()];
                tick.setSkippedCategory(skippedCategory);
                return tick;
            } else {
                return createMajorTick(that, renderer, skippedCategory)(v);
            }
        });

        that._majorTicks = majorTicks;

        const oldMinorTicks = that._minorTicks || [];

        that._minorTicks = minors.map((v, i) => {
            const minorTick = oldMinorTicks[i];
            if(minorTick) {
                minorTick.updateValue(v);
                return minorTick;
            }
            return createMinorTick(that, renderer)(v);
        });

        that._ticksToRemove = Object.keys(majorTicksByValues)
            .map(k => majorTicksByValues[k]).concat(oldMinorTicks.slice(that._minorTicks.length, oldMinorTicks.length));
        that._ticksToRemove.forEach(t => t.label?.removeTitle());

        if(ticks.breaks) {
            that._seriesData.breaks = ticks.breaks;
        }
        that._reinitTranslator(that._getViewportRange());
    },

    _reinitTranslator: function(range) {
        const that = this;
        const translator = that._translator;

        if(that._isSynchronized) {
            return;
        }

        translator.updateBusinessRange(range);
    },

    _getViewportRange() {
        return this.adjustViewport(this._seriesData);
    },

    setMarginOptions: function(options) {
        this._marginOptions = options;
    },

    getMarginOptions() {
        return this._marginOptions ?? {};
    },

    _calculateRangeInterval: function(interval) {
        const isDateTime = this._options.dataType === 'datetime';
        const minArgs = [];
        const addToArgs = function(value) {
            isDefined(value) && minArgs.push(isDateTime ? dateUtils.dateToMilliseconds(value) : value);
        };

        addToArgs(this._tickInterval);
        addToArgs(this._estimatedTickInterval);
        isDefined(interval) && minArgs.push(interval);
        addToArgs(this._aggregationInterval);

        return this._calculateWorkWeekInterval(_min.apply(this, minArgs));
    },

    _calculateWorkWeekInterval(businessInterval) {
        const options = this._options;
        if(options.dataType === 'datetime' && options.workdaysOnly && businessInterval) {
            const workWeek = options.workWeek.length * dateIntervals.day;
            const weekend = dateIntervals.week - workWeek;
            if(workWeek !== businessInterval && weekend < businessInterval) {
                const weekendsCount = Math.ceil(businessInterval / dateIntervals.week);
                businessInterval = weekend >= businessInterval ? dateIntervals.day : businessInterval - (weekend * weekendsCount);
            } else if(weekend >= businessInterval && businessInterval > dateIntervals.day) {
                businessInterval = dateIntervals.day;
            }
        }
        return businessInterval;
    },

    _getConvertIntervalCoefficient(intervalInPx, screenDelta) {
        const ratioOfCanvasRange = this._translator.ratioOfCanvasRange();
        return ratioOfCanvasRange / (ratioOfCanvasRange * screenDelta / (intervalInPx + screenDelta));
    },

    _calculateValueMargins(ticks) {
        this._resetMargins();
        const that = this;
        const margins = that.getMarginOptions();
        const marginSize = (margins.size || 0) / 2;
        const options = that._options;
        const dataRange = that._getViewportRange();
        const viewPort = that.getViewport();
        const screenDelta = that._getScreenDelta();
        const isDiscrete = (options.type || '').indexOf(constants.discrete) !== -1;
        const valueMarginsEnabled = options.valueMarginsEnabled && !isDiscrete && !that.customPositionIsBoundaryOrthogonalAxis();

        const translator = that._translator;

        const minValueMargin = options.minValueMargin;
        const maxValueMargin = options.maxValueMargin;

        let minPadding = 0;
        let maxPadding = 0;
        let interval = 0;
        let rangeInterval;

        if(dataRange.stubData || !screenDelta) {
            return {
                startPadding: 0,
                endPadding: 0
            };
        }

        if(that.isArgumentAxis && margins.checkInterval) {
            rangeInterval = that._calculateRangeInterval(dataRange.interval);
            const pxInterval = translator.getInterval(rangeInterval);
            if(isFinite(pxInterval)) {
                interval = Math.ceil(pxInterval / (2 * that._getConvertIntervalCoefficient(pxInterval, screenDelta)));
            } else {
                rangeInterval = 0;
            }
        }

        let minPercentPadding;
        let maxPercentPadding;

        const maxPaddingValue = (screenDelta * MAX_MARGIN_VALUE) / 2;

        if(valueMarginsEnabled) {
            if(isDefined(minValueMargin)) {
                minPercentPadding = isFinite(minValueMargin) ? minValueMargin : 0;
            } else if(!that.isArgumentAxis && margins.checkInterval && valueOf(dataRange.minVisible) > 0 && valueOf(dataRange.minVisible) === valueOf(dataRange.min)) {
                minPadding = MIN_BAR_MARGIN;
            } else {
                minPadding = Math.max(marginSize, interval);
                minPadding = Math.min(maxPaddingValue, minPadding);
            }

            if(isDefined(maxValueMargin)) {
                maxPercentPadding = isFinite(maxValueMargin) ? maxValueMargin : 0;
            } else if(!that.isArgumentAxis && margins.checkInterval && valueOf(dataRange.maxVisible) < 0 && valueOf(dataRange.maxVisible) === valueOf(dataRange.max)) {
                maxPadding = MIN_BAR_MARGIN;
            } else {
                maxPadding = Math.max(marginSize, interval);
                maxPadding = Math.min(maxPaddingValue, maxPadding);
            }
        }

        const percentStick = margins.percentStick && !this.isArgumentAxis;

        if(percentStick) {
            if(_abs(dataRange.max) === 1) {
                maxPadding = 0;
            }

            if(_abs(dataRange.min) === 1) {
                minPadding = 0;
            }
        }

        const canvasStartEnd = that._getCanvasStartEnd();

        const commonMargin = 1 + (minPercentPadding || 0) + (maxPercentPadding || 0);
        const screenDeltaWithMargins = ((screenDelta - minPadding - maxPadding) / commonMargin) || screenDelta;

        if(minPercentPadding !== undefined || maxPercentPadding !== undefined) {
            if(minPercentPadding !== undefined) {
                minPadding = screenDeltaWithMargins * minPercentPadding;
            }
            if(maxPercentPadding !== undefined) {
                maxPadding = screenDeltaWithMargins * maxPercentPadding;
            }
        }

        let minValue;
        let maxValue;

        if(options.type !== constants.discrete &&
            ticks && ticks.length > 1 &&
            !options.skipViewportExtending &&
            !viewPort.action &&
            options.endOnTick !== false) {
            const length = ticks.length;
            const firstTickPosition = translator.translate(ticks[0].value);
            const lastTickPosition = translator.translate(ticks[length - 1].value);

            const invertMultiplier = firstTickPosition > lastTickPosition ? -1 : 1;

            const minTickPadding = _max(invertMultiplier * (canvasStartEnd.start - firstTickPosition), 0);
            const maxTickPadding = _max(invertMultiplier * (lastTickPosition - canvasStartEnd.end), 0);

            if(minTickPadding > minPadding || maxTickPadding > maxPadding) {
                const commonPadding = (maxTickPadding + minTickPadding);
                const coeff = that._getConvertIntervalCoefficient(commonPadding, screenDelta);
                if(minTickPadding >= minPadding) {
                    minValue = ticks[0].value;
                }
                if(maxTickPadding >= maxPadding) {
                    maxValue = ticks[length - 1].value;
                }
                minPadding = _max(minTickPadding, minPadding) / coeff;
                maxPadding = _max(maxTickPadding, maxPadding) / coeff;
            }
        }

        minPercentPadding = minPercentPadding === undefined ? minPadding / screenDeltaWithMargins : minPercentPadding;
        maxPercentPadding = maxPercentPadding === undefined ? maxPadding / screenDeltaWithMargins : maxPercentPadding;

        if(!isDiscrete) {
            if(this._translator.isInverted()) {
                minValue = minValue ?? translator.from(canvasStartEnd.start + screenDelta * minPercentPadding, -1);
                maxValue = maxValue ?? translator.from(canvasStartEnd.end - screenDelta * maxPercentPadding, 1);
            } else {
                minValue = minValue ?? translator.from(canvasStartEnd.start - screenDelta * minPercentPadding, -1);
                maxValue = maxValue ?? translator.from(canvasStartEnd.end + screenDelta * maxPercentPadding, 1);
            }
        }

        const { correctedMin, correctedMax, start, end } = that.getCorrectedValuesToZero(minValue, maxValue);
        minPadding = start ?? minPadding;
        maxPadding = end ?? maxPadding;

        return {
            startPadding: translator.isInverted() ? maxPadding : minPadding,
            endPadding: translator.isInverted() ? minPadding : maxPadding,

            minValue: correctedMin ?? minValue,
            maxValue: correctedMax ?? maxValue,

            interval: rangeInterval,
            isSpacedMargin: minPadding === maxPadding && minPadding !== 0
        };
    },

    getCorrectedValuesToZero(minValue, maxValue) {
        const that = this;
        const translator = that._translator;
        const canvasStartEnd = that._getCanvasStartEnd();
        const dataRange = that._getViewportRange();
        const screenDelta = that._getScreenDelta();
        const options = that._options;
        let start;
        let end;
        let correctedMin;
        let correctedMax;
        const correctZeroLevel = (minPoint, maxPoint) => {
            const minExpectedPadding = _abs(canvasStartEnd.start - minPoint);
            const maxExpectedPadding = _abs(canvasStartEnd.end - maxPoint);

            const coeff = that._getConvertIntervalCoefficient(minExpectedPadding + maxExpectedPadding, screenDelta);

            start = minExpectedPadding / coeff;
            end = maxExpectedPadding / coeff;
        };
        if(!that.isArgumentAxis && options.dataType !== 'datetime') {
            if(minValue * dataRange.min <= 0 && minValue * dataRange.minVisible <= 0) {
                correctZeroLevel(translator.translate(0), translator.translate(maxValue));
                correctedMin = 0;
            }

            if(maxValue * dataRange.max <= 0 && maxValue * dataRange.maxVisible <= 0) {
                correctZeroLevel(translator.translate(minValue), translator.translate(0));
                correctedMax = 0;
            }
        }
        return {
            start: isFinite(start) ? start : null,
            end: isFinite(end) ? end : null,
            correctedMin,
            correctedMax
        };
    },

    applyMargins() {
        if(this._isSynchronized) {
            return;
        }
        const margins = this._calculateValueMargins(this._majorTicks);

        const canvas = extend({}, this._canvas, {
            startPadding: margins.startPadding,
            endPadding: margins.endPadding
        });

        this._translator.updateCanvas(this._processCanvas(canvas));

        if(isFinite(margins.interval)) {
            const br = this._translator.getBusinessRange();
            br.addRange({ interval: margins.interval });
            this._translator.updateBusinessRange(br);
        }

    },

    _resetMargins: function() {
        this._reinitTranslator(this._getViewportRange());
        if(this._canvas) {
            this._translator.updateCanvas(this._processCanvas(this._canvas));
        }
    },

    _createConstantLines() {
        const constantLines = (this._options.constantLines || []).map(o => createConstantLine(this, o));

        this._outsideConstantLines = constantLines.filter(l => l.labelPosition === 'outside');
        this._insideConstantLines = constantLines.filter(l => l.labelPosition === 'inside');
    },

    draw: function(canvas, borderOptions) {
        const that = this;
        const options = this._options;
        that.borderOptions = borderOptions || { visible: false };

        that._resetMargins();
        that.createTicks(canvas);

        that.applyMargins();

        that._clearAxisGroups();

        initTickCoords(that._majorTicks);
        initTickCoords(that._minorTicks);
        initTickCoords(that._boundaryTicks);

        that._axisGroup.append(that._axesContainerGroup);

        that._drawAxis();
        that._drawTitle();
        drawTickMarks(that._majorTicks, options.tick);
        drawTickMarks(that._minorTicks, options.minorTick);
        drawTickMarks(that._boundaryTicks, options.tick);

        const drawGridLine = that._getGridLineDrawer();
        drawGrids(that._majorTicks, drawGridLine);
        drawGrids(that._minorTicks, drawGridLine);

        callAction(that._majorTicks, 'drawLabel', that._getViewportRange(), that._getTemplate());

        that._templatesRendered && that._templatesRendered.reject();
        that._templatesRendered = new Deferred();

        when.apply(this, that._majorTicks.map(tick => tick.getTemplateDeferred())).done(() => {
            that._templatesRendered.resolve();
        });
        that._majorTicks.forEach(function(tick) {
            tick.labelRotationAngle = 0;
            tick.labelAlignment = undefined;
            tick.labelOffset = 0;
        });

        callAction(that._outsideConstantLines.concat(that._insideConstantLines), 'draw');

        callAction(that._strips, 'draw');

        that._dateMarkers = that._drawDateMarkers() || [];

        that._labelAxesGroup && that._axisStripLabelGroup.append(that._labelAxesGroup);
        that._gridContainerGroup && that._axisGridGroup.append(that._gridContainerGroup);
        that._stripsGroup && that._axisStripGroup.append(that._stripsGroup);

        if(that._constantLinesGroup) {
            that._axisConstantLineGroups.above.inside.append(that._constantLinesGroup.above);
            that._axisConstantLineGroups.above.outside1.append(that._constantLinesGroup.above);
            that._axisConstantLineGroups.above.outside2.append(that._constantLinesGroup.above);

            that._axisConstantLineGroups.under.inside.append(that._constantLinesGroup.under);
            that._axisConstantLineGroups.under.outside1.append(that._constantLinesGroup.under);
            that._axisConstantLineGroups.under.outside2.append(that._constantLinesGroup.under);
        }

        that._measureTitle();
        measureLabels(that._majorTicks);

        !options.label.template && that._applyWordWrap();

        measureLabels(that._outsideConstantLines);
        measureLabels(that._insideConstantLines);
        measureLabels(that._strips);
        measureLabels(that._dateMarkers);

        that._adjustConstantLineLabels(that._insideConstantLines);
        that._adjustStripLabels();

        let offset = that._constantLabelOffset = that._adjustConstantLineLabels(that._outsideConstantLines);

        if(!that._translator.getBusinessRange().isEmpty()) {
            that._setLabelsPlacement();
            offset = that._adjustLabels(offset);
        }

        offset = that._adjustDateMarkers(offset);
        that._adjustTitle(offset);
    },

    getTemplatesDef() {
        return this._templatesRendered;
    },

    setRenderedState(state) {
        this._drawn = state;
    },

    isRendered() {
        return this._drawn;
    },

    _applyWordWrap() {
        const that = this;
        let convertedTickInterval;
        let textWidth;
        let textHeight;
        const options = this._options;
        const tickInterval = that._tickInterval;
        if(isDefined(tickInterval)) {
            convertedTickInterval = that.getTranslator().getInterval(options.dataType === 'datetime' ? dateUtils.dateToMilliseconds(tickInterval) : tickInterval);
        }

        const displayMode = that._validateDisplayMode(options.label.displayMode);
        const overlappingMode = that._validateOverlappingMode(options.label.overlappingBehavior, displayMode);
        const wordWrapMode = options.label.wordWrap || 'none';
        const overflowMode = options.label.textOverflow || 'none';

        if((wordWrapMode !== 'none' || overflowMode !== 'none') && displayMode !== ROTATE && overlappingMode !== ROTATE && overlappingMode !== 'auto') {
            const usefulSpace = isDefined(options.placeholderSize) ? options.placeholderSize - options.label.indentFromAxis : undefined;
            if(that._isHorizontal) {
                textWidth = convertedTickInterval;
                textHeight = usefulSpace;
            } else {
                textWidth = usefulSpace;
                textHeight = convertedTickInterval;
            }
            let correctByWidth = false;
            let correctByHeight = false;
            if(textWidth) {
                if(that._majorTicks.some(tick => tick.labelBBox.width > textWidth)) {
                    correctByWidth = true;
                }
            }
            if(textHeight) {
                if(that._majorTicks.some(tick => tick.labelBBox.height > textHeight)) {
                    correctByHeight = true;
                }
            }
            if(correctByWidth || correctByHeight) {
                that._majorTicks.forEach(tick => {
                    tick.label && tick.label.setMaxSize(textWidth, textHeight, options.label);
                });
                measureLabels(that._majorTicks);
            }
        }
    },

    _measureTitle: _noop,

    animate() {
        callAction(this._majorTicks, 'animateLabels');
    },

    updateSize: function(canvas, animate, updateTitle = true) {
        const that = this;
        that.updateCanvas(canvas);

        if(updateTitle) {
            that._checkTitleOverflow();
            that._measureTitle();
            that._updateTitleCoords();
        }

        that._reinitTranslator(that._getViewportRange());
        that.applyMargins();

        const animationEnabled = !that._firstDrawing && animate;
        const options = this._options;

        initTickCoords(that._majorTicks);
        initTickCoords(that._minorTicks);
        initTickCoords(that._boundaryTicks);

        if(this._resetApplyingAnimation && !this._firstDrawing) {
            that._resetStartCoordinates();
        }

        cleanUpInvalidTicks(that._majorTicks);
        cleanUpInvalidTicks(that._minorTicks);
        cleanUpInvalidTicks(that._boundaryTicks);

        if(this._axisElement) {
            that._updateAxisElementPosition();
        }

        updateTicksPosition(that._majorTicks, options.tick, animationEnabled);
        updateTicksPosition(that._minorTicks, options.minorTick, animationEnabled);
        updateTicksPosition(that._boundaryTicks, options.tick);

        callAction(that._majorTicks, 'updateLabelPosition', animationEnabled);

        that._outsideConstantLines.concat(that._insideConstantLines || []).forEach(l => l.updatePosition(animationEnabled));

        callAction(that._strips, 'updatePosition', animationEnabled);

        updateGridsPosition(that._majorTicks, animationEnabled);
        updateGridsPosition(that._minorTicks, animationEnabled);

        if(animationEnabled) {
            callAction(that._ticksToRemove || [], 'fadeOutElements');
        }

        that.prepareAnimation();

        that._ticksToRemove = null;

        if(!that._translator.getBusinessRange().isEmpty()) {
            that._firstDrawing = false;
        }
        this._resetApplyingAnimation = false;
    },

    prepareAnimation() {
        const that = this;
        const action = 'saveCoords';
        callAction(that._majorTicks, action);
        callAction(that._minorTicks, action);
        callAction(that._insideConstantLines, action);
        callAction(that._outsideConstantLines, action);
        callAction(that._strips, action);
    },

    _resetStartCoordinates() {
        const that = this;
        const action = 'resetCoordinates';
        callAction(that._majorTicks, action);
        callAction(that._minorTicks, action);
        callAction(that._insideConstantLines, action);
        callAction(that._outsideConstantLines, action);
        callAction(that._strips, action);
    },

    applyClipRects: function(elementsClipID, canvasClipID) {
        this._axisGroup.attr({ 'clip-path': canvasClipID });
        this._axisStripGroup.attr({ 'clip-path': elementsClipID });
    },

    _validateVisualRange(optionValue) {
        const range = getVizRangeObject(optionValue);
        if(range.startValue !== undefined) {
            range.startValue = this.validateUnit(range.startValue);
        }

        if(range.endValue !== undefined) {
            range.endValue = this.validateUnit(range.endValue);
        }

        return convertVisualRangeObject(range, !_isArray(optionValue));
    },

    _validateOptions(options) {
        const that = this;

        options.wholeRange = that._validateVisualRange(options.wholeRange);
        options.visualRange = options._customVisualRange = that._validateVisualRange(options._customVisualRange);

        that._setVisualRange(options._customVisualRange);
    },

    beforeCleanGroups() {
        this._options.label.template && this._axisElementsGroup && this._axisElementsGroup.linkRemove();
    },

    afterCleanGroups() {
        this._options.label.template && this._axisElementsGroup && this._axisElementsGroup.linkAppend();
    },

    validate() {
        const that = this;
        const options = that._options;
        const dataType = that.isArgumentAxis ? options.argumentType : options.valueType;
        const parser = dataType ? getParser(dataType) : function(unit) { return unit; };

        that.parser = parser;
        options.dataType = dataType;

        that._validateOptions(options);
    },

    resetVisualRange(isSilent) {
        this._seriesData.minVisible = this._seriesData.min;
        this._seriesData.maxVisible = this._seriesData.max;
        this.handleZooming([null, null], { start: !!isSilent, end: !!isSilent });
    },

    _setVisualRange(visualRange, allowPartialUpdate) {
        const range = this.adjustRange(getVizRangeObject(visualRange));
        if(allowPartialUpdate) {
            isDefined(range.startValue) && (this._viewport.startValue = range.startValue);
            isDefined(range.endValue) && (this._viewport.endValue = range.endValue);
        } else {
            this._viewport = range;
        }
    },

    _applyZooming(visualRange, allowPartialUpdate) {
        const that = this;
        that._resetVisualRangeOption();
        that._setVisualRange(visualRange, allowPartialUpdate);

        const viewPort = that.getViewport();

        that._seriesData.userBreaks = that._getScaleBreaks(that._options, {
            minVisible: viewPort.startValue,
            maxVisible: viewPort.endValue
        }, that._series, that.isArgumentAxis);

        that._translator.updateBusinessRange(that._getViewportRange());
    },

    getZoomStartEventArg(event, actionType) {
        return {
            axis: this,
            range: this.visualRange(),
            cancel: false,
            event,
            actionType
        };
    },

    _getZoomEndEventArg(previousRange, event, actionType, zoomFactor, shift) {
        const newRange = this.visualRange();
        return {
            axis: this,
            previousRange,
            range: newRange,
            cancel: false,
            event,
            actionType,
            zoomFactor,
            shift,
            // backwards
            rangeStart: newRange.startValue,
            rangeEnd: newRange.endValue
        };
    },

    getZoomBounds() {
        const wholeRange = getVizRangeObject(this._options.wholeRange);
        const range = this.getTranslator().getBusinessRange();
        const secondPriorityRange = {
            startValue: getZoomBoundValue(this._initRange.startValue, range.min),
            endValue: getZoomBoundValue(this._initRange.endValue, range.max)
        };

        return {
            startValue: getZoomBoundValue(wholeRange.startValue, secondPriorityRange.startValue),
            endValue: getZoomBoundValue(wholeRange.endValue, secondPriorityRange.endValue)
        };
    },

    setInitRange() {
        this._initRange = {};
        if(Object.keys(this._options.wholeRange || {}).length === 0) {
            this._initRange = this.getZoomBounds();
        }
    },

    _resetVisualRangeOption() {
        this._options._customVisualRange = {};
    },

    getTemplatesGroups() {
        const ticks = this._majorTicks;
        if(ticks) {
            return this._majorTicks.map(tick => {
                return tick.templateContainer;
            }).filter(item => isDefined(item));
        } else {
            return [];
        }
    },

    setCustomVisualRange(range) {
        this._options._customVisualRange = range;
    },

    // API
    visualRange() {
        const that = this;
        const args = arguments;
        let visualRange;

        if(args.length === 0) {
            const adjustedRange = that._getAdjustedBusinessRange();
            let startValue = adjustedRange.minVisible;
            let endValue = adjustedRange.maxVisible;
            if(that._options.type === constants.discrete) {
                startValue = startValue ?? adjustedRange.categories[0];
                endValue = endValue ?? adjustedRange.categories[adjustedRange.categories.length - 1];
                return {
                    startValue,
                    endValue,
                    categories: getCategoriesInfo(adjustedRange.categories, startValue, endValue).categories
                };
            }
            return {
                startValue,
                endValue
            };
        } else if(_isArray(args[0])) {
            visualRange = args[0];
        } else if(isPlainObject(args[0])) {
            visualRange = extend({}, args[0]);
        } else {
            visualRange = [args[0], args[1]];
        }

        const zoomResults = that.handleZooming(visualRange, args[1]);
        if(!zoomResults.isPrevented) {
            that._visualRange(that, zoomResults);
        }
    },

    handleZooming(visualRange, preventEvents, domEvent, action) {
        const that = this;
        preventEvents = preventEvents || {};

        if(isDefined(visualRange)) {
            visualRange = that._validateVisualRange(visualRange);
            visualRange.action = action;
        }

        const zoomStartEvent = that.getZoomStartEventArg(domEvent, action);
        const previousRange = zoomStartEvent.range;

        !preventEvents.start && that._eventTrigger('zoomStart', zoomStartEvent);
        const zoomResults = {
            isPrevented: zoomStartEvent.cancel,
            skipEventRising: preventEvents.skipEventRising,
            range: visualRange || zoomStartEvent.range
        };

        if(!zoomStartEvent.cancel) {
            isDefined(visualRange) && that._applyZooming(visualRange, preventEvents.allowPartialUpdate);
            if(!isDefined(that._storedZoomEndParams)) {
                that._storedZoomEndParams = {
                    startRange: previousRange,
                    type: this.getOptions().type
                };
            }
            that._storedZoomEndParams.event = domEvent;
            that._storedZoomEndParams.action = action;
            that._storedZoomEndParams.prevent = !!preventEvents.end;
        }

        return zoomResults;
    },

    handleZoomEnd() {
        const that = this;
        if(isDefined(that._storedZoomEndParams) && !that._storedZoomEndParams.prevent) {
            const previousRange = that._storedZoomEndParams.startRange;
            const domEvent = that._storedZoomEndParams.event;
            const action = that._storedZoomEndParams.action;
            const previousBusinessRange = {
                minVisible: previousRange.startValue,
                maxVisible: previousRange.endValue,
                categories: previousRange.categories
            };
            const typeIsNotChanged = that.getOptions().type === that._storedZoomEndParams.type;
            const shift = typeIsNotChanged ? adjust(that.getVisualRangeCenter() - that.getVisualRangeCenter(previousBusinessRange)) : NaN;
            const zoomFactor = typeIsNotChanged ?
                +(Math.round(that.getVisualRangeLength(previousBusinessRange) / (that.getVisualRangeLength() || 1) + 'e+2') + 'e-2') : NaN;
            const zoomEndEvent = that._getZoomEndEventArg(previousRange, domEvent, action, zoomFactor, shift);

            zoomEndEvent.cancel = that.checkZoomingLowerLimitOvercome(zoomFactor === 1 ? 'pan' : 'zoom', zoomFactor).stopInteraction;
            that._eventTrigger('zoomEnd', zoomEndEvent);

            if(zoomEndEvent.cancel) {
                that._restorePreviousVisualRange(previousRange);
            }
            that._storedZoomEndParams = null;
        }
    },

    _restorePreviousVisualRange(previousRange) {
        const that = this;
        that._storedZoomEndParams = null;
        that._applyZooming(previousRange);
        that._visualRange(that, previousRange);
    },

    checkZoomingLowerLimitOvercome(actionType, zoomFactor, range) {
        const that = this;
        const options = that._options;
        const translator = that._translator;
        let minZoom = options.minVisualRangeLength;
        let correctedRange = range;
        let visualRange;

        let isOvercoming = actionType === 'zoom' && zoomFactor >= 1;
        const businessRange = translator.getBusinessRange();

        if(range) {
            visualRange = that.adjustRange(getVizRangeObject(range));
            visualRange = {
                minVisible: visualRange.startValue,
                maxVisible: visualRange.endValue,
                categories: businessRange.categories
            };
        }

        const beforeVisualRangeLength = that.getVisualRangeLength(businessRange);
        const afterVisualRangeLength = that.getVisualRangeLength(visualRange);

        if(isDefined(minZoom) || options.type === 'discrete') {
            minZoom = translator.convert(minZoom);
            if(visualRange && (minZoom < beforeVisualRangeLength) && (minZoom >= afterVisualRangeLength)) {
                correctedRange = getVizRangeObject(translator.getRangeByMinZoomValue(minZoom, visualRange));
                isOvercoming = false;
            } else {
                isOvercoming &= minZoom > afterVisualRangeLength;
            }
        } else {
            const canvasLength = that._translator.canvasLength;
            const fullRange = {
                minVisible: businessRange.min,
                maxVisible: businessRange.max,
                categories: businessRange.categories
            };
            isOvercoming &= that.getVisualRangeLength(fullRange) / canvasLength >= afterVisualRangeLength;
        }

        return { stopInteraction: !!isOvercoming, correctedRange: correctedRange };
    },

    dataVisualRangeIsReduced() {
        let minDataValue;
        let maxDataValue;
        const translator = this.getTranslator();

        if(this._options.type === 'discrete') {
            const categories = translator.getBusinessRange().categories;
            minDataValue = categories[0];
            maxDataValue = categories[categories.length - 1];
        } else {
            const seriesData = this._seriesData;
            minDataValue = seriesData.min;
            maxDataValue = seriesData.max;
        }

        if(!isDefined(minDataValue) || !isDefined(maxDataValue)) {
            return false;
        }

        const startPoint = translator.translate(minDataValue);
        const endPoint = translator.translate(maxDataValue);
        const edges = [Math.min(startPoint, endPoint), Math.max(startPoint, endPoint)];
        const visualRange = this.visualRange();
        const visualRangeStartPoint = translator.translate(visualRange.startValue);
        const visualRangeEndPoint = translator.translate(visualRange.endValue);

        return (visualRangeStartPoint > edges[0] && visualRangeStartPoint < edges[1]) ||
            (visualRangeEndPoint > edges[0] && visualRangeEndPoint < edges[1]) ||
            visualRangeStartPoint === visualRangeEndPoint && edges[0] !== edges[1];
    },

    isExtremePosition(isMax) {
        let extremeDataValue;
        let seriesData;

        if(this._options.type === 'discrete') {
            seriesData = this._translator.getBusinessRange();
            extremeDataValue = isMax ? seriesData.categories[seriesData.categories.length - 1] : seriesData.categories[0];
        } else {
            seriesData = this.getZoomBounds(); // T702708
            extremeDataValue = isMax ? seriesData.endValue : seriesData.startValue;
        }

        const translator = this.getTranslator();
        const extremePoint = translator.translate(extremeDataValue);
        const visualRange = this.visualRange();
        const visualRangePoint = isMax ? translator.translate(visualRange.endValue) : translator.translate(visualRange.startValue);

        return _abs(visualRangePoint - extremePoint) < SCROLL_THRESHOLD;
    },

    getViewport() {
        return this._viewport;
    },

    getFullTicks: function() {
        const majors = this._majorTicks || [];
        if(this._options.type === constants.discrete) {
            return convertTicksToValues(majors);
        } else {
            return convertTicksToValues(majors.concat(this._minorTicks, this._boundaryTicks))
                .sort(function(a, b) {
                    return valueOf(a) - valueOf(b);
                });
        }
    },

    measureLabels: function(canvas, withIndents) {
        const that = this;
        const options = that._options;
        const widthAxis = options.visible ? options.width : 0;
        let ticks;
        const indent = withIndents ? options.label.indentFromAxis + (options.tick.length * 0.5) : 0;
        let tickInterval;
        const viewportRange = that._getViewportRange();

        if(viewportRange.isEmpty() || !options.label.visible || !that._axisElementsGroup) {
            return { height: widthAxis, width: widthAxis, x: 0, y: 0 };
        }

        if(that._majorTicks) {
            ticks = convertTicksToValues(that._majorTicks);
        } else {
            that.updateCanvas(canvas);
            ticks = that._createTicksAndLabelFormat(viewportRange, _noop);
            tickInterval = ticks.tickInterval;
            ticks = ticks.ticks;
        }

        const maxText = ticks.reduce(function(prevLabel, tick, index) {
            const label = that.formatLabel(tick, options.label, viewportRange, undefined, tickInterval, ticks);
            if(prevLabel.length < label.length) {
                return label;
            } else {
                return prevLabel;
            }
        }, that.formatLabel(ticks[0], options.label, viewportRange, undefined, tickInterval, ticks));

        const text = that._renderer.text(maxText, 0, 0).css(that._textFontStyles).attr(that._textOptions).append(that._renderer.root);
        const box = text.getBBox();

        text.remove();
        return { x: box.x, y: box.y, width: box.width + indent, height: box.height + indent };
    },

    _setLabelsPlacement: function() {
        if(!this._options.label.visible) {
            return;
        }
        const that = this;
        const labelOpt = that._options.label;
        const displayMode = that._validateDisplayMode(labelOpt.displayMode);
        const overlappingMode = that._validateOverlappingMode(labelOpt.overlappingBehavior, displayMode);
        const ignoreOverlapping = overlappingMode === 'none' || overlappingMode === 'ignore';
        const behavior = {
            rotationAngle: labelOpt.rotationAngle,
            staggeringSpacing: labelOpt.staggeringSpacing
        };
        let notRecastStep;
        const boxes = that._majorTicks.map(function(tick) { return tick.labelBBox; });
        let step = that._getStep(boxes);
        switch(displayMode) {
            case ROTATE:
                if(ignoreOverlapping) {
                    notRecastStep = true;
                    step = 1;
                }
                that._applyLabelMode(displayMode, step, boxes, labelOpt, notRecastStep);
                break;
            case 'stagger':
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
        const that = this;
        const labelOpt = that._options.label;
        const majorTicks = that._majorTicks;

        if(mode === 'none' || mode === 'ignore') {
            return;
        }
        const checkLabels = function(box, index, array) {
            if(index === 0) {
                return false;
            }
            return constants.areLabelsOverlap(box, array[index - 1], labelOpt.minSpacing, labelOpt.alignment);
        };
        if(step > 1 && boxes.some(checkLabels)) {
            that._applyLabelMode(mode, step, boxes, behavior);
        }
        that._checkBoundedLabelsOverlapping(majorTicks, boxes, mode);
    },

    _applyLabelMode: function(mode, step, boxes, behavior, notRecastStep) {
        const that = this;
        const majorTicks = that._majorTicks;
        const labelOpt = that._options.label;
        const angle = behavior.rotationAngle;
        let labelHeight;
        let alignment;
        let func;
        switch(mode) {
            case ROTATE:
                if(!labelOpt.userAlignment) {
                    alignment = angle < 0 ? RIGHT : LEFT;
                    if(angle % 90 === 0) {
                        alignment = CENTER;
                    }
                }
                step = notRecastStep ? step : that._getStep(boxes, angle);
                func = function(tick) {
                    const contentContainer = tick.getContentContainer();
                    if(!contentContainer) {
                        return;
                    }
                    contentContainer.rotate(angle);
                    tick.labelRotationAngle = angle;
                    alignment && (tick.labelAlignment = alignment);
                };
                updateLabels(majorTicks, step, func);
                break;
            case 'stagger':
                labelHeight = that._getMaxLabelHeight(boxes, behavior.staggeringSpacing);

                func = function(tick, index) {
                    if((index / (step - 1)) % 2 !== 0) {
                        tick.labelOffset = labelHeight;
                    }
                };
                updateLabels(majorTicks, step - 1, func);
                break;
            case 'auto':
            case '_auto':
                if(step === 2) {
                    that._applyLabelMode('stagger', step, boxes, behavior);
                } else {
                    that._applyLabelMode(ROTATE, step, boxes, { rotationAngle: getOptimalAngle(boxes, labelOpt) });
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

    areCoordsOutsideAxis: _noop,

    _getSkippedCategory: _noop,

    _initAxisPositions: _noop,

    _drawTitle: _noop,

    _updateTitleCoords: _noop,

    _adjustConstantLineLabels: _noop,

    _createTranslator: function() {
        return new Translator2D({}, {}, {});
    },

    _updateTranslator: function() {
        const translator = this._translator;
        translator.update(translator.getBusinessRange(), this._canvas || {}, this._getTranslatorOptions());
    },

    _getTranslatorOptions: function() {
        const options = this._options;
        return {
            isHorizontal: this._isHorizontal,
            shiftZeroValue: !this.isArgumentAxis,
            interval: options.semiDiscreteInterval,
            firstDayOfWeek: options.workWeek?.[0],
            stick: this._getStick(),
            breaksSize: options.breakStyle?.width ?? 0
        };
    },

    getVisibleArea() {
        const canvas = this._getCanvasStartEnd();
        return [canvas.start, canvas.end].sort((a, b) => a - b);
    },

    _getCanvasStartEnd: function() {
        const isHorizontal = this._isHorizontal;
        const canvas = this._canvas || {};
        const invert = this._translator.getBusinessRange().invert;
        const coords = isHorizontal ? [canvas.left, canvas.width - canvas.right] : [canvas.height - canvas.bottom, canvas.top];

        invert && coords.reverse();

        return {
            start: coords[0],
            end: coords[1]
        };
    },

    _getScreenDelta: function() {
        const that = this;
        const canvas = that._getCanvasStartEnd();
        const breaks = that._seriesData ? that._seriesData.breaks || [] : [];
        const breaksLength = breaks.length;
        const screenDelta = _abs(canvas.start - canvas.end);

        return screenDelta - (breaksLength ? breaks[breaksLength - 1].cumulativeWidth : 0);
    },

    _getScaleBreaks: function() { return []; },

    _filterBreaks: function() { return []; },

    _adjustTitle: _noop,

    _checkTitleOverflow: _noop,

    getSpiderTicks: _noop,

    setSpiderTicks: _noop,

    _checkBoundedLabelsOverlapping: _noop,

    drawScaleBreaks: _noop,

    _visualRange: _noop,

    _rotateConstantLine: _noop,

    applyVisualRangeSetter(visualRangeSetter) {
        this._visualRange = visualRangeSetter;
    },
    // T642779, T714928, T810801
    getCategoriesSorter(argCategories) {
        let sort;
        if(this.isArgumentAxis) {
            sort = argCategories;
        } else {
            const categoriesSortingMethod = this._options.categoriesSortingMethod;
            sort = categoriesSortingMethod ?? this._options.categories;
        }

        return sort;
    },

    _getAdjustedBusinessRange() {
        return this.adjustViewport(this._translator.getBusinessRange());
    },

    ///#DEBUG
    _getTickMarkPoints: _noop,
    _validateOverlappingMode: _noop,
    _getStep: _noop,
    _validateDisplayMode: _noop,
    shift: _noop
    ///#ENDDEBUG
};
