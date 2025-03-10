import type { Orientation } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { OptionChanged } from '@ts/core/widget/types';
import CollectionWidgetAsync from '@ts/ui/collection/m_collection_widget.async';

import type { CollectionWidgetEditProperties } from '../collection/m_collection_widget.edit';
import type { StepperItemProperties } from './stepper_item';
import StepperItem from './stepper_item';

export const STEPPER_CLASS = 'dx-stepper';
export const STEP_LIST_CLASS = 'dx-step-list';
export const STEP_CLASS = 'dx-step';
export const STEP_SELECTED_CLASS = 'dx-step-selected';
export const STEPPER_HORIZONTAL_ORIENTATION_CLASS = 'dx-stepper-horizontal';
export const STEPPER_VERTICAL_ORIENTATION_CLASS = 'dx-stepper-vertical';

export const STEPPER_ITEM_DATA_KEY = 'dxStepperItemData';

const ORIENTATION: Record<string, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export interface StepperProperties extends CollectionWidgetEditProperties<Stepper> {
  orientation?: Orientation;
}

class Stepper extends CollectionWidgetAsync<StepperProperties> {
  static ItemClass = StepperItem;

  _$stepsContainer!: dxElementWrapper;

  _getDefaultOptions(): StepperProperties {
    return {
      ...super._getDefaultOptions(),
      orientation: 'horizontal',
      selectionMode: 'single',
      selectOnFocus: true,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      focusStateEnabled: true,
    };
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

    this._toggleOrientationClass();

    super._initMarkup();
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
    const { name } = args;

    switch (name) {
      case 'orientation':
        this._toggleOrientationClass();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxStepper', Stepper);

export default Stepper;
