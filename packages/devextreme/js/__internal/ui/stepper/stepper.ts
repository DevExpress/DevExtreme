import type { Orientation } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import $, { type dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Item, Properties } from '@js/ui/stepper';
import { BindableTemplate } from '@ts/core/templates/m_bindable_template';
import type { Template } from '@ts/core/templates/m_template';
import { getImageContainer } from '@ts/core/utils/m_icon';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import CollectionWidgetAsync from '@ts/ui/collection/collection_widget.async';
import type {
  ItemRenderInfo,
  PostprocessRenderItemInfo,
} from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';
import type { ConnectorProperties } from '@ts/ui/stepper/connector';
import Connector from '@ts/ui/stepper/connector';
import StepperItem, {
  STEP_COMPLETED_CLASS,
  STEP_INVALID_ICON,
  STEP_VALID_ICON,
} from '@ts/ui/stepper/stepper_item';

export const STEPPER_CLASS = 'dx-stepper';
export const STEP_LIST_CLASS = 'dx-step-list';
export const STEP_CLASS = 'dx-step';
export const STEP_SELECTED_CLASS = 'dx-step-selected';
export const STEPPER_HORIZONTAL_ORIENTATION_CLASS = 'dx-stepper-horizontal';
export const STEPPER_VERTICAL_ORIENTATION_CLASS = 'dx-stepper-vertical';
export const STEP_INDICATOR_CLASS = 'dx-step-indicator';
export const STEP_TEXT_CLASS = 'dx-step-text';
export const STEP_CAPTION_CLASS = 'dx-step-caption';
export const STEP_LABEL_CLASS = 'dx-step-label';
export const STEP_OPTIONAL_MARK_CLASS = 'dx-step-optional-mark';

export const STEPPER_ITEM_DATA_KEY = 'dxStepperItemData';

export const ORIENTATION: Record<string, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export interface StepperProperties extends Properties, Omit<
  CollectionWidgetEditProperties<Stepper, Item>,
  keyof Properties<Item>
> {
  hintExpr?: (data: Item) => string | undefined;
}

class Stepper extends CollectionWidgetAsync<StepperProperties> {
  static ItemClass = StepperItem;

  _connector!: Connector;

  _$stepsContainer!: dxElementWrapper;

  _getDefaultOptions(): StepperProperties {
    return {
      ...super._getDefaultOptions(),
      orientation: 'horizontal',
      linear: true,
      selectionMode: 'single',
      selectOnFocus: true,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      focusStateEnabled: true,
      loopItemFocus: false,
      selectionRequired: true,
      hintExpr(data): string | undefined { return data ? data.hint : undefined; },
      _itemAttributes: { role: 'tab' },
    };
  }

  _supportedKeys(): SupportedKeys {
    const defaultHandlers = super._supportedKeys();
    const { linear, selectOnFocus } = this.option();

    return {
      ...defaultHandlers,
      home: linear && selectOnFocus ? defaultHandlers.leftArrow : defaultHandlers.home,
      end: linear && selectOnFocus ? defaultHandlers.rightArrow : defaultHandlers.end,
    };
  }

  _getStepIcon(data: Item): string | undefined {
    const { isValid, icon } = data;

    if (isValid === false) {
      return STEP_INVALID_ICON;
    }

    if (isValid === true) {
      return STEP_VALID_ICON;
    }

    return icon;
  }

  _getStepIndicator(data: Item): dxElementWrapper {
    const { text } = data;

    const $indicatorElement = $('<div>').addClass(STEP_INDICATOR_CLASS);

    const iconName = this._getStepIcon(data);
    const $indicatorContent = getImageContainer(iconName) ?? $('<div>').addClass(STEP_TEXT_CLASS).text(text ?? '');

    $indicatorElement.append($indicatorContent);

    return $indicatorElement;
  }

  _getStepLabel(data: Item): dxElementWrapper {
    const { label } = data;

    if (isDefined(label)) {
      return $('<div>')
        .addClass(STEP_LABEL_CLASS)
        .text(label);
    }

    return $();
  }

  _getStepOptionalMark(data: Item): dxElementWrapper {
    const { optional } = data;

    if (optional) {
      const optionalMarkText = messageLocalization.format('dxStepper-optionalMark');

      return $('<div>')
        .addClass(STEP_OPTIONAL_MARK_CLASS)
        .text(optionalMarkText);
    }

    return $();
  }

  _getStepCaption(data: Item): dxElementWrapper {
    const $stepLabel = this._getStepLabel(data);
    const $stepOptionalMark = this._getStepOptionalMark(data);

    if ($stepLabel.length || $stepOptionalMark.length) {
      const $stepCaption = $('<div>')
        .addClass(STEP_CAPTION_CLASS);

      $stepCaption
        .append($stepLabel)
        .append($stepOptionalMark);

      return $stepCaption;
    }

    return $();
  }

  _prepareDefaultItemTemplate(data: Item, $container: dxElementWrapper): void {
    const $stepIndicator = this._getStepIndicator(data);
    const $stepLabel = this._getStepCaption(data);

    $container
      .append($stepIndicator)
      .append($stepLabel);
  }

  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate((
        $container: dxElementWrapper,
        data: Item,
      ) => {
        this._prepareDefaultItemTemplate(data, $container);
      }, ['text', 'icon', 'label', 'isValid', 'optional'], this.option('integrationOptions.watchMethod')),
    });
  }

  _createItemByTemplate(
    itemTemplate: Template,
    renderArgs: ItemRenderInfo<Item>,
  ): dxElementWrapper {
    const { itemData, index } = renderArgs;

    return super._createItemByTemplate(itemTemplate, {
      ...renderArgs,
      itemData: {
        text: `${index + 1}`,
        ...itemData,
      },
    });
  }

  _getItemInstance($item: dxElementWrapper): StepperItem {
    return StepperItem.getInstance<StepperItem>($item);
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container: dxElementWrapper,
    $itemToReplace: dxElementWrapper,
  ): dxElementWrapper {
    const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);

    this._getItemInstance($itemFrame).updateInvalidClass(itemData.isValid);

    return $itemFrame;
  }

  _postprocessRenderItem(args: PostprocessRenderItemInfo<Item>): void {
    super._postprocessRenderItem(args);

    const { selectedIndex = 0 } = this.option();
    const itemInstance = this._getItemInstance(args.itemElement);

    itemInstance.changeCompleted(args.itemIndex < selectedIndex);
  }

  _itemClass(): string {
    return STEP_CLASS;
  }

  _itemContainer(): dxElementWrapper {
    return this._$stepsContainer;
  }

  _selectedItemClass(): string {
    return STEP_SELECTED_CLASS;
  }

  _isItemSelected(index: number): boolean {
    const { items = [], selectedItem } = this.option();

    return selectedItem === items[index];
  }

  _itemDataKey(): string {
    return STEPPER_ITEM_DATA_KEY;
  }

  _init(): void {
    super._init();

    this.setAria('role', 'tablist');
    this._appendStepsContainer();
  }

  _initMarkup(): void {
    $(this.element()).addClass(STEPPER_CLASS);

    this._renderConnector();
    this._toggleOrientationClass();
    this._setAriaOrientation();

    super._initMarkup();
  }

  _getConnectorOptions(): ConnectorProperties {
    const { orientation } = this.option();

    return {
      orientation,
      size: this._getConnectorSize(),
      value: this._getConnectorValue(),
    };
  }

  _renderConnector(): void {
    if (this._connector) {
      this._connector.option(this._getConnectorOptions());
      return;
    }

    this._connector = this._createComponent(
      $('<div>'),
      Connector,
      this._getConnectorOptions(),
    );

    $(this.element())
      .prepend(this._connector.$element());
  }

  _getConnectorSize(): number {
    const { items = [] } = this.option();

    const itemRatio = 100 / (items.length || 1);

    return 100 - itemRatio;
  }

  _getConnectorValue(): number {
    const { items = [], selectedIndex = 0 } = this.option();

    const segmentsCount = items.length - 1;
    const itemRatio = 100 / Math.max(segmentsCount, 1);

    return selectedIndex * itemRatio;
  }

  _appendStepsContainer(): void {
    this._$stepsContainer = $('<div>')
      .addClass(STEP_LIST_CLASS);

    $(this.element()).append(this._$stepsContainer);
  }

  _setAriaOrientation(): void {
    const { orientation } = this.option();

    this.setAria('orientation', orientation);
  }

  _toggleOrientationClass(): void {
    $(this.element())
      .toggleClass(STEPPER_HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation())
      .toggleClass(STEPPER_VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  }

  _isHorizontalOrientation(): boolean {
    const { orientation } = this.option();

    return orientation === ORIENTATION.horizontal;
  }

  _shouldPreventItemEvent(itemElement: Element | dxElementWrapper): boolean {
    const itemIndex = this._editStrategy.getIndex(itemElement) as number;
    const { linear, selectedIndex = 0 } = this.option();

    return !!linear && Math.abs(selectedIndex - itemIndex) > 1;
  }

  _itemClickHandler(
    e: DxEvent,
    args?: Record<string, unknown>,
    config?: ActionConfig,
  ): void {
    if (!this._shouldPreventItemEvent(e.currentTarget)) {
      super._itemClickHandler(e, args, config);
    }
  }

  _itemPointerHandler(e: DxEvent): void {
    if (!this._shouldPreventItemEvent(e.currentTarget)) {
      super._itemPointerHandler(e);
    }
  }

  _itemSelectHandler(e: DxEvent): void {
    if (!this._shouldPreventItemEvent(e.currentTarget)) {
      super._itemSelectHandler(e);
    }
  }

  _hover($el: dxElementWrapper | undefined, $previous: dxElementWrapper | undefined): void {
    const $hoverTarget = this._findHoverTarget($el);

    if ($hoverTarget && this._shouldPreventItemEvent($hoverTarget)) {
      return;
    }

    super._hover($el, $previous);
  }

  _focusOutHandler(e: DxEvent): void {
    this._clearFocusedItem();

    super._focusOutHandler(e);
  }

  _clearFocusedItem(): void {
    this.option('focusedElement', null);
  }

  _processChangeCompletedItems(): void {
    const itemElements = this._itemElements();

    if (!itemElements.length) {
      return;
    }

    const $lastCompletedElement = itemElements.filter(`.${STEP_COMPLETED_CLASS}`).last();
    const lastCompletedIndex = this._editStrategy.getIndex($lastCompletedElement) as number;
    const { selectedIndex = 0 } = this.option();

    const startIndex = Math.min(lastCompletedIndex + 1, selectedIndex);
    const endIndex = Math.max(lastCompletedIndex + 1, selectedIndex);
    const isCompleted = lastCompletedIndex < selectedIndex;

    for (let i = startIndex; i < endIndex; i += 1) {
      const itemInstance = this._getItemInstance($(itemElements[i]));

      itemInstance.changeCompleted(isCompleted);
    }
  }

  _postProcessSyncSelection(): void {
    this._connector.option('value', this._getConnectorValue());
    this._processChangeCompletedItems();
  }

  _syncSelectionOptions(byOption?: string): DeferredObj<unknown> {
    const parentDeferred = super._syncSelectionOptions(byOption);

    parentDeferred.done(() => {
      this._postProcessSyncSelection();
    });

    return parentDeferred;
  }

  _itemOptionChanged(
    item: Item,
    property: keyof Item,
    value: unknown,
    prevValue: unknown,
  ): void {
    switch (property) {
      case 'isValid': {
        type PropertyType = Item[typeof property];

        const itemIndex = this._getIndexByItem(item);
        const $item = $(this._itemElements()[itemIndex]);

        const itemInstance = this._getItemInstance($item);

        itemInstance.updateInvalidClass(value as PropertyType);

        super._itemOptionChanged(item, property, value, prevValue);
        break;
      }
      default:
        super._itemOptionChanged(item, property, value, prevValue);
    }
  }

  _optionChanged(args: OptionChanged<StepperProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'orientation':
        this._toggleOrientationClass();
        this._setAriaOrientation();

        this._connector.option(name, value);
        break;
      case 'linear':
        break;
      case 'hintExpr':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxStepper', Stepper);

export default Stepper;
