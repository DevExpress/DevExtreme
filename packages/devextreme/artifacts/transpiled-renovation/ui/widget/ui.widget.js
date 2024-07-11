"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _action = _interopRequireDefault(require("../../core/action"));
var _dom_component = _interopRequireDefault(require("../../core/dom_component"));
var _short = require("../../events/short");
var _common = require("../../core/utils/common");
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _selectors = require("./selectors");
var _type = require("../../core/utils/type");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _version = require("../../core/utils/version");
require("../../events/click");
require("../../events/core/emitter.feedback");
require("../../events/hover");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function setAttribute(name, value, target) {
  name = name === 'role' || name === 'id' ? name : `aria-${name}`;
  value = (0, _type.isDefined)(value) ? value.toString() : null;
  target.attr(name, value);
}
const Widget = _dom_component.default.inherit({
  _feedbackHideTimeout: 400,
  _feedbackShowTimeout: 30,
  _supportedKeys() {
    return {};
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      hoveredElement: null,
      isActive: false,
      disabled: false,
      visible: true,
      hint: undefined,
      activeStateEnabled: false,
      onContentReady: null,
      hoverStateEnabled: false,
      focusStateEnabled: false,
      tabIndex: 0,
      accessKey: undefined,
      /**
      * @section Utils
      * @type function
      * @default null
      * @type_function_param1 e:object
      * @type_function_param1_field1 component:this
      * @type_function_param1_field2 element:DxElement
      * @type_function_param1_field3 model:object
      * @name WidgetOptions.onFocusIn
      * @action
      * @hidden
      */
      onFocusIn: null,
      /**
      * @section Utils
      * @type function
      * @default null
      * @type_function_param1 e:object
      * @type_function_param1_field1 component:this
      * @type_function_param1_field2 element:DxElement
      * @type_function_param1_field3 model:object
      * @name WidgetOptions.onFocusOut
      * @action
      * @hidden
      */
      onFocusOut: null,
      onKeyboardHandled: null,
      ignoreParentReadOnly: false,
      useResizeObserver: true
    });
  },
  _defaultOptionsRules: function () {
    return this.callBase().concat([{
      device: function () {
        const device = _devices.default.real();
        const platform = device.platform;
        const version = device.version;
        return platform === 'ios' && (0, _version.compare)(version, '13.3') <= 0;
      },
      options: {
        useResizeObserver: false
      }
    }]);
  },
  _init() {
    this.callBase();
    this._initContentReadyAction();
  },
  _innerWidgetOptionChanged: function (innerWidget, args) {
    const options = Widget.getOptionsFromContainer(args);
    innerWidget && innerWidget.option(options);
    this._options.cache(args.name, options);
  },
  _bindInnerWidgetOptions(innerWidget, optionsContainer) {
    const syncOptions = () => this._options.silent(optionsContainer, (0, _extend.extend)({}, innerWidget.option()));
    syncOptions();
    innerWidget.on('optionChanged', syncOptions);
  },
  _getAriaTarget() {
    return this._focusTarget();
  },
  _initContentReadyAction() {
    this._contentReadyAction = this._createActionByOption('onContentReady', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _initMarkup() {
    const {
      disabled,
      visible
    } = this.option();
    this.$element().addClass('dx-widget');
    this._toggleDisabledState(disabled);
    this._toggleVisibility(visible);
    this._renderHint();
    this._isFocusable() && this._renderFocusTarget();
    this.callBase();
  },
  _render() {
    this.callBase();
    this._renderContent();
    this._renderFocusState();
    this._attachFeedbackEvents();
    this._attachHoverEvents();
    this._toggleIndependentState();
  },
  _renderHint() {
    const {
      hint
    } = this.option();
    this.$element().attr('title', hint || null);
  },
  _renderContent() {
    (0, _common.deferRender)(() => !this._disposed ? this._renderContentImpl() : void 0).done(() => !this._disposed ? this._fireContentReadyAction() : void 0);
  },
  _renderContentImpl: _common.noop,
  _fireContentReadyAction: (0, _common.deferRenderer)(function () {
    return this._contentReadyAction();
  }),
  _dispose() {
    this._contentReadyAction = null;
    this._detachKeyboardEvents();
    this.callBase();
  },
  _resetActiveState() {
    this._toggleActiveState(this._eventBindingTarget(), false);
  },
  _clean() {
    this._cleanFocusState();
    this._resetActiveState();
    this.callBase();
    this.$element().empty();
  },
  _toggleVisibility(visible) {
    this.$element().toggleClass('dx-state-invisible', !visible);
  },
  _renderFocusState() {
    this._attachKeyboardEvents();
    if (this._isFocusable()) {
      this._renderFocusTarget();
      this._attachFocusEvents();
      this._renderAccessKey();
    }
  },
  _renderAccessKey() {
    const $el = this._focusTarget();
    const {
      accessKey
    } = this.option();
    $el.attr('accesskey', accessKey);
  },
  _isFocusable() {
    const {
      focusStateEnabled,
      disabled
    } = this.option();
    return focusStateEnabled && !disabled;
  },
  _eventBindingTarget() {
    return this.$element();
  },
  _focusTarget() {
    return this._getActiveElement();
  },
  _isFocusTarget: function (element) {
    const focusTargets = (0, _renderer.default)(this._focusTarget()).toArray();
    return focusTargets.includes(element);
  },
  _findActiveTarget($element) {
    return $element.find(this._activeStateUnit).not('.dx-state-disabled');
  },
  _getActiveElement() {
    const activeElement = this._eventBindingTarget();
    if (this._activeStateUnit) {
      return this._findActiveTarget(activeElement);
    }
    return activeElement;
  },
  _renderFocusTarget() {
    const {
      tabIndex
    } = this.option();
    this._focusTarget().attr('tabIndex', tabIndex);
  },
  _keyboardEventBindingTarget() {
    return this._eventBindingTarget();
  },
  _refreshFocusEvent() {
    this._detachFocusEvents();
    this._attachFocusEvents();
  },
  _focusEventTarget() {
    return this._focusTarget();
  },
  _focusInHandler(event) {
    if (!event.isDefaultPrevented()) {
      this._createActionByOption('onFocusIn', {
        beforeExecute: () => this._updateFocusState(event, true),
        excludeValidators: ['readOnly']
      })({
        event
      });
    }
  },
  _focusOutHandler(event) {
    if (!event.isDefaultPrevented()) {
      this._createActionByOption('onFocusOut', {
        beforeExecute: () => this._updateFocusState(event, false),
        excludeValidators: ['readOnly', 'disabled']
      })({
        event
      });
    }
  },
  _updateFocusState(_ref, isFocused) {
    let {
      target
    } = _ref;
    if (this._isFocusTarget(target)) {
      this._toggleFocusClass(isFocused, (0, _renderer.default)(target));
    }
  },
  _toggleFocusClass(isFocused, $element) {
    const $focusTarget = $element && $element.length ? $element : this._focusTarget();
    $focusTarget.toggleClass('dx-state-focused', isFocused);
  },
  _hasFocusClass(element) {
    const $focusTarget = (0, _renderer.default)(element || this._focusTarget());
    return $focusTarget.hasClass('dx-state-focused');
  },
  _isFocused() {
    return this._hasFocusClass();
  },
  _getKeyboardListeners() {
    return [];
  },
  _attachKeyboardEvents() {
    this._detachKeyboardEvents();
    const {
      focusStateEnabled,
      onKeyboardHandled
    } = this.option();
    const hasChildListeners = this._getKeyboardListeners().length;
    const hasKeyboardEventHandler = !!onKeyboardHandled;
    const shouldAttach = focusStateEnabled || hasChildListeners || hasKeyboardEventHandler;
    if (shouldAttach) {
      this._keyboardListenerId = _short.keyboard.on(this._keyboardEventBindingTarget(), this._focusTarget(), opts => this._keyboardHandler(opts));
    }
  },
  _keyboardHandler(options, onlyChildProcessing) {
    if (!onlyChildProcessing) {
      const {
        originalEvent,
        keyName,
        which
      } = options;
      const keys = this._supportedKeys(originalEvent);
      const func = keys[keyName] || keys[which];
      if (func !== undefined) {
        const handler = func.bind(this);
        const result = handler(originalEvent, options);
        if (!result) {
          return false;
        }
      }
    }
    const keyboardListeners = this._getKeyboardListeners();
    const {
      onKeyboardHandled
    } = this.option();
    keyboardListeners.forEach(listener => listener && listener._keyboardHandler(options));
    onKeyboardHandled && onKeyboardHandled(options);
    return true;
  },
  _refreshFocusState() {
    this._cleanFocusState();
    this._renderFocusState();
  },
  _cleanFocusState() {
    const $element = this._focusTarget();
    $element.removeAttr('tabIndex');
    this._toggleFocusClass(false);
    this._detachFocusEvents();
    this._detachKeyboardEvents();
  },
  _detachKeyboardEvents() {
    _short.keyboard.off(this._keyboardListenerId);
    this._keyboardListenerId = null;
  },
  _attachHoverEvents() {
    const {
      hoverStateEnabled
    } = this.option();
    const selector = this._activeStateUnit;
    const namespace = 'UIFeedback';
    const $el = this._eventBindingTarget();
    _short.hover.off($el, {
      selector,
      namespace
    });
    if (hoverStateEnabled) {
      _short.hover.on($el, new _action.default(_ref2 => {
        let {
          event,
          element
        } = _ref2;
        this._hoverStartHandler(event);
        this.option('hoveredElement', (0, _renderer.default)(element));
      }, {
        excludeValidators: ['readOnly']
      }), event => {
        this.option('hoveredElement', null);
        this._hoverEndHandler(event);
      }, {
        selector,
        namespace
      });
    }
  },
  _attachFeedbackEvents() {
    const {
      activeStateEnabled
    } = this.option();
    const selector = this._activeStateUnit;
    const namespace = 'UIFeedback';
    const $el = this._eventBindingTarget();
    _short.active.off($el, {
      namespace,
      selector
    });
    if (activeStateEnabled) {
      _short.active.on($el, new _action.default(_ref3 => {
        let {
          event,
          element
        } = _ref3;
        return this._toggleActiveState((0, _renderer.default)(element), true, event);
      }), new _action.default(_ref4 => {
        let {
          event,
          element
        } = _ref4;
        return this._toggleActiveState((0, _renderer.default)(element), false, event);
      }, {
        excludeValidators: ['disabled', 'readOnly']
      }), {
        showTimeout: this._feedbackShowTimeout,
        hideTimeout: this._feedbackHideTimeout,
        selector,
        namespace
      });
    }
  },
  _detachFocusEvents() {
    const $el = this._focusEventTarget();
    _short.focus.off($el, {
      namespace: `${this.NAME}Focus`
    });
  },
  _attachFocusEvents() {
    const $el = this._focusEventTarget();
    _short.focus.on($el, e => this._focusInHandler(e), e => this._focusOutHandler(e), {
      namespace: `${this.NAME}Focus`,
      isFocusable: (index, el) => (0, _renderer.default)(el).is(_selectors.focusable)
    });
  },
  _hoverStartHandler: _common.noop,
  _hoverEndHandler: _common.noop,
  _toggleActiveState($element, value) {
    this.option('isActive', value);
    $element.toggleClass('dx-state-active', value);
  },
  _updatedHover() {
    const hoveredElement = this._options.silent('hoveredElement');
    this._hover(hoveredElement, hoveredElement);
  },
  _findHoverTarget($el) {
    return $el && $el.closest(this._activeStateUnit || this._eventBindingTarget());
  },
  _hover($el, $previous) {
    const {
      hoverStateEnabled,
      disabled,
      isActive
    } = this.option();
    $previous = this._findHoverTarget($previous);
    $previous && $previous.toggleClass('dx-state-hover', false);
    if ($el && hoverStateEnabled && !disabled && !isActive) {
      const newHoveredElement = this._findHoverTarget($el);
      newHoveredElement && newHoveredElement.toggleClass('dx-state-hover', true);
    }
  },
  _toggleDisabledState(value) {
    this.$element().toggleClass('dx-state-disabled', Boolean(value));
    this.setAria('disabled', value || undefined);
  },
  _toggleIndependentState() {
    this.$element().toggleClass('dx-state-independent', this.option('ignoreParentReadOnly'));
  },
  _setWidgetOption(widgetName, args) {
    if (!this[widgetName]) {
      return;
    }
    if ((0, _type.isPlainObject)(args[0])) {
      (0, _iterator.each)(args[0], (option, value) => this._setWidgetOption(widgetName, [option, value]));
      return;
    }
    const optionName = args[0];
    let value = args[1];
    if (args.length === 1) {
      value = this.option(optionName);
    }
    const widgetOptionMap = this[`${widgetName}OptionMap`];
    this[widgetName].option(widgetOptionMap ? widgetOptionMap(optionName) : optionName, value);
  },
  _optionChanged(args) {
    const {
      name,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'disabled':
        this._toggleDisabledState(value);
        this._updatedHover();
        this._refreshFocusState();
        break;
      case 'hint':
        this._renderHint();
        break;
      case 'ignoreParentReadOnly':
        this._toggleIndependentState();
        break;
      case 'activeStateEnabled':
        this._attachFeedbackEvents();
        break;
      case 'hoverStateEnabled':
        this._attachHoverEvents();
        this._updatedHover();
        break;
      case 'tabIndex':
      case 'focusStateEnabled':
        this._refreshFocusState();
        break;
      case 'onFocusIn':
      case 'onFocusOut':
      case 'useResizeObserver':
        break;
      case 'accessKey':
        this._renderAccessKey();
        break;
      case 'hoveredElement':
        this._hover(value, previousValue);
        break;
      case 'isActive':
        this._updatedHover();
        break;
      case 'visible':
        this._toggleVisibility(value);
        if (this._isVisibilityChangeSupported()) {
          // TODO hiding works wrong
          this._checkVisibilityChanged(value ? 'shown' : 'hiding');
        }
        break;
      case 'onKeyboardHandled':
        this._attachKeyboardEvents();
        break;
      case 'onContentReady':
        this._initContentReadyAction();
        break;
      default:
        this.callBase(args);
    }
  },
  _isVisible() {
    const {
      visible
    } = this.option();
    return this.callBase() && visible;
  },
  beginUpdate() {
    this._ready(false);
    this.callBase();
  },
  endUpdate() {
    this.callBase();
    if (this._initialized) {
      this._ready(true);
    }
  },
  _ready(value) {
    if (arguments.length === 0) {
      return this._isReady;
    }
    this._isReady = value;
  },
  setAria() {
    if (!(0, _type.isPlainObject)(arguments.length <= 0 ? undefined : arguments[0])) {
      setAttribute(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1], (arguments.length <= 2 ? undefined : arguments[2]) || this._getAriaTarget());
    } else {
      const target = (arguments.length <= 1 ? undefined : arguments[1]) || this._getAriaTarget();
      (0, _iterator.each)(arguments.length <= 0 ? undefined : arguments[0], (name, value) => setAttribute(name, value, target));
    }
  },
  isReady() {
    return this._ready();
  },
  repaint() {
    this._refresh();
  },
  focus() {
    _short.focus.trigger(this._focusTarget());
  },
  registerKeyHandler(key, handler) {
    const currentKeys = this._supportedKeys();
    this._supportedKeys = () => (0, _extend.extend)(currentKeys, {
      [key]: handler
    });
  }
});
Widget.getOptionsFromContainer = _ref5 => {
  let {
    name,
    fullName,
    value
  } = _ref5;
  let options = {};
  if (name === fullName) {
    options = value;
  } else {
    const option = fullName.split('.').pop();
    options[option] = value;
  }
  return options;
};
var _default = exports.default = Widget;
module.exports = exports.default;
module.exports.default = exports.default;