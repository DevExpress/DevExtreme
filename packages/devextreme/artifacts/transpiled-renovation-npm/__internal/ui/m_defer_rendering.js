"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _transition_executor = require("../../animation/transition_executor/transition_executor");
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _position = require("../../core/utils/position");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _visibility_change = require("../../events/visibility_change");
var _load_indicator = _interopRequireDefault(require("../../ui/load_indicator"));
var _ui = _interopRequireDefault(require("../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const WIDGET_CLASS = 'dx-widget';
const DEFER_RENDERING_CLASS = 'dx-deferrendering';
const PENDING_RENDERING_CLASS = 'dx-pending-rendering';
const PENDING_RENDERING_MANUAL_CLASS = 'dx-pending-rendering-manual';
const PENDING_RENDERING_ACTIVE_CLASS = 'dx-pending-rendering-active';
const VISIBLE_WHILE_PENDING_RENDERING_CLASS = 'dx-visible-while-pending-rendering';
const INVISIBLE_WHILE_PENDING_RENDERING_CLASS = 'dx-invisible-while-pending-rendering';
const LOADINDICATOR_CONTAINER_CLASS = 'dx-loadindicator-container';
const DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS = 'dx-deferrendering-loadindicator-container';
const DEFER_DEFER_RENDERING_LOAD_INDICATOR = 'dx-deferrendering-load-indicator';
const ANONYMOUS_TEMPLATE_NAME = 'content';
const ACTIONS = ['onRendered', 'onShown'];
// @ts-expect-error
const DeferRendering = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      showLoadIndicator: false,
      renderWhen: undefined,
      animation: undefined,
      staggerItemSelector: undefined,
      onRendered: null,
      onShown: null
    });
  },
  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _init() {
    this.transitionExecutor = new _transition_executor.TransitionExecutor();
    this._initElement();
    this._initRender();
    this._$initialContent = this.$element().clone().contents();
    this._initActions();
    this.callBase();
  },
  _initElement() {
    this.$element().addClass(DEFER_RENDERING_CLASS);
  },
  _initRender() {
    const that = this;
    const $element = this.$element();
    const renderWhen = this.option('renderWhen');
    const doRender = () => that._renderDeferredContent();
    if ((0, _type.isPromise)(renderWhen)) {
      (0, _deferred.fromPromise)(renderWhen).done(doRender);
    } else {
      $element.data('dx-render-delegate', doRender);
      if (renderWhen === undefined) {
        $element.addClass(PENDING_RENDERING_MANUAL_CLASS);
      }
    }
  },
  _initActions() {
    this._actions = {};
    (0, _iterator.each)(ACTIONS, (_, action) => {
      this._actions[action] = this._createActionByOption(action) || _common.noop;
    });
  },
  _initMarkup() {
    this.callBase();
    if (!this._initContent) {
      this._initContent = this._renderContent;
      this._renderContent = () => {};
    }
    this._initContent();
  },
  _renderContentImpl() {
    this.$element().removeClass(WIDGET_CLASS);
    this.$element().append(this._$initialContent);
    this._setLoadingState();
  },
  _renderDeferredContent() {
    const that = this;
    const $element = this.$element();
    const result = (0, _deferred.Deferred)();
    $element.removeClass(PENDING_RENDERING_MANUAL_CLASS);
    $element.addClass(PENDING_RENDERING_ACTIVE_CLASS);
    this._abortRenderTask();
    this._renderTask = (0, _common.executeAsync)(() => {
      that._renderImpl().done(() => {
        const shownArgs = {
          element: $element
        };
        that._actions.onShown([shownArgs]);
        result.resolve(shownArgs);
      }).fail(function () {
        // @ts-expect-error
        result.rejectWith(result, arguments);
      });
    });
    return result.promise();
  },
  _isElementInViewport(element) {
    const rect = (0, _position.getBoundingRect)(element);
    return rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || _dom_adapter.default.getDocumentElement().clientHeight) && rect.left <= (window.innerWidth || _dom_adapter.default.getDocumentElement().clientWidth);
  },
  _animate() {
    const that = this;
    const $element = this.$element();
    const animation = (0, _window.hasWindow)() && this.option('animation');
    const staggerItemSelector = this.option('staggerItemSelector');
    let animatePromise;
    that.transitionExecutor.stop();
    if (animation) {
      if (staggerItemSelector) {
        $element.find(staggerItemSelector).each(function () {
          if (that._isElementInViewport(this)) {
            that.transitionExecutor.enter((0, _renderer.default)(this), animation);
          }
        });
      } else {
        that.transitionExecutor.enter($element, animation);
      }
      animatePromise = that.transitionExecutor.start();
    } else {
      animatePromise = (0, _deferred.Deferred)().resolve().promise();
    }
    return animatePromise;
  },
  _renderImpl() {
    const $element = this.$element();
    const renderedArgs = {
      element: $element
    };
    const contentTemplate = this._getTemplate(this._templateManager.anonymousTemplateName);
    if (contentTemplate) {
      contentTemplate.render({
        container: $element.empty(),
        noModel: true
      });
    }
    this._setRenderedState($element);
    // @ts-expect-error
    _events_engine.default.trigger($element, 'dxcontentrendered');
    this._actions.onRendered([renderedArgs]);
    this._isRendered = true;
    return this._animate();
  },
  _setLoadingState() {
    const $element = this.$element();
    const hasCustomLoadIndicator = !!$element.find(`.${VISIBLE_WHILE_PENDING_RENDERING_CLASS}`).length;
    $element.addClass(PENDING_RENDERING_CLASS);
    if (!hasCustomLoadIndicator) {
      $element.children().addClass(INVISIBLE_WHILE_PENDING_RENDERING_CLASS);
    }
    if (this.option('showLoadIndicator')) {
      this._showLoadIndicator($element);
    }
  },
  _showLoadIndicator($container) {
    // @ts-expect-error
    this._$loadIndicator = new _load_indicator.default((0, _renderer.default)('<div>'), {
      visible: true
    }).$element()
    // @ts-expect-error
    .addClass(DEFER_DEFER_RENDERING_LOAD_INDICATOR);
    (0, _renderer.default)('<div>').addClass(LOADINDICATOR_CONTAINER_CLASS).addClass(DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS).append(this._$loadIndicator).appendTo($container);
  },
  _setRenderedState() {
    const $element = this.$element();
    if (this._$loadIndicator) {
      this._$loadIndicator.remove();
    }
    $element.removeClass(PENDING_RENDERING_CLASS);
    $element.removeClass(PENDING_RENDERING_ACTIVE_CLASS);
    (0, _visibility_change.triggerShownEvent)($element.children());
  },
  _optionChanged(args) {
    const {
      value
    } = args;
    const {
      previousValue
    } = args;
    switch (args.name) {
      case 'renderWhen':
        if (previousValue === false && value === true) {
          this._renderOrAnimate();
        } else if (previousValue === true && value === false) {
          this.transitionExecutor.stop();
          this._setLoadingState();
        }
        break;
      case 'showLoadIndicator':
      case 'onRendered':
      case 'onShown':
        break;
      default:
        this.callBase(args);
    }
  },
  _renderOrAnimate() {
    let result;
    if (this._isRendered) {
      this._setRenderedState();
      result = this._animate();
    } else {
      result = this._renderDeferredContent();
    }
    return result;
  },
  renderContent() {
    return this._renderOrAnimate();
  },
  _abortRenderTask() {
    if (this._renderTask) {
      this._renderTask.abort();
      this._renderTask = undefined;
    }
  },
  _dispose() {
    this.transitionExecutor.stop(true);
    this._abortRenderTask();
    this._actions = undefined;
    this._$initialContent = undefined;
    this.callBase();
  }
});
(0, _component_registrator.default)('dxDeferRendering', DeferRendering);
var _default = exports.default = DeferRendering;