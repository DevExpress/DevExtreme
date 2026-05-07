/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { name as wheelEvent } from '@js/common/core/events/core/wheel';
import {
  end as dragEventEnd,
  move as dragEventMove,
  start as dragEventStart,
} from '@js/common/core/events/drag';
import * as transformEvents from '@js/common/core/events/transform';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import { getVizRangeObject, normalizeEnum } from '@ts/viz/core/utils';

const EVENTS_NS = '.zoomAndPanNS';

const DRAG_START_EVENT_NAME = dragEventStart + EVENTS_NS;
const DRAG_EVENT_NAME = dragEventMove + EVENTS_NS;
const DRAG_END_EVENT_NAME = dragEventEnd + EVENTS_NS;

const PINCH_START_EVENT_NAME = transformEvents.pinchstart + EVENTS_NS;
const PINCH_EVENT_NAME = transformEvents.pinch + EVENTS_NS;
const PINCH_END_EVENT_NAME = transformEvents.pinchend + EVENTS_NS;

const SCROLL_BAR_START_EVENT_NAME = `dxc-scroll-start${EVENTS_NS}`;
const SCROLL_BAR_MOVE_EVENT_NAME = `dxc-scroll-move${EVENTS_NS}`;
const SCROLL_BAR_END_EVENT_NAME = `dxc-scroll-end${EVENTS_NS}`;

const GESTURE_TIMEOUT = 300;
const MIN_DRAG_DELTA = 5;
export const SCROLL_PREVENTION_TIMEOUT = 500;

const _min = Math.min;
const _max = Math.max;
const _abs = Math.abs;

function canvasToRect(canvas) {
  return {
    x: canvas.left,
    y: canvas.top,
    width: canvas.width - canvas.left - canvas.right,
    height: canvas.height - canvas.top - canvas.bottom,
  };
}

function checkCoords(rect, coords) {
  const { x } = coords;
  const { y } = coords;
  return x >= rect.x && x <= (rect.width + rect.x)
        && y >= rect.y && y <= (rect.height + rect.y);
}

function sortAxes(axes, onlyAxisToNotify) {
  if (onlyAxisToNotify) {
    axes = axes.sort((a, b) => {
      if (a === onlyAxisToNotify) {
        return -1;
      }
      if (b === onlyAxisToNotify) {
        return 1;
      }
      return 0;
    });
  }

  return axes;
}

function getFilteredAxes(axes) {
  return axes.filter((a) => !a.getTranslator().getBusinessRange().isEmpty());
}

function isAxisAvailablePanning(axes) {
  return axes.some((axis) => !axis.isExtremePosition(false) || !axis.isExtremePosition(true));
}

function axisZoom(axis, onlyAxisToNotify, getRange, getParameters, actionField, scale, e) {
  const silent = onlyAxisToNotify && (axis !== onlyAxisToNotify);
  const range = getRange(axis);

  const { stopInteraction, correctedRange } = axis.checkZoomingLowerLimitOvercome(actionField, scale, range);

  const result = axis.handleZooming(stopInteraction ? null : correctedRange, getParameters(silent), e, actionField);
  stopInteraction && axis.handleZoomEnd();
  return { stopInteraction, result };
}

function zoomAxes(e, axes, getRange, zoom, params, onlyAxisToNotify?) {
  axes = sortAxes(axes, onlyAxisToNotify);
  let zoomStarted = false;
  const getParameters = (silent) => ({ start: !!silent, end: !!silent });
  getFilteredAxes(axes).some((axis) => {
    const translator = axis.getTranslator();
    const scale = translator.getMinScale(zoom);
    const {
      stopInteraction,
      result,
    } = axisZoom(axis, onlyAxisToNotify, getRange({
      scale, translator, axis, ...params,
    }), getParameters, 'zoom', scale, e);
    zoomStarted = !stopInteraction;
    return onlyAxisToNotify && result.isPrevented;
  });

  return zoomStarted;
}

function cancelEvent(e) {
  if (e.originalEvent) {
    cancelEvent(e.originalEvent);
  }
  if (e.cancelable !== false) {
    e.cancel = true;
  }
}

export default {
  name: 'zoom_and_pan',
  init() {
    const chart = this;
    const renderer = this._renderer;
    let lastWheelTimer: number | undefined;

    function getAxesCopy(zoomAndPan, actionField) {
      let axes = [];
      const { options } = zoomAndPan;
      const { actionData } = zoomAndPan;
      if (options.argumentAxis[actionField]) {
        // @ts-expect-error
        axes.push(chart.getArgumentAxis());
      }
      if (options.valueAxis[actionField]) {
        axes = axes.concat(actionData.valueAxes);
      }
      return axes;
    }

    function startAxesViewportChanging(zoomAndPan, actionField, e) {
      const axes = getAxesCopy(zoomAndPan, actionField);

      getFilteredAxes(axes).some((axis) => axis.handleZooming(null, { end: true }, e, actionField).isPrevented) && cancelEvent(e);
    }

    function axesViewportChanging(zoomAndPan, actionField, e, offsetCalc, centerCalc) {
      function zoomAxes(axes, criteria, coordField, e, actionData) {
        let zoom = { zoomed: false };
        criteria && getFilteredAxes(axes).forEach((axis) => {
          const options = axis.getOptions();
          const viewport = axis.visualRange();
          const scale = axis.getTranslator().getEventScale(e);
          const translate = -offsetCalc(e, actionData, coordField, scale);
          zoom = extend(true, zoom, axis.getTranslator().zoom(translate, scale, axis.getZoomBounds()));
          // @ts-expect-error
          const range = axis.adjustRange(getVizRangeObject([zoom.min, zoom.max]));
          const { stopInteraction, correctedRange } = axis.checkZoomingLowerLimitOvercome(actionField, scale, range);

          if (!isDefined(viewport)
                        || viewport.startValue.valueOf() !== correctedRange.startValue.valueOf()
                        || viewport.endValue.valueOf() !== correctedRange.endValue.valueOf()) {
            axis.handleZooming(stopInteraction ? null : correctedRange, { start: true, end: true }, e, actionField);
            if (!stopInteraction) {
              zoom.zoomed = true;
              // @ts-expect-error
              zoom.deltaTranslate = translate - zoom.translate;
            }
          } else if (e.pointerType === 'touch' && options.type === 'discrete') {
            const isMinPosition = axis.isExtremePosition(false);
            const isMaxPosition = axis.isExtremePosition(true);
            const zoomInEnabled = scale > 1 && !stopInteraction;
            const zoomOutEnabled = scale < 1 && (!isMinPosition || !isMaxPosition);
            const panningEnabled = scale === 1 && !(isMinPosition && (translate < 0 && !options.inverted || translate > 0 && options.inverted)
                            || isMaxPosition && (translate > 0 && !options.inverted || translate < 0 && options.inverted));
            // @ts-expect-error
            zoom.enabled = zoomInEnabled || zoomOutEnabled || panningEnabled;
          }
        });
        return zoom;
      }

      function storeOffset(e, actionData, zoom, coordField) {
        if (zoom.zoomed) {
          actionData.offset[coordField] = (e.offset ? e.offset[coordField] : actionData.offset[coordField]) + zoom.deltaTranslate;
        }
      }

      function storeCenter(center, actionData, zoom, coordField) {
        if (zoom.zoomed) {
          actionData.center[coordField] = center[coordField] + zoom.deltaTranslate;
        }
      }

      const rotated = chart.option('rotated');
      const { actionData } = zoomAndPan;
      const { options } = zoomAndPan;
      let argZoom = {};
      let valZoom = {};

      if (!actionData.fallback) {
        argZoom = zoomAxes(chart._argumentAxes, options.argumentAxis[actionField], rotated ? 'y' : 'x', e, actionData);
        valZoom = zoomAxes(actionData.valueAxes, options.valueAxis[actionField], rotated ? 'x' : 'y', e, actionData);
        chart._requestChange(['VISUAL_RANGE']);
        storeOffset(e, actionData, argZoom, rotated ? 'y' : 'x');
        storeOffset(e, actionData, valZoom, rotated ? 'x' : 'y');
      }

      const center = centerCalc(e);
      storeCenter(center, actionData, argZoom, rotated ? 'y' : 'x');
      storeCenter(center, actionData, valZoom, rotated ? 'x' : 'y');
      // @ts-expect-error
      if (!argZoom.zoomed && !valZoom.zoomed) {
        actionData.center = center;
      }
      // @ts-expect-error
      return argZoom.zoomed || valZoom.zoomed || actionData.fallback || argZoom.enabled || valZoom.enabled;
    }

    function finishAxesViewportChanging(zoomAndPan, actionField, e, offsetCalc) {
      function zoomAxes(axes, coordField, actionData, onlyAxisToNotify) {
        let zoomStarted = false;
        const scale = e.scale || 1;
        const getRange = (axis) => {
          const zoom = axis.getTranslator().zoom(-offsetCalc(e, actionData, coordField, scale), scale, axis.getZoomBounds());
          return { startValue: zoom.min, endValue: zoom.max };
        };
        const getParameters = (silent) => ({ start: true, end: silent });
        getFilteredAxes(axes).forEach((axis) => {
          zoomStarted = !axisZoom(axis, onlyAxisToNotify, getRange, getParameters, actionField, scale, e).stopInteraction;
        });
        return zoomStarted;
      }

      const rotated = chart.option('rotated');
      const { actionData } = zoomAndPan;
      const { options } = zoomAndPan;
      let zoomStarted = true;

      if (actionData.fallback) {
        // @ts-expect-error
        zoomStarted &= options.argumentAxis[actionField] && zoomAxes(chart._argumentAxes, rotated ? 'y' : 'x', actionData, chart.getArgumentAxis());
        // @ts-expect-error
        zoomStarted |= options.valueAxis[actionField] && zoomAxes(actionData.valueAxes, rotated ? 'x' : 'y', actionData);
      } else {
        const axes = getAxesCopy(zoomAndPan, actionField);

        getFilteredAxes(axes).forEach((axis) => {
          axis.handleZooming(null, { start: true }, e, actionField);
        });
        // @ts-expect-error
        zoomStarted = axes.length;
      }
      zoomStarted && chart._requestChange(['VISUAL_RANGE']);
    }

    function prepareActionData(coords, action) {
      const axes = chart._argumentAxes.filter((axis) => checkCoords(canvasToRect(axis.getCanvas()), coords));

      return {
        fallback: chart._lastRenderingTime > GESTURE_TIMEOUT,
        cancel: !axes.length || !isDefined(action),
        action,
        curAxisRect: axes.length && canvasToRect(axes[0].getCanvas()),
        valueAxes: axes.length && chart._valueAxes.filter((axis) => checkCoords(canvasToRect(axis.getCanvas()), coords)),
        offset: { x: 0, y: 0 },
        center: coords,
        startCenter: coords,
      };
    }

    function getPointerCoord(rect, e) {
      const rootOffset = renderer.getRootOffset();
      return {
        x: _min(_max(e.pageX - rootOffset.left, rect.x), rect.width + rect.x),
        y: _min(_max(e.pageY - rootOffset.top, rect.y), rect.height + rect.y),
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
        y: _min(y1, y2) + _abs(y2 - y1) / 2 - rootOffset.top,
      };
    }

    function calcCenterForDrag(e) {
      const rootOffset = renderer.getRootOffset();
      return {
        x: e.pageX - rootOffset.left,
        y: e.pageY - rootOffset.top,
      };
    }

    function calcOffsetForDrag(e, actionData, coordField) {
      return e.offset[coordField] - actionData.offset[coordField];
    }

    function setLastWheelTimer() {
      clearTimeout(lastWheelTimer);
      // eslint-disable-next-line no-restricted-globals
      lastWheelTimer = setTimeout(() => {
        lastWheelTimer = undefined;
      }, SCROLL_PREVENTION_TIMEOUT) as unknown as number;
    }

    function preventDefaults(e, stopChartHandler = true): void {
      if (e.cancelable !== false) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (stopChartHandler) {
        chart._stopCurrentHandling();
      }
    }

    const zoomAndPan = {
      dragStartHandler(e) {
        // @ts-expect-error
        const { options } = zoomAndPan;
        const isTouch = e.pointerType === 'touch';
        const wantPan = options.argumentAxis.pan || options.valueAxis.pan;
        const wantZoom = options.argumentAxis.zoom || options.valueAxis.zoom;
        const panKeyPressed = isDefined(options.panKey) && e[`${normalizeEnum(options.panKey)}Key`];
        const { dragToZoom } = options;

        let action;

        e._cancelPreventDefault = true;
        if (isTouch) {
          if (options.allowTouchGestures && wantPan) {
            // @ts-expect-error
            const cancelPanning = !zoomAndPan.panningVisualRangeEnabled() || zoomAndPan.skipEvent;
            action = cancelPanning ? null : 'pan';
          }
        } else if (dragToZoom && wantPan && panKeyPressed || !dragToZoom && wantPan) {
          action = 'pan';
        } else if (dragToZoom && wantZoom) {
          action = 'zoom';
        }

        const actionData = prepareActionData(calcCenterForDrag(e), action);
        if (actionData.cancel) {
          // @ts-expect-error
          zoomAndPan.skipEvent = false;
          if (e.cancelable !== false) {
            e.cancel = true;
          }
          return;
        }
        // @ts-expect-error
        zoomAndPan.actionData = actionData;

        if (action === 'zoom') {
          // @ts-expect-error
          actionData.startCoords = getPointerCoord(actionData.curAxisRect, e);
          // @ts-expect-error
          actionData.rect = renderer.rect(0, 0, 0, 0).attr(options.dragBoxStyle).append(renderer.root);
        } else {
          startAxesViewportChanging(zoomAndPan, 'pan', e);
        }
      },
      dragHandler(e) {
        const rotated = chart.option('rotated');
        // @ts-expect-error
        const { options } = zoomAndPan;
        // @ts-expect-error
        const { actionData } = zoomAndPan;
        const isTouch = e.pointerType === 'touch';
        e._cancelPreventDefault = true;

        if (!actionData || isTouch && !zoomAndPan.panningVisualRangeEnabled()) {
          return;
        }

        if (actionData.action === 'zoom') {
          preventDefaults(e);

          const curCanvas = actionData.curAxisRect;
          const { startCoords } = actionData;
          const curCoords = getPointerCoord(curCanvas, e);
          const zoomArg = options.argumentAxis.zoom;
          const zoomVal = options.valueAxis.zoom;

          const rect = {
            x: _min(startCoords.x, curCoords.x),
            y: _min(startCoords.y, curCoords.y),
            width: _abs(startCoords.x - curCoords.x),
            height: _abs(startCoords.y - curCoords.y),
          };

          if (!zoomArg || !zoomVal) {
            if (!zoomArg && !rotated || !zoomVal && rotated) {
              rect.x = curCanvas.x;
              rect.width = curCanvas.width;
            } else {
              rect.y = curCanvas.y;
              rect.height = curCanvas.height;
            }
          }

          actionData.rect.attr(rect);
        } else if (actionData.action === 'pan') {
          axesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag, (e) => e.offset);
          const deltaOffsetY = Math.abs(e.offset.y - actionData.offset.y);
          const deltaOffsetX = Math.abs(e.offset.x - actionData.offset.x);
          if (isTouch
                        && (deltaOffsetY > MIN_DRAG_DELTA && deltaOffsetY > Math.abs(actionData.offset.x)
                        || deltaOffsetX > MIN_DRAG_DELTA && deltaOffsetX > Math.abs(actionData.offset.y))
          ) {
            return;
          }
          preventDefaults(e);
        }
      },
      dragEndHandler(e) {
        const rotated = chart.option('rotated');
        // @ts-expect-error
        const { options } = zoomAndPan;
        // @ts-expect-error
        const { actionData } = zoomAndPan;
        const isTouch = e.pointerType === 'touch';
        const getRange = ({ translator, startCoord, curCoord }) => () => [translator.from(startCoord), translator.from(curCoord)];
        const getCoords = (curCoords, startCoords, field) => ({
          curCoord: curCoords[field],
          startCoord: startCoords[field],
        });
        const needToZoom = (axisOption, coords) => axisOption.zoom && _abs(coords.curCoord - coords.startCoord) > MIN_DRAG_DELTA;

        const panIsEmpty = actionData && actionData.action === 'pan' && !actionData.fallback && actionData.offset.x === 0 && actionData.offset.y === 0;

        if (!actionData || isTouch && !zoomAndPan.panningVisualRangeEnabled() || panIsEmpty) {
          return;
        }
        !isTouch && preventDefaults(e);
        if (actionData.action === 'zoom') {
          const curCoords = getPointerCoord(actionData.curAxisRect, e);
          const argumentCoords = getCoords(curCoords, actionData.startCoords, rotated ? 'y' : 'x');
          const valueCoords = getCoords(curCoords, actionData.startCoords, rotated ? 'x' : 'y');
          const argumentAxesZoomed = needToZoom(options.argumentAxis, argumentCoords) && zoomAxes(e, chart._argumentAxes, getRange, true, argumentCoords, chart.getArgumentAxis());
          const valueAxesZoomed = needToZoom(options.valueAxis, valueCoords) && zoomAxes(e, actionData.valueAxes, getRange, true, valueCoords);

          if (valueAxesZoomed || argumentAxesZoomed) {
            chart._requestChange(['VISUAL_RANGE']);
          }

          actionData.rect.dispose();
        } else if (actionData.action === 'pan') {
          finishAxesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag);
        }
        // @ts-expect-error
        zoomAndPan.actionData = null;
      },
      pinchStartHandler(e) {
        const actionData = prepareActionData(calcCenterForPinch(e), 'zoom');
        if (actionData.cancel) {
          cancelEvent(e);
          return;
        }
        // @ts-expect-error
        zoomAndPan.actionData = actionData;
        startAxesViewportChanging(zoomAndPan, 'zoom', e);
      },
      pinchHandler(e) {
        // @ts-expect-error
        if (!zoomAndPan.actionData) {
          return;
        }
        axesViewportChanging(
          zoomAndPan,
          'zoom',
          e,
          (e, actionData, coordField, scale) => calcCenterForPinch(e)[coordField] - actionData.center[coordField] + (actionData.center[coordField] - actionData.center[coordField] * scale),
          calcCenterForPinch,
        );
        preventDefaults(e);
      },
      pinchEndHandler(e) {
        // @ts-expect-error
        if (!zoomAndPan.actionData) {
          return;
        }
        finishAxesViewportChanging(
          zoomAndPan,
          'zoom',
          e,
          (e, actionData, coordField, scale) => actionData.center[coordField] - actionData.startCenter[coordField] + (actionData.startCenter[coordField] - actionData.startCenter[coordField] * scale),
        );
        // @ts-expect-error
        zoomAndPan.actionData = null;
      },
      mouseWheelHandler(e) {
        // @ts-expect-error
        const { options } = zoomAndPan;
        const rotated = chart.option('rotated');
        const getRange = ({
          translator, coord, scale, axis,
        }) => () => {
          const zoom = translator.zoom(-(coord - coord * scale), scale, axis.getZoomBounds());
          return { startValue: zoom.min, endValue: zoom.max };
        };
        const coords = calcCenterForDrag(e);
        let axesZoomed = false;
        let targetAxes;
        if (options.valueAxis.zoom) {
          targetAxes = chart._valueAxes.filter((axis) => checkCoords(canvasToRect(axis.getCanvas()), coords));

          if (targetAxes.length === 0) {
            const targetCanvas = chart._valueAxes.reduce((r, axis) => {
              if (!r && axis.coordsIn(coords.x, coords.y)) {
                r = axis.getCanvas();
              }
              return r;
            }, null);
            if (targetCanvas) {
              targetAxes = chart._valueAxes.filter((axis) => checkCoords(canvasToRect(axis.getCanvas()), {
                x: targetCanvas.left,
                y: targetCanvas.top,
              }));
            }
          }
          // @ts-expect-error
          axesZoomed |= zoomAxes(e, targetAxes, getRange, e.delta > 0, { coord: rotated ? coords.x : coords.y });
        }
        if (options.argumentAxis.zoom) {
          const canZoom = chart._argumentAxes.some((axis) => {
            if (checkCoords(canvasToRect(axis.getCanvas()), coords)
                            || axis.coordsIn(coords.x, coords.y)) {
              return true;
            }
            return false;
          });
          // @ts-expect-error
          axesZoomed |= canZoom && zoomAxes(e, chart._argumentAxes, getRange, e.delta > 0, { coord: rotated ? coords.y : coords.x }, chart.getArgumentAxis());
        }

        const isPanningAvailable = targetAxes ? isAxisAvailablePanning(targetAxes) : zoomAndPan.panningVisualRangeEnabled();

        if (axesZoomed) {
          chart._requestChange(['VISUAL_RANGE']);
          if (isPanningAvailable) {
            preventDefaults(e); // T249548
            setLastWheelTimer();
          }
        }

        if ((!axesZoomed || !isPanningAvailable) && lastWheelTimer) {
          preventDefaults(e, false);
          setLastWheelTimer();
        }
      },
      cleanup() {
        renderer.root.off(EVENTS_NS);
        // @ts-expect-error
        zoomAndPan.actionData?.rect?.dispose();
        // @ts-expect-error
        zoomAndPan.actionData = null;
        renderer.root.css({ 'touch-action': '' });
      },
      setup(options) {
        zoomAndPan.cleanup();
        if (!options.argumentAxis.pan) {
          renderer.root.on(SCROLL_BAR_START_EVENT_NAME, cancelEvent);
        }
        if (options.argumentAxis.none && options.valueAxis.none) {
          return;
        }
        // @ts-expect-error
        zoomAndPan.options = options;

        if ((options.argumentAxis.zoom || options.valueAxis.zoom) && options.allowMouseWheel) {
          renderer.root.on(wheelEvent + EVENTS_NS, zoomAndPan.mouseWheelHandler);
        }
        if ((options.argumentAxis.zoom || options.valueAxis.zoom) && options.allowTouchGestures) {
          renderer.root
            .on(PINCH_START_EVENT_NAME, { passive: false }, zoomAndPan.pinchStartHandler)
            .on(PINCH_EVENT_NAME, { passive: false }, zoomAndPan.pinchHandler)
            .on(PINCH_END_EVENT_NAME, zoomAndPan.pinchEndHandler);
        }

        renderer.root
          .on(DRAG_START_EVENT_NAME, { immediate: true, passive: false }, zoomAndPan.dragStartHandler)
          .on(DRAG_EVENT_NAME, { immediate: true, passive: false }, zoomAndPan.dragHandler)
          .on(DRAG_END_EVENT_NAME, zoomAndPan.dragEndHandler);

        renderer.root
          .on(SCROLL_BAR_START_EVENT_NAME, (e) => {
            // @ts-expect-error
            zoomAndPan.actionData = {
              valueAxes: [],
              offset: { x: 0, y: 0 },
              center: { x: 0, y: 0 },
            };
            preventDefaults(e);
            startAxesViewportChanging(zoomAndPan, 'pan', e);
          })
          .on(SCROLL_BAR_MOVE_EVENT_NAME, (e) => {
            preventDefaults(e);
            axesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag, (e) => e.offset);
          })
          .on(SCROLL_BAR_END_EVENT_NAME, (e) => {
            preventDefaults(e);
            finishAxesViewportChanging(zoomAndPan, 'pan', e, calcOffsetForDrag);
            // @ts-expect-error
            zoomAndPan.actionData = null;
          });
      },

      panningVisualRangeEnabled() {
        return isAxisAvailablePanning(chart._valueAxes) || isAxisAvailablePanning(chart._argumentAxes);
      },
    };

    this._zoomAndPan = zoomAndPan;
  },
  members: {
    _setupZoomAndPan() {
      this._zoomAndPan.setup(this._themeManager.getOptions('zoomAndPan'));
    },
  },
  dispose() {
    this._zoomAndPan.cleanup();
  },
  customize(constructor) {
    constructor.addChange({
      code: 'ZOOM_AND_PAN',
      handler() {
        this._setupZoomAndPan();
      },
      isThemeDependent: true,
      isOptionChange: true,
      option: 'zoomAndPan',
    });
  },
};
