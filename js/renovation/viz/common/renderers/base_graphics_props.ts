import {
  OneWay, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import SvgBaseProps from './base_props';

@ComponentBindings()
export default class SvgGraphicsProps extends SvgBaseProps {
  @OneWay() fill?: string;

  @OneWay() stroke?: string;

  @OneWay() strokeWidth?: number;

  @OneWay() strokeOpacity?: number;

  @OneWay() opacity?: number;

  @OneWay() dashStyle?: string;
}
