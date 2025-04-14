import type { Orientation } from '@js/common';
import type { Properties as DOMComponentProperties } from '@js/core/dom_component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { styleProp } from '@js/core/utils/style';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

import { ORIENTATION } from './stepper';

export const STEPPER_CONNECTOR_CLASS = 'dx-stepper-connector';
export const STEPPER_CONNECTOR_HORIZONTAL_ORIENTATION_CLASS = 'dx-stepper-connector-horizontal';
export const STEPPER_CONNECTOR_VERTICAL_ORIENTATION_CLASS = 'dx-stepper-connector-vertical';
export const STEPPER_CONNECTOR_VALUE_CLASS = 'dx-stepper-connector-value';

const PERCENT_UNIT = '%';
const FLEX_GROW = 'flexGrow';
export const MAX_SIZE = 100;

export interface ConnectorProperties extends DOMComponentProperties {
  orientation?: Orientation;

  size: number;

  value: number;
}

class Connector extends DOMComponent<Connector, ConnectorProperties> {
  _getDefaultOptions(): ConnectorProperties {
    return {
      ...super._getDefaultOptions(),
      orientation: 'horizontal',
      size: MAX_SIZE,
      value: 0,
    };
  }

  _init(): void {
    super._init();

    $(this.element()).addClass(STEPPER_CONNECTOR_CLASS);
  }

  _initMarkup(): void {
    super._initMarkup();

    this._toggleOrientationClass();
    this._renderContent();

    this._updateDimensions();
  }

  _updateDimensions(): void {
    const isHorizontal = this._isHorizontalOrientation();

    const dimension = isHorizontal ? 'width' : 'height';
    const inverseDimension = isHorizontal ? 'height' : 'width';

    const { size } = this.option();

    this.option(inverseDimension, null);
    this.option(dimension, `${size}${PERCENT_UNIT}`);

    this._updateConnectorValue();
  }

  _updateConnectorValue(): void {
    const { value } = this.option();

    const connectorElement = this._$connectorValue().get(0) as HTMLElement;

    const ratio = value / MAX_SIZE;

    connectorElement.style[styleProp(FLEX_GROW)] = String(ratio);
  }

  _$connectorValue(): dxElementWrapper {
    return this.$element().find(`.${STEPPER_CONNECTOR_VALUE_CLASS}`);
  }

  _toggleOrientationClass(): void {
    $(this.element())
      .toggleClass(STEPPER_CONNECTOR_HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation())
      .toggleClass(STEPPER_CONNECTOR_VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  }

  _isHorizontalOrientation(): boolean {
    const { orientation } = this.option();

    return orientation === ORIENTATION.horizontal;
  }

  _renderContent(): void {
    $('<div>')
      .addClass(STEPPER_CONNECTOR_VALUE_CLASS)
      .appendTo(this.element());
  }

  _optionChanged(args: OptionChanged<ConnectorProperties>): void {
    const { name } = args;

    switch (name) {
      case 'orientation':
        this._toggleOrientationClass();
        this._updateDimensions();
        break;
      case 'size':
      case 'value':
        this._updateDimensions();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default Connector;
