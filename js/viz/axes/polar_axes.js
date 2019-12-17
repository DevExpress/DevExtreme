const vizUtils = require('../core/utils');
const isDefined = require('../../core/utils/type').isDefined;
const extend = require('../../core/utils/extend').extend;
const constants = require('./axes_constants');
let circularAxes;
const xyAxesLinear = require('./xy_axes').linear;
const tick = require('./tick').tick;
let polarAxes;
const _map = vizUtils.map;
const baseAxisModule = require('./base_axis');

const _math = Math;
const _abs = _math.abs;
const _round = _math.round;
const convertPolarToXY = vizUtils.convertPolarToXY;

const _extend = extend;
const _noop = require('../../core/utils/common').noop;

const HALF_PI_ANGLE = 90;

function getPolarQuarter(angle) {
    let quarter;

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
    _calculateValueMargins(ticks) {
        let { minVisible, maxVisible } = this._getViewportRange();
        if(ticks && ticks.length > 1) {
            minVisible = minVisible < ticks[0].value ? minVisible : ticks[0].value;
            maxVisible = minVisible > ticks[ticks.length - 1].value ? maxVisible : ticks[ticks.length - 1].value;
        }

        return {
            minValue: minVisible,
            maxValue: maxVisible
        };
    },

    applyMargins() {
        const margins = this._calculateValueMargins(this._majorTicks);

        const br = this._translator.getBusinessRange();
        br.addRange({ minVisible: margins.minValue, maxVisible: margins.maxValue, interval: this._calculateRangeInterval(br.interval) });
        this._translator.updateBusinessRange(br);
    },

    _getTranslatorOptions: function() {
        return {
            isHorizontal: true,
            conversionValue: true,
            addSpiderCategory: this._getSpiderCategoryOption(),
            stick: this._getStick()
        };
    },

    getCenter: function() {
        return this._center;
    },

    getRadius: function() {
        return this._radius;
    },

    getAngles: function() {
        const options = this._options;
        return [options.startAngle, options.endAngle];
    },

    _updateRadius(canvas) {
        const rad = Math.min((canvas.width - canvas.left - canvas.right), (canvas.height - canvas.top - canvas.bottom)) / 2;
        this._radius = rad < 0 ? 0 : rad;
    },

    _updateCenter: function(canvas) {
        this._center = {
            x: canvas.left + (canvas.width - canvas.right - canvas.left) / 2,
            y: canvas.top + (canvas.height - canvas.top - canvas.bottom) / 2,
        };
    },

    _processCanvas: function(canvas) {
        this._updateRadius(canvas);
        this._updateCenter(canvas);

        return { left: 0, right: 0, width: this._getScreenDelta() };
    },

    _createAxisElement: function() {
        return this._renderer.circle();
    },

    _updateAxisElementPosition: function() {
        const center = this.getCenter();
        this._axisElement.attr({ cx: center.x, cy: center.y, r: this.getRadius() });
    },

    _boundaryTicksVisibility: {
        min: true
    },

    _getSpiderCategoryOption: function() { // TODO rename spider
        return this._options.firstPointOnStartAngle;
    },

    _validateOptions(options) {
        const that = this;
        let originValue = options.originValue;
        const wholeRange = options.wholeRange = {};
        const period = options.period;

        if(isDefined(originValue)) {
            originValue = that.validateUnit(originValue);
        }

        if(period > 0 && options.argumentType === constants.numeric) {
            originValue = originValue || 0;
            wholeRange.endValue = originValue + period;
            that._viewport = vizUtils.getVizRangeObject([originValue, wholeRange.endValue]);
        }

        if(isDefined(originValue)) {
            wholeRange.startValue = originValue;
        }
    },

    getMargins() {
        const tickOptions = this._options.tick;
        const tickOuterLength = Math.max(tickOptions.visible ? tickOptions.length / 2 + tickOptions.shift : 0, 0);
        const radius = this.getRadius();
        const { x, y } = this._center;
        const labelBoxes = this._majorTicks.map(t => t.label && t.label.getBBox()).filter(b => b);

        const canvas = extend({}, this._canvas, {
            left: x - radius,
            top: y - radius,
            right: this._canvas.width - (x + radius),
            bottom: this._canvas.height - (y + radius)
        });

        const margins = baseAxisModule.calculateCanvasMargins(labelBoxes, canvas);
        Object.keys(margins).forEach(k => margins[k] = (margins[k] < tickOuterLength ? tickOuterLength : margins[k]));

        return margins;
    },

    updateSize() {
        const that = this;

        baseAxisModule.Axis.prototype.updateSize.apply(that, arguments);

        baseAxisModule.measureLabels(that._majorTicks);
        that._adjustLabelsCoord(0, 0, true);

        this._checkBoundedLabelsOverlapping(this._majorTicks, this._majorTicks.map(t=>t.labelBBox));
    },

    _setVisualRange: _noop,

    applyVisualRangeSetter: _noop,

    allowToExtendVisualRange(isEnd) {
        return true;
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

    _getStripGraphicAttributes: function(fromAngle, toAngle) {
        const center = this.getCenter();
        const angle = this.getAngles()[0];
        const r = this.getRadius();

        return {
            x: center.x,
            y: center.y,
            innerRadius: 0,
            outerRadius: r,
            startAngle: -toAngle - angle,
            endAngle: -fromAngle - angle
        };
    },

    _createStrip: function(coords) {
        return this._renderer.arc(coords.x, coords.y, coords.innerRadius, coords.outerRadius, coords.startAngle, coords.endAngle);
    },

    _getStripLabelCoords: function(from, to) {
        const that = this;
        const coords = that._getStripGraphicAttributes(from, to);
        const angle = coords.startAngle + (coords.endAngle - coords.startAngle) / 2;
        const cosSin = vizUtils.getCosAndSin(angle);
        const halfRad = that.getRadius() / 2;
        const center = that.getCenter();
        const x = _round(center.x + halfRad * cosSin.cos);
        const y = _round(center.y - halfRad * cosSin.sin);

        return { x: x, y: y, align: constants.center };
    },

    _getConstantLineGraphicAttributes: function(value) {
        const center = this.getCenter();
        const r = this.getRadius();

        return {
            points: [center.x, center.y, center.x + r, center.y]
        };
    },

    _createConstantLine: function(value, attr) {
        return this._createPathElement(this._getConstantLineGraphicAttributes(value).points, attr);
    },

    _rotateConstantLine(line, value) {
        const { x, y } = this.getCenter();
        line.rotate(value + this.getAngles()[0], x, y);
    },

    _getConstantLineLabelsCoords: function(value) {
        const that = this;
        const cosSin = vizUtils.getCosAndSin(-value - that.getAngles()[0]);
        const halfRad = that.getRadius() / 2;
        const center = that.getCenter();
        const x = _round(center.x + halfRad * cosSin.cos);
        const y = _round(center.y - halfRad * cosSin.sin);

        return { x: x, y: y };
    },

    _checkAlignmentConstantLineLabels: _noop,

    _adjustDivisionFactor: function(val) {
        return val * 180 / (this.getRadius() * Math.PI);
    },

    _getScreenDelta: function() {
        const angles = this.getAngles();
        return _math.abs(angles[0] - angles[1]);
    },

    _getTickMarkPoints: function(coords, length, { shift = 0 }) {
        const center = this.getCenter();
        const corrections = {
            inside: -1,
            center: -0.5,
            outside: 0
        };
        const radiusWithTicks = this.getRadius() + length * corrections[this._options.tickOrientation || 'center'];
        return [
            center.x + radiusWithTicks + shift,
            center.y,
            center.x + radiusWithTicks + length + shift,
            center.y
        ];
    },

    _getLabelAdjustedCoord: function(tick, _offset, _maxWidth, checkCanvas) {
        const that = this;
        const labelCoords = tick.labelCoords;
        const labelY = labelCoords.y;
        const labelAngle = labelCoords.angle;
        const cosSin = vizUtils.getCosAndSin(labelAngle);
        const cos = cosSin.cos;
        const sin = cosSin.sin;
        const box = tick.labelBBox;
        const halfWidth = box.width / 2;
        const halfHeight = box.height / 2;
        const indentFromAxis = that._options.label.indentFromAxis || 0;
        const x = labelCoords.x + indentFromAxis * cos;
        const y = labelY + (labelY - box.y - halfHeight) + indentFromAxis * sin;

        let shiftX = 0;
        let shiftY = 0;

        switch(getPolarQuarter(labelAngle)) {
            case 1:
                shiftX = halfWidth;
                shiftY = halfHeight * sin;
                break;
            case 2:
                shiftX = halfWidth * cos;
                shiftY = halfHeight;
                break;
            case 3:
                shiftX = -halfWidth;
                shiftY = halfHeight * sin;
                break;
            case 4:
                shiftX = halfWidth * cos;
                shiftY = -halfHeight;
                break;
        }

        if(checkCanvas) {
            const canvas = that._canvas;
            const boxShiftX = (x - labelCoords.x) + shiftX;
            const boxShiftY = (y - labelCoords.y) + shiftY;

            if(box.x + boxShiftX < canvas.originalLeft) {
                shiftX -= box.x + boxShiftX - canvas.originalLeft;
            }

            if(box.x + box.width + boxShiftX > canvas.width - canvas.originalRight) {
                shiftX -= box.x + box.width + boxShiftX - (canvas.width - canvas.originalRight);
            }

            if(box.y + boxShiftY < canvas.originalTop) {
                shiftY -= box.y + boxShiftY - canvas.originalTop;
            }

            if(box.y + box.height + boxShiftY > canvas.height - canvas.originalBottom) {
                shiftY -= box.y + box.height + boxShiftY - (canvas.height - canvas.originalBottom);
            }
        }

        return {
            x: x + shiftX,
            y: y + shiftY
        };
    },

    _getGridLineDrawer: function() {
        const that = this;

        return function(tick, gridStyle) {
            const center = that.getCenter();

            return that._createPathElement(that._getGridPoints().points, gridStyle)
                .rotate(tick.coords.angle, center.x, center.y);
        };
    },

    _getGridPoints: function() {
        const r = this.getRadius();
        const center = this.getCenter();

        return {
            points: [center.x, center.y, center.x + r, center.y]
        };
    },

    _getTranslatedValue: function(value, offset) {
        const startAngle = this.getAngles()[0];
        const angle = this._translator.translate(value, -offset);
        const coords = convertPolarToXY(this.getCenter(), startAngle, angle, this.getRadius());

        return { x: coords.x, y: coords.y, angle: angle + startAngle - HALF_PI_ANGLE };
    },

    _getAdjustedStripLabelCoords: function(strip) {
        const box = strip.labelBBox;

        return {
            translateY: strip.label.attr('y') - box.y - box.height / 2
        };
    },

    coordsIn: function(x, y) {
        return vizUtils.convertXYToPolar(this.getCenter(), x, y).r > this.getRadius();
    },

    _rotateTick: function(element, coords) {
        const center = this.getCenter();
        element.rotate(coords.angle, center.x, center.y);
    },

    _validateOverlappingMode: function(mode) {
        return constants.validateOverlappingMode(mode);
    },

    _validateDisplayMode: function() {
        return 'standard';
    },

    _getStep: function(boxes) {
        const that = this;
        const radius = that.getRadius() + (that._options.label.indentFromAxis || 0);
        const maxLabelBox = boxes.reduce(function(prevValue, box) {
            const curValue = prevValue;
            if(prevValue.width < box.width) {
                curValue.width = box.width;
            }
            if(prevValue.height < box.height) {
                curValue.height = box.height;
            }
            return curValue;
        }, { width: 0, height: 0 });
        const angle1 = _abs(2 * (_math.atan(maxLabelBox.height / (2 * radius - maxLabelBox.width))) * 180 / _math.PI);
        const angle2 = _abs(2 * (_math.atan(maxLabelBox.width / (2 * radius - maxLabelBox.height))) * 180 / _math.PI);

        return constants.getTicksCountInRange(that._majorTicks, 'angle', _math.max(angle1, angle2));
    },

    _checkBoundedLabelsOverlapping: function(majorTicks, boxes, mode) {
        const labelOpt = this._options.label;
        mode = mode || this._validateOverlappingMode(labelOpt.overlappingBehavior);
        if(mode !== 'hide') {
            return;
        }
        const lastVisibleLabelIndex = majorTicks.reduce((lastVisibleLabelIndex, tick, index) => tick.label ? index : lastVisibleLabelIndex, null);

        if(!lastVisibleLabelIndex) {
            return;
        }

        if(constants.areLabelsOverlap(boxes[0], boxes[lastVisibleLabelIndex], labelOpt.minSpacing, constants.center)) {
            labelOpt.hideFirstOrLast === 'first' ? majorTicks[0].label.remove() : majorTicks[lastVisibleLabelIndex].label.remove();
        }
    },

    shift: function(margins) {
        this._axisGroup.attr({ translateX: margins.right, translateY: margins.bottom });
    }
};

polarAxes.circularSpider = _extend({}, circularAxes, {
    _createAxisElement: function() {
        return this._renderer.path([], 'area');
    },

    _updateAxisElementPosition: function() {
        this._axisElement.attr({
            points: _map(this.getSpiderTicks(), function(tick) {
                return { x: tick.coords.x, y: tick.coords.y };
            })
        });
    },

    _getStick: function() {
        return true;
    },

    _getSpiderCategoryOption: function() {
        return true;
    },

    getSpiderTicks: function() {
        const that = this;
        const ticks = that.getFullTicks();
        that._spiderTicks = ticks.map(tick(
            that,
            that.renderer,
            {},
            {},
            that._getSkippedCategory(ticks),
            true
        ));

        that._spiderTicks.forEach(function(tick) { tick.initCoords(); });

        return that._spiderTicks;
    },

    _getStripGraphicAttributes: function(fromAngle, toAngle) {
        const center = this.getCenter();
        const spiderTicks = this.getSpiderTicks();
        let firstTick;
        let lastTick;
        let nextTick;
        let tick;
        const points = [];
        let i = 0;
        const len = spiderTicks.length;

        while(i < len) {
            tick = spiderTicks[i].coords;
            if(tick.angle >= fromAngle && tick.angle <= toAngle) {
                if(!firstTick) {
                    firstTick = (spiderTicks[i - 1] || spiderTicks[spiderTicks.length - 1]).coords;
                    points.push((tick.x + firstTick.x) / 2, (tick.y + firstTick.y) / 2);
                }
                points.push(tick.x, tick.y);
                nextTick = (spiderTicks[i + 1] || spiderTicks[0]).coords;
                lastTick = ({ x: (tick.x + nextTick.x) / 2, y: (tick.y + nextTick.y) / 2 });
            }
            i++;
        }

        points.push(lastTick.x, lastTick.y);
        points.push(center.x, center.y);

        return {
            points: points
        };
    },

    _createStrip: function({ points }) {
        return this._renderer.path(points, 'area');
    },

    _getTranslatedCoord: function(value, offset) {
        return this._translator.translate(value, offset) - HALF_PI_ANGLE;
    },

    _setTickOffset: function() {
        this._tickOffset = false;
    }
});

polarAxes.linear = {
    _resetMargins() {
        this._reinitTranslator(this._getViewportRange());
    },
    _getStick: xyAxesLinear._getStick,
    _getSpiderCategoryOption: _noop,

    _getTranslatorOptions: function() {
        return {
            isHorizontal: true,
            stick: this._getStick()
        };
    },

    getRadius: circularAxes.getRadius,
    getCenter: circularAxes.getCenter,
    getAngles: circularAxes.getAngles,
    _updateRadius: circularAxes._updateRadius,
    _updateCenter: circularAxes._updateCenter,

    _processCanvas(canvas) {
        this._updateRadius(canvas);
        this._updateCenter(canvas);

        return {
            left: 0,
            right: 0,
            startPadding: canvas.startPadding,
            endPadding: canvas.endPadding,
            width: this.getRadius()
        };
    },

    _createAxisElement: xyAxesLinear._createAxisElement,

    _updateAxisElementPosition: function() {
        const centerCoord = this.getCenter();

        this._axisElement.attr({
            points: [centerCoord.x, centerCoord.y, centerCoord.x + this.getRadius(), centerCoord.y]
        }).rotate(this.getAngles()[0] - HALF_PI_ANGLE, centerCoord.x, centerCoord.y);
    },

    _getScreenDelta: function() {
        return this.getRadius();
    },

    _getTickMarkPoints: function(coords, length) {
        return [
            coords.x - length / 2,
            coords.y,
            coords.x + length / 2,
            coords.y
        ];
    },

    _getLabelAdjustedCoord: function(tick) {
        const that = this;
        const labelCoords = tick.labelCoords;
        const labelY = labelCoords.y;
        const cosSin = vizUtils.getCosAndSin(labelCoords.angle);
        const indentFromAxis = that._options.label.indentFromAxis || 0;
        const box = tick.labelBBox;
        let x;
        let y;

        x = labelCoords.x - _abs(indentFromAxis * cosSin.sin) + _abs(box.width / 2 * cosSin.cos) - box.width / 2;
        y = labelY + (labelY - box.y) - _abs(box.height / 2 * cosSin.sin) + _abs(indentFromAxis * cosSin.cos);

        return { x: x, y: y };
    },

    _getGridLineDrawer: function() {
        const that = this;

        return function(tick, gridStyle) {
            const grid = that._getGridPoints(tick.coords);

            return that._renderer.circle(grid.cx, grid.cy, grid.r)
                .attr(gridStyle)
                .sharp();
        };
    },

    _getGridPoints: function(coords) {
        const pos = this.getCenter();
        const radius = vizUtils.getDistance(pos.x, pos.y, coords.x, coords.y);
        if(radius > this.getRadius()) {
            return { cx: null, cy: null, r: null };
        }

        return {
            cx: pos.x,
            cy: pos.y,
            r: radius
        };
    },

    _getTranslatedValue: function(value, offset) {
        const startAngle = this.getAngles()[0];
        const xy = convertPolarToXY(this.getCenter(), startAngle, 0, this._translator.translate(value, offset));
        return { x: xy.x, y: xy.y, angle: startAngle - HALF_PI_ANGLE };
    },

    _getTranslatedCoord: function(value, offset) {
        return this._translator.translate(value, offset);
    },

    _getCanvasStartEnd() {
        const invert = this.getTranslator().getBusinessRange().invert;
        const coords = [0, this.getRadius()];

        invert && coords.reverse();

        return {
            start: coords[0],
            end: coords[1]
        };
    },

    _getStripGraphicAttributes: function(fromPoint, toPoint) {
        const center = this.getCenter();

        return {
            x: center.x,
            y: center.y,
            innerRadius: fromPoint,
            outerRadius: toPoint
        };
    },

    _createStrip: function(attrs) {
        return this._renderer.arc(attrs.x, attrs.y, attrs.innerRadius, attrs.outerRadius, 0, 360);
    },

    _getAdjustedStripLabelCoords: circularAxes._getAdjustedStripLabelCoords,

    _getStripLabelCoords: function(from, to) {
        const that = this;
        const labelPos = from + (to - from) / 2;
        const center = that.getCenter();
        const y = _round(center.y - labelPos);

        return { x: center.x, y: y, align: constants.center };
    },

    _getConstantLineGraphicAttributes: function(value) {
        const center = this.getCenter();

        return {
            cx: center.x,
            cy: center.y,
            r: value
        };
    },

    _createConstantLine: function(value, attr) {
        const attrs = this._getConstantLineGraphicAttributes(value);

        return this._renderer.circle(attrs.cx, attrs.cy, attrs.r).attr(attr).sharp();
    },

    _getConstantLineLabelsCoords: function(value) {
        const that = this;
        const center = that.getCenter();
        const y = _round(center.y - value);

        return { x: center.x, y: y };
    },

    _checkAlignmentConstantLineLabels: _noop,

    _rotateTick: function(element, coords, isGridLine) {
        !isGridLine && element.rotate(coords.angle + HALF_PI_ANGLE, coords.x, coords.y);
    },

    _validateOverlappingMode: circularAxes._validateOverlappingMode,

    _validateDisplayMode: circularAxes._validateDisplayMode,

    _getStep: function(boxes) {
        const quarter = getPolarQuarter(this.getAngles()[0]);
        const spacing = this._options.label.minSpacing;
        const func = (quarter === 2 || quarter === 4) ? function(box) { return box.width + spacing; } : function(box) { return box.height; };
        const maxLabelLength = boxes.reduce(function(prevValue, box) {
            return _math.max(prevValue, func(box));
        }, 0);

        return constants.getTicksCountInRange(this._majorTicks, (quarter === 2 || quarter === 4) ? 'x' : 'y', maxLabelLength);
    }
};

polarAxes.linearSpider = _extend({}, polarAxes.linear, {
    _createPathElement: function(points, attr) {
        return this._renderer.path(points, 'area').attr(attr).sharp();
    },

    setSpiderTicks: function(ticks) {
        this._spiderTicks = ticks;
    },

    _getGridLineDrawer: function() {
        const that = this;

        return function(tick, gridStyle, element) {
            return that._createPathElement(that._getGridPoints(tick.coords).points, gridStyle);
        };
    },

    _getGridPoints: function(coords) {
        const pos = this.getCenter();
        const radius = vizUtils.getDistance(pos.x, pos.y, coords.x, coords.y);

        return this._getGridPointsByRadius(radius);
    },

    _getGridPointsByRadius: function(radius) {
        const pos = this.getCenter();
        if(radius > this.getRadius()) {
            return { points: null };
        }

        return {
            points: _map(this._spiderTicks, function(tick) {
                const cosSin = vizUtils.getCosAndSin(tick.coords.angle);
                return { x: _round(pos.x + radius * cosSin.cos), y: _round(pos.y + radius * cosSin.sin) };
            })
        };
    },

    _getStripGraphicAttributes: function(fromPoint, toPoint) {
        const innerPoints = this._getGridPointsByRadius(toPoint).points;
        const outerPoints = this._getGridPointsByRadius(fromPoint).points;

        return {
            points: [outerPoints, innerPoints.reverse()]
        };
    },

    _createStrip: polarAxes.circularSpider._createStrip,

    _getConstantLineGraphicAttributes: function(value) {
        return this._getGridPointsByRadius(value);
    },

    _createConstantLine: function(value, attr) {
        return this._createPathElement(this._getConstantLineGraphicAttributes(value).points, attr);
    }
});
