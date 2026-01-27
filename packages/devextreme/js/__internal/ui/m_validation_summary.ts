import eventsEngine from '@js/common/core/events/core/events_engine';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error ts-error
import { grep } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import type { OptionChanged } from '@ts/core/widget/types';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';

import ValidationEngine from './m_validation_engine';
import type ValidationGroup from './m_validation_group';

const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';
const SCREEN_READER_ONLY_CLASS = 'dx-screen-reader-only';
const ITEM_CLASS = `${VALIDATION_SUMMARY_CLASS}-item`;
const ITEM_DATA_KEY = `${VALIDATION_SUMMARY_CLASS}-item-data`;

export interface ValidationSummaryProperties extends CollectionWidgetEditProperties<ValidationSummary> {
  validationGroup?: string;
}

class ValidationSummary extends CollectionWidget<ValidationSummaryProperties> {
  _groupWasInit?: boolean;

  _validationGroup?: ValidationGroup;

  validators?: any[];

  _$announceContainer?: dxElementWrapper;

  _lastAnnouncedText?: string;

  groupSubscription?: (params) => void;

  _getDefaultOptions(): ValidationSummaryProperties {
    return {
      ...super._getDefaultOptions(),
      focusStateEnabled: false,
      // @ts-expect-error ts-error
      noDataText: null,
    };
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      validationGroup: true,
    });
  }

  _init(): void {
    super._init();
    this._initGroupRegistration();
  }

  _initGroupRegistration(): void {
    const $element = this.$element();
    const { validationGroup } = this.option();

    const group = validationGroup
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || ValidationEngine.findGroup($element, this._modelByElement($element));
    const groupConfig = ValidationEngine.addGroup(group, true);

    this._unsubscribeGroup();

    this._groupWasInit = true;
    this._validationGroup = group;

    this.groupSubscription = this._groupValidationHandler.bind(this);
    groupConfig.on('validated', this.groupSubscription);
  }

  _unsubscribeGroup(): void {
    const groupConfig = ValidationEngine.getGroupConfig(this._validationGroup);
    groupConfig?.off('validated', this.groupSubscription);
  }

  _getOrderedItems(validators, items) {
    let orderedItems = [];

    each(validators, (_, validator) => {
      // @ts-expect-error ts-error
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
  }

  _groupValidationHandler(params): void {
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
          // @ts-expect-error ts-error
          handler = null;
        };
        validator.on('validated', handler);
        validator.on('disposing', disposingHandler);
        validator._validationSummary = this;
      }
    });

    this.option('items', items);

    this._announceOnGroupValidation();
  }

  _announceOnGroupValidation(): void {
    const { items } = this.option();

    if (!items?.length) {
      this._lastAnnouncedText = '';
      this._removeAnnounceContainer();
      return;
    }

    const text = items.map((item) => item.text).join('. ');

    if (text !== this._lastAnnouncedText) {
      this._lastAnnouncedText = text;
      this._announceText(text);
    }
  }

  _removeAnnounceContainer(): void {
    this._$announceContainer?.remove();
    this._$announceContainer = undefined;
  }

  _renderAnnounceContainer(): void {
    this._removeAnnounceContainer();

    this._$announceContainer = $('<div>')
      .addClass(SCREEN_READER_ONLY_CLASS)
      .attr('role', 'alert')
      .appendTo(this.element());
  }

  _announceText(text: string): void {
    this._renderAnnounceContainer();

    this._$announceContainer?.text(text);
  }

  _itemValidationHandler({ isValid, validator, brokenRules }): void {
    let { items } = this.option();
    let itemsChanged = false;

    let itemIndex = 0;
    // @ts-expect-error ts-error
    while (itemIndex < items.length) {
      // @ts-expect-error ts-error
      const item = items[itemIndex];
      if (item.validator === validator) {
        const foundRule = grep(brokenRules || [], (rule) => rule.index === item.index)[0];
        if (isValid || !foundRule) {
          // @ts-expect-error ts-error
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
        // @ts-expect-error ts-error
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
  }

  _initMarkup(): void {
    this.$element().addClass(VALIDATION_SUMMARY_CLASS);

    super._initMarkup();
  }

  _optionChanged(args: OptionChanged<ValidationSummaryProperties>): void {
    switch (args.name) {
      case 'validationGroup':
        this._initGroupRegistration();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _itemClass(): string {
    return ITEM_CLASS;
  }

  _itemDataKey(): string {
    return ITEM_DATA_KEY;
  }

  _postprocessRenderItem(params): void {
    eventsEngine.on(params.itemElement, 'click', () => {
      params.itemData.validator?.focus?.();
    });
  }

  _dispose(): void {
    this._removeAnnounceContainer();
    super._dispose();
    this._unsubscribeGroup();
  }

  refreshValidationGroup(): void {
    this._initGroupRegistration();
  }
}

registerComponent('dxValidationSummary', ValidationSummary);

export default ValidationSummary;
