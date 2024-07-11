"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _window = require("../../../core/utils/window");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _load_indicator = _interopRequireDefault(require("../../../ui/load_indicator"));
var _load_panel = _interopRequireDefault(require("../../../ui/load_panel"));
var _themes = require("../../../ui/themes");
var _m_scroll_viewNative = _interopRequireDefault(require("./m_scroll_view.native.pull_down"));
var _m_scroll_viewNative2 = _interopRequireDefault(require("./m_scroll_view.native.swipe_down"));
var _m_scroll_view = _interopRequireDefault(require("./m_scroll_view.simulated"));
var _m_scrollable = _interopRequireDefault(require("./m_scrollable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SCROLLVIEW_CLASS = 'dx-scrollview';
const SCROLLVIEW_CONTENT_CLASS = `${SCROLLVIEW_CLASS}-content`;
const SCROLLVIEW_TOP_POCKET_CLASS = `${SCROLLVIEW_CLASS}-top-pocket`;
const SCROLLVIEW_BOTTOM_POCKET_CLASS = `${SCROLLVIEW_CLASS}-bottom-pocket`;
const SCROLLVIEW_PULLDOWN_CLASS = `${SCROLLVIEW_CLASS}-pull-down`;
const SCROLLVIEW_REACHBOTTOM_CLASS = `${SCROLLVIEW_CLASS}-scrollbottom`;
const SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = `${SCROLLVIEW_REACHBOTTOM_CLASS}-indicator`;
const SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = `${SCROLLVIEW_REACHBOTTOM_CLASS}-text`;
const SCROLLVIEW_LOADPANEL = `${SCROLLVIEW_CLASS}-loadpanel`;
const refreshStrategies = {
  pullDown: _m_scroll_viewNative.default,
  swipeDown: _m_scroll_viewNative2.default,
  simulated: _m_scroll_view.default
};
const isServerSide = !(0, _window.hasWindow)();
const scrollViewServerConfig = {
  finishLoading: _common.noop,
  release: _common.noop,
  refresh: _common.noop,
  scrollOffset: () => ({
    top: 0,
    left: 0
  }),
  _optionChanged(args) {
    if (args.name !== 'onUpdated') {
      return this.callBase.apply(this, arguments);
    }
  }
};
const ScrollView = _m_scrollable.default.inherit(isServerSide ? scrollViewServerConfig : {
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      pullingDownText: _message.default.format('dxScrollView-pullingDownText'),
      pulledDownText: _message.default.format('dxScrollView-pulledDownText'),
      refreshingText: _message.default.format('dxScrollView-refreshingText'),
      reachBottomText: _message.default.format('dxScrollView-reachBottomText'),
      onPullDown: null,
      onReachBottom: null,
      refreshStrategy: 'pullDown'
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        const realDevice = _devices.default.real();
        return realDevice.platform === 'android';
      },
      options: {
        refreshStrategy: 'swipeDown'
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterialBased)();
      },
      options: {
        pullingDownText: '',
        pulledDownText: '',
        refreshingText: '',
        reachBottomText: ''
      }
    }]);
  },
  _init() {
    this.callBase();
    this._loadingIndicatorEnabled = true;
  },
  _initScrollableMarkup() {
    this.callBase();
    this.$element().addClass(SCROLLVIEW_CLASS);
    this._initContent();
    this._initTopPocket();
    this._initBottomPocket();
    this._initLoadPanel();
  },
  _initContent() {
    const $content = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_CONTENT_CLASS);
    this._$content.wrapInner($content);
  },
  _initTopPocket() {
    const $topPocket = this._$topPocket = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_TOP_POCKET_CLASS);
    const $pullDown = this._$pullDown = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_PULLDOWN_CLASS);
    $topPocket.append($pullDown);
    this._$content.prepend($topPocket);
  },
  _initBottomPocket() {
    const $bottomPocket = this._$bottomPocket = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_BOTTOM_POCKET_CLASS);
    const $reachBottom = this._$reachBottom = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_REACHBOTTOM_CLASS);
    const $loadContainer = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS);
    // @ts-expect-error
    const $loadIndicator = new _load_indicator.default((0, _renderer.default)('<div>')).$element();
    const $text = this._$reachBottomText = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);
    this._updateReachBottomText();
    $reachBottom.append($loadContainer.append($loadIndicator)).append($text);
    $bottomPocket.append($reachBottom);
    this._$content.append($bottomPocket);
  },
  _initLoadPanel() {
    const $loadPanelElement = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_LOADPANEL).appendTo(this.$element());
    const loadPanelOptions = {
      shading: false,
      delay: 400,
      message: this.option('refreshingText'),
      position: {
        of: this.$element()
      }
    };
    this._loadPanel = this._createComponent($loadPanelElement, _load_panel.default, loadPanelOptions);
  },
  _updateReachBottomText() {
    this._$reachBottomText.text(this.option('reachBottomText'));
  },
  _createStrategy() {
    const strategyName = this.option('useNative') ? this.option('refreshStrategy') : 'simulated';
    const strategyClass = refreshStrategies[strategyName];
    // eslint-disable-next-line new-cap
    this._strategy = new strategyClass(this);
    this._strategy.pullDownCallbacks.add(this._pullDownHandler.bind(this));
    this._strategy.releaseCallbacks.add(this._releaseHandler.bind(this));
    this._strategy.reachBottomCallbacks.add(this._reachBottomHandler.bind(this));
  },
  _createActions() {
    this.callBase();
    this._pullDownAction = this._createActionByOption('onPullDown');
    this._reachBottomAction = this._createActionByOption('onReachBottom');
    this._tryRefreshPocketState();
  },
  _tryRefreshPocketState() {
    this._pullDownEnable(this.hasActionSubscription('onPullDown'));
    this._reachBottomEnable(this.hasActionSubscription('onReachBottom'));
  },
  on(eventName) {
    const result = this.callBase.apply(this, arguments);
    if (eventName === 'pullDown' || eventName === 'reachBottom') {
      this._tryRefreshPocketState();
    }
    return result;
  },
  _pullDownEnable(enabled) {
    if (arguments.length === 0) {
      return this._pullDownEnabled;
    }
    if (this._$pullDown && this._strategy) {
      this._$pullDown.toggle(enabled);
      this._strategy.pullDownEnable(enabled);
      this._pullDownEnabled = enabled;
    }
  },
  _reachBottomEnable(enabled) {
    if (arguments.length === 0) {
      return this._reachBottomEnabled;
    }
    if (this._$reachBottom && this._strategy) {
      this._$reachBottom.toggle(enabled);
      this._strategy.reachBottomEnable(enabled);
      this._reachBottomEnabled = enabled;
    }
  },
  _pullDownHandler() {
    this._loadingIndicator(false);
    this._pullDownLoading();
  },
  _loadingIndicator(value) {
    if (arguments.length < 1) {
      return this._loadingIndicatorEnabled;
    }
    this._loadingIndicatorEnabled = value;
  },
  _pullDownLoading() {
    this.startLoading();
    this._pullDownAction();
  },
  _reachBottomHandler() {
    this._loadingIndicator(false);
    this._reachBottomLoading();
  },
  _reachBottomLoading() {
    this.startLoading();
    this._reachBottomAction();
  },
  _releaseHandler() {
    this.finishLoading();
    this._loadingIndicator(true);
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'onPullDown':
      case 'onReachBottom':
        this._createActions();
        break;
      case 'pullingDownText':
      case 'pulledDownText':
      case 'refreshingText':
      case 'refreshStrategy':
        this._invalidate();
        break;
      case 'reachBottomText':
        this._updateReachBottomText();
        break;
      default:
        this.callBase(args);
    }
  },
  content() {
    return (0, _element.getPublicElement)(this._$content.children().eq(1));
  },
  release(preventReachBottom) {
    if (preventReachBottom !== undefined) {
      this.toggleLoading(!preventReachBottom);
    }
    return this._strategy.release();
  },
  toggleLoading(showOrHide) {
    this._reachBottomEnable(showOrHide);
  },
  refresh() {
    if (!this.hasActionSubscription('onPullDown')) {
      return;
    }
    this._strategy.pendingRelease();
    this._pullDownLoading();
  },
  startLoading() {
    if (this._loadingIndicator() && this.$element().is(':visible')) {
      this._loadPanel.show();
    }
    this._lock();
  },
  finishLoading() {
    this._loadPanel.hide();
    this._unlock();
  },
  _dispose() {
    this._strategy.dispose();
    this.callBase();
    if (this._loadPanel) {
      this._loadPanel.$element().remove();
    }
  }
});
(0, _component_registrator.default)('dxScrollView', ScrollView);
var _default = exports.default = ScrollView;