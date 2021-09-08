import {
  OneWay, ComponentBindings,
} from '@devextreme-generator/declarations';
import { SharpDirection } from './types.d';

@ComponentBindings()
export default class SvgBaseProps {
  @OneWay() className? = '';

  @OneWay() sharp?: string | boolean;

  @OneWay() sharpDirection?: SharpDirection;

  @OneWay() translateX?: number;

  @OneWay() translateY?: number;

  @OneWay() rotate?: number;

  @OneWay() rotateX?: number;

  @OneWay() rotateY?: number;

  @OneWay() scaleX?: number;

  @OneWay() scaleY?: number;
}
