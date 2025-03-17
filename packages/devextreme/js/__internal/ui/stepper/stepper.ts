import type { Orientation } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import type { DxElement } from '@js/core/element';
import $, { type dxElementWrapper } from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Item } from '@js/ui/stepper';
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
import type { StepperItemProperties } from '@ts/ui/stepper/stepper_item';
import StepperItem, { STEP_COMPLETED_CLASS } from '@ts/ui/stepper/stepper_item';

import type { CollectionWidgetEditProperties } from '../collection/m_collection_widget.edit';

export const STEPPER_CLASS = 'dx-stepper';
export const STEP_LIST_CLASS = 'dx-step-list';
export const STEP_CLASS = 'dx-step';
export const STEP_SELECTED_CLASS = 'dx-step-selected';
export const STEPPER_HORIZONTAL_ORIENTATION_CLASS = 'dx-stepper-horizontal';
export const STEPPER_VERTICAL_ORIENTATION_CLASS = 'dx-stepper-vertical';
export const STEP_INDICATOR_CLASS = 'dx-step-indicator';
export const STEP_TEXT_CLASS = 'dx-step-text';
export const STEP_TITLE_CLASS = 'dx-step-title';

const PERCENT_UNIT = '%';

export const STEPPER_ITEM_DATA_KEY = 'dxStepperItemData';

export const ORIENTATION: Record<string, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export interface StepperProperties extends CollectionWidgetEditProperties<Stepper> {
  orientation?: Orientation;
  linear?: boolean;
  isValidExpr?: (data: Item) => boolean | undefined;
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
      isValidExpr(data): boolean | undefined {
        // @ts-expect-error ts-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data ? data.isValid : undefined;
      },
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

  _prepareDefaultItemTemplate(data: StepperItemProperties, $container: dxElementWrapper): void {
    const $indicatorElement = $('<div>').addClass(STEP_INDICATOR_CLASS);
    const $iconElement = getImageContainer(data.icon) ?? $('<div>').addClass(STEP_TEXT_CLASS).text(data.text ?? '');

    $iconElement.appendTo($indicatorElement);
    $indicatorElement.prependTo($container);

    if (isDefined(data.title)) {
      const $stepTitleDiv = $('<div>').addClass(STEP_TITLE_CLASS);

      $stepTitleDiv.text(data.title);

      $stepTitleDiv.appendTo($container);
    }
  }

  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container: dxElementWrapper, data: StepperItemProperties) => {
        this._prepareDefaultItemTemplate(data, $container);
      }, ['text', 'icon', 'title', 'isValid'], this.option('integrationOptions.watchMethod')),
    });
  }

  _createItemByTemplate(
    itemTemplate: Template,
    renderArgs: ItemRenderInfo<StepperItemProperties>,
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

  _postprocessRenderItem(args: PostprocessRenderItemInfo<StepperItem>): void {
    super._postprocessRenderItem(args);

    const { selectedIndex = 0 } = this.option();
    const itemInstance = this._getItemInstance($(args.itemElement));

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

  _shouldPreventItemEvent(itemElement: Element): boolean {
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

  _processChangeCompletedItems(): void {
    const itemElements = this._itemElements();

    if (!itemElements.length) {
      return;
    }

    const lastCompletedElement = itemElements.filter(`.${STEP_COMPLETED_CLASS}`).last();
    const lastCompletedIndex = this._editStrategy.getIndex($(lastCompletedElement));
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
    item: StepperItemProperties,
    property: keyof StepperItemProperties,
    value: unknown,
    prevValue: unknown,
  ): void {
    switch (property) {
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
      case 'isValidExpr':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxStepper', Stepper);

export default Stepper;
