"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _element = require("../../core/element");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _index = require("../../events/utils/index");
var _ui = _interopRequireDefault(require("../../ui/editor/ui.data_expression"));
var _selectors = require("../../ui/widget/selectors");
var _m_drop_down_editor = _interopRequireDefault(require("../ui/drop_down_editor/m_drop_down_editor"));
var _m_utils = require("../ui/overlay/m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

const {
  getActiveElement
} = _dom_adapter.default;
const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
const ANONYMOUS_TEMPLATE_NAME = 'content';
const realDevice = _devices.default.real();
const DropDownBox = _m_drop_down_editor.default.inherit({
  _supportedKeys() {
    return (0, _extend.extend)({}, this.callBase(), {
      tab(e) {
        if (!this.option('opened')) {
          return;
        }
        const $tabbableElements = this._getTabbableElements();
        const $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();
        // @ts-expect-error
        $focusableElement && _events_engine.default.trigger($focusableElement, 'focus');
        e.preventDefault();
      }
    });
  },
  /// #DEBUG
  _realDevice: realDevice,
  /// #ENDDEBUG
  _getTabbableElements() {
    return this._getElements().filter(_selectors.tabbable);
  },
  _getElements() {
    return (0, _renderer.default)(this.content()).find('*');
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      acceptCustomValue: false,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      openOnFieldClick: true,
      displayValueFormatter(value) {
        return Array.isArray(value) ? value.join(', ') : value;
      },
      useHiddenSubmitElement: true
    });
  },
  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates() {
    this.callBase();
  },
  _initMarkup() {
    this._initDataExpressions();
    this.$element().addClass(DROP_DOWN_BOX_CLASS);
    this.callBase();
  },
  _setSubmitValue() {
    const value = this.option('value');
    const submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;
    this._getSubmitElement().val(submitValue);
  },
  _shouldUseDisplayValue(value) {
    return this.option('valueExpr') === 'this' && (0, _type.isObject)(value);
  },
  _sortValuesByKeysOrder(orderedKeys, values) {
    const sortedValues = values.sort((a, b) => orderedKeys.indexOf(a.itemKey) - orderedKeys.indexOf(b.itemKey));
    return sortedValues.map(x => x.itemDisplayValue);
  },
  _renderInputValue() {
    this._rejectValueLoading();
    const values = [];
    if (!this._dataSource) {
      this.callBase(values);
      return (0, _deferred.Deferred)().resolve();
    }
    const currentValue = this._getCurrentValue();
    let keys = currentValue ?? [];
    keys = Array.isArray(keys) ? keys : [keys];
    const itemLoadDeferreds = (0, _iterator.map)(keys, key => {
      const deferred = (0, _deferred.Deferred)();
      this._loadItem(key).always(item => {
        const displayValue = this._displayGetter(item);
        if ((0, _type.isDefined)(displayValue)) {
          values.push({
            itemKey: key,
            itemDisplayValue: displayValue
          });
        } else if (this.option('acceptCustomValue')) {
          values.push({
            itemKey: key,
            itemDisplayValue: key
          });
        }
        deferred.resolve();
      });
      return deferred;
    });
    const callBase = this.callBase.bind(this);
    return _deferred.when.apply(this, itemLoadDeferreds).always(() => {
      const orderedValues = this._sortValuesByKeysOrder(keys, values);
      this.option('displayValue', orderedValues);
      callBase(values.length && orderedValues);
    });
  },
  _loadItem(value) {
    const deferred = (0, _deferred.Deferred)();
    const that = this;
    const selectedItem = (0, _common.grep)(this.option('items') || [], item => this._isValueEquals(this._valueGetter(item), value))[0];
    if (selectedItem !== undefined) {
      deferred.resolve(selectedItem);
    } else {
      this._loadValue(value).done(item => {
        deferred.resolve(item);
      }).fail(args => {
        if (args !== null && args !== void 0 && args.shouldSkipCallback) {
          return;
        }
        if (that.option('acceptCustomValue')) {
          deferred.resolve(value);
        } else {
          deferred.reject();
        }
      });
    }
    return deferred.promise();
  },
  _popupTabHandler(e) {
    if ((0, _index.normalizeKeyName)(e) !== 'tab') return;
    const $firstTabbable = this._getTabbableElements().first().get(0);
    const $lastTabbable = this._getTabbableElements().last().get(0);
    const $target = e.target;
    const moveBackward = !!($target === $firstTabbable && e.shiftKey);
    const moveForward = !!($target === $lastTabbable && !e.shiftKey);
    if (moveBackward || moveForward) {
      this.close();
      // @ts-expect-error
      _events_engine.default.trigger(this._input(), 'focus');
      if (moveBackward) {
        e.preventDefault();
      }
    }
  },
  _renderPopupContent() {
    if (this.option('contentTemplate') === ANONYMOUS_TEMPLATE_NAME) {
      return;
    }
    const contentTemplate = this._getTemplateByOption('contentTemplate');
    if (!(contentTemplate && this.option('contentTemplate'))) {
      return;
    }
    const $popupContent = this._popup.$content();
    const templateData = {
      value: this._fieldRenderData(),
      component: this
    };
    $popupContent.empty();
    contentTemplate.render({
      container: (0, _element.getPublicElement)($popupContent),
      model: templateData
    });
  },
  _canShowVirtualKeyboard() {
    // @ts-expect-error
    return realDevice.mac; // T845484
  },
  _isNestedElementActive() {
    const activeElement = getActiveElement();
    return activeElement && this._popup.$content().get(0).contains(activeElement);
  },
  _shouldHideOnParentScroll() {
    return realDevice.deviceType === 'desktop' && this._canShowVirtualKeyboard() && this._isNestedElementActive();
  },
  _popupHiddenHandler() {
    this.callBase();
    this._popupPosition = undefined;
  },
  _popupPositionedHandler(e) {
    this.callBase(e);
    this._popupPosition = e.position;
  },
  _getDefaultPopupPosition(isRtlEnabled) {
    const {
      my,
      at
    } = this.callBase(isRtlEnabled);
    return {
      my,
      at,
      offset: {
        v: -1
      },
      collision: 'flipfit'
    };
  },
  _popupConfig() {
    const {
      focusStateEnabled
    } = this.option();
    return (0, _extend.extend)(this.callBase(), {
      tabIndex: -1,
      dragEnabled: false,
      focusStateEnabled,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      hideOnParentScroll: this._shouldHideOnParentScroll.bind(this),
      position: (0, _extend.extend)(this.option('popupPosition'), {
        of: this.$element()
      }),
      _ignoreFunctionValueDeprecation: true,
      maxHeight: function () {
        var _this$_popupPosition;
        const popupLocation = (_this$_popupPosition = this._popupPosition) === null || _this$_popupPosition === void 0 ? void 0 : _this$_popupPosition.v.location;
        return (0, _m_utils.getElementMaxHeightByWindow)(this.$element(), popupLocation);
      }.bind(this)
    });
  },
  _popupShownHandler() {
    this.callBase();
    const $firstElement = this._getTabbableElements().first();
    // @ts-expect-error
    _events_engine.default.trigger($firstElement, 'focus');
  },
  _setCollectionWidgetOption: _common.noop,
  _optionChanged(args) {
    this._dataExpressionOptionChanged(args);
    switch (args.name) {
      case 'dataSource':
        this._renderInputValue();
        break;
      case 'displayValue':
        this.option('text', args.value);
        break;
      case 'displayExpr':
        this._renderValue();
        break;
      case 'contentTemplate':
        this._invalidate();
        break;
      default:
        this.callBase(args);
    }
  }
}).include(_ui.default);
(0, _component_registrator.default)('dxDropDownBox', DropDownBox);
var _default = exports.default = DropDownBox;