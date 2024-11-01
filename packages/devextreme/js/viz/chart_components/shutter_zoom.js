import { start as dragEventStart, move as dragEventMove, end as dragEventEnd } from '../../common/core/events/drag';
const SHUTTER_EVENTS_NS = '.shutter-zoom';
const DRAG_START_EVENT_NAME = dragEventStart + SHUTTER_EVENTS_NS;
const DRAG_UPDATE_EVENT_NAME = dragEventMove + SHUTTER_EVENTS_NS;
const DRAG_END_EVENT_NAME = dragEventEnd + SHUTTER_EVENTS_NS;

function getPointerCoord(rootOffset, canvas, rotated, e) {
    let coord = Math.floor(rotated ? (e.pageY - rootOffset.top) : (e.pageX - rootOffset.left));
    const min = rotated ? canvas.y1 : canvas.x1;
    const max = rotated ? canvas.y2 : canvas.x2;

    if(coord < min) {
        coord = min;
    } else if(coord > max) {
        coord = max;
    }
    return coord;
}

function checkCoords(rootOffset, canvas, e) {
    const x = e.pageX - rootOffset.left;
    const y = e.pageY - rootOffset.top;
    return x >= canvas.x1 && x <= canvas.x2
        && y >= canvas.y1 && y <= canvas.y2;
}

function dragStartHandler(ctx) {
    return function(e) {
        const offset = ctx.getRootOffset();
        const canvas = ctx.getCanvas();

        if(!checkCoords(offset, canvas, e)) {
            e.cancel = true;
            return;
        }

        ctx.rootOffset = offset;
        ctx.canvas = canvas;
        ctx.startCoord = getPointerCoord(offset, canvas, ctx.rotated, e);

        ctx.triggerStart();

        ctx.rect.attr({
            x: canvas.x1,
            y: canvas.y1,
            width: canvas.width,
            height: canvas.height
        }).append(ctx.root);
    };
}

function dragHandler(ctx) {
    return function(e) {
        const curCoord = getPointerCoord(ctx.rootOffset, ctx.canvas, ctx.rotated, e);
        const attr = {};
        ctx.curCoord = curCoord;

        attr[ctx.rotated ? 'y' : 'x'] = Math.min(ctx.startCoord, curCoord);
        attr[ctx.rotated ? 'height' : 'width'] = Math.abs(ctx.startCoord - curCoord);
        ctx.rect.attr(attr);
    };
}

function dragEndHandler(ctx) {
    return function(e) {
        ctx.triggerEnd();
        ctx.rect.remove();
    };
}

function shutterZoom(options) {
    const chart = options.chart;
    const renderer = options.renderer;
    const rotated = options.rotated;
    const rect = renderer.rect(0, 0, 0, 0).attr(options.shutterOptions);
    const shutter = {
        rect: rect,
        root: renderer.root,
        rotated: rotated,
        triggerStart: function() { chart._eventTrigger('zoomStart'); },
        triggerEnd: function() {
            const tr = chart._argumentAxes[0].getTranslator();
            const rangeStart = Math.min(this.startCoord, this.curCoord);
            const rangeEnd = Math.max(this.startCoord, this.curCoord);
            chart._eventTrigger('zoomEnd', { rangeStart: tr.from(rangeStart), rangeEnd: tr.from(rangeEnd) });
        },
        dispose: function() {
            renderer.root.off(SHUTTER_EVENTS_NS);
            rect.dispose();
        },
        getRootOffset: function() {
            return renderer.getRootOffset();
        },
        getCanvas: function() {
            const canvas = chart._canvas;
            const panes = chart.panes;
            const firstPane = panes[0].canvas;
            const lastPane = panes[panes.length - 1].canvas;

            return {
                x1: firstPane.left,
                y1: firstPane.top,
                x2: canvas.width - lastPane.right,
                y2: canvas.height - lastPane.bottom,
                width: canvas.width - firstPane.left - lastPane.right,
                height: canvas.height - firstPane.top - lastPane.bottom
            };
        }
    };

    renderer.root.off(SHUTTER_EVENTS_NS)
        .on(DRAG_START_EVENT_NAME, { direction: rotated ? 'vertical' : 'horizontal', immediate: true }, dragStartHandler(shutter))
        .on(DRAG_UPDATE_EVENT_NAME, dragHandler(shutter))
        .on(DRAG_END_EVENT_NAME, dragEndHandler(shutter));

    return shutter;
}

export default {
    name: 'shutter_zoom',

    init: function() {
        const options = this.option('shutterZoom') || {};

        if(!options.enabled) {
            return;
        }

        this._shutterZoom = shutterZoom({
            chart: this,
            renderer: this._renderer,
            rotated: this.option('rotated'),
            shutterOptions: options
        });
    },

    dispose: function() {
        this._shutterZoom && this._shutterZoom.dispose();
    }
};
