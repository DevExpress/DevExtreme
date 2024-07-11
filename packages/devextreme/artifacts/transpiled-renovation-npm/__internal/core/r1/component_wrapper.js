"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentWrapper = void 0;
require("../../../events/click");
require("../../../events/core/emitter.feedback");
require("../../../events/hover");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _dom_component = _interopRequireDefault(require("../../../core/dom_component"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _inferno = require("inferno");
var _inferno_renderer = _interopRequireDefault(require("../../../core/inferno_renderer"));
var _keyboard_processor = _interopRequireDefault(require("../../../events/core/keyboard_processor"));
var _template_wrapper = require("./template_wrapper");
var _index = require("./utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable @typescript-eslint/ban-types */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable class-methods-use-this */
const setDefaultOptionValue = (options, defaultValueGetter) => name => {
  if (Object.prototype.hasOwnProperty.call(options, name) && options[name] === undefined) {
    // eslint-disable-next-line no-param-reassign
    options[name] = defaultValueGetter(name);
  }
};
class ComponentWrapper extends _dom_component.default {
  get _propsInfo() {
    return {
      allowNull: [],
      twoWay: [],
      elements: [],
      templates: [],
      props: []
    };
  }
  constructor(element, options) {
    super(element, options);
    this._shouldRaiseContentReady = false;
    this.validateKeyDownHandler();
  }
  validateKeyDownHandler() {
    const supportedKeyNames = this.getSupportedKeyNames();
    const hasComponentDefaultKeyHandlers = supportedKeyNames.length > 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasComponentKeyDownMethod = typeof this._viewComponent.prototype.keyDown === 'function';
    if (hasComponentDefaultKeyHandlers && !hasComponentKeyDownMethod) {
      throw Error('Component\'s declaration must have \'keyDown\' method.');
    }
  }
  get viewRef() {
    var _this$_viewRef;
    return (_this$_viewRef = this._viewRef) === null || _this$_viewRef === void 0 ? void 0 : _this$_viewRef.current;
  }
  _checkContentReadyOption(fullName) {
    const contentReadyOptions = this._getContentReadyOptions().reduce((options, name) => {
      // eslint-disable-next-line no-param-reassign
      options[name] = true;
      return options;
    }, {});
    this._checkContentReadyOption = optionName => !!contentReadyOptions[optionName];
    return this._checkContentReadyOption(fullName);
  }
  _getContentReadyOptions() {
    return ['rtlEnabled'];
  }
  _fireContentReady() {
    this._actionsMap.onContentReady({});
  }
  _getDefaultOptions() {
    const viewDefaultProps = this._getViewComponentDefaultProps();
    return (0, _extend.extend)(true,
    // @ts-expect-error badly typed base class
    super._getDefaultOptions(), viewDefaultProps, this._propsInfo.twoWay.reduce((options, _ref) => {
      let [name, defaultName, eventName] = _ref;
      return _extends({}, options, {
        [name]: viewDefaultProps[defaultName],
        [eventName]: value => this.option(name, value)
      });
    }, {}), this._propsInfo.templates.reduce((options, name) => _extends({}, options, {
      [name]: null
    }), {}));
  }
  _getUnwrappedOption() {
    const unwrappedProps = {};
    Object.keys(this.option()).forEach(key => {
      unwrappedProps[key] = this.option(key);
    });
    return unwrappedProps;
  }
  _initializeComponent() {
    var _this$_templateManage;
    // @ts-expect-error badly typed base class
    super._initializeComponent();
    (_this$_templateManage = this._templateManager) === null || _this$_templateManage === void 0 || _this$_templateManage.addDefaultTemplates(this.getDefaultTemplates());
    const optionProxy = this._getUnwrappedOption();
    this._props = this._optionsWithDefaultTemplates(optionProxy);
    this._propsInfo.templates.forEach(template => {
      this._componentTemplates[template] = this._createTemplateComponent(this._props[template]);
    });
    Object.keys(this._getActionConfigsFull()).forEach(name => this._addAction(name));
    this._viewRef = (0, _inferno.createRef)();
    this.defaultKeyHandlers = this._createDefaultKeyHandlers();
  }
  _initMarkup() {
    const props = this.getProps();
    this._renderWrapper(props);
  }
  _renderWrapper(props) {
    const containerNode = this.$element()[0];
    if (!this._isNodeReplaced) {
      _inferno_renderer.default.onPreRender();
    }
    _inferno_renderer.default.render(this._viewComponent, props, containerNode, this._isNodeReplaced);
    if (!this._isNodeReplaced) {
      this._isNodeReplaced = true;
      _inferno_renderer.default.onAfterRender();
      this._shouldRaiseContentReady = true;
    }
    if (this._shouldRaiseContentReady) {
      this._fireContentReady();
      this._shouldRaiseContentReady = false;
    }
  }
  _silent(name, value) {
    // @ts-expect-error badly typed base class
    this._options.silent(name, value);
  }
  _render() {} // NOTE: Inherited from DOM_Component
  _removeWidget() {
    _inferno_renderer.default.remove(this.$element()[0]);
  }
  _dispose() {
    this._removeWidget();
    // @ts-expect-error badly typed base class
    super._dispose();
  }
  get elementAttr() {
    const element = this.$element()[0];
    if (!this._elementAttr) {
      const {
        attributes
      } = element;
      const attrs = Array.from(attributes).filter(attr => {
        var _attributes$attr$name;
        return !this._propsInfo.templates.includes(attr.name) && ((_attributes$attr$name = attributes[attr.name]) === null || _attributes$attr$name === void 0 ? void 0 : _attributes$attr$name.specified);
      }).reduce((result, _ref2) => {
        let {
          name,
          value
        } = _ref2;
        const updatedAttributes = result;
        const isDomAttr = (name in element);
        updatedAttributes[name] = value === '' && isDomAttr ? element[name] : value;
        return updatedAttributes;
      }, {});
      this._elementAttr = attrs;
      this._storedClasses = element.getAttribute('class') || '';
    }
    const elemStyle = element.style;
    const style = {};
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < elemStyle.length; i += 1) {
      style[elemStyle[i]] = elemStyle.getPropertyValue(elemStyle[i]);
    }
    this._elementAttr.style = style;
    this._elementAttr.class = this._storedClasses;
    return this._elementAttr;
  }
  _getAdditionalActionConfigs() {
    return {
      onContentReady: {
        excludeValidators: ['disabled', 'readOnly']
      }
    };
  }
  _getAdditionalProps() {
    return [];
  }
  _patchOptionValues(options) {
    const {
      allowNull,
      twoWay,
      elements,
      props
    } = this._propsInfo;
    const viewDefaultProps = this._getViewComponentDefaultProps();
    const defaultWidgetPropsKeys = Object.keys(viewDefaultProps);
    const defaultOptions = this._getDefaultOptions();
    const {
      ref,
      children,
      onKeyboardHandled
    } = options;
    const onKeyDown = onKeyboardHandled ? (_, event_options) => {
      onKeyboardHandled(event_options);
    } : undefined;
    const widgetProps = {
      ref,
      children,
      onKeyDown
    };
    [...props, ...this._getAdditionalProps()].forEach(propName => {
      if (Object.prototype.hasOwnProperty.call(options, propName)) {
        widgetProps[propName] = options[propName];
      }
    });
    allowNull.forEach(setDefaultOptionValue(widgetProps, () => null));
    defaultWidgetPropsKeys.forEach(setDefaultOptionValue(widgetProps, name => defaultOptions[name]));
    twoWay.forEach(_ref3 => {
      let [name, defaultName] = _ref3;
      setDefaultOptionValue(widgetProps, () => defaultOptions[defaultName])(name);
    });
    elements.forEach(name => {
      if (name in widgetProps) {
        const value = widgetProps[name];
        if ((0, _type.isRenderer)(value)) {
          widgetProps[name] = this._patchElementParam(value);
        }
      }
    });
    return widgetProps;
  }
  getSupportedKeyNames() {
    return [];
  }
  prepareStyleProp(props) {
    if (typeof props.style === 'string') {
      return _extends({}, props, {
        style: {},
        cssText: props.style
      });
    }
    return props;
  }
  getProps() {
    const {
      elementAttr
    } = this.option();
    const options = this._patchOptionValues(_extends({}, this._props, {
      ref: this._viewRef,
      children: this._extractDefaultSlot(),
      aria: this._aria
    }));
    this._propsInfo.templates.forEach(template => {
      options[template] = this._componentTemplates[template];
    });
    return this.prepareStyleProp(_extends({}, options, this.elementAttr, elementAttr, {
      className: [...(this.elementAttr.class ?? '').split(' '), ...((elementAttr === null || elementAttr === void 0 ? void 0 : elementAttr.class) ?? '').split(' ')].filter((c, i, a) => c && a.indexOf(c) === i).join(' ').trim(),
      class: ''
    }, this._actionsMap));
  }
  _getActionConfigs() {
    return {};
  }
  _getActionConfigsFull() {
    return _extends({}, this._getActionConfigs(), this._getAdditionalActionConfigs());
  }
  getDefaultTemplates() {
    const defaultTemplates = Object.values(this._templatesInfo);
    const result = {};
    defaultTemplates.forEach(template => {
      result[template] = 'dx-renovation-template-mock';
    });
    return result;
  }
  get _templatesInfo() {
    return {};
  }
  _optionsWithDefaultTemplates(options) {
    const templateOptions = Object.entries(this._templatesInfo).reduce((result, _ref4) => {
      let [templateName, templateValue] = _ref4;
      return _extends({}, result, {
        [templateName]: options[templateName] ?? templateValue
      });
    }, {});
    return _extends({}, options, templateOptions);
  }
  _init() {
    // @ts-expect-error badly typed base class
    super._init();
    this.customKeyHandlers = {};
    this._actionsMap = {};
    this._aria = {};
    this._componentTemplates = {};
  }
  _createDefaultKeyHandlers() {
    const result = {};
    const keys = this.getSupportedKeyNames();
    keys.forEach(key => {
      // eslint-disable-next-line
      result[key] = e => this.viewRef.keyDown(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _keyboard_processor.default.createKeyDownOptions(e));
    });
    return result;
  }
  _addAction(event, actionToAdd) {
    let action = actionToAdd;
    if (!action) {
      // @ts-expect-error badly typed base class
      const actionByOption = this._createActionByOption(event, this._getActionConfigsFull()[event]);
      action = actArgs => {
        Object.keys(actArgs).forEach(name => {
          if ((0, _type.isDefined)(actArgs[name]) && _dom_adapter.default.isNode(actArgs[name])) {
            // eslint-disable-next-line no-param-reassign
            actArgs[name] = (0, _element.getPublicElement)((0, _renderer.default)(actArgs[name]));
          }
        });
        return actionByOption(actArgs);
      };
    }
    this._actionsMap[event] = action;
  }
  _optionChanged(option) {
    const {
      name,
      fullName,
      value,
      previousValue
    } = option;
    (0, _index.updatePropsImmutable)(this._props, this.option(), name, fullName);
    if (this._propsInfo.templates.includes(name) && value !== previousValue) {
      this._componentTemplates[name] = this._createTemplateComponent(value);
    }
    if (name && this._getActionConfigsFull()[name]) {
      this._addAction(name);
    }
    this._shouldRaiseContentReady = this._shouldRaiseContentReady || this._checkContentReadyOption(fullName);
    // @ts-expect-error badly typed base class
    super._optionChanged(option);
    this._invalidate();
  }
  _extractDefaultSlot() {
    if (this.option('_hasAnonymousTemplateContent')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return _inferno_renderer.default.createElement(_template_wrapper.TemplateWrapper, {
        template: this._getTemplate(this._templateManager.anonymousTemplateName),
        transclude: true,
        renovated: true
      });
    }
    return null;
  }
  _createTemplateComponent(templateOption) {
    if (!templateOption) {
      return undefined;
    }
    const template = this._getTemplate(templateOption);
    if ((0, _type.isString)(template) && template === 'dx-renovation-template-mock') {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const templateWrapper = model => _inferno_renderer.default.createElement(_template_wrapper.TemplateWrapper, (0, _template_wrapper.buildTemplateArgs)(model, template));
    return templateWrapper;
  }
  _wrapKeyDownHandler(initialHandler) {
    return options => {
      const {
        originalEvent,
        keyName,
        which
      } = options;
      const keys = this.customKeyHandlers;
      const func = keys[keyName] || keys[which];
      // NOTE: registered handler has more priority
      if (func !== undefined) {
        const handler = func.bind(this);
        const result = handler(originalEvent, options);
        if (!result) {
          originalEvent.cancel = true;
          return originalEvent;
        }
      }
      // NOTE: make it possible to pass onKeyDown property
      return initialHandler === null || initialHandler === void 0 ? void 0 : initialHandler(originalEvent, options);
    };
  }
  _toPublicElement(element) {
    return (0, _element.getPublicElement)((0, _renderer.default)(element));
  }
  _patchElementParam(value) {
    try {
      const result = (0, _renderer.default)(value);
      const element = result === null || result === void 0 ? void 0 : result.get(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return element !== null && element !== void 0 && element.nodeType ? element : value;
    } catch (error) {
      return value;
    }
  }
  // Public API
  repaint() {
    this._isNodeReplaced = false;
    this._shouldRaiseContentReady = true;
    this._removeWidget();
    this._refresh();
  }
  _supportedKeys() {
    return _extends({}, this.defaultKeyHandlers, this.customKeyHandlers);
  }
  registerKeyHandler(key, handler) {
    this.customKeyHandlers[key] = handler;
  }
  // NOTE: this method will be deprecated
  //       aria changes should be defined in declaration or passed through property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAria(name, value) {
    this._aria[name] = value;
    this._initMarkup();
  }
  _getViewComponentDefaultProps() {
    return this._viewComponent.defaultProps || {};
  }
}
exports.ComponentWrapper = ComponentWrapper;
ComponentWrapper.IS_RENOVATED_WIDGET = false;
ComponentWrapper.IS_RENOVATED_WIDGET = true;
/* eslint-enable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */