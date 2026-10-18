/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { domAdapter } from '@ts/core/dom_adapter';
import { each } from '@ts/core/utils/m_iterator';
import { pointerEvents as msPointerEnabled } from '@ts/core/utils/m_support';
import { getWindow } from '@ts/core/utils/m_window';
import eventsEngine from '@ts/events/core/events_engine';
import pointerEvents from '@ts/events/pointer';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { MovingHandler } from '@ts/viz/range_selector/sliders_controller';

const MIN_MANUAL_SELECTING_WIDTH = 10;
const window = getWindow();

type EventHandler = (e: ThemeValue) => void;

type DocumentEvents = Record<string, EventHandler>;

interface TrackerState {
  enabled?: boolean;
  moveSelectedRangeByClick?: boolean;
  manualRangeSelectionEnabled?: boolean;
}

interface TrackerSlider {
  on: (events: DocumentEvents) => void;
}

interface TrackerController {
  getTrackerTargets: () => { area: ThemeValue; selectedArea: ThemeValue; sliders: TrackerSlider[] };
  placeSliderAndBeginMoving: (firstPosition: number, secondPosition: number, e: ThemeValue) => MovingHandler;
  moveSelectedArea: (screenPosition: number, e: ThemeValue) => void;
  beginSelectedAreaMoving: (initialPosition: number) => MovingHandler;
  beginSliderMoving: (initialIndex: number, initialPosition: number) => MovingHandler;
  foregroundSlider: (index: number) => void;
}

interface TrackerParams {
  renderer: {
    root: ThemeValue;
    getRootOffset: () => { left: number };
  };
  controller: TrackerController;
}

function isLeftButtonPressed(event: ThemeValue): boolean {
  const e = event || window.event;
  const originalEvent = e.originalEvent;
  const touches = e.touches;
  const pointerType = originalEvent ? originalEvent.pointerType : false;
  const eventTouches = originalEvent ? originalEvent.touches : false;
  const isMSPointerLeftClick = originalEvent && pointerType !== undefined && (pointerType === (originalEvent.MSPOINTER_TYPE_TOUCH || 'touch') || (pointerType === (originalEvent.MSPOINTER_TYPE_MOUSE || 'mouse') && originalEvent.buttons === 1));
  const isTouches = (touches && touches.length > 0) || (eventTouches && eventTouches.length > 0);

  return (e.which === 1) || isMSPointerLeftClick || isTouches;
}

function isMultiTouches(event: ThemeValue): boolean | null {
  const originalEvent = event.originalEvent;
  const touches = event.touches;
  const eventTouches = originalEvent && originalEvent.touches;

  return (touches && touches.length > 1) || (eventTouches && eventTouches.length > 1) || null;
}

function preventDefault(e: ThemeValue): void {
  if (!isMultiTouches(e)) {
    e.preventDefault();
  }
}

function stopPropagationAndPreventDefault(e: ThemeValue): void {
  if (!isMultiTouches(e)) {
    e.stopPropagation();
    e.preventDefault();
  }
}

// Q375042
function isTouchEventArgs(e: ThemeValue): boolean {
  return e && e.type && e.type.indexOf('touch') === 0;
}

function getEventPageX(event: ThemeValue): number {
  const originalEvent = event.originalEvent;
  let result = 0;
  if (event.pageX) {
    result = event.pageX;
  } else if (originalEvent && originalEvent.pageX) {
    result = originalEvent.pageX;
  }
  if (originalEvent && originalEvent.touches) {
    if (originalEvent.touches.length > 0) {
      result = originalEvent.touches[0].pageX;
    } else if (originalEvent.changedTouches.length > 0) {
      result = originalEvent.changedTouches[0].pageX;
    }
  }
  return result;
}

function initializeAreaEvents(controller: TrackerController, area: ThemeValue, state: TrackerState, getRootOffsetLeft: () => number): DocumentEvents {
  let isTouchEvent;
  let isActive = false;
  let initialPosition;
  let movingHandler: MovingHandler | null = null;
  const docEvents = {
    [pointerEvents.move](e: ThemeValue): void {
      let position;
      let offset;
      if (isTouchEvent !== isTouchEventArgs(e)) return;

      if (!isLeftButtonPressed(e)) {
        cancel(e);
      }
      if (isActive) {
        position = getEventPageX(e);
        offset = getRootOffsetLeft();
        if (movingHandler) {
          movingHandler(position - offset, e);
        } else if (state.manualRangeSelectionEnabled && Math.abs(initialPosition - position) >= MIN_MANUAL_SELECTING_WIDTH) {
          movingHandler = controller.placeSliderAndBeginMoving(initialPosition - offset, position - offset, e);
        }
      }
    },
    [pointerEvents.up](e: ThemeValue): void {
      let position;
      if (isActive) {
        position = getEventPageX(e);
        if (!movingHandler && state.moveSelectedRangeByClick && Math.abs(initialPosition - position) < MIN_MANUAL_SELECTING_WIDTH) {
          controller.moveSelectedArea(position - getRootOffsetLeft(), e);
        }
        cancel(e);
      }
    },
  };

  function cancel(e: ThemeValue): void {
    if (isActive) {
      isActive = false;
      if (movingHandler) {
        movingHandler.complete(e);
        movingHandler = null;
      }
    }
  }

  area.on(pointerEvents.down, (e) => {
    if (!state.enabled || !isLeftButtonPressed(e) || isActive) return;

    isActive = true;
    isTouchEvent = isTouchEventArgs(e);
    initialPosition = getEventPageX(e);
  });
  return docEvents;
}

function initializeSelectedAreaEvents(controller: TrackerController, area: ThemeValue, state: TrackerState, getRootOffsetLeft: () => number): DocumentEvents {
  let isTouchEvent;
  let isActive = false;
  let movingHandler: MovingHandler | null = null;
  const docEvents = {
    [pointerEvents.move](e: ThemeValue): void {
      if (isTouchEvent !== isTouchEventArgs(e)) return;

      if (!isLeftButtonPressed(e)) {
        cancel(e);
      }
      if (isActive) {
        preventDefault(e);
        // @ts-expect-error movingHandler is set whenever isActive is true
        movingHandler(getEventPageX(e) - getRootOffsetLeft(), e);
      }
    },
    [pointerEvents.up]: cancel,
  };

  function cancel(e: ThemeValue): void {
    if (isActive) {
      isActive = false;
      // @ts-expect-error movingHandler is set whenever isActive is true
      movingHandler.complete(e);
      movingHandler = null;
    }
  }

  area.on(pointerEvents.down, (e) => {
    if (!state.enabled || !isLeftButtonPressed(e) || isActive) return;

    isActive = true;
    isTouchEvent = isTouchEventArgs(e);
    movingHandler = controller.beginSelectedAreaMoving(getEventPageX(e) - getRootOffsetLeft());
    stopPropagationAndPreventDefault(e);
  });
  return docEvents;
}

function initializeSliderEvents(controller: TrackerController, sliders: TrackerSlider[], state: TrackerState, getRootOffsetLeft: () => number): DocumentEvents {
  let isTouchEvent;
  let isActive = false;
  let movingHandler: MovingHandler | null = null;
  const docEvents = {
    [pointerEvents.move](e: ThemeValue): void {
      if (isTouchEvent !== isTouchEventArgs(e)) return;

      if (!isLeftButtonPressed(e)) {
        cancel(e);
      }
      if (isActive) {
        preventDefault(e);
        // @ts-expect-error movingHandler is set whenever isActive is true
        movingHandler(getEventPageX(e) - getRootOffsetLeft(), e);
      }
    },
    [pointerEvents.up]: cancel,
  };

  each(sliders, (i, slider) => {
    slider.on({
      [pointerEvents.down](e: ThemeValue) {
        if (!state.enabled || !isLeftButtonPressed(e) || isActive) return;

        isActive = true;
        isTouchEvent = isTouchEventArgs(e);
        movingHandler = controller.beginSliderMoving(i, getEventPageX(e) - getRootOffsetLeft());
        stopPropagationAndPreventDefault(e);
      },
      [pointerEvents.move]() {
        if (!movingHandler) {
          controller.foregroundSlider(i);
        }
      },
    });
  });

  function cancel(e: ThemeValue): void {
    if (isActive) {
      isActive = false;
      // @ts-expect-error movingHandler is set whenever isActive is true
      movingHandler.complete(e);
      movingHandler = null;
    }
  }

  return docEvents;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Tracker = class Tracker {
  declare _state: TrackerState;

  declare _docEvents: DocumentEvents[];

  constructor(params: TrackerParams) {
    const state = this._state = {};
    const targets = params.controller.getTrackerTargets();
    if (msPointerEnabled) {
      params.renderer.root.css({ msTouchAction: 'pinch-zoom' });
    }
    this._docEvents = [
      initializeSelectedAreaEvents(params.controller, targets.selectedArea, state, getRootOffsetLeft),
      initializeAreaEvents(params.controller, targets.area, state, getRootOffsetLeft),
      initializeSliderEvents(params.controller, targets.sliders, state, getRootOffsetLeft),
    ];
    // TODO: 3 "move" and 3 "end" events - do we really need that much?
    each(this._docEvents, (_, events) => {
      eventsEngine.on(domAdapter.getDocument(), events);
    });

    function getRootOffsetLeft(): number {
      return params.renderer.getRootOffset().left;
    }
  }

  dispose(): void {
    each(this._docEvents, (_, events) => {
      eventsEngine.off(domAdapter.getDocument(), events);
    });
  }

  update(enabled: boolean, behavior: ThemeValue): void {
    const state = this._state;
    state.enabled = enabled;
    state.moveSelectedRangeByClick = behavior.moveSelectedRangeByClick;
    state.manualRangeSelectionEnabled = behavior.manualRangeSelectionEnabled;
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_Tracker(value: typeof Tracker): void {
  Tracker = value;
}
/// #ENDDEBUG
