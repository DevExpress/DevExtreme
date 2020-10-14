import {
  OneWay, TwoWay, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import { SharpDirection } from './types.d';

@ComponentBindings()
export default class SvgBaseProps {
  @TwoWay() sharp?: string | boolean;

  @OneWay() sharpDirection?: SharpDirection;

  @OneWay() translateX?: number;

  @OneWay() translateY?: number;

  @OneWay() rotate?: number;

  @OneWay() rotateX?: number;

  @OneWay() rotateY?: number;

  @OneWay() scaleX?: number;

  @OneWay() scaleY?: number;
}
