var dragEvents = require('../../events/drag'),
    SHUTTER_EVENTS_NS = '.shutter-zoom',
    DRAG_START_EVENT_NAME = dragEvents.start + SHUTTER_EVENTS_NS,
    DRAG_UPDATE_EVENT_NAME = dragEvents.move + SHUTTER_EVENTS_NS,
    DRAG_END_EVENT_NAME = dragEvents.end + SHUTTER_EVENTS_NS;

function getPointerCoord(rootOffset, canvas, rotated, e) {
    var coord = Math.floor(rotated ? (e.pageY - rootOffset.top) : (e.pageX - rootOffset.left)),
        min = rotated ? canvas.y1 : canvas.x1,
        max = rotated ? canvas.y2 : canvas.x2;

    if(coord < min) {
        coord = min;
    } else if(coord > max) {
        coord = max;
    }
    return coord;
}

function checkCoords(rootOffset, canvas, e) {
    var x = e.pageX - rootOffset.left,
        y = e.pageY - rootOffset.top;
    return x >= canvas.x1 && x <= canvas.x2
        && y >= canvas.y1 && y <= canvas.y2;
}

function dragStartHandler(ctx) {
    return function(e) {
        var offset = ctx.getRootOffset(),
            canvas = ctx.getCanvas();

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
        var curCoord = getPointerCoord(ctx.rootOffset, ctx.canvas, ctx.rotated, e),
            attr = {};
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
    var chart = options.chart,
        renderer = options.renderer,
        rotated = options.rotated,
        rect = renderer.rect(0, 0, 0, 0).attr(options.shutterOptions),
        shutter = {
            rect: rect,
            root: renderer.root,
            rotated: rotated,
            triggerStart: function() { chart._eventTrigger('zoomStart'); },
            triggerEnd: function() {
                var tr = chart._argumentAxes[0].getTranslator(),
                    rangeStart = Math.min(this.startCoord, this.curCoord),
                    rangeEnd = Math.max(this.startCoord, this.curCoord);
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
                var canvas = chart._canvas,
                    panes = chart.panes,
                    firstPane = panes[0].canvas,
                    lastPane = panes[panes.length - 1].canvas;

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

module.exports = {
    name: 'shutter_zoom',

    init: function() {
        var options = this.option('shutterZoom') || {};

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
