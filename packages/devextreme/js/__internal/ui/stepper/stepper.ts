import type { Orientation, SingleOrNone } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { DxElement } from '@js/core/element';
import $, { type dxElementWrapper } from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Item, Properties } from '@js/ui/stepper';
import { BindableTemplate } from '@ts/core/templates/m_bindable_template';
import type { Template } from '@ts/core/templates/m_template';
import { getImageContainer } from '@ts/core/utils/m_icon';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type {
  ItemRenderInfo,
  PostprocessRenderItemInfo,
} from '@ts/ui/collection/collection_widget.base';
import CollectionWidgetAsync from '@ts/ui/collection/m_collection_widget.async';
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
export const STEP_LABEL_CLASS = 'dx-step-label';
export const STEP_TITLE_CLASS = 'dx-step-title';
export const STEP_OPTIONAL_MARK_CLASS = 'dx-step-optional-mark';

const PERCENT_UNIT = '%';

export const STEPPER_ITEM_DATA_KEY = 'dxStepperItemData';

export const ORIENTATION: Record<string, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export interface StepperProperties extends Properties {
  selectionMode?: SingleOrNone;

  loopItemFocus?: boolean;

  selectionRequired?: boolean;

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
    };
  }

  _supportedKeys(): Record<string, (e: KeyboardEvent, options?: Record<string, unknown>) => void> {
    const defaultHandlers = super._supportedKeys();
    const { linear } = this.option();

    return {
      ...defaultHandlers,
      home: linear ? defaultHandlers.leftArrow : defaultHandlers.home,
      end: linear ? defaultHandlers.rightArrow : defaultHandlers.end,
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

  _prepareDefaultItemTemplate(data: Item, $container: dxElementWrapper): void {
    const { text, title, optional } = data;

    const $indicatorElement = $('<div>').addClass(STEP_INDICATOR_CLASS);

    const iconName = this._getStepIcon(data);
    const $iconElement = getImageContainer(iconName) ?? $('<div>').addClass(STEP_TEXT_CLASS).text(text ?? '');

    $iconElement.appendTo($indicatorElement);

    $indicatorElement.prependTo($container);

    const hasTitle = isDefined(title);
    const hasLabel = hasTitle || optional;

    if (hasLabel) {
      const $stepLabel = $('<div>').addClass(STEP_LABEL_CLASS);
      const $stepTitle = hasTitle ? $('<div>').addClass(STEP_TITLE_CLASS).text(title) : null;
      const $stepOptionalMark = optional
        ? $('<div>').addClass(STEP_OPTIONAL_MARK_CLASS).text(messageLocalization.format('dxStepper-optionalMark'))
        : null;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      $stepTitle && $stepLabel.prepend($stepTitle);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      $stepOptionalMark && $stepLabel.append($stepOptionalMark);

      $stepLabel.appendTo($container);
    }
  }

  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate((
        $container: dxElementWrapper,
        data: Item,
      ) => {
        this._prepareDefaultItemTemplate(data, $container);
      }, ['text', 'icon', 'title', 'isValid', 'optional'], this.option('integrationOptions.watchMethod')),
    });
  }

  _createItemByTemplate(
    itemTemplate: Template,
    renderArgs: ItemRenderInfo<Item>,
  ): DxElement {
    const { itemData, index } = renderArgs;

    return super._createItemByTemplate(itemTemplate, {
      ...renderArgs,
      itemData: {
        text: `${index + 1}`,
        ...itemData,
      },
    }) as DxElement;
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

  _postprocessRenderItem(args: PostprocessRenderItemInfo<StepperItem>): void {
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

  _itemDataKey(): string {
    return STEPPER_ITEM_DATA_KEY;
  }

  _init(): void {
    super._init();

    this._appendStepsContainer();
  }

  _initMarkup(): void {
    $(this.element()).addClass(STEPPER_CLASS);

    this._renderConnector();
    this._toggleOrientationClass();

    super._initMarkup();
  }

  _renderConnector(): void {
    if (this._connector) {
      return;
    }

    const { orientation } = this.option();

    this._connector = this._createComponent($('<div>'), Connector, {
      orientation,
      size: this._getConnectorSize(),
      value: this._getConnectorValue(),
    });

    $(this.element())
      .prepend(this._connector.$element());
  }

  _getConnectorSize(): string {
    const { items = [] } = this.option();

    const itemRatio = 100 / (items.length || 1);

    return `${100 - itemRatio}${PERCENT_UNIT}`;
  }

  _getConnectorValue(): string {
    const { items = [], selectedIndex = 0 } = this.option();

    const segmentsCount = (items.length || 1) - 1;
    const itemRatio = 100 / (segmentsCount || 1);

    return `${selectedIndex * itemRatio}${PERCENT_UNIT}`;
  }

  _appendStepsContainer(): void {
    this._$stepsContainer = $('<div>')
      .addClass(STEP_LIST_CLASS);

    $(this.element()).append(this._$stepsContainer);
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
    const itemIndex = this._editStrategy.getIndex(itemElement);
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

  _itemPointerDownHandler(e: DxEvent): void {
    if (!this._shouldPreventItemEvent(e.currentTarget)) {
      super._itemPointerDownHandler(e);
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
    const lastCompletedIndex = this._editStrategy.getIndex($lastCompletedElement);
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

  _syncSelectionOptions(byOption?: string): Promise<unknown> {
    super._syncSelectionOptions(byOption).done(() => {
      this._postProcessSyncSelection();
    });

    return Deferred().resolve().promise();
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
