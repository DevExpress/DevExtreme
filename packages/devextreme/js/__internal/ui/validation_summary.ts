import eventsEngine from '@js/common/core/events/core/events_engine';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { OptionChanged } from '@ts/core/widget/types';
import type { PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';
import type {
  GroupConfig,
  GroupValidatedHandler,
  GroupValidationResult,
  ValidationGroupKey,
  ValidationResultInternal,
} from '@ts/ui/validation_engine';
import ValidationEngine from '@ts/ui/validation_engine';
import type Validator from '@ts/ui/validator';

const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';
const SCREEN_READER_ONLY_CLASS = 'dx-screen-reader-only';
const ITEM_CLASS = `${VALIDATION_SUMMARY_CLASS}-item`;
const ITEM_DATA_KEY = `${VALIDATION_SUMMARY_CLASS}-item-data`;

export interface ValidationSummaryItem {
  text?: string;
  validator?: Validator;
  index?: number;
}

export interface ValidationSummaryProperties extends CollectionWidgetEditProperties<
  ValidationSummary,
  ValidationSummaryItem
> {
  validationGroup?: ValidationGroupKey;
  validator?: Validator;
}

type ItemValidationHandler = (result: ValidationResultInternal) => void;

class ValidationSummary extends CollectionWidget<
  ValidationSummaryProperties,
  ValidationSummaryItem
> {
  _groupWasInit?: boolean;

  _validationGroup?: ValidationGroupKey;

  validators?: Validator[];

  _$announceContainer?: dxElementWrapper;

  _lastAnnouncedText?: string;

  groupSubscription?: GroupValidatedHandler;

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

    Object.assign(this._optionsByReference, {
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

    const groupSubscription: GroupValidatedHandler = this._groupValidationHandler.bind(this);
    this.groupSubscription = groupSubscription;
    groupConfig.on('validated', groupSubscription);
  }

  _unsubscribeGroup(): void {
    const groupConfig: GroupConfig | undefined = ValidationEngine
      .getGroupConfig(this._validationGroup);
    groupConfig?.off('validated', this.groupSubscription);
  }

  _getOrderedItems(
    validators: Validator[],
    items: ValidationSummaryItem[],
  ): ValidationSummaryItem[] {
    const orderedItems: ValidationSummaryItem[] = [];

    for (const validator of validators) {
      const foundItems = items.filter((item): boolean => item.validator === validator);

      if (foundItems.length) {
        orderedItems.push(...foundItems);
      }
    }

    return orderedItems;
  }

  _groupValidationHandler(params: GroupValidationResult): void {
    const items = this._getOrderedItems(
      params.validators,
      (params.brokenRules ?? []).map((rule): ValidationSummaryItem => ({
        text: rule.message,
        validator: rule.validator,
        index: rule.index,
      })),
    );

    this.validators = params.validators;

    for (const validator of this.validators ?? []) {
      if (validator._validationSummary !== this) {
        let handler: ItemValidationHandler | null = this._itemValidationHandler.bind(this);
        const disposingHandler = (): void => {
          validator.off('validated', handler);
          validator._validationSummary = null;
          handler = null;
        };
        validator.on('validated', handler);
        validator.on('disposing', disposingHandler);
        validator._validationSummary = this;
      }
    }

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

  _itemValidationHandler({ isValid, validator, brokenRules }: ValidationResultInternal): void {
    let { items } = this.option();

    if (!items) {
      return;
    }

    let itemsChanged = false;

    let itemIndex = 0;
    while (itemIndex < items.length) {
      const item = items[itemIndex];
      if (item.validator === validator) {
        const foundRule = (brokenRules ?? []).find((rule): boolean => rule.index === item.index);
        if (isValid || !foundRule) {
          items.splice(itemIndex, 1);
          itemsChanged = true;
        } else {
          // eslint-disable-next-line max-depth
          if (foundRule.message !== item.text) {
            item.text = foundRule.message;
            itemsChanged = true;
          }
          itemIndex += 1;
        }
      } else {
        itemIndex += 1;
      }
    }

    for (const rule of brokenRules ?? []) {
      const foundItem = items?.find(
        (item): boolean => item.validator === validator && item.index === rule.index,
      );
      if (!foundItem) {
        items?.push({
          text: rule.message,
          validator,
          index: rule.index,
        });
        itemsChanged = true;
      }
    }

    if (itemsChanged && this.validators) {
      items = this._getOrderedItems(this.validators, items ?? []);
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

  _postprocessRenderItem(params: PostprocessRenderItemInfo<ValidationSummaryItem>): void {
    eventsEngine.on(params.itemElement, 'click', (): void => {
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
