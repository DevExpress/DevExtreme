import eventsEngine from '../../common/core/events/core/events_engine';
import { fireEvent } from '../../common/core/events/utils/index';
import { extend } from '../../core/utils/extend';
import { Translator2D } from '../translators/translator2d';
import { isDefined } from '../../core/utils/type';
import { noop } from '../../core/utils/common';
import { start as dragEventStart, move as dragEventMove, end as dragEventEnd } from '../../common/core/events/drag';

const _min = Math.min;
const _max = Math.max;
const MIN_SCROLL_BAR_SIZE = 2;

export const ScrollBar = function(renderer, group) {
    this._translator = new Translator2D({}, {}, {});
    this._scroll = renderer.rect().append(group);
    this._addEvents();
};

function _getXCoord(canvas, pos, offset, width) {
    let x = 0;

    if(pos === 'right') {
        x = canvas.width - canvas.right + offset;
    } else if(pos === 'left') {
        x = canvas.left - offset - width;
    }

    return x;
}

function _getYCoord(canvas, pos, offset, width) {
    let y = 0;

    if(pos === 'top') {
        y = canvas.top - offset;
    } else if(pos === 'bottom') {
        y = canvas.height - canvas.bottom + width + offset;
    }

    return y;
}

ScrollBar.prototype = {

    _addEvents: function() {
        const scrollElement = this._scroll.element;

        eventsEngine.on(scrollElement, dragEventStart, e => {
            fireEvent({
                type: 'dxc-scroll-start',
                originalEvent: e,
                target: scrollElement
            });
        });

        eventsEngine.on(scrollElement, dragEventMove, e => {
            const dX = -e.offset.x * this._scale;
            const dY = -e.offset.y * this._scale;
            const lx = this._offset - (this._layoutOptions.vertical ? dY : dX) / this._scale;
            this._applyPosition(lx, lx + this._translator.canvasLength / this._scale);

            fireEvent({
                type: 'dxc-scroll-move',
                originalEvent: e,
                target: scrollElement,
                offset: {
                    x: dX,
                    y: dY
                }
            });
        });

        eventsEngine.on(scrollElement, dragEventEnd, e => {
            fireEvent({
                type: 'dxc-scroll-end',
                originalEvent: e,
                target: scrollElement,
                offset: {
                    x: -e.offset.x * this._scale,
                    y: -e.offset.y * this._scale
                }
            });
        });
    },

    update: function(options) {
        const that = this;
        let position = options.position;
        const isVertical = options.rotated;
        const defaultPosition = isVertical ? 'right' : 'top';
        const secondaryPosition = isVertical ? 'left' : 'bottom';

        if(position !== defaultPosition && position !== secondaryPosition) {
            position = defaultPosition;
        }

        that._scroll.attr({
            rotate: !options.rotated ? -90 : 0,
            rotateX: 0,
            rotateY: 0,
            fill: options.color,
            width: options.width,
            opacity: options.opacity
        });

        that._layoutOptions = {
            width: options.width,
            offset: options.offset,
            vertical: isVertical,
            position: position
        };

        return that;
    },

    init: function(range, stick) {
        const that = this;
        const isDiscrete = range.axisType === 'discrete';
        that._translateWithOffset = (isDiscrete && !stick && 1) || 0;
        that._translator.update(extend({}, range, {
            minVisible: null,
            maxVisible: null,
            visibleCategories: null
        }, isDiscrete && {
            min: null,
            max: null
        } || {}), that._canvas, { isHorizontal: !that._layoutOptions.vertical, stick: stick });
        return that;
    },

    getOptions: function() {
        return this._layoutOptions;
    },

    setPane: function(panes) {
        const position = this._layoutOptions.position;
        let pane;

        if(position === 'left' || position === 'top') {
            pane = panes[0];
        } else {
            pane = panes[panes.length - 1];
        }
        this.pane = pane.name;

        return this;
    },

    updateSize: function(canvas) {
        this._canvas = extend({}, canvas);

        const options = this._layoutOptions;
        const pos = options.position;
        const offset = options.offset;
        const width = options.width;

        this._scroll.attr({
            translateX: _getXCoord(canvas, pos, offset, width),
            translateY: _getYCoord(canvas, pos, offset, width)
        });
    },

    getMultipleAxesSpacing: function() {
        return 0;
    },

    estimateMargins: function() { return this.getMargins(); },

    getMargins: function() {
        const options = this._layoutOptions;
        const margins = { left: 0, top: 0, right: 0, bottom: 0 };

        margins[options.position] = options.width + options.offset;

        return margins;
    },

    shift: function(margins) {
        const that = this;
        const options = that._layoutOptions;
        const side = options.position;
        const isVertical = options.vertical;
        const attr = {
            translateX: that._scroll.attr('translateX') ?? 0,
            translateY: that._scroll.attr('translateY') ?? 0
        };
        const shift = margins[side];

        attr[isVertical ? 'translateX' : 'translateY'] += (side === 'left' || side === 'top' ? -1 : 1) * shift;
        that._scroll.attr(attr);
    },

    // Axis like functions
    hideTitle: noop,

    hideOuterElements: noop,
    // Axis like functions

    setPosition: function(min, max) {
        const that = this;
        const translator = that._translator;
        const minPoint = isDefined(min) ? translator.translate(min, -that._translateWithOffset) : translator.translate('canvas_position_start');
        const maxPoint = isDefined(max) ? translator.translate(max, that._translateWithOffset) : translator.translate('canvas_position_end');

        that._offset = _min(minPoint, maxPoint);
        that._scale = translator.getScale(min, max);

        that._applyPosition(_min(minPoint, maxPoint), _max(minPoint, maxPoint));
    },

    customPositionIsAvailable() {
        return false;
    },

    dispose: function() {
        this._scroll.dispose();
        this._scroll = this._translator = null;
    },

    _applyPosition: function(x1, x2) {
        const that = this;
        const visibleArea = that._translator.getCanvasVisibleArea();

        x1 = _max(x1, visibleArea.min);
        x1 = _min(x1, visibleArea.max);

        x2 = _min(x2, visibleArea.max);
        x2 = _max(x2, visibleArea.min);

        const height = Math.abs(x2 - x1);
        that._scroll.attr({
            y: x1,
            height: height < MIN_SCROLL_BAR_SIZE ? MIN_SCROLL_BAR_SIZE : height
        });
    }
};
