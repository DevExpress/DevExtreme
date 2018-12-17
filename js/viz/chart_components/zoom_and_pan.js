
import { isDefined } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { normalizeEnum, getVizRangeObject } from "../core/utils";
import { name as wheelEvent } from "../../events/core/wheel";
import transformEvents from "../../events/transform";
import dragEvents from "../../events/drag";

const EVENTS_NS = ".zoomAndPanNS";

const DRAG_START_EVENT_NAME = dragEvents.start + EVENTS_NS;
const DRAG_EVENT_NAME = dragEvents.move + EVENTS_NS;
const DRAG_END_EVENT_NAME = dragEvents.end + EVENTS_NS;

const PINCH_START_EVENT_NAME = transformEvents["pinchstart"] + EVENTS_NS;
const PINCH_EVENT_NAME = transformEvents["pinch"] + EVENTS_NS;
const PINCH_END_EVENT_NAME = transformEvents["pinchend"] + EVENTS_NS;

const SCROLL_BAR_START_EVENT_NAME = "dxc-scroll-start" + EVENTS_NS;
const SCROLL_BAR_MOVE_EVENT_NAME = "dxc-scroll-move" + EVENTS_NS;
const SCROLL_BAR_END_EVENT_NAME = "dxc-scroll-end" + EVENTS_NS;

const GESTURE_TIMEOUT = 300;
const MIN_DRAG_DELTA = 5;

const _min = Math.min;
const _max = Math.max;
const _abs = Math.abs;

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

        function cancelEvent(e) {
            if(e.cancelable) {
                e.cancel = true;
                e.originalEvent && (e.originalEvent.cancel = true);
            }
        }

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

            axes.some(axis => {
                return axis.handleZooming(null, { end: true }, e, actionField).isPrevented;
            }) && cancelEvent(e);
        }

        function axesViewportChanging(zoomAndPan, actionField, e, offsetCalc, centerCalc) {
            function zoomAxes(axes, criteria, coordField, e, actionData) {
                let zoom = { zoomed: false };
                criteria && axes.forEach(axis => {
                    const options = axis.getOptions();
                    const viewport = axis.visualRange();
                    const scale = axis.getTranslator().getEventScale(e);
                    const translate = -offsetCalc(e, actionData, coordField, scale);
                    zoom = extend(true, zoom, axis.getTranslator().zoom(translate, scale, axis.getZoomBounds()));
                    const range = axis.adjustRange(getVizRangeObject([zoom.min, zoom.max]));
                    const isMinZoom = axis.isZoomingLowerLimitOvercome(actionField, scale, range);

                    if(!isDefined(viewport) ||
                        viewport.startValue.valueOf() !== range.startValue.valueOf() ||
                        viewport.endValue.valueOf() !== range.endValue.valueOf()) {
                        axis.handleZooming(isMinZoom ? null : range, { start: true, end: true }, e, actionField);
                        if(!isMinZoom) {
                            zoom.zoomed = true;
                            zoom.deltaTranslate = translate - zoom.translate;
                        }
                    } else if(e.pointerType === "touch" && options.type === "discrete") {
                        const isMinPosition = axis.isExtremePosition(false);
                        const isMaxPosition = axis.isExtremePosition(true);
                        const zoomInEnabled = scale > 1 && !isMinZoom;
                        const zoomOutEnabled = scale < 1 && (!isMinPosition || !isMaxPosition);
                        const panningEnabled = scale === 1 && !(isMinPosition && (translate < 0 && !options.inverted || translate > 0 && options.inverted) ||
                            isMaxPosition && (translate > 0 && !options.inverted || translate < 0 && options.inverted));

                        zoom.enabled = zoomInEnabled || zoomOutEnabled || panningEnabled;
                    }
                });
                return zoom;
            }

            function storeOffset(e, actionData, zoom, coordField) {
                if(zoom.zoomed) {
                    actionData.offset[coordField] = (e.offset ? e.offset[coordField] : actionData.offset[coordField]) + zoom.deltaTranslate;
                }
            }

            function storeCenter(center, actionData, zoom, coordField) {
                if(zoom.zoomed) {
                    actionData.center[coordField] = center[coordField] + zoom.deltaTranslate;
                }
            }

            const rotated = chart.option("rotated");
            const actionData = zoomAndPan.actionData;
            const options = zoomAndPan.options;
            let argZoom = {};
            let valZoom = {};

            if(!actionData.fallback) {
                argZoom = zoomAxes(chart._argumentAxes, options.argumentAxis[actionField], rotated ? "y" : "x", e, actionData);
                valZoom = zoomAxes(actionData.valueAxes, options.valueAxis[actionField], rotated ? "x" : "y", e, actionData);
                chart._requestChange(["VISUAL_RANGE"]);
                storeOffset(e, actionData, argZoom, rotated ? "y" : "x");
                storeOffset(e, actionData, valZoom, rotated ? "x" : "y");
            }

            const center = centerCalc(e);
            storeCenter(center, actionData, argZoom, rotated ? "y" : "x");
            storeCenter(center, actionData, valZoom, rotated ? "x" : "y");
            if(!argZoom.zoomed && !valZoom.zoomed) {
                actionData.center = center;
            }
            return argZoom.zoomed || valZoom.zoomed || actionData.fallback || argZoom.enabled || valZoom.enabled;
        }

        function finishAxesViewportChanging(zoomAndPan, actionField, e, offsetCalc) {
            function zoomAxes(axes, criteria, coordField, e, actionData, onlyAxisToNotify) {
                let zoomStarted = false;
                criteria && axes.forEach(axis => {
                    const silent = onlyAxisToNotify && (axis !== onlyAxisToNotify);
                    const scale = e.scale || 1;
                    const zoom = axis.getTranslator().zoom(-offsetCalc(e, actionData, coordField, scale), scale, axis.getZoomBounds());
                    const range = { startValue: zoom.min, endValue: zoom.max };
                    const isMinZoom = axis.isZoomingLowerLimitOvercome(actionField, scale, range);

                    axis.handleZooming(isMinZoom ? null : range, { start: true, end: silent }, e, actionField);
                    isMinZoom ? axis.handleZoomEnd() : (zoomStarted = true);
                });
                return zoomStarted;
            }

            const rotated = chart.option("rotated");
            const actionData = zoomAndPan.actionData;
            const options = zoomAndPan.options;
            let zoomStarted = true;

            if(actionData.fallback) {
                zoomStarted &= zoomAxes(chart._argumentAxes, options.argumentAxis[actionField], rotated ? "y" : "x", e, actionData, chart.getArgumentAxis());
                zoomStarted |= zoomAxes(actionData.valueAxes, options.valueAxis[actionField], rotated ? "x" : "y", e, actionData);
            } else {
                let axes = [];
                if(options.argumentAxis[actionField]) {
                    axes.push(chart.getArgumentAxis());
                }
                if(options.valueAxis[actionField]) {
                    axes = axes.concat(actionData.valueAxes);
                }

                axes.forEach(axis => {
                    axis.handleZooming(null, { start: true }, e, actionField);
                });
            }
            zoomStarted && chart._requestChange(["VISUAL_RANGE"]);
        }

        function prepareActionData(coords, action) {
            const axes = chart._argumentAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), coords));

            return {
                fallback: chart._lastRenderingTime > GESTURE_TIMEOUT,
                cancel: !axes.length || !isDefined(action),
                action: action,
                curAxisRect: axes.length && canvasToRect(axes[0].getCanvas()),
                valueAxes: axes.length && chart._valueAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), coords)),
                offset: { x: 0, y: 0 },
                center: coords,
                startCenter: coords
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
                    if(options.allowTouchGestures && wantPan) {
                        const cancelPanning = !zoomAndPan.panningVisualRangeEnabled() || zoomAndPan.skipEvent;
                        action = cancelPanning ? null : "pan";
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
                    zoomAndPan.skipEvent = false;
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
                const isTouch = e.pointerType === "touch";

                if(!actionData || isTouch && !zoomAndPan.panningVisualRangeEnabled()) {
                    return;
                }

                if(actionData.action === "zoom") {
                    preventDefaults(e);

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
                    const viewportChanged = axesViewportChanging(zoomAndPan, "pan", e, calcOffsetForDrag, e => e.offset);

                    if(isTouch) {
                        zoomAndPan.defineTouchBehavior(!viewportChanged, e);
                        if(!viewportChanged && zoomAndPan.panningVisualRangeEnabled()) {
                            cancelEvent(e);
                            zoomAndPan.skipEvent = true;
                            zoomAndPan.actionData = null;
                        }
                    } else {
                        preventDefaults(e);
                    }
                }
            },
            dragEndHandler: function(e) {
                const rotated = chart.option("rotated");
                const options = zoomAndPan.options;
                const actionData = zoomAndPan.actionData;
                const isTouch = e.pointerType === "touch";

                if(!actionData || isTouch && !zoomAndPan.panningVisualRangeEnabled()) {
                    return;
                }

                (!isTouch || !zoomAndPan.actionData.isNative) && preventDefaults(e);
                if(actionData.action === "zoom") {
                    function zoomAxes(axes, criteria, coordField, startCoords, curCoords, onlyAxisToNotify) {
                        const curCoord = curCoords[coordField];
                        const startCoord = startCoords[coordField];
                        let zoomStarted = false;
                        if(_abs(curCoord - startCoord) > MIN_DRAG_DELTA) {
                            criteria && axes.forEach(axis => {
                                const silent = onlyAxisToNotify && (axis !== onlyAxisToNotify),
                                    tr = axis.getTranslator(),
                                    range = [tr.from(startCoord), tr.from(curCoord)],
                                    isMinZoom = axis.isZoomingLowerLimitOvercome(actionData.action, tr.getMinScale(true), range);

                                axis.handleZooming(isMinZoom ? null : range, { start: !!silent, end: !!silent }, e, actionData.action);
                                isMinZoom ? axis.handleZoomEnd() : (zoomStarted = true);
                            });
                        }
                        return zoomStarted;
                    }

                    const curCoords = getPointerCoord(actionData.curAxisRect, e);
                    const valueAxesZoomed = zoomAxes(chart._argumentAxes, options.argumentAxis.zoom, rotated ? "y" : "x", actionData.startCoords, curCoords, chart.getArgumentAxis());
                    const argumentAxesZoomed = zoomAxes(actionData.valueAxes, options.valueAxis.zoom, rotated ? "x" : "y", actionData.startCoords, curCoords);

                    if(valueAxesZoomed || argumentAxesZoomed) {
                        chart._requestChange(["VISUAL_RANGE"]);
                    }

                    actionData.rect.dispose();
                } else if(actionData.action === "pan") {
                    finishAxesViewportChanging(zoomAndPan, "pan", e, calcOffsetForDrag);
                }
                zoomAndPan.actionData = null;
            },
            pinchStartHandler: function(e) {
                preventDefaults(e);

                const actionData = prepareActionData(calcCenterForPinch(e), "zoom");
                actionData.isNative = !zoomAndPan.panningVisualRangeEnabled();
                if(actionData.cancel) {
                    cancelEvent(e);
                    return;
                }
                zoomAndPan.actionData = actionData;
                startAxesViewportChanging(zoomAndPan, "zoom", e);
            },
            pinchHandler: function(e) {
                if(zoomAndPan.actionData && zoomAndPan.actionData.isNative && e.deltaScale <= 1) {
                    zoomAndPan.defineTouchBehavior(true, e);
                    zoomAndPan.actionData = null;
                }
                if(!zoomAndPan.actionData) {
                    return;
                }
                const viewportChanged = axesViewportChanging(zoomAndPan, "zoom", e,
                    (e, actionData, coordField, scale) => calcCenterForPinch(e)[coordField] - actionData.center[coordField] + (actionData.center[coordField] - actionData.center[coordField] * scale),
                    calcCenterForPinch);
                zoomAndPan.defineTouchBehavior(!viewportChanged, e);
            },
            pinchEndHandler: function(e) {
                if(!zoomAndPan.actionData) {
                    return;
                }

                !zoomAndPan.actionData.isNative && preventDefaults(e);
                finishAxesViewportChanging(zoomAndPan, "zoom", e,
                    (e, actionData, coordField, scale) => actionData.center[coordField] - actionData.startCenter[coordField] + (actionData.startCenter[coordField] - actionData.startCenter[coordField] * scale));
                zoomAndPan.actionData = null;
            },
            cleanup: function() {
                renderer.root.off(EVENTS_NS);
                zoomAndPan.actionData && zoomAndPan.actionData.rect && zoomAndPan.actionData.rect.dispose();
                zoomAndPan.actionData = null;
                renderer.root.css({ "touch-action": "", "-ms-touch-action": "" });
            },
            setup: function(options) {
                zoomAndPan.cleanup();
                if(!options.argumentAxis.pan) {
                    renderer.root.on(SCROLL_BAR_START_EVENT_NAME, cancelEvent);
                }
                if(options.argumentAxis.none && options.valueAxis.none) {
                    return;
                }
                zoomAndPan.options = options;

                const rotated = chart.option("rotated");

                if((options.argumentAxis.zoom || options.valueAxis.zoom) && options.allowMouseWheel) {
                    renderer.root.on(wheelEvent + EVENTS_NS, function(e) {
                        function zoomAxes(axes, coord, delta, onlyAxisToNotify) {
                            let zoomStarted = false;
                            axes.forEach(axis => {
                                const silent = onlyAxisToNotify && (axis !== onlyAxisToNotify),
                                    translator = axis.getTranslator(),
                                    scale = translator.getMinScale(delta > 0),
                                    zoom = translator.zoom(-(coord - coord * scale), scale, axis.getZoomBounds()),
                                    range = { startValue: zoom.min, endValue: zoom.max },
                                    isMinZoom = axis.isZoomingLowerLimitOvercome("zoom", scale, range);

                                axis.handleZooming(isMinZoom ? null : range, { start: !!silent, end: !!silent }, e, "zoom");
                                isMinZoom ? axis.handleZoomEnd() : (zoomStarted = true);
                            });

                            return !!zoomStarted;
                        }

                        const coords = calcCenterForDrag(e);
                        let axesZoomed = false;
                        if(options.valueAxis.zoom) {
                            let targetAxes = chart._valueAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), coords));

                            if(targetAxes.length === 0) {
                                const targetCanvas = chart._valueAxes.reduce((r, axis) => {
                                    if(!r && axis.coordsIn(coords.x, coords.y)) {
                                        r = axis.getCanvas();
                                    }
                                    return r;
                                }, null);
                                if(targetCanvas) {
                                    targetAxes = chart._valueAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), {
                                        x: targetCanvas.left,
                                        y: targetCanvas.top
                                    }));
                                }
                            }

                            axesZoomed |= zoomAxes(targetAxes, rotated ? coords.x : coords.y, e.delta);
                        }
                        if(options.argumentAxis.zoom) {
                            const canZoom = chart._argumentAxes.some(axis => {
                                if(checkCoords(canvasToRect(axis.getCanvas()), coords)
                                    || axis.coordsIn(coords.x, coords.y)) {
                                    return true;
                                }
                                return false;
                            });
                            axesZoomed |= canZoom && zoomAxes(chart._argumentAxes, rotated ? coords.y : coords.x, e.delta, chart.getArgumentAxis());
                        }

                        if(axesZoomed) {
                            chart._requestChange(["VISUAL_RANGE"]);
                            zoomAndPan.panningVisualRangeEnabled() && preventDefaults(e); // T249548
                        }
                    });
                }
                if(options.allowTouchGestures) {
                    if(options.argumentAxis.zoom || options.valueAxis.zoom) {
                        renderer.root
                            .on(PINCH_START_EVENT_NAME, { immediate: true }, zoomAndPan.pinchStartHandler)
                            .on(PINCH_EVENT_NAME, zoomAndPan.pinchHandler)
                            .on(PINCH_END_EVENT_NAME, zoomAndPan.pinchEndHandler);
                    }

                    zoomAndPan.setTouchAction(false);
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
                            finishAxesViewportChanging(zoomAndPan, "pan", e, calcOffsetForDrag);
                            zoomAndPan.actionData = null;
                        });
                }
            },

            defineTouchBehavior: function(isDefault, e) {
                zoomAndPan.setTouchAction(isDefault);
                zoomAndPan.actionData && (zoomAndPan.actionData.isNative = isDefault);
                if(!isDefault) {
                    preventDefaults(e);
                }
            },

            setTouchAction: function(isDefault) {
                const options = zoomAndPan.options;
                if(!options.allowTouchGestures) {
                    return;
                }

                let touchAction = isDefault ? "" : "none";
                if(!isDefault) {
                    if(!options.argumentAxis.zoom && !options.valueAxis.zoom) {
                        touchAction = "pinch-zoom";
                    }

                    if(!options.argumentAxis.pan && !options.valueAxis.pan) {
                        touchAction = "pan-x pan-y";
                    }
                }
                renderer.root.css({ "touch-action": touchAction, "-ms-touch-action": touchAction });
            },

            panningVisualRangeEnabled: function() {
                const enablePanByValueAxis =
                    chart._valueAxes.some(axis => !axis.isExtremePosition(false) || !axis.isExtremePosition(true));
                const enablePanByArgumentAxis =
                    chart._argumentAxes.some(axis => !axis.isExtremePosition(false) || !axis.isExtremePosition(true));
                return enablePanByValueAxis || enablePanByArgumentAxis;
            }
        };

        this._zoomAndPan = zoomAndPan;
    },
    members: {
        _setupZoomAndPan: function() {
            this._zoomAndPan.setup(this._themeManager.getOptions("zoomAndPan"));
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
