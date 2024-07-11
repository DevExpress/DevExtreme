"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _config = _interopRequireDefault(require("./config"));
var _errors = _interopRequireDefault(require("./errors"));
var _resize_callbacks = _interopRequireDefault(require("../core/utils/resize_callbacks"));
var _component = require("./component");
var _template_manager = require("./template_manager");
var _public_component = require("./utils/public_component");
var _shadow_dom = require("./utils/shadow_dom");
var _element_data = require("./element_data");
var _iterator = require("./utils/iterator");
var _extend = require("./utils/extend");
var _element = require("../core/element");
var _common = require("./utils/common");
var _type = require("./utils/type");
var _window = require("../core/utils/window");
var _short = require("../events/short");
var _license_validation = _interopRequireWildcard(require("../__internal/core/license/license_validation"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  abstract
} = _component.Component;
const DOMComponent = _component.Component.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      width: undefined,
      height: undefined,
      rtlEnabled: (0, _config.default)().rtlEnabled,
      elementAttr: {},
      disabled: false,
      integrationOptions: {}
    }, this._useTemplates() ? _template_manager.TemplateManager.createDefaultOptions() : {});
  },
  /**
  * @name DOMComponent.ctor
  * @publicName ctor(element,options)
  * @param1 element:Element|JQuery
  * @param2 options:DOMComponentOptions|undefined
  * @hidden
  */
  ctor(element, options) {
    this._customClass = null;
    this._createElement(element);
    (0, _public_component.attachInstanceToElement)(this._$element, this, this._dispose);
    this.callBase(options);
    const validationAlreadyPerformed = (0, _license_validation.peekValidationPerformed)();
    _license_validation.default.validateLicense((0, _config.default)().licenseKey);
    if (!validationAlreadyPerformed && (0, _license_validation.peekValidationPerformed)()) {
      (0, _config.default)({
        licenseKey: ''
      });
    }
  },
  _createElement(element) {
    this._$element = (0, _renderer.default)(element);
  },
  _getSynchronizableOptionsForCreateComponent() {
    return ['rtlEnabled', 'disabled', 'templatesRenderAsynchronously'];
  },
  _checkFunctionValueDeprecation: function (optionNames) {
    if (!this.option('_ignoreFunctionValueDeprecation')) {
      optionNames.forEach(optionName => {
        if ((0, _type.isFunction)(this.option(optionName))) {
          _errors.default.log('W0017', optionName);
        }
      });
    }
  },
  _visibilityChanged: abstract,
  _dimensionChanged: abstract,
  _init() {
    this.callBase();
    this._checkFunctionValueDeprecation(['width', 'height', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'popupHeight', 'popupWidth']);
    this._attachWindowResizeCallback();
    this._initTemplateManager();
  },
  _setOptionsByDevice(instanceCustomRules) {
    this.callBase([].concat(this.constructor._classCustomRules || [], instanceCustomRules || []));
  },
  _isInitialOptionValue(name) {
    const isCustomOption = this.constructor._classCustomRules && Object.prototype.hasOwnProperty.call(this._convertRulesToOptions(this.constructor._classCustomRules), name);
    return !isCustomOption && this.callBase(name);
  },
  _attachWindowResizeCallback() {
    if (this._isDimensionChangeSupported()) {
      const windowResizeCallBack = this._windowResizeCallBack = this._dimensionChanged.bind(this);
      _resize_callbacks.default.add(windowResizeCallBack);
    }
  },
  _isDimensionChangeSupported() {
    return this._dimensionChanged !== abstract;
  },
  _renderComponent() {
    this._initMarkup();
    (0, _window.hasWindow)() && this._render();
  },
  _initMarkup() {
    const {
      rtlEnabled
    } = this.option() || {};
    this._renderElementAttributes();
    this._toggleRTLDirection(rtlEnabled);
    this._renderVisibilityChange();
    this._renderDimensions();
  },
  _render() {
    this._attachVisibilityChangeHandlers();
    (0, _shadow_dom.addShadowDomStyles)(this.$element());
  },
  _renderElementAttributes() {
    const {
      elementAttr
    } = this.option() || {};
    const attributes = (0, _extend.extend)({}, elementAttr);
    const classNames = attributes.class;
    delete attributes.class;
    this.$element().attr(attributes).removeClass(this._customClass).addClass(classNames);
    this._customClass = classNames;
  },
  _renderVisibilityChange() {
    if (this._isDimensionChangeSupported()) {
      this._attachDimensionChangeHandlers();
    }
    if (this._isVisibilityChangeSupported()) {
      const $element = this.$element();
      $element.addClass('dx-visibility-change-handler');
    }
  },
  _renderDimensions() {
    const $element = this.$element();
    const element = $element.get(0);
    const width = this._getOptionValue('width', element);
    const height = this._getOptionValue('height', element);
    if (this._isCssUpdateRequired(element, height, width)) {
      $element.css({
        width: width === null ? '' : width,
        height: height === null ? '' : height
      });
    }
  },
  _isCssUpdateRequired(element, height, width) {
    return !!((0, _type.isDefined)(width) || (0, _type.isDefined)(height) || element.style.width || element.style.height);
  },
  _attachDimensionChangeHandlers() {
    const $el = this.$element();
    const namespace = `${this.NAME}VisibilityChange`;
    _short.resize.off($el, {
      namespace
    });
    _short.resize.on($el, () => this._dimensionChanged(), {
      namespace
    });
  },
  _attachVisibilityChangeHandlers() {
    if (this._isVisibilityChangeSupported()) {
      const $el = this.$element();
      const namespace = `${this.NAME}VisibilityChange`;
      this._isHidden = !this._isVisible();
      _short.visibility.off($el, {
        namespace
      });
      _short.visibility.on($el, () => this._checkVisibilityChanged('shown'), () => this._checkVisibilityChanged('hiding'), {
        namespace
      });
    }
  },
  _isVisible() {
    const $element = this.$element();
    return $element.is(':visible');
  },
  _checkVisibilityChanged(action) {
    const isVisible = this._isVisible();
    if (isVisible) {
      if (action === 'hiding' && !this._isHidden) {
        this._visibilityChanged(false);
        this._isHidden = true;
      } else if (action === 'shown' && this._isHidden) {
        this._isHidden = false;
        this._visibilityChanged(true);
      }
    }
  },
  _isVisibilityChangeSupported() {
    return this._visibilityChanged !== abstract && (0, _window.hasWindow)();
  },
  _clean: _common.noop,
  _modelByElement() {
    const {
      modelByElement
    } = this.option();
    const $element = this.$element();
    return modelByElement ? modelByElement($element) : undefined;
  },
  _invalidate() {
    if (this._isUpdateAllowed()) {
      throw _errors.default.Error('E0007');
    }
    this._requireRefresh = true;
  },
  _refresh() {
    this._clean();
    this._renderComponent();
  },
  _dispose() {
    this._templateManager && this._templateManager.dispose();
    this.callBase();
    this._clean();
    this._detachWindowResizeCallback();
  },
  _detachWindowResizeCallback() {
    if (this._isDimensionChangeSupported()) {
      _resize_callbacks.default.remove(this._windowResizeCallBack);
    }
  },
  _toggleRTLDirection(rtl) {
    const $element = this.$element();
    $element.toggleClass('dx-rtl', rtl);
  },
  _createComponent(element, component) {
    let config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const synchronizableOptions = (0, _common.grep)(this._getSynchronizableOptionsForCreateComponent(), value => !(value in config));
    const {
      integrationOptions
    } = this.option();
    let {
      nestedComponentOptions
    } = this.option();
    nestedComponentOptions = nestedComponentOptions || _common.noop;
    const nestedComponentConfig = (0, _extend.extend)({
      integrationOptions
    }, nestedComponentOptions(this));
    synchronizableOptions.forEach(optionName => nestedComponentConfig[optionName] = this.option(optionName));
    this._extendConfig(config, nestedComponentConfig);
    let instance = void 0;
    if ((0, _type.isString)(component)) {
      const $element = (0, _renderer.default)(element)[component](config);
      instance = $element[component]('instance');
    } else if (element) {
      instance = component.getInstance(element);
      if (instance) {
        instance.option(config);
      } else {
        instance = new component(element, config);
      }
    }
    if (instance) {
      const optionChangedHandler = _ref => {
        let {
          name,
          value
        } = _ref;
        if (synchronizableOptions.includes(name)) {
          instance.option(name, value);
        }
      };
      this.on('optionChanged', optionChangedHandler);
      instance.on('disposing', () => this.off('optionChanged', optionChangedHandler));
    }
    return instance;
  },
  _extendConfig(config, extendConfig) {
    (0, _iterator.each)(extendConfig, (key, value) => {
      !Object.prototype.hasOwnProperty.call(config, key) && (config[key] = value);
    });
  },
  _defaultActionConfig() {
    const $element = this.$element();
    const context = this._modelByElement($element);
    return (0, _extend.extend)(this.callBase(), {
      context
    });
  },
  _defaultActionArgs() {
    const $element = this.$element();
    const model = this._modelByElement($element);
    const element = this.element();
    return (0, _extend.extend)(this.callBase(), {
      element,
      model
    });
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'width':
      case 'height':
        this._renderDimensions();
        break;
      case 'rtlEnabled':
        this._invalidate();
        break;
      case 'elementAttr':
        this._renderElementAttributes();
        break;
      case 'disabled':
      case 'integrationOptions':
        break;
      default:
        this.callBase(args);
        break;
    }
  },
  _removeAttributes(element) {
    const attrs = element.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if (attr) {
        const {
          name
        } = attr;
        if (!name.indexOf('aria-') || name.indexOf('dx-') !== -1 || name === 'role' || name === 'style' || name === 'tabindex') {
          element.removeAttribute(name);
        }
      }
    }
  },
  _removeClasses(element) {
    element.className = element.className.split(' ').filter(cssClass => cssClass.lastIndexOf('dx-', 0) !== 0).join(' ');
  },
  _updateDOMComponent(renderRequired) {
    if (renderRequired) {
      this._renderComponent();
    } else if (this._requireRefresh) {
      this._requireRefresh = false;
      this._refresh();
    }
  },
  endUpdate() {
    const renderRequired = this._isInitializingRequired();
    this.callBase();
    this._isUpdateAllowed() && this._updateDOMComponent(renderRequired);
  },
  $element() {
    return this._$element;
  },
  element() {
    const $element = this.$element();
    return (0, _element.getPublicElement)($element);
  },
  dispose() {
    const element = this.$element().get(0);
    (0, _element_data.cleanDataRecursive)(element, true);
    element.textContent = '';
    this._removeAttributes(element);
    this._removeClasses(element);
  },
  resetOption(optionName) {
    this.callBase(optionName);
    if (optionName === 'width' || optionName === 'height') {
      const initialOption = this.initialOption(optionName);
      !(0, _type.isDefined)(initialOption) && this.$element().css(optionName, '');
    }
  },
  _getAnonymousTemplateName() {
    return void 0;
  },
  _initTemplateManager() {
    if (this._templateManager || !this._useTemplates()) return void 0;
    const {
      integrationOptions = {}
    } = this.option();
    const {
      createTemplate
    } = integrationOptions;
    this._templateManager = new _template_manager.TemplateManager(createTemplate, this._getAnonymousTemplateName());
    this._initTemplates();
  },
  _initTemplates() {
    const {
      templates,
      anonymousTemplateMeta
    } = this._templateManager.extractTemplates(this.$element());
    const anonymousTemplate = this.option(`integrationOptions.templates.${anonymousTemplateMeta.name}`);
    templates.forEach(_ref2 => {
      let {
        name,
        template
      } = _ref2;
      this._options.silent(`integrationOptions.templates.${name}`, template);
    });
    if (anonymousTemplateMeta.name && !anonymousTemplate) {
      this._options.silent(`integrationOptions.templates.${anonymousTemplateMeta.name}`, anonymousTemplateMeta.template);
      this._options.silent('_hasAnonymousTemplateContent', true);
    }
  },
  _getTemplateByOption(optionName) {
    return this._getTemplate(this.option(optionName));
  },
  _getTemplate(templateSource) {
    const templates = this.option('integrationOptions.templates');
    const isAsyncTemplate = this.option('templatesRenderAsynchronously');
    const skipTemplates = this.option('integrationOptions.skipTemplates');
    return this._templateManager.getTemplate(templateSource, templates, {
      isAsyncTemplate,
      skipTemplates
    }, this);
  },
  _saveTemplate(name, template) {
    this._setOptionWithoutOptionChange('integrationOptions.templates.' + name, this._templateManager._createTemplate(template));
  },
  _useTemplates() {
    return true;
  }
});
DOMComponent.getInstance = function (element) {
  return (0, _public_component.getInstanceByElement)((0, _renderer.default)(element), this);
};
DOMComponent.defaultOptions = function (rule) {
  this._classCustomRules = this._classCustomRules || [];
  this._classCustomRules.push(rule);
};
var _default = exports.default = DOMComponent;
module.exports = exports.default;
module.exports.default = exports.default;