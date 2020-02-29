import { patchFontOptions } from '../core/utils';
import { extend } from '../../core/utils/extend';
const math = Math;
const mathAbs = math.abs;
const mathMin = math.min;
const mathMax = math.max;
const mathFloor = math.floor;
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const LABEL_BACKGROUND_PADDING_X = 8;
const LABEL_BACKGROUND_PADDING_Y = 4;
const CENTER = 'center';
const RIGHT = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';

exports.getMargins = function() {
    return {
        x: LABEL_BACKGROUND_PADDING_X,
        y: LABEL_BACKGROUND_PADDING_Y
    };
};

function getRectangleBBox(bBox) {
    return {
        x: bBox.x - LABEL_BACKGROUND_PADDING_X,
        y: bBox.y - LABEL_BACKGROUND_PADDING_Y,
        width: bBox.width + LABEL_BACKGROUND_PADDING_X * 2,
        height: bBox.height + LABEL_BACKGROUND_PADDING_Y * 2
    };
}

function getLabelCheckerPosition(x, y, isHorizontal, canvas) {
    const params = isHorizontal ? ['x', 'width', 'y', 'height', y, 0] : ['y', 'height', 'x', 'width', x, 1];

    return function(bBox, position, coord) {
        const labelCoord = { x: coord.x, y: coord.y };
        const rectangleBBox = getRectangleBBox(bBox);
        const delta = isHorizontal ? coord.y - bBox.y - bBox.height / 2 : coord.y - bBox.y;

        labelCoord.y = isHorizontal || (!isHorizontal && position === BOTTOM) ? coord.y + delta : coord.y;

        if(rectangleBBox[params[0]] < 0) {
            labelCoord[params[0]] -= rectangleBBox[params[0]];
        } else if(rectangleBBox[params[0]] + rectangleBBox[params[1]] + delta * params[5] > canvas[params[1]]) {
            labelCoord[params[0]] -= rectangleBBox[params[0]] + rectangleBBox[params[1]] + delta * params[5] - canvas[params[1]];
        }
        if(params[4] - rectangleBBox[params[3]] / 2 < 0) {
            labelCoord[params[2]] -= params[4] - rectangleBBox[params[3]] / 2;
        } else if(params[4] + rectangleBBox[params[3]] / 2 > canvas[params[3]]) {
            labelCoord[params[2]] -= params[4] + rectangleBBox[params[3]] / 2 - canvas[params[3]];
        }

        return labelCoord;
    };
}

function Crosshair(renderer, options, params, group) {
    const that = this;
    that._renderer = renderer;
    that._crosshairGroup = group;
    that._options = {};
    that.update(options, params);
}

Crosshair.prototype = {
    constructor: Crosshair,

    update: function(options, params) {
        const that = this;
        const canvas = params.canvas;
        that._canvas = {
            top: canvas.top,
            bottom: canvas.height - canvas.bottom,
            left: canvas.left,
            right: canvas.width - canvas.right,
            width: canvas.width,
            height: canvas.height
        };
        that._axes = params.axes;
        that._panes = params.panes;
        that._prepareOptions(options, HORIZONTAL);
        that._prepareOptions(options, VERTICAL);
    },

    dispose: function() {
        const that = this;

        that._renderer = that._crosshairGroup = that._options = that._axes =
            that._canvas = that._horizontalGroup = that._verticalGroup =
            that._horizontal = that._vertical = that._circle = that._panes = null;
    },

    _prepareOptions: function(options, direction) {
        const lineOptions = options[direction + 'Line'];
        this._options[direction] = {
            visible: lineOptions.visible,
            line: {
                stroke: lineOptions.color || options.color,
                'stroke-width': lineOptions.width || options.width,
                dashStyle: lineOptions.dashStyle || options.dashStyle,
                opacity: lineOptions.opacity || options.opacity,
                'stroke-linecap': 'butt'
            },
            label: extend(true, {}, options.label, lineOptions.label)
        };
    },

    _createLines: function(options, sharpParam, group) {
        const lines = [];
        const canvas = this._canvas;
        const points = [canvas.left, canvas.top, canvas.left, canvas.top];
        for(let i = 0; i < 2; i++) {
            lines.push(this._renderer.path(points, 'line').attr(options).sharp(sharpParam).append(group));
        }
        return lines;
    },

    render: function() {
        const that = this;
        const renderer = that._renderer;
        const options = that._options;
        const verticalOptions = options.vertical;
        const horizontalOptions = options.horizontal;
        const extraOptions = horizontalOptions.visible ? horizontalOptions.line : verticalOptions.line;
        const circleOptions = { stroke: extraOptions.stroke, 'stroke-width': extraOptions['stroke-width'], dashStyle: extraOptions.dashStyle, opacity: extraOptions.opacity };
        const canvas = that._canvas;

        that._horizontal = {};
        that._vertical = {};

        that._circle = renderer.circle(canvas.left, canvas.top, 0).attr(circleOptions).append(that._crosshairGroup);
        that._horizontalGroup = renderer.g().append(that._crosshairGroup);
        that._verticalGroup = renderer.g().append(that._crosshairGroup);

        if(verticalOptions.visible) {
            that._vertical.lines = that._createLines(verticalOptions.line, 'h', that._verticalGroup);
            that._vertical.labels = that._createLabels(that._axes[0], verticalOptions, false, that._verticalGroup);
        }
        if(horizontalOptions.visible) {
            that._horizontal.lines = that._createLines(horizontalOptions.line, 'v', that._horizontalGroup);
            that._horizontal.labels = that._createLabels(that._axes[1], horizontalOptions, true, that._horizontalGroup);
        }

        that.hide();
    },

    _createLabels: function(axes, options, isHorizontal, group) {
        const that = this;
        const canvas = that._canvas;
        const renderer = that._renderer;
        let x;
        let y;
        let text;
        const labels = [];
        let background;
        let currentLabelPos;
        const labelOptions = options.label;

        if(labelOptions.visible) {
            axes.forEach(function(axis) {
                const position = axis.getOptions().position;
                let align;
                if(axis.getTranslator().getBusinessRange().isEmpty()) {
                    return;
                }

                currentLabelPos = axis.getLabelsPosition();
                if(isHorizontal) {
                    y = canvas.top;
                    x = currentLabelPos;
                } else {
                    x = canvas.left;
                    y = currentLabelPos;
                }
                align = position === TOP || position === BOTTOM ? CENTER : (position === RIGHT ? LEFT : RIGHT);
                background = renderer.rect(0, 0, 0, 0).attr({ fill: labelOptions.backgroundColor || options.line.stroke }).append(group);
                text = renderer.text('0', 0, 0).css(patchFontOptions(options.label.font)).attr({
                    align: align,
                    'class': labelOptions.cssClass
                }).append(group);

                labels.push({ text: text, background: background, axis: axis, options: labelOptions, pos: { coord: currentLabelPos, side: position }, startXY: { x: x, y: y } });
            });
        }

        return labels;
    },

    _updateText: function(value, axisName, labels, point, func) {
        const that = this;

        labels.forEach(function(label) {
            const axis = label.axis;
            const coord = label.startXY;
            const textElement = label.text;
            const backgroundElement = label.background;
            let text = '';

            if(!axis.name || axis.name === axisName) {
                text = axis.getFormattedValue(value, label.options, point);
            }

            if(text) {
                textElement.attr({ text: text, x: coord.x, y: coord.y });
                textElement.attr(func(textElement.getBBox(), label.pos.side, coord));

                that._updateLinesCanvas(label);
                backgroundElement.attr(getRectangleBBox(textElement.getBBox()));
            } else {
                textElement.attr({ text: '' });
                backgroundElement.attr({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                });
            }
        });
    },

    hide: function() {
        this._crosshairGroup.attr({ visibility: 'hidden' });
    },

    _updateLinesCanvas: function(label) {
        const position = label.pos.side;
        const labelCoord = label.pos.coord;
        const coords = this._linesCanvas;
        const canvas = this._canvas;

        coords[position] = (coords[position] !== canvas[position] && mathAbs(coords[position] - canvas[position]) < mathAbs(labelCoord - canvas[position])) ? coords[position] : labelCoord;
    },

    _updateLines: function(lines, x, y, r, isHorizontal) {
        const coords = this._linesCanvas;
        const canvas = this._canvas;
        const points = isHorizontal
            ? [
                [mathMin(x - r, coords.left), canvas.top, x - r, canvas.top],
                [x + r, canvas.top, mathMax(coords.right, x + r), canvas.top]
            ]
            : [
                [canvas.left, mathMin(coords.top, y - r), canvas.left, y - r],
                [canvas.left, y + r, canvas.left, mathMax(coords.bottom, y + r)]
            ];
        for(let i = 0; i < 2; i++) {
            lines[i].attr({ points: points[i] }).sharp(isHorizontal ? 'v' : 'h', isHorizontal ? (y === canvas.bottom ? -1 : 1) : (x === canvas.right ? -1 : 1));
        }
    },

    _resetLinesCanvas: function() {
        const canvas = this._canvas;
        this._linesCanvas = {
            left: canvas.left,
            right: canvas.right,
            top: canvas.top,
            bottom: canvas.bottom
        };
    },

    _getClipRectForPane: function(x, y) {
        const panes = this._panes;
        let i;
        let coords;
        for(i = 0; i < panes.length; i++) {
            coords = panes[i].coords;
            if(coords.left <= x && coords.right >= x && coords.top <= y && coords.bottom >= y) {
                return panes[i].clipRect;
            }
        }
        return { id: null };
    },

    show: function(data) {
        const that = this;
        const point = data.point;
        const pointData = point.getCrosshairData(data.x, data.y);
        const r = point.getPointRadius();
        const horizontal = that._horizontal;
        const vertical = that._vertical;
        const rad = !r ? 0 : r + 3;
        const canvas = that._canvas;
        const x = mathFloor(pointData.x);
        const y = mathFloor(pointData.y);

        if(x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom) {
            that._crosshairGroup.attr({ visibility: 'visible' });
            that._resetLinesCanvas();
            that._circle.attr({ cx: x, cy: y, r: rad, 'clip-path': that._getClipRectForPane(x, y).id });

            if(horizontal.lines) {
                that._updateText(pointData.yValue, pointData.axis, horizontal.labels, point, getLabelCheckerPosition(x, y, true, canvas));
                that._updateLines(horizontal.lines, x, y, rad, true);
                that._horizontalGroup.attr({ translateY: y - canvas.top });
            }

            if(vertical.lines) {
                that._updateText(pointData.xValue, pointData.axis, vertical.labels, point, getLabelCheckerPosition(x, y, false, canvas));
                that._updateLines(vertical.lines, x, y, rad, false);
                that._verticalGroup.attr({ translateX: x - canvas.left });
            }
        } else {
            that.hide();
        }
    }
};

exports.Crosshair = Crosshair;
