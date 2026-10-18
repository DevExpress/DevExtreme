/* eslint-disable import/no-import-module-exports */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import type { ThemeValue } from './base_theme_manager';
import { patchFontOptions as _patchFontOptions } from './utils';

const STATE_HIDDEN = 0;
const STATE_SHOWN = 1;

const ANIMATION_EASING = 'linear';
const ANIMATION_DURATION = 400;

const LOADING_INDICATOR_READY = 'loadingIndicatorReady';

type LoadingIndicatorEventTrigger = (name: string) => void;

type LoadingIndicatorNotify = (state: boolean) => void;

interface LoadingIndicatorParams {
  renderer: ThemeValue;
  eventTrigger: LoadingIndicatorEventTrigger;
  notify: LoadingIndicatorNotify;
}

interface LoadingIndicatorState {
  opacity: number;
  start: () => void;
  complete: () => void;
}

export let LoadingIndicator = class LoadingIndicator {
  declare _group: ThemeValue;

  declare _rect: ThemeValue;

  declare _text: ThemeValue;

  declare _states: LoadingIndicatorState[];

  declare _state: number;

  declare _isHiding: boolean;

  declare _noHiding: boolean;

  constructor(parameters: LoadingIndicatorParams) {
    const renderer = parameters.renderer;
    this._group = renderer.g().attr({ class: 'dx-loading-indicator' }).linkOn(renderer.root, { name: 'loading-indicator', after: 'peripheral' });
    this._rect = renderer.rect().attr({ opacity: 0 }).append(this._group);
    this._text = renderer.text().attr({ align: 'center' }).append(this._group);
    this._createStates(parameters.eventTrigger, this._group, renderer.root, parameters.notify);
  }

  _createStates(eventTrigger: LoadingIndicatorEventTrigger, group: ThemeValue, root: ThemeValue, notify: LoadingIndicatorNotify): void {
    this._states = [{
      opacity: 0,
      start(): void {
        notify(false);
      },
      complete(): void {
        group.linkRemove();
        root.css({ 'pointer-events': '' });
        eventTrigger(LOADING_INDICATOR_READY);
      },
    }, {
      opacity: 0.85,
      start(): void {
        group.linkAppend();
        root.css({ 'pointer-events': 'none' });
        notify(true);
      },
      complete(): void {
        eventTrigger(LOADING_INDICATOR_READY);
      },
    }];
    this._state = STATE_HIDDEN;
  }

  setSize(size: { width: number; height: number }): void {
    const width = size.width;
    const height = size.height;
    this._rect.attr({ width, height });
    this._text.attr({ x: width / 2, y: height / 2 });
  }

  setOptions(options: ThemeValue): void {
    this._rect.attr({ fill: options.backgroundColor });
    this._text.css(_patchFontOptions(options.font)).attr({ text: options.text, class: options.cssClass });
    this[options.show ? 'show' : 'hide']();
  }

  dispose(): void {
    this._group.linkRemove().linkOff();
    // @ts-expect-error dispose drops the references kept in non-nullable fields
    this._group = this._rect = this._text = this._states = null;
  }

  _transit(stateId: number): void {
    let state: LoadingIndicatorState;
    if (this._state !== stateId) {
      this._state = stateId;
      this._isHiding = false;
      state = this._states[stateId];
      this._rect.stopAnimation().animate({ opacity: state.opacity }, {
        complete: state.complete,
        easing: ANIMATION_EASING,
        duration: ANIMATION_DURATION,
        unstoppable: true, // T261694
      });
      this._noHiding = true;
      state.start();
      this._noHiding = false;
    }
  }

  show(): void {
    this._transit(STATE_SHOWN);
  }

  hide(): void {
    this._transit(STATE_HIDDEN);
  }

  scheduleHiding(): void {
    if (!this._noHiding) {
      this._isHiding = true;
    }
  }

  fulfillHiding(): void {
    if (this._isHiding) {
      this.hide();
    }
  }
};

export const plugin = {
  name: 'loading_indicator',
  init() {
    const that = this;

    that._loadingIndicator = new LoadingIndicator({ eventTrigger: that._eventTrigger, renderer: that._renderer, notify });
    that._scheduleLoadingIndicatorHiding();
    function notify(state) {
      // This flag is used to suppress redundant `_optionChanged` notifications caused by the mechanism that synchronizes the `loadingIndicator.show` option and the loading indicator visibility
      that._skipLoadingIndicatorOptions = true;
      that.option('loadingIndicator', { show: state });
      that._skipLoadingIndicatorOptions = false;
      if (state) {
        that._stopCurrentHandling();
      }
    }
  },
  dispose() {
    this._loadingIndicator.dispose();
    this._loadingIndicator = null;
  },
  members: {
    _scheduleLoadingIndicatorHiding() {
      this._loadingIndicator.scheduleHiding();
    },
    _fulfillLoadingIndicatorHiding() {
      this._loadingIndicator.fulfillHiding();
    },
    showLoadingIndicator() {
      this._loadingIndicator.show();
    },
    hideLoadingIndicator() {
      this._loadingIndicator.hide();
    },
    _onBeginUpdate() {
      if (!this._optionChangedLocker) {
        this._scheduleLoadingIndicatorHiding();
      }
    },
  },
  extenders: {
    _dataSourceLoadingChangedHandler(isLoading) {
      if (isLoading && (this._options.silent('loadingIndicator') || {}).enabled) {
        this._loadingIndicator.show();
      }
    },

    _setContentSize() {
      this._loadingIndicator.setSize(this._canvas);
    },
    endUpdate() {
      if (this._initialized && this._dataIsReady()) {
        this._fulfillLoadingIndicatorHiding();
      }
    },
  },
  customize(constructor) {
    const proto = constructor.prototype;

    // Of course this looks dirty - but cleaning it is another task. For now it has been just extracted from BaseWidget with minimal changes.
    if (proto._dataSourceChangedHandler) {
      const _dataSourceChangedHandler = proto._dataSourceChangedHandler;
      proto._dataSourceChangedHandler = function () {
        this._scheduleLoadingIndicatorHiding();
        _dataSourceChangedHandler.apply(this, arguments);
      };
    }
    constructor.addChange({
      code: 'LOADING_INDICATOR',
      handler() {
        if (!this._skipLoadingIndicatorOptions) {
          this._loadingIndicator.setOptions(this._getOption('loadingIndicator'));
        }
        this._scheduleLoadingIndicatorHiding();
      },
      isThemeDependent: true,
      option: 'loadingIndicator',
      isOptionChange: true,
    });
    proto._eventsMap.onLoadingIndicatorReady = { name: 'loadingIndicatorReady' };
    const _drawn = proto._drawn;
    proto._drawn = function () {
      _drawn.apply(this, arguments);
      if (this._dataIsReady()) {
        this._fulfillLoadingIndicatorHiding();
      }
    };
  },
  fontFields: ['loadingIndicator.font'],
};

/// #DEBUG
exports.DEBUG_set_LoadingIndicator = function (value) {
  LoadingIndicator = value;
};
/// #ENDDEBUG
