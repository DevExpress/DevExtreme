import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
/// #DEBUG
import { debug } from '@js/core/utils/console';
/// #ENDDEBUG
import ReadyCallbacks from '@js/core/utils/ready_callbacks';
import eventsEngine from '@ts/events/core/events_engine';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const EVENT_NS = 'gauge-tooltip';

const TOOLTIP_HIDE_DELAY = 100;

const ready = ReadyCallbacks.add;

export interface TrackerParameters {
  renderer: ThemeValue;
  container: ThemeValue;
}

export interface TrackerCallbacks {
  'tooltip-show': (target: ThemeValue, info: ThemeValue, callback: (result: boolean) => void) => boolean;
  'tooltip-hide': () => void;
}

interface TrackerEvent {
  data: { tracker: Tracker };
  target: ThemeValue;
  pageX: number;
  pageY: number;
}

let activeTouchTooltipTracker: Tracker | null = null;

function handleTooltipMouseOver(event: TrackerEvent): void {
  const { tracker } = event.data;
  tracker._x = event.pageX;
  tracker._y = event.pageY;
  tracker._showTooltip(event);
}

function handleTooltipMouseOut(event: TrackerEvent): void {
  event.data.tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
}

function handleTooltipMouseWheel(event: TrackerEvent): void {
  event.data.tracker._hideTooltip();
}

function handleTooltipTouchStart(event: TrackerEvent): void {
  const { tracker } = event.data;
  activeTouchTooltipTracker = tracker;
  tracker._touch = true;
  handleTooltipMouseOver(event);
}

function handleTooltipTouchEnd(): void {
  (activeTouchTooltipTracker as Tracker)._touch = false;
}

function handleDocumentTooltipTouchStart(): void {
  const tracker = activeTouchTooltipTracker;
  if (tracker && !tracker._touch) {
    tracker._hideTooltip(TOOLTIP_HIDE_DELAY);
    activeTouchTooltipTracker = null;
  }
}

class Tracker {
  _element;

  _context;

  _callbacks!: TrackerCallbacks;

  _tooltipEvent?: TrackerEvent;

  _tooltipTarget;

  _targetEvent;

  _hideTooltipTimeout;

  _showTooltipCallback!: () => void;

  _hideTooltipCallback!: () => void;

  _dispose!: () => void;

  _x?: number;

  _y?: number;

  _touch?: boolean;

  _DEBUG_hideTooltipTimeoutSet!: number;

  _DEBUG_hideTooltipTimeoutCleared!: number;

  TOOLTIP_HIDE_DELAY!: number;

  static _DEBUG_reset: () => void;

  constructor(parameters: TrackerParameters) {
    /// #DEBUG
    debug.assertParam(parameters, 'parameters');
    debug.assertParam(parameters.renderer, 'parameters.renderer');
    debug.assertParam(parameters.container, 'parameters.container');
    /// #ENDDEBUG
    this._element = parameters.renderer.g().attr({
      class: 'dxg-tracker', stroke: 'none', 'stroke-width': 0, fill: '#000000', opacity: 0.0001,
    }).linkOn(parameters.container, { name: 'tracker', after: 'peripheral' });

    this._showTooltipCallback = (): void => {
      const { target } = this._tooltipEvent as TrackerEvent;
      const dataTarget = target['gauge-data-target'];
      const dataInfo = target['gauge-data-info'];

      this._targetEvent = null; //  Internal state must be reset strictly BEFORE callback is invoked
      if (this._tooltipTarget !== target) {
        const callback = (result: boolean): void => {
          if (result) {
            this._tooltipTarget = target;
          }
        };
        callback(this._callbacks['tooltip-show'](dataTarget, dataInfo, callback));
      }
    };
    this._hideTooltipCallback = (): void => {
      this._hideTooltipTimeout = null;
      this._targetEvent = null;
      if (this._tooltipTarget) {
        this._callbacks['tooltip-hide']();
        this._tooltipTarget = null;
      }
    };
    this._dispose = (): void => {
      clearTimeout(this._hideTooltipTimeout);
      Object.assign(this, {
        _dispose: null,
        _hideTooltipCallback: null,
        _showTooltipCallback: null,
      });
    };
    /// #DEBUG
    this._DEBUG_hideTooltipTimeoutSet = 0;
    this._DEBUG_hideTooltipTimeoutCleared = 0;
    this.TOOLTIP_HIDE_DELAY = TOOLTIP_HIDE_DELAY;
    /// #ENDDEBUG
  }

  dispose(): this {
    this._dispose();
    this.deactivate();
    this._element.off(`.${EVENT_NS}`);
    this._element.linkOff();
    Object.assign(this, { _callbacks: null, _context: null, _element: null });
    return this;
  }

  activate(): this {
    this._element.linkAppend();
    return this;
  }

  deactivate(): this {
    this._element.linkRemove().clear();
    return this;
  }

  attach(element: ThemeValue, target: ThemeValue, info: ThemeValue): this {
    element.data({ 'gauge-data-target': target, 'gauge-data-info': info }).append(this._element);
    return this;
  }

  detach(element: ThemeValue): this {
    element.remove();
    return this;
  }

  setTooltipState(state: boolean): this {
    this._element.off(`.${EVENT_NS}`);
    if (state) {
      const data = { tracker: this };
      this._element
        .on(addNamespace([pointerEvents.move], EVENT_NS), data, handleTooltipMouseOver)
        .on(addNamespace([pointerEvents.out], EVENT_NS), data, handleTooltipMouseOut)
        .on(addNamespace([pointerEvents.down], EVENT_NS), data, handleTooltipTouchStart)
        .on(addNamespace([pointerEvents.up], EVENT_NS), data, handleTooltipTouchEnd)
        .on(addNamespace([wheelEventName], EVENT_NS), data, handleTooltipMouseWheel);
    }
    return this;
  }

  setCallbacks(callbacks: TrackerCallbacks): this {
    this._callbacks = callbacks;
    return this;
  }

  _showTooltip(event: TrackerEvent): void {
    /// #DEBUG
    if (this._hideTooltipTimeout) {
      this._DEBUG_hideTooltipTimeoutCleared += 1;
    }
    /// #ENDDEBUG
    clearTimeout(this._hideTooltipTimeout);
    this._hideTooltipTimeout = null;

    if (this._tooltipTarget === event.target) {
      return;
    }
    this._tooltipEvent = event;
    this._showTooltipCallback();
  }

  _hideTooltip(delay?: number): void {
    clearTimeout(this._hideTooltipTimeout);
    if (delay) {
      /// #DEBUG
      this._DEBUG_hideTooltipTimeoutSet += 1;
      /// #ENDDEBUG
      this._hideTooltipTimeout = setTimeout(this._hideTooltipCallback, delay);
    } else {
      this._hideTooltipCallback();
    }
  }
}

/// #DEBUG
Tracker._DEBUG_reset = (): void => {
  activeTouchTooltipTracker = null;
};
/// #ENDDEBUG

ready(() => {
  eventsEngine.subscribeGlobal(
    domAdapter.getDocument(),
    addNamespace([pointerEvents.down], EVENT_NS),
    handleDocumentTooltipTouchStart,
  );
});

export default Tracker;
