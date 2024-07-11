"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _common = require("../../core/utils/common");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _uiCollection_widget = _interopRequireDefault(require("../../ui/collection/ui.collection_widget.edit"));
var _m_validation_engine = _interopRequireDefault(require("./m_validation_engine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';
const ITEM_CLASS = `${VALIDATION_SUMMARY_CLASS}-item`;
const ITEM_DATA_KEY = `${VALIDATION_SUMMARY_CLASS}-item-data`;
const ValidationSummary = _uiCollection_widget.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      focusStateEnabled: false,
      noDataText: null
    });
  },
  _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      validationGroup: true
    });
  },
  _init() {
    this.callBase();
    this._initGroupRegistration();
  },
  _initGroupRegistration() {
    const $element = this.$element();
    const group = this.option('validationGroup') || _m_validation_engine.default.findGroup($element, this._modelByElement($element));
    const groupConfig = _m_validation_engine.default.addGroup(group, true);
    this._unsubscribeGroup();
    this._groupWasInit = true;
    this._validationGroup = group;
    this.groupSubscription = this._groupValidationHandler.bind(this);
    groupConfig.on('validated', this.groupSubscription);
  },
  _unsubscribeGroup() {
    const groupConfig = _m_validation_engine.default.getGroupConfig(this._validationGroup);
    groupConfig && groupConfig.off('validated', this.groupSubscription);
  },
  _getOrderedItems(validators, items) {
    let orderedItems = [];
    (0, _iterator.each)(validators, (_, validator) => {
      // @ts-expect-error
      const foundItems = (0, _common.grep)(items, item => {
        if (item.validator === validator) {
          return true;
        }
      });
      if (foundItems.length) {
        orderedItems = orderedItems.concat(foundItems);
      }
    });
    return orderedItems;
  },
  _groupValidationHandler(params) {
    const items = this._getOrderedItems(params.validators, (0, _iterator.map)(params.brokenRules, rule => ({
      text: rule.message,
      validator: rule.validator,
      index: rule.index
    })));
    this.validators = params.validators;
    (0, _iterator.each)(this.validators, (_, validator) => {
      if (validator._validationSummary !== this) {
        let handler = this._itemValidationHandler.bind(this);
        const disposingHandler = function () {
          validator.off('validated', handler);
          validator._validationSummary = null;
          handler = null;
        };
        validator.on('validated', handler);
        validator.on('disposing', disposingHandler);
        validator._validationSummary = this;
      }
    });
    this.option('items', items);
  },
  _itemValidationHandler(_ref) {
    let {
      isValid,
      validator,
      brokenRules
    } = _ref;
    let items = this.option('items');
    let itemsChanged = false;
    let itemIndex = 0;
    while (itemIndex < items.length) {
      const item = items[itemIndex];
      if (item.validator === validator) {
        const foundRule = (0, _common.grep)(brokenRules || [], rule => rule.index === item.index)[0];
        if (isValid || !foundRule) {
          items.splice(itemIndex, 1);
          itemsChanged = true;
          continue;
        }
        if (foundRule.message !== item.text) {
          item.text = foundRule.message;
          itemsChanged = true;
        }
      }
      itemIndex++;
    }
    (0, _iterator.each)(brokenRules, (_, rule) => {
      const foundItem = (0, _common.grep)(items, item => item.validator === validator && item.index === rule.index)[0];
      if (!foundItem) {
        items.push({
          text: rule.message,
          validator,
          index: rule.index
        });
        itemsChanged = true;
      }
    });
    if (itemsChanged) {
      items = this._getOrderedItems(this.validators, items);
      this.option('items', items);
    }
  },
  _initMarkup() {
    this.$element().addClass(VALIDATION_SUMMARY_CLASS);
    this.callBase();
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'validationGroup':
        this._initGroupRegistration();
        break;
      default:
        this.callBase(args);
    }
  },
  _itemClass() {
    return ITEM_CLASS;
  },
  _itemDataKey() {
    return ITEM_DATA_KEY;
  },
  _postprocessRenderItem(params) {
    _events_engine.default.on(params.itemElement, 'click', () => {
      params.itemData.validator && params.itemData.validator.focus && params.itemData.validator.focus();
    });
  },
  _dispose() {
    this.callBase();
    this._unsubscribeGroup();
  },
  refreshValidationGroup() {
    this._initGroupRegistration();
  }
});
(0, _component_registrator.default)('dxValidationSummary', ValidationSummary);
var _default = exports.default = ValidationSummary;