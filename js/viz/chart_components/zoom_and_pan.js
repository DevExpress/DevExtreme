
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { normalizeEnum, getVizRangeObject } from '../core/utils';
import { name as wheelEvent } from '../../events/core/wheel';
import * as transformEvents from '../../events/transform';
import { start as dragEventStart, move as dragEventMove, end as dragEventEnd } from '../../events/drag';

const EVENTS_NS = '.zoomAndPanNS';

const DRAG_START_EVENT_NAME = dragEventStart + EVENTS_NS;
const DRAG_EVENT_NAME = dragEventMove + EVENTS_NS;
const DRAG_END_EVENT_NAME = dragEventEnd + EVENTS_NS;

const PINCH_START_EVENT_NAME = transformEvents['pinchstart'] + EVENTS_NS;
const PINCH_EVENT_NAME = transformEvents['pinch'] + EVENTS_NS;
const PINCH_END_EVENT_NAME = transformEvents['pinchend'] + EVENTS_NS;

const SCROLL_BAR_START_EVENT_NAME = 'dxc-scroll-start' + EVENTS_NS;
const SCROLL_BAR_MOVE_EVENT_NAME = 'dxc-scroll-move' + EVENTS_NS;
const SCROLL_BAR_END_EVENT_NAME = 'dxc-scroll-end' + EVENTS_NS;

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
    const x = coords.x;
    const y = coords.y;
    return x >= rect.x && x <= (rect.width + rect.x)
        && y >= rect.y && y <= (rect.height + rect.y);
}

function sortAxes(axes, onlyAxisToNotify) {
    if(onlyAxisToNotify) {
        axes = axes.sort((a, b) => {
            if(a === onlyAxisToNotify) {
                return -1;
            }
            if(b === onlyAxisToNotify) {
                return 1;
            }
            return 0;
        });
    }

    return axes;
}

function isNotEmptyAxisBusinessRange(axis) {
    return !axis.getTranslator().getBusinessRange().isEmpty();
}

function axisZoom(axis, onlyAxisToNotify, getRange, getParameters, actionField, scale, e) {
    const silent = onlyAxisToNotify && (axis !== onlyAxisToNotify);
    const range = getRange(axis);

    const { stopInteraction, correctedRange } = axis.checkZoomingLowerLimitOvercome(actionField, scale, range);

    const result = axis.handleZooming(stopInteraction ? null : correctedRange, getParameters(silent), e, actionField);
    stopInteraction && axis.handleZoomEnd();
    return { stopInteraction, result };
}

export default {
    name: 'zoom_and_pan',
    init: function() {
        const chart = this;
        const renderer = this._renderer;

        function cancelEvent(e) {
            if(e.originalEvent) {
                cancelEvent(e.originalEvent);
            }
            if(e.cancelable !== false) {
                e.cancel = true;
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

            axes.reduce((isPrevented, axis) => {
                if(isPrevented) {
                    return isPrevented;
                }
                if(isNotEmptyAxisBusinessRange(axis)) {
                    return axis.handleZooming(null, { end: true }, e, actionField).isPrevented;
                }
                return isPrevented;
            }, false) && cancelEvent(e);
        }

        function axesViewportChanging(zoomAndPan, actionField, e, offsetCalc, centerCalc) {
            function zoomAxes(axes, criteria, coordField, e, actionData) {
                let zoom = { zoomed: false };
                criteria && axes.filter(isNotEmptyAxisBusinessRange).forEach(axis => {
                    const options = axis.getOptions();
                    const viewport = axis.visualRange();
                    const scale = axis.getTranslator().getEventScale(e);
                    const translate = -offsetCalc(e, actionData, coordField, scale);
                    zoom = extend(true, zoom, axis.getTranslator().zoom(translate, scale, axis.getZoomBounds()));
                    const range = axis.adjustRange(getVizRangeObject([zoom.min, zoom.max]));
                    const { stopInteraction, correctedRange } = axis.checkZoomingLowerLimitOvercome(actionField, scale, range);

                    if(!isDefined(viewport) ||
                        viewport.startValue.valueOf() !== correctedRange.startValue.valueOf() ||
                        viewport.endValue.valueOf() !== correctedRange.endValue.valueOf()) {
                        axis.handleZooming(stopInteraction ? null : correctedRange, { start: true, end: true }, e, actionField);
                        if(!stopInteraction) {
                            zoom.zoomed = true;
                            zoom.deltaTranslate = translate - zoom.translate;
                        }
                    } else if(e.pointerType === 'touch' && options.type === 'discrete') {
                        const isMinPosition = axis.isExtremePosition(false);
                        const isMaxPosition = axis.isExtremePosition(true);
                        const zoomInEnabled = scale > 1 && !stopInteraction;
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

            const rotated = chart.option('rotated');
            const actionData = zoomAndPan.actionData;
            const options = zoomAndPan.options;
            let argZoom = {};
            let valZoom = {};

            if(!actionData.fallback) {
                argZoom = zoomAxes(chart._argumentAxes, options.argumentAxis[actionField], rotated ? 'y' : 'x', e, actionData);
                valZoom = zoomAxes(actionData.valueAxes, options.valueAxis[actionField], rotated ? 'x' : 'y', e, actionData);
                chart._requestChange(['VISUAL_RANGE']);
                storeOffset(e, actionData, argZoom, rotated ? 'y' : 'x');
                storeOffset(e, actionData, valZoom, rotated ? 'x' : 'y');
            }

            const center = centerCalc(e);
            storeCenter(center, actionData, argZoom, rotated ? 'y' : 'x');
            storeCenter(center, actionData, valZoom, rotated ? 'x' : 'y');
            if(!argZoom.zoomed && !valZoom.zoomed) {
                actionData.center = center;
            }
            return argZoom.zoomed || valZoom.zoomed || actionData.fallback || argZoom.enabled || valZoom.enabled;
        }

        function finishAxesViewportChanging(zoomAndPan, actionField, e, offsetCalc) {
            function zoomAxes(axes, criteria, coordField, actionData, onlyAxisToNotify) {
                let zoomStarted = false;
                const scale = e.scale || 1;
                const getRange = (axis) => {
                    const zoom = axis.getTranslator().zoom(-offsetCalc(e, actionData, coordField, scale), scale, axis.getZoomBounds());
                    return { startValue: zoom.min, endValue: zoom.max };
                };
                const getParameters = (silent) => {
                    return { start: true, end: silent };
                };
                criteria && axes.forEach(axis => {
                    zoomStarted = !axisZoom(axis, onlyAxisToNotify, getRange, getParameters, actionField, scale, e).stopInteraction;
                });
                return zoomStarted;
            }

            const rotated = chart.option('rotated');
            const actionData = zoomAndPan.actionData;
            const options = zoomAndPan.options;
            let zoomStarted = true;

            if(actionData.fallback) {
                zoomStarted &= zoomAxes(chart._argumentAxes, options.argumentAxis[actionField], rotated ? 'y' : 'x', actionData, chart.getArgumentAxis());
                zoomStarted |= zoomAxes(actionData.valueAxes, options.valueAxis[actionField], rotated ? 'x' : 'y', actionData);
            } else {
                let axes = [];
                if(options.argumentAxis[actionField]) {
                    axes.push(chart.getArgumentAxis());
                }
                if(options.valueAxis[actionField]) {
                    axes = axes.concat(actionData.valueAxes);
                }

                axes.filter(isNotEmptyAxisBusinessRange).forEach(axis => {
                    axis.handleZooming(null, { start: true }, e, actionField);
                });
                zoomStarted = zoomStarted && axes.length;
            }
            zoomStarted && chart._requestChange(['VISUAL_RANGE']);
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
            const x1 = e.pointers[0].pageX;
            const x2 = e.pointers[1].pageX;
            const y1 = e.pointers[0].pageY;
            const y2 = e.pointers[1].pageY;
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
            if(e.cancelable !== false) {
                e.preventDefault();
                e.stopPropagation();
            }

            chart._stopCurrentHandling();
        }

        const zoomAndPan = {
            dragStartHandler: function(e) {
                const options = zoomAndPan.options;
                const isTouch = e.pointerType === 'touch';
                const wantPan = options.argumentAxis.pan || options.valueAxis.pan;
                const wantZoom = options.argumentAxis.zoom || options.valueAxis.zoom;
                const panKeyPressed = isDefined(options.panKey) && e[normalizeEnum(options.panKey) + 'Key'];
                const dragToZoom = options.dragToZoom;

                let action;

                e._cancelPreventDefault = true;
                if(isTouch) {
                    if(options.allowTouchGestures && wantPan) {
                        const cancelPanning = !zoomAndPan.panningVisualRangeEnabled() || zoomAndPan.skipEvent;
                        action = cancelPanning ? null : 'pan';
                    }
                } else {
                    if(dragToZoom && wantPan && panKeyPressed) {
                        action = 'pan';
                    } else if(!dragToZoom && wantPan) {
                        action = 'pan';
                    } else if(dragToZoom && wantZoom) {
                        action = 'zoom';
                    }
                }

                const actionData = prepareActionData(calcCenterForDrag(e), action);
                if(actionData.cancel) {
                    zoomAndPan.skipEvent = false;
                    if(e.cancelable !== false) {
                        e.cancel = true;
                    }
                    return;
                }

                zoomAndPan.actionData = actionData;

                if(action === 'zoom') {
                    actionData.startCoords = getPointerCoord(actionData.curAxisRect, e);
                    actionData.rect = renderer.rect(0, 0, 0, 0).attr(options.dragBoxStyle).append(renderer.root);
                } else {
                    startAxesViewportChanging(zoomAndPan, 'pan', e);
                }
            },
            dragHandler: function(e) {
                const rotated = chart.option('rotated');
                const options = zoomAndPan.options;
                const actionData = zoomAndPan.actionData;
                const isTouch = e.pointerType === 'touch';
                e._cancelPreventDefault = true;

                if(!actionData || isTouch && !zoomAndPan.panningVisualRangeEnabled()) {
                    return;
                }

                if(actionData.action === 'zoom') {
                    preventDefaults(e);

                    const curCanvas = actionData.curAxisRect;
                    const startCoords = actionData.startCoords;
                    const curCoords = getPointerCoord(curCanvas, e);
                    const zoomArg = options.argumentAxis.zoom;
                    const zoomVal = options.valueAxis.zoom;

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
                } else if(actionData.action === 'pan') {
                    axesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag, e => e.offset);
                    const deltaOffsetY = Math.abs(e.offset.y - actionData.offset.y);
                    const deltaOffsetX = Math.abs(e.offset.x - actionData.offset.x);
                    if(isTouch &&
                        (deltaOffsetY > MIN_DRAG_DELTA && deltaOffsetY > Math.abs(actionData.offset.x)
                        || deltaOffsetX > MIN_DRAG_DELTA && deltaOffsetX > Math.abs(actionData.offset.y))
                    ) {
                        return;
                    }
                    preventDefaults(e);
                }
            },
            dragEndHandler: function(e) {
                const rotated = chart.option('rotated');
                const options = zoomAndPan.options;
                const actionData = zoomAndPan.actionData;
                const isTouch = e.pointerType === 'touch';

                const panIsEmpty = actionData && actionData.action === 'pan' && !actionData.fallback && actionData.offset.x === 0 && actionData.offset.y === 0;

                if(!actionData || isTouch && !zoomAndPan.panningVisualRangeEnabled() || panIsEmpty) {
                    return;
                }

                (!isTouch || !zoomAndPan.actionData.isNative) && preventDefaults(e);
                if(actionData.action === 'zoom') {
                    const zoomAxes = (axes, criteria, coordField, startCoords, curCoords, onlyAxisToNotify) => {
                        axes = sortAxes(axes, onlyAxisToNotify);
                        const curCoord = curCoords[coordField];
                        const startCoord = startCoords[coordField];
                        let zoomStarted = false;
                        const getParameters = (silent) => {
                            return { start: !!silent, end: !!silent };
                        };
                        if(criteria && _abs(curCoord - startCoord) > MIN_DRAG_DELTA) {
                            axes.some(axis => {
                                const tr = axis.getTranslator();
                                if(tr.getBusinessRange().isEmpty()) {
                                    return;
                                }
                                const getRange = () => {
                                    return [tr.from(startCoord), tr.from(curCoord)];
                                };
                                const {
                                    stopInteraction,
                                    result
                                } = axisZoom(axis, onlyAxisToNotify, getRange, getParameters, actionData.action, tr.getMinScale(true), e);
                                zoomStarted = !stopInteraction;
                                return onlyAxisToNotify && result.isPrevented;
                            });
                        }
                        return zoomStarted;
                    };

                    const curCoords = getPointerCoord(actionData.curAxisRect, e);
                    const argumentAxesZoomed = zoomAxes(chart._argumentAxes, options.argumentAxis.zoom, rotated ? 'y' : 'x', actionData.startCoords, curCoords, chart.getArgumentAxis());
                    const valueAxesZoomed = zoomAxes(actionData.valueAxes, options.valueAxis.zoom, rotated ? 'x' : 'y', actionData.startCoords, curCoords);

                    if(valueAxesZoomed || argumentAxesZoomed) {
                        chart._requestChange(['VISUAL_RANGE']);
                    }

                    actionData.rect.dispose();
                } else if(actionData.action === 'pan') {
                    finishAxesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag);
                }
                zoomAndPan.actionData = null;
            },
            pinchStartHandler: function(e) {
                const actionData = prepareActionData(calcCenterForPinch(e), 'zoom');
                actionData.isNative = !zoomAndPan.panningVisualRangeEnabled();
                if(actionData.cancel) {
                    cancelEvent(e);
                    return;
                }
                zoomAndPan.actionData = actionData;
                startAxesViewportChanging(zoomAndPan, 'zoom', e);
            },
            pinchHandler: function(e) {
                if(!zoomAndPan.actionData) {
                    return;
                }
                const viewportChanged = axesViewportChanging(zoomAndPan, 'zoom', e,
                    (e, actionData, coordField, scale) => calcCenterForPinch(e)[coordField] - actionData.center[coordField] + (actionData.center[coordField] - actionData.center[coordField] * scale),
                    calcCenterForPinch);
                zoomAndPan.defineTouchBehavior(!viewportChanged, e);
                !viewportChanged && (zoomAndPan.actionData = null);
            },
            pinchEndHandler: function(e) {
                if(!zoomAndPan.actionData) {
                    return;
                }
                finishAxesViewportChanging(zoomAndPan, 'zoom', e,
                    (e, actionData, coordField, scale) => actionData.center[coordField] - actionData.startCenter[coordField] + (actionData.startCenter[coordField] - actionData.startCenter[coordField] * scale));
                zoomAndPan.actionData = null;
            },
            cleanup: function() {
                renderer.root.off(EVENTS_NS);
                zoomAndPan.actionData && zoomAndPan.actionData.rect && zoomAndPan.actionData.rect.dispose();
                zoomAndPan.actionData = null;
                renderer.root.css({ 'touch-action': '', '-ms-touch-action': '' });
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

                const rotated = chart.option('rotated');

                if((options.argumentAxis.zoom || options.valueAxis.zoom) && options.allowMouseWheel) {
                    renderer.root.on(wheelEvent + EVENTS_NS, function(e) {
                        function zoomAxes(axes, coord, delta, onlyAxisToNotify) {
                            axes = sortAxes(axes, onlyAxisToNotify);
                            let zoomStarted = false;
                            const getParameters = (silent) => {
                                return { start: !!silent, end: !!silent };
                            };
                            axes.some(axis => {
                                const translator = axis.getTranslator();
                                if(translator.getBusinessRange().isEmpty()) {
                                    return;
                                }
                                const scale = translator.getMinScale(delta > 0);
                                const getRange = () => {
                                    const zoom = translator.zoom(-(coord - coord * scale), scale, axis.getZoomBounds());
                                    return { startValue: zoom.min, endValue: zoom.max };
                                };
                                const {
                                    stopInteraction,
                                    result
                                } = axisZoom(axis, onlyAxisToNotify, getRange, getParameters, 'zoom', scale, e);
                                zoomStarted = !stopInteraction;
                                return onlyAxisToNotify && result.isPrevented;
                            });

                            return zoomStarted;
                        }

                        const coords = calcCenterForDrag(e);
                        let axesZoomed = false;
                        let targetAxes;
                        if(options.valueAxis.zoom) {
                            targetAxes = chart._valueAxes.filter(axis => checkCoords(canvasToRect(axis.getCanvas()), coords));

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
                            chart._requestChange(['VISUAL_RANGE']);
                            zoomAndPan.panningVisualRangeEnabled(targetAxes) && preventDefaults(e); // T249548
                        }
                    });
                }
                if(options.allowTouchGestures) {
                    if(options.argumentAxis.zoom || options.valueAxis.zoom) {
                        renderer.root
                            .on(PINCH_START_EVENT_NAME, { passive: false }, zoomAndPan.pinchStartHandler)
                            .on(PINCH_EVENT_NAME, { passive: false }, zoomAndPan.pinchHandler)
                            .on(PINCH_END_EVENT_NAME, zoomAndPan.pinchEndHandler);
                    }
                }

                renderer.root
                    .on(DRAG_START_EVENT_NAME, { immediate: true, passive: false }, zoomAndPan.dragStartHandler)
                    .on(DRAG_EVENT_NAME, { immediate: true, passive: false }, zoomAndPan.dragHandler)
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
                            startAxesViewportChanging(zoomAndPan, 'pan', e);
                        })
                        .on(SCROLL_BAR_MOVE_EVENT_NAME, function(e) {
                            preventDefaults(e);
                            axesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag, e => e.offset);
                        })
                        .on(SCROLL_BAR_END_EVENT_NAME, function(e) {
                            preventDefaults(e);
                            finishAxesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag);
                            zoomAndPan.actionData = null;
                        });
                }
            },

            defineTouchBehavior: function(isDefault, e) {
                zoomAndPan.actionData && (zoomAndPan.actionData.isNative = isDefault);
                if(!isDefault) {
                    preventDefaults(e);
                }
            },

            panningVisualRangeEnabled: function(targetAxes) {
                if(targetAxes?.length) {
                    return targetAxes.some(axis => !axis.isExtremePosition(false) || !axis.isExtremePosition(true));
                }
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
            this._zoomAndPan.setup(this._themeManager.getOptions('zoomAndPan'));
        },
    },
    dispose: function() {
        this._zoomAndPan.cleanup();
    },
    customize: function(constructor) {
        constructor.addChange({
            code: 'ZOOM_AND_PAN',
            handler: function() {
                this._setupZoomAndPan();
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: 'zoomAndPan'
        });
    }
};
