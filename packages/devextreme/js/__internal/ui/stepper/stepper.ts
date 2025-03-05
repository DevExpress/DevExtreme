import type { Orientation } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import type { OptionChanged } from '@ts/core/widget/types';
import CollectionWidgetAsync from '@ts/ui/collection/m_collection_widget.async';

import type { CollectionWidgetEditProperties } from '../collection/m_collection_widget.edit';
import type { StepperItemProperties } from './stepper_item';
import StepperItem from './stepper_item';

export const STEPPER_CLASS = 'dx-stepper';
export const STEPPER_ITEM_CLASS = 'dx-stepper-item';
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

  _getDefaultOptions(): StepperProperties {
    return {
      ...super._getDefaultOptions(),
      orientation: 'horizontal',
    };
  }

  _itemClass(): string {
    return STEPPER_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return STEPPER_ITEM_DATA_KEY;
  }

  _initMarkup(): void {
    $(this.element()).addClass(STEPPER_CLASS);

    this._toggleOrientationClass();

    super._initMarkup();
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
