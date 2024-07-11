"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _devices = _interopRequireDefault(require("../core/devices"));
var _utils = require("./widget/utils.ink_ripple");
var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));
var _themes = require("./themes");
var _action = _interopRequireDefault(require("../core/action"));
var _validation_engine = _interopRequireDefault(require("./validation_engine"));
var _ui = _interopRequireDefault(require("./widget/ui.widget"));
var _short = require("../events/short");
var _extend = require("../core/utils/extend");
var _function_template = require("../core/templates/function_template");
var _icon = require("../core/utils/icon");
var _element = require("../core/element");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// STYLE button

const ANONYMOUS_TEMPLATE_NAME = 'content';
class Button extends _ui.default {
  constructor() {
    super(...arguments);
    this._feedbackHideTimeout = 100;
  }
  _$content() {
    return this.$element().find('.dx-button-content');
  }
  _$submitInput() {
    return this.$element().find('.dx-button-submit-input');
  }
  _attachActiveEvents(active, inactive) {
    const $el = this._eventBindingTarget();
    const namespace = 'inkRipple';
    const selector = this._activeStateUnit;
    _short.active.off($el, {
      namespace,
      selector
    });
    _short.active.on($el, new _action.default(active), new _action.default(inactive, {
      excludeValidators: ['disabled', 'readOnly']
    }), {
      showTimeout: this._feedbackShowTimeout,
      hideTimeout: this._feedbackHideTimeout,
      selector,
      namespace
    });
  }
  _defaultOptionsRules() {
    return super._defaultOptionsRules().concat([{
      device: () => _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator(),
      options: {
        focusStateEnabled: true
      }
    }, {
      device: () => (0, _themes.isMaterial)((0, _themes.current)()),
      options: {
        useInkRipple: true
      }
    }]);
  }
  _executeClickAction(event) {
    this._clickAction({
      validationGroup: this._validationGroupConfig,
      event
    });
  }
  _findGroup() {
    const $element = this.$element();
    const model = this._modelByElement($element);
    const {
      validationGroup
    } = this.option();
    return validationGroup || _validation_engine.default.findGroup($element, model);
  }
  _getContentData() {
    const {
      icon,
      text,
      type,
      _templateData
    } = this.option();
    return (0, _extend.extend)({
      icon: type === 'back' && !icon ? 'back' : icon,
      text
    }, _templateData);
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      hoverStateEnabled: true,
      onClick: null,
      type: 'normal',
      text: '',
      icon: '',
      iconPosition: 'left',
      validationGroup: undefined,
      activeStateEnabled: true,
      template: 'content',
      useSubmitBehavior: false,
      useInkRipple: false,
      _templateData: {},
      stylingMode: 'contained'
    });
  }
  _getSubmitAction() {
    let needValidate = true;
    let validationStatus = 'valid';
    return this._createAction(_ref => {
      let {
        event
      } = _ref;
      if (needValidate) {
        const validationGroup = this._validationGroupConfig;
        if (validationGroup) {
          const {
            status,
            complete
          } = validationGroup.validate();
          validationStatus = status;
          if (status === 'pending') {
            needValidate = false;
            this.option('disabled', true);
            complete.then(_ref2 => {
              let {
                status
              } = _ref2;
              this.option('disabled', false);
              validationStatus = status;
              validationStatus === 'valid' && this._submitInput().click();
              needValidate = true;
            });
          }
        }
      }
      validationStatus !== 'valid' && event.preventDefault();
      event.stopPropagation();
    });
  }
  _initMarkup() {
    this.$element().addClass('dx-button');
    this._renderType();
    this._renderStylingMode();
    this._renderInkRipple();
    this._renderClick();
    this._updateAriaLabel();
    super._initMarkup();
    this._updateContent();
    this.setAria('role', 'button');
  }
  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  }
  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      content: new _function_template.FunctionTemplate(_ref3 => {
        let {
          model = {},
          container
        } = _ref3;
        const {
          text,
          icon
        } = model;
        const {
          iconPosition
        } = this.option();
        const $icon = (0, _icon.getImageContainer)(icon);
        const $textContainer = text && (0, _renderer.default)('<span>').text(text).addClass('dx-button-text');
        const $container = (0, _renderer.default)(container);
        $container.append($textContainer);
        if (iconPosition === 'left') {
          $container.prepend($icon);
        } else {
          $icon.addClass('dx-icon-right');
          $container.append($icon);
        }
      })
    });
    super._initTemplates();
  }
  _optionChanged(args) {
    const {
      name
    } = args;
    switch (name) {
      case 'onClick':
        this._updateClick();
        break;
      case 'icon':
      case 'text':
        this._updateContent();
        this._updateAriaLabel();
        break;
      case 'type':
        this._updateType();
        this._updateContent();
        break;
      case '_templateData':
        break;
      case 'template':
      case 'iconPosition':
        this._updateContent();
        break;
      case 'stylingMode':
        this._updateStylingMode();
        break;
      case 'useSubmitBehavior':
        this._updateSubmitInput();
        break;
      case 'useInkRipple':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
  _renderClick() {
    const $el = this.$element();
    _short.dxClick.off($el, {
      namespace: this.NAME
    });
    _short.dxClick.on($el, event => this._executeClickAction(event), {
      namespace: this.NAME
    });
    this._updateClick();
  }
  _renderInkRipple() {
    const {
      text,
      icon,
      type,
      useInkRipple
    } = this.option();
    if (useInkRipple) {
      const isOnlyIconButton = !text && icon || type === 'back';
      const _inkRipple = (0, _utils.render)(isOnlyIconButton ? {
        waveSizeCoefficient: 1,
        useHoldAnimation: false,
        isCentered: true
      } : {});
      const changeWaveVisibility = (event, visible) => {
        const {
          activeStateEnabled,
          useInkRipple
        } = this.option();
        if (useInkRipple && activeStateEnabled && !this._disposed) {
          const config = {
            element: this._$content(),
            event
          };
          visible ? _inkRipple.showWave(config) : _inkRipple.hideWave(config);
        }
      };
      this._attachActiveEvents(_ref4 => {
        let {
          event
        } = _ref4;
        return changeWaveVisibility(event, true);
      }, _ref5 => {
        let {
          event
        } = _ref5;
        return changeWaveVisibility(event);
      });
    }
  }
  _renderStylingMode() {
    const $element = this.$element();
    let {
      stylingMode
    } = this.option();
    if (['contained', 'text', 'outlined'].indexOf(stylingMode) === -1) {
      stylingMode = this._getDefaultOptions().stylingMode;
    }
    $element.addClass(`dx-button-mode-${stylingMode}`);
  }
  _renderSubmitInput() {
    const {
      useSubmitBehavior
    } = this.option();
    if (useSubmitBehavior) {
      const submitAction = this._getSubmitAction();
      const $content = this._$content();
      (0, _renderer.default)('<input>').attr('type', 'submit').attr('tabindex', -1).addClass('dx-button-submit-input').appendTo($content);
      _short.click.on(this._$submitInput(), event => submitAction({
        event
      }));
    }
  }
  _renderType() {
    const {
      type
    } = this.option();
    const $element = this.$element();
    type && $element.addClass(`dx-button-${type}`);
  }
  _submitInput() {
    return this._$submitInput().get(0);
  }
  _supportedKeys() {
    const click = e => {
      e.preventDefault();
      this._executeClickAction(e);
    };
    return (0, _extend.extend)(super._supportedKeys(), {
      space: click,
      enter: click
    });
  }
  _updateAriaLabel() {
    const ariaTarget = this._getAriaTarget();
    let {
      icon,
      text
    } = this.option();
    if (!text) {
      if ((0, _icon.getImageSourceType)(icon) === 'image') {
        icon = icon.indexOf('base64') === -1 ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : 'Base64';
      }
      text = icon || '';
    }
    ariaTarget.attr('aria-label', text || null);
  }
  _updateClick() {
    this._clickAction = this._createActionByOption('onClick', {
      excludeValidators: ['readOnly'],
      afterExecute: () => {
        const {
          useSubmitBehavior
        } = this.option();
        useSubmitBehavior && setTimeout(() => this._submitInput().click());
      }
    });
  }
  _updateContent() {
    const $element = this.$element();
    let $content = this._$content();
    const data = this._getContentData();
    const {
      template,
      iconPosition
    } = this.option();
    const {
      icon,
      text
    } = data;
    $content.length ? $content.empty() : $content = (0, _renderer.default)('<div>').addClass('dx-button-content').appendTo($element);
    $element.toggleClass('dx-button-has-icon', !!icon).toggleClass('dx-button-icon-right', !!icon && iconPosition !== 'left').toggleClass('dx-button-has-text', !!text);
    const $template = (0, _renderer.default)(this._getTemplateByOption('template').render({
      model: data,
      container: (0, _element.getPublicElement)($content),
      transclude: this._templateManager.anonymousTemplateName === template
    }));
    if ($template.hasClass('dx-template-wrapper')) {
      $template.addClass('dx-button-content');
      $content.replaceWith($template);
    }
    this._updateSubmitInput();
  }
  _updateSubmitInput() {
    const {
      useSubmitBehavior
    } = this.option();
    const $submitInput = this._$submitInput();
    if (!useSubmitBehavior && $submitInput.length) {
      $submitInput.remove();
    } else if (useSubmitBehavior && !$submitInput.length) {
      this._renderSubmitInput();
    }
  }
  _updateStylingMode() {
    const $element = this.$element();
    ['contained', 'text', 'outlined'].map(mode => `dx-button-mode-${mode}`).forEach(className => {
      $element.removeClass(className);
    });
    this._renderStylingMode();
  }
  _updateType() {
    const $element = this.$element();
    ['back', 'danger', 'default', 'normal', 'success'].map(type => `dx-button-${type}`).forEach(className => {
      $element.removeClass(className);
    });
    this._renderType();
  }
  get _validationGroupConfig() {
    return _validation_engine.default.getGroupConfig(this._findGroup());
  }
}
(0, _component_registrator.default)('dxButton', Button);
var _default = exports.default = Button;
module.exports = exports.default;
module.exports.default = exports.default;