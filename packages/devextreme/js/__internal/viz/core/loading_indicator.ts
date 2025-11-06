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

import { patchFontOptions as _patchFontOptions } from './utils';

const STATE_HIDDEN = 0;
const STATE_SHOWN = 1;

const ANIMATION_EASING = 'linear';
const ANIMATION_DURATION = 400;

const LOADING_INDICATOR_READY = 'loadingIndicatorReady';

export let LoadingIndicator = function (parameters) {
  const that = this;
  const renderer = parameters.renderer;
  that._group = renderer.g().attr({ class: 'dx-loading-indicator' }).linkOn(renderer.root, { name: 'loading-indicator', after: 'peripheral' });
  that._rect = renderer.rect().attr({ opacity: 0 }).append(that._group);
  that._text = renderer.text().attr({ align: 'center' }).append(that._group);
  that._createStates(parameters.eventTrigger, that._group, renderer.root, parameters.notify);
};

LoadingIndicator.prototype = {
  constructor: LoadingIndicator,

  _createStates(eventTrigger, group, root, notify) {
    const that = this;
    that._states = [{
      opacity: 0,
      start() {
        notify(false);
      },
      complete() {
        group.linkRemove();
        root.css({ 'pointer-events': '' });
        eventTrigger(LOADING_INDICATOR_READY);
      },
    }, {
      opacity: 0.85,
      start() {
        group.linkAppend();
        root.css({ 'pointer-events': 'none' });
        notify(true);
      },
      complete() {
        eventTrigger(LOADING_INDICATOR_READY);
      },
    }];
    that._state = STATE_HIDDEN;
  },

  setSize(size) {
    const width = size.width;
    const height = size.height;
    this._rect.attr({ width, height });
    this._text.attr({ x: width / 2, y: height / 2 });
  },

  setOptions(options) {
    this._rect.attr({ fill: options.backgroundColor });
    this._text.css(_patchFontOptions(options.font)).attr({ text: options.text, class: options.cssClass });
    this[options.show ? 'show' : 'hide']();
  },

  dispose() {
    const that = this;
    that._group.linkRemove().linkOff();
    that._group = that._rect = that._text = that._states = null;
  },

  _transit(stateId) {
    const that = this;
    let state;
    if (that._state !== stateId) {
      that._state = stateId;
      that._isHiding = false;
      state = that._states[stateId];
      that._rect.stopAnimation().animate({ opacity: state.opacity }, {
        complete: state.complete,
        easing: ANIMATION_EASING,
        duration: ANIMATION_DURATION,
        unstoppable: true, // T261694
      });
      that._noHiding = true;
      state.start();
      that._noHiding = false;
    }
  },

  show() {
    this._transit(STATE_SHOWN);
  },

  hide() {
    this._transit(STATE_HIDDEN);
  },

  scheduleHiding() {
    if (!this._noHiding) {
      this._isHiding = true;
    }
  },

  fulfillHiding() {
    if (this._isHiding) {
      this.hide();
    }
  },
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
