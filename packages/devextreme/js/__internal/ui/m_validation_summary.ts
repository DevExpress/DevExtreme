import eventsEngine from '@js/common/core/events/core/events_engine';
import registerComponent from '@js/core/component_registrator';
// @ts-expect-error
import { grep } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.edit';

import ValidationEngine from './m_validation_engine';

const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';
const ITEM_CLASS = `${VALIDATION_SUMMARY_CLASS}-item`;
const ITEM_DATA_KEY = `${VALIDATION_SUMMARY_CLASS}-item-data`;
// @ts-expect-error
const ValidationSummary = CollectionWidget.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      focusStateEnabled: false,
      noDataText: null,
    });
  },

  _setOptionsByReference() {
    this.callBase();

    extend(this._optionsByReference, {
      validationGroup: true,
    });
  },

  _init() {
    this.callBase();
    this._initGroupRegistration();
  },

  _initGroupRegistration() {
    const $element = this.$element();
    const group = this.option('validationGroup')
            || ValidationEngine.findGroup($element, this._modelByElement($element));
    const groupConfig = ValidationEngine.addGroup(group, true);

    this._unsubscribeGroup();

    this._groupWasInit = true;
    this._validationGroup = group;

    this.groupSubscription = this._groupValidationHandler.bind(this);
    groupConfig.on('validated', this.groupSubscription);
  },

  _unsubscribeGroup() {
    const groupConfig = ValidationEngine.getGroupConfig(this._validationGroup);
    groupConfig && groupConfig.off('validated', this.groupSubscription);
  },

  _getOrderedItems(validators, items) {
    let orderedItems = [];

    each(validators, (_, validator) => {
      // @ts-expect-error
      const foundItems = grep(items, (item) => {
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
    const items = this._getOrderedItems(params.validators, map(params.brokenRules, (rule) => ({
      text: rule.message,
      validator: rule.validator,
      index: rule.index,
    })));

    this.validators = params.validators;

    each(this.validators, (_, validator) => {
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

  _itemValidationHandler({ isValid, validator, brokenRules }) {
    let items = this.option('items');
    let itemsChanged = false;

    let itemIndex = 0;
    while (itemIndex < items.length) {
      const item = items[itemIndex];
      if (item.validator === validator) {
        const foundRule = grep(brokenRules || [], (rule) => rule.index === item.index)[0];
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
    each(brokenRules, (_, rule) => {
      const foundItem = grep(items, (item) => item.validator === validator && item.index === rule.index)[0];
      if (!foundItem) {
        items.push({
          text: rule.message,
          validator,
          index: rule.index,
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
    eventsEngine.on(params.itemElement, 'click', () => {
      params.itemData.validator && params.itemData.validator.focus && params.itemData.validator.focus();
    });
  },

  _dispose() {
    this.callBase();
    this._unsubscribeGroup();
  },

  refreshValidationGroup() {
    this._initGroupRegistration();
  },
});

registerComponent('dxValidationSummary', ValidationSummary);

export default ValidationSummary;
