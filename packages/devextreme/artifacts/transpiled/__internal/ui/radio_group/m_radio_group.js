"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _ui = _interopRequireDefault(require("../../../ui/editor/ui.data_expression"));
var _editor = _interopRequireDefault(require("../editor"));
var _m_radio_collection = _interopRequireDefault(require("./m_radio_collection"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_GROUP_HORIZONTAL_CLASS = 'dx-radiogroup-horizontal';
const RADIO_GROUP_VERTICAL_CLASS = 'dx-radiogroup-vertical';
const RADIO_GROUP_CLASS = 'dx-radiogroup';
const RADIO_FEEDBACK_HIDE_TIMEOUT = 100;
class RadioGroup extends _editor.default {
  _dataSourceOptions() {
    return {
      paginate: false
    };
  }
  _defaultOptionsRules() {
    const defaultOptionsRules = super._defaultOptionsRules();
    return defaultOptionsRules.concat([{
      device: {
        tablet: true
      },
      options: {
        layout: 'horizontal'
      }
    }, {
      device: () => _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator(),
      options: {
        focusStateEnabled: true
      }
    }]);
  }
  _fireContentReadyAction(force) {
    force && super._fireContentReadyAction();
  }
  _focusTarget() {
    return this.$element();
  }
  _getAriaTarget() {
    return this.$element();
  }
  _getDefaultOptions() {
    const defaultOptions = super._getDefaultOptions();
    // @ts-expect-error
    return (0, _extend.extend)(defaultOptions, (0, _extend.extend)(_ui.default._dataExpressionDefaultOptions(), {
      hoverStateEnabled: true,
      activeStateEnabled: true,
      layout: 'vertical'
    }));
  }
  _getItemValue(item) {
    // @ts-expect-error
    return this._valueGetter ? this._valueGetter(item) : item.text;
  }
  _getSubmitElement() {
    return this._$submitElement;
  }
  _init() {
    super._init();
    // @ts-expect-error
    this._activeStateUnit = `.${RADIO_BUTTON_CLASS}`;
    // @ts-expect-error
    this._feedbackHideTimeout = RADIO_FEEDBACK_HIDE_TIMEOUT;
    // @ts-expect-error
    this._initDataExpressions();
  }
  _initMarkup() {
    (0, _renderer.default)(this.element()).addClass(RADIO_GROUP_CLASS);
    this._renderSubmitElement();
    this.setAria('role', 'radiogroup');
    this._renderRadios();
    this._renderLayout();
    super._initMarkup();
  }
  _itemClickHandler(_ref) {
    let {
      itemElement,
      event,
      itemData
    } = _ref;
    // @ts-expect-error
    if (this.itemElements().is(itemElement)) {
      const newValue = this._getItemValue(itemData);
      if (newValue !== this.option('value')) {
        this._saveValueChangeEvent(event);
        this.option('value', newValue);
      }
    }
  }
  _getSelectedItemKeys() {
    let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.option('value');
    const isNullSelectable = this.option('valueExpr') !== 'this';
    const shouldSelectValue = isNullSelectable && value === null || (0, _type.isDefined)(value);
    return shouldSelectValue ? [value] : [];
  }
  _setSelection(currentValue) {
    // @ts-expect-error
    const value = this._unwrappedValue(currentValue);
    this._setCollectionWidgetOption('selectedItemKeys', this._getSelectedItemKeys(value));
  }
  _renderValidationState() {
    var _this$_validationMess;
    super._renderValidationState();
    // @ts-expect-error
    (_this$_validationMess = this._validationMessage) === null || _this$_validationMess === void 0 || _this$_validationMess.$content().attr('role', 'alert');
  }
  _optionChanged(args) {
    const {
      name,
      value
    } = args;
    // @ts-expect-error
    this._dataExpressionOptionChanged(args);
    switch (name) {
      case 'dataSource':
        this._invalidate();
        break;
      case 'focusStateEnabled':
      case 'accessKey':
      case 'tabIndex':
        this._setCollectionWidgetOption(name, value);
        break;
      case 'disabled':
        super._optionChanged(args);
        this._setCollectionWidgetOption(name, value);
        break;
      case 'valueExpr':
        // @ts-expect-error
        this._setCollectionWidgetOption('keyExpr', this._getCollectionKeyExpr());
        break;
      case 'value':
        this._setSelection(value);
        this._setSubmitValue(value);
        super._optionChanged(args);
        break;
      case 'items':
        this._setSelection(this.option('value'));
        break;
      case 'itemTemplate':
      case 'displayExpr':
        break;
      case 'layout':
        this._renderLayout();
        this._updateItemsSize();
        break;
      default:
        super._optionChanged(args);
    }
  }
  _render() {
    super._render();
    this._updateItemsSize();
  }
  _renderLayout() {
    const layout = this.option('layout');
    const $element = (0, _renderer.default)(this.element());
    $element.toggleClass(RADIO_GROUP_VERTICAL_CLASS, layout === 'vertical');
    $element.toggleClass(RADIO_GROUP_HORIZONTAL_CLASS, layout === 'horizontal');
  }
  _renderRadios() {
    this._areRadiosCreated = (0, _deferred.Deferred)();
    const $radios = (0, _renderer.default)('<div>').appendTo(this.$element());
    const {
      displayExpr,
      accessKey,
      focusStateEnabled,
      itemTemplate,
      tabIndex
    } = this.option();
    this._createComponent($radios, _m_radio_collection.default, {
      onInitialized: _ref2 => {
        let {
          component
        } = _ref2;
        this._radios = component;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onContentReady: e => {
        this._fireContentReadyAction(true);
      },
      // @ts-expect-error
      onItemClick: this._itemClickHandler.bind(this),
      displayExpr,
      accessKey,
      // @ts-expect-error
      dataSource: this._dataSource,
      focusStateEnabled,
      itemTemplate,
      // @ts-expect-error
      keyExpr: this._getCollectionKeyExpr(),
      noDataText: '',
      scrollingEnabled: false,
      selectByClick: false,
      selectionMode: 'single',
      selectedItemKeys: this._getSelectedItemKeys(),
      tabIndex
    });
    this._areRadiosCreated.resolve();
  }
  _renderSubmitElement() {
    this._$submitElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this.$element());
    this._setSubmitValue();
  }
  _setOptionsByReference() {
    super._setOptionsByReference();
    (0, _extend.extend)(this._optionsByReference, {
      value: true
    });
  }
  _setSubmitValue(value) {
    value = value ?? this.option('value');
    const submitValue = this.option('valueExpr') === 'this'
    // @ts-expect-error
    ? this._displayGetter(value) : value;
    this._$submitElement.val(submitValue);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setCollectionWidgetOption(name, value) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._areRadiosCreated.done(this._setWidgetOption.bind(this, '_radios', arguments));
  }
  _updateItemsSize() {
    if (this.option('layout') === 'horizontal') {
      var _this$itemElements;
      (_this$itemElements = this.itemElements()) === null || _this$itemElements === void 0 || _this$itemElements.css('height', 'auto');
    } else {
      var _this$itemElements2;
      // @ts-expect-error
      const itemsCount = this.option('items').length;
      (_this$itemElements2 = this.itemElements()) === null || _this$itemElements2 === void 0 || _this$itemElements2.css('height', `${100 / itemsCount}%`);
    }
  }
  focus() {
    var _this$_radios;
    (_this$_radios = this._radios) === null || _this$_radios === void 0 || _this$_radios.focus();
  }
  itemElements() {
    var _this$_radios2;
    return (_this$_radios2 = this._radios) === null || _this$_radios2 === void 0 ? void 0 : _this$_radios2._itemElements();
  }
}
// @ts-expect-error
RadioGroup.include(_ui.default);
// @ts-expect-error
(0, _component_registrator.default)('dxRadioGroup', RadioGroup);
var _default = exports.default = RadioGroup;