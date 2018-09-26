
const deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,

    extend = require("../../core/utils/extend").extend,
    isDefined = require("../../core/utils/type").isDefined,
    normalizeEnum = require("../core/utils").normalizeEnum,
    wheelEvent = require("../../events/core/wheel"),
    transformEvents = require("../../events/transform"),
    dragEvents = require("../../events/drag"),
    EVENTS_NS = ".zoomAndPanNS",
    DRAG_START_EVENT_NAME = dragEvents.start + EVENTS_NS,
    DRAG_EVENT_NAME = dragEvents.move + EVENTS_NS,
    DRAG_END_EVENT_NAME = dragEvents.end + EVENTS_NS,

    PINCH_START_EVENT_NAME = transformEvents["pinchstart"] + EVENTS_NS,
    PINCH_EVENT_NAME = transformEvents["pinch"] + EVENTS_NS,
    PINCH_END_EVENT_NAME = transformEvents["pinchend"] + EVENTS_NS,

    SCROLL_BAR_START_EVENT_NAME = "dxc-scroll-start" + EVENTS_NS,
    SCROLL_BAR_MOVE_EVENT_NAME = "dxc-scroll-move" + EVENTS_NS,
    SCROLL_BAR_END_EVENT_NAME = "dxc-scroll-end" + EVENTS_NS,

    DEFAULT_ARG_AXIS_NAME = "_arg_axis_internal_name_",

    ZOOM_START = "zoomStart",
    ZOOM_END = "zoomEnd",

    GESTURE_TIMEOUT = 300,

    _min = Math.min,
    _max = Math.max,
    _abs = Math.abs;

function canvasToRect(canvas) {
    return {
        x: canvas.left,
        y: canvas.top,
        width: canvas.width - canvas.left - canvas.right,
        height: canvas.height - canvas.top - canvas.bottom
    };
}

function checkCoords(rect, coords) {
    var x = coords.x,
        y = coords.y;
    return x >= rect.x && x <= (rect.width + rect.x)
        && y >= rect.y && y <= (rect.height + rect.y);
}

function parseOption(option) {
    option = normalizeEnum(option);
    const pan = option === "pan" || option === "both",
        zoom = option === "zoom" || option === "both";

    return {
        pan: pan,
        zoom: zoom,
        none: !pan && !zoom
    };
}

function getDragDirection(options, rotated) {
    let anyArg = !options.argumentAxis.none,
        anyVal = !options.valueAxis.none;

    if(anyArg && anyVal) {
        return "both";
    }
    return (rotated && anyArg || !rotated && anyVal) ? "vertical" : "horizontal";
}

module.exports = {
    name: "zoom_and_pan",
    init: function() {
        const chart = this,
            renderer = this._renderer;

        function startAxesViewportChanging(zoomAndPan, actionField, e) {
            const options = zoomAndPan.options;
            const actionData = zoomAndPan.actionData;
            let axes = [];
            if(options.argumentAxis[actionField]) {
                axes.push(chart.getArgumentAxis());
            }
            if(options.valueAxis[actionField]) {
                axes = axes.concat(actionData.valueAxes);
            }

            e.cancel = axes.some(axis => {
                const eventArg = axis.getZoomStartEventArg();
                chart._eventTrigger(ZOOM_START, eventArg);
                actionData.startRanges[axis.name || DEFAULT_ARG_AXIS_NAME] = eventArg.range;
                return eventArg.cancel;
            });
        }

        function axesViewportChanging(zoomAndPan, actionField, e, offsetCalc, centerCalc) {
            function zoomAxes(axes, criteria, coordField, e, actionData) {
                criteria && axes.forEach(axis => {
                    const viewport = axis.visualRange();
                    const zoom = axis.getTranslator().zoom(-offsetCalc(e, actionData, coordField, e.deltaScale || 1), e.deltaScale || 1, axis.getZoomBounds());
                    if(!isDefined(viewport) || viewport.startValue.valueOf() !== zoom.min.valueOf() || viewport.endValue.valueOf() !== zoom.max.valueOf()) {
                        axis.handleZooming([zoom.min, zoom.max], { start: true, end: true });
                    }
                });
            }

            const rotated = chart.option("rotated");
            const actionData = zoomAndPan.actionData;
            const options = zoomAndPan.options;

            if(chart._lastRenderingTime < GESTURE_TIMEOUT) {
                zoomAxes(chart._argumentAxes, options.argumentAxis[actionField], rotated ? "y" : "x", e, actionData);
                zoomAxes(actionData.valueAxes, options.valueAxis[actionField], rotated ? "x" : "y", e, actionData);
                chart._requestChange(["VISUAL_RANGE"]);
            } else {
                const rootOffset = renderer.getRootOffset();
                chart._transform({
                    x: offsetCalc(e, actionData, "x", e.scale || 1) - rootOffset.left,
                    y: offsetCalc(e, actionData, "y", e.scale || 1) - rootOffset.top
                }, e.scale || 1);
            }
            actionData.offset = e.offset;
            actionData.center = centerCalc(e);
        }

        function finishAxesViewportChanging(zoomAndPan, actionField, e, offsetCalc, centerCalc, scaleCalc) {
            function zoomAxes(axes, criteria, coordField, e, actionData) {
                return criteria
                    && axes.map(axis => {
                        const d = new Deferred();

                        function getComplete(zoom) {
                            return function() {
                                axis.handleZooming([zoom.min, zoom.max], { start: true, startRange: actionData.startRanges[axis.name || DEFAULT_ARG_AXIS_NAME] });
                                d.resolve();
                            };
                        }

                        const scale = e.scale || 1;
                        const offset = offsetCalc(e, actionData, coordField, scale);
                        const zoom = axis.getTranslator().zoom(-offset, scale, axis.getZoomBounds());
                        if(renderer.animationEnabled() && (-offset !== zoom.translate || scale !== zoom.scale)) {
                            const translateDelta = -(offset + zoom.translate);
                            const scaleDelta = scale - zoom.scale;

                            renderer.root.animate({ _: 0 }, {
                                step: function(pos) {
                                    const translateValue = -offset - translateDelta * pos;
                                    const scaleValue = scale - scaleDelta * pos;

                                    const transform = { x: 0, y: 0 };
                                    transform[coordField] = -translateValue;
                                    chart._transform(transform, scaleValue);
                                }, complete: getComplete(zoom),
                                duration: 250
                            });
                        } else {
                            getComplete(zoom)();
                        }
                        return d;
                    })
                || [];
            }

            const rotated = chart.option("rotated");
            const actionData = zoomAndPan.actionData;
            const options = zoomAndPan.options;

            // TODO offsetCalc is always undefined
            if(offsetCalc && (!isDefined(chart._lastRenderingTime) || chart._lastRenderingTime >= GESTURE_TIMEOUT)) {
                when.apply(null,
                    zoomAxes([chart.getArgumentAxis()], options.argumentAxis[actionField], rotated ? "y" : "x", e, actionData)
                        .concat(zoomAxes(actionData.valueAxes, options.valueAxis[actionField], rotated ? "x" : "y", e, actionData)))
                    .done(function() {
                        chart._requestChange(["VISUAL_RANGE"]);
                    });
            } else {
                let axes = [];
                if(options.argumentAxis[actionField]) {
                    axes.push(chart.getArgumentAxis());
                }
                if(options.valueAxis[actionField]) {
                    axes = axes.concat(actionData.valueAxes);
                }

                axes.forEach(axis => {
                    const currentRange = actionData.startRanges[axis.name || DEFAULT_ARG_AXIS_NAME];
                    const zoomEndEvent = axis.getZoomEndEventArg(currentRange);

                    chart._eventTrigger(ZOOM_END, zoomEndEvent);

                    if(zoomEndEvent.cancel) {
                        axis._applyZooming(currentRange);
                    }
                });
                chart._requestChange(["VISUAL_RANGE"]);
            }
        }

        function prepareActionData(coords, action) {
            const axes = chart._argumentAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), coords));

            return {
                cancel: !axes.length || !isDefined(action),
                action: action,
                curAxisRect: axes.length && canvasToRect(axes[0].getCanvas()),
                valueAxes: axes.length && chart._valueAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), coords)),
                offset: { x: 0, y: 0 },
                center: coords,
                startRanges: {}
            };
        }

        function getPointerCoord(rect, e) {
            const rootOffset = renderer.getRootOffset();
            return {
                x: _min(_max(e.pageX - rootOffset.left, rect.x), rect.width + rect.x),
                y: _min(_max(e.pageY - rootOffset.top, rect.y), rect.height + rect.y)
            };
        }

        function calcCenterForPinch(e) {
            const rootOffset = renderer.getRootOffset();
            let x1 = e.pointers[0].pageX,
                x2 = e.pointers[1].pageX,
                y1 = e.pointers[0].pageY,
                y2 = e.pointers[1].pageY;
            return {
                x: _min(x1, x2) + _abs(x2 - x1) / 2 - rootOffset.left,
                y: _min(y1, y2) + _abs(y2 - y1) / 2 - rootOffset.top
            };
        }

        function calcCenterForDrag(e) {
            const rootOffset = renderer.getRootOffset();
            return {
                x: e.pageX - rootOffset.left,
                y: e.pageY - rootOffset.top
            };
        }

        function calcOffsetForDrag(e, actionData, coordField) {
            return e.offset[coordField] - actionData.offset[coordField];
        }

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
            chart._tracker.stopCurrentHandling();
        }

        const zoomAndPan = {
            dragStartHandler: function(e) {
                const options = zoomAndPan.options;
                const isTouch = e.pointerType === "touch";
                const wantPan = options.argumentAxis.pan || options.valueAxis.pan;
                const wantZoom = options.argumentAxis.zoom || options.valueAxis.zoom;
                const panKeyPressed = isDefined(options.panKey) && e[normalizeEnum(options.panKey) + "Key"];
                const dragToZoom = options.dragToZoom;

                let action;

                if(isTouch) {
                    if(options.allowGestures && wantPan) {
                        action = "pan";
                    }
                } else {
                    if(dragToZoom && wantPan && panKeyPressed) {
                        action = "pan";
                    } else if(!dragToZoom && wantPan) {
                        action = "pan";
                    } else if(dragToZoom && wantZoom) {
                        action = "zoom";
                    }
                }

                const actionData = prepareActionData(calcCenterForDrag(e), action);
                if(actionData.cancel) {
                    e.cancel = true;
                    return;
                }

                zoomAndPan.actionData = actionData;

                preventDefaults(e);

                if(action === "zoom") {
                    actionData.startCoords = getPointerCoord(actionData.curAxisRect, e);
                    actionData.rect = renderer.rect(0, 0, 0, 0).attr(options.dragBoxStyle).append(renderer.root);
                } else {
                    startAxesViewportChanging(zoomAndPan, "pan", e);
                }
            },
            dragHandler: function(e) {
                const rotated = chart.option("rotated");
                const options = zoomAndPan.options;
                const actionData = zoomAndPan.actionData;

                if(!actionData) {
                    return;
                }
                preventDefaults(e);

                if(actionData.action === "zoom") {
                    const curCanvas = actionData.curAxisRect,
                        startCoords = actionData.startCoords,
                        curCoords = getPointerCoord(curCanvas, e),
                        zoomArg = options.argumentAxis.zoom,
                        zoomVal = options.valueAxis.zoom;

                    const rect = {
                        x: _min(startCoords.x, curCoords.x),
                        y: _min(startCoords.y, curCoords.y),
                        width: _abs(startCoords.x - curCoords.x),
                        height: _abs(startCoords.y - curCoords.y)
                    };

                    if(!zoomArg || !zoomVal) {
                        if(!zoomArg && !rotated || !zoomVal && rotated) {
                            rect.x = curCanvas.x;
                            rect.width = curCanvas.width;
                        } else {
                            rect.y = curCanvas.y;
                            rect.height = curCanvas.height;
                        }
                    }

                    actionData.rect.attr(rect);
                } else if(actionData.action === "pan") {
                    axesViewportChanging(zoomAndPan, "pan", e, calcOffsetForDrag, e => e.offset);
                }
            },
            dragEndHandler: function(e) {
                const rotated = chart.option("rotated");
                const options = zoomAndPan.options;
                const actionData = zoomAndPan.actionData;

                if(!actionData) {
                    return;
                }

                preventDefaults(e);
                if(actionData.action === "zoom") {
                    function zoomAxes(axes, criteria, coordField, startCoords, curCoords, onlyAxisToNotify) {
                        criteria && axes.forEach(axis => {
                            const silent = onlyAxisToNotify && (axis !== onlyAxisToNotify),
                                tr = axis.getTranslator();

                            axis.handleZooming([tr.from(startCoords[coordField]), tr.from(curCoords[coordField])], { start: !!silent, end: !!silent });
                        });
                    }

                    const curCoords = getPointerCoord(actionData.curAxisRect, e);
                    zoomAxes(chart._argumentAxes, options.argumentAxis.zoom, rotated ? "y" : "x", actionData.startCoords, curCoords, chart._argumentAxes[chart._displayedArgumentAxisIndex]);
                    zoomAxes(actionData.valueAxes, options.valueAxis.zoom, rotated ? "x" : "y", actionData.startCoords, curCoords);

                    chart._requestChange(["VISUAL_RANGE"]);

                    actionData.rect.dispose();
                } else if(actionData.action === "pan") {
                    finishAxesViewportChanging(zoomAndPan, "pan", e);
                }
                zoomAndPan.actionData = null;
            },
            pinchStartHandler: function(e) {
                preventDefaults(e);

                const actionData = prepareActionData(calcCenterForPinch(e), "zoom");
                if(actionData.cancel) {
                    e.cancel = true;
                    return;
                }
                zoomAndPan.actionData = actionData;
                startAxesViewportChanging(zoomAndPan, "zoom", e);
            },
            pinchHandler: function(e) {
                preventDefaults(e);
                axesViewportChanging(zoomAndPan, "zoom", e,
                    (e, actionData, coordField, scale) => calcCenterForPinch(e)[coordField] - actionData.center[coordField] + (actionData.center[coordField] - actionData.center[coordField] * scale),
                    calcCenterForPinch);
            },
            pinchEndHandler: function(e) {
                preventDefaults(e);
                finishAxesViewportChanging(zoomAndPan, "zoom", e);
                zoomAndPan.actionData = null;
            },

            cleanup: function() {
                renderer.root.off(EVENTS_NS);
                zoomAndPan.actionData && zoomAndPan.actionData.rect && zoomAndPan.actionData.rect.dispose();
                zoomAndPan.actionData = null;
            },
            setup: function(options) {
                zoomAndPan.cleanup();

                renderer.root.css({ "touch-action": "", "-ms-touch-action": "" });
                if(options.argumentAxis.none && options.valueAxis.none) {
                    return;
                }
                zoomAndPan.options = options;

                const rotated = chart.option("rotated");

                if((options.argumentAxis.zoom || options.valueAxis.zoom) && options.allowMouseWheel) {
                    renderer.root.on(wheelEvent.name + EVENTS_NS, function(e) {
                        preventDefaults(e); // T249548

                        function zoomAxes(axes, coord, delta, onlyAxisToNotify) {
                            axes.forEach(axis => {
                                const silent = onlyAxisToNotify && (axis !== onlyAxisToNotify),
                                    translator = axis.getTranslator(),
                                    scale = translator.getMinScale(delta > 0),
                                    zoom = translator.zoom(-(coord - coord * scale), scale, axis.getZoomBounds());

                                axis.handleZooming([zoom.min, zoom.max], { start: !!silent, end: !!silent });
                            });
                        }

                        const coords = calcCenterForDrag(e);
                        if(e.shiftKey && options.valueAxis.zoom) {
                            const targetAxes = chart._valueAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), coords));
                            zoomAxes(targetAxes, rotated ? coords.x : coords.y, e.delta);
                        } else if(options.argumentAxis.zoom) {
                            zoomAxes(chart._argumentAxes, rotated ? coords.y : coords.x, e.delta, chart._argumentAxes[chart._displayedArgumentAxisIndex]);
                        }

                        chart._requestChange(["VISUAL_RANGE"]);
                    });
                }
                if(options.allowGestures) {
                    if(options.argumentAxis.zoom || options.valueAxis.zoom) {
                        renderer.root
                            .on(PINCH_START_EVENT_NAME, { immediate: true }, zoomAndPan.pinchStartHandler)
                            .on(PINCH_EVENT_NAME, zoomAndPan.pinchHandler)
                            .on(PINCH_END_EVENT_NAME, zoomAndPan.pinchEndHandler);
                    }

                    let touchAction = "none";
                    if(!options.argumentAxis.zoom && !options.valueAxis.zoom) {
                        touchAction = "pinch-zoom";
                    }

                    if(!options.argumentAxis.pan && !options.valueAxis.pan) {
                        touchAction = "pan-x pan-y";
                    }
                    renderer.root.css({ "touch-action": touchAction, "-ms-touch-action": touchAction });
                }

                renderer.root
                    .on(DRAG_START_EVENT_NAME, { direction: getDragDirection(options, rotated), immediate: true }, zoomAndPan.dragStartHandler)
                    .on(DRAG_EVENT_NAME, zoomAndPan.dragHandler)
                    .on(DRAG_END_EVENT_NAME, zoomAndPan.dragEndHandler);


                if(options.argumentAxis.pan) {
                    renderer.root
                        .on(SCROLL_BAR_START_EVENT_NAME, function(e) {
                            zoomAndPan.actionData = {
                                valueAxes: [],
                                startRanges: {},
                                offset: { x: 0, y: 0 },
                                center: { x: 0, y: 0 }
                            };
                            preventDefaults(e);
                            startAxesViewportChanging(zoomAndPan, "pan", e);
                        })
                        .on(SCROLL_BAR_MOVE_EVENT_NAME, function(e) {
                            preventDefaults(e);
                            axesViewportChanging(zoomAndPan, "pan", e, calcOffsetForDrag, e => e.offset);
                        })
                        .on(SCROLL_BAR_END_EVENT_NAME, function(e) {
                            preventDefaults(e);
                            finishAxesViewportChanging(zoomAndPan, "pan", e);
                            zoomAndPan.actionData = null;
                        });
                }
            }
        };

        this._zoomAndPan = zoomAndPan;
    },
    members: {
        _setupZoomAndPan: function() {
            const theme = this._themeManager.theme("zoomAndPan");
            let userOptions = this.option("zoomAndPan");

            if(!isDefined(userOptions)) {
                const zoomingMode = normalizeEnum(this._themeManager.getOptions("zoomingMode"));
                const scrollingMode = normalizeEnum(this._themeManager.getOptions("scrollingMode"));
                const allowZoom = ['all', 'mouse', 'touch'].indexOf(zoomingMode) !== -1;
                const allowScroll = ['all', 'mouse', 'touch'].indexOf(scrollingMode) !== -1;

                userOptions = {
                    argumentAxis: (allowZoom && allowScroll) ? "both" : (allowZoom ? "zoom" : (allowScroll ? "pan" : "none")),
                    allowMouseWheel: zoomingMode === "all" || zoomingMode === "mouse",
                    allowGestures: zoomingMode === "all" || zoomingMode === "touch" || scrollingMode === "all" || scrollingMode === "touch"
                };
            }

            const options = extend(true, { dragBoxStyle: {} }, theme, userOptions);

            this._zoomAndPan.setup({
                valueAxis: parseOption(options.valueAxis),
                argumentAxis: parseOption(options.argumentAxis),
                dragToZoom: options.dragToZoom,
                dragBoxStyle: {
                    class: "dxc-shutter",
                    fill: options.dragBoxStyle.color,
                    opacity: options.dragBoxStyle.opacity
                },
                panKey: options.panKey,
                allowMouseWheel: options.allowMouseWheel,
                allowGestures: options.allowGestures
            });
        },
    },
    dispose: function() {
        this._zoomAndPan.cleanup();
    },
    customize: function(constructor) {
        constructor.addChange({
            code: "ZOOM_AND_PAN",
            handler: function() {
                this._setupZoomAndPan();
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: "zoomAndPan"
        });
    }
};
