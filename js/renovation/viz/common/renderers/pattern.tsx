import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from 'devextreme-generator/component_declaration/common';
import { RectSvgElement } from './svg_rect';
import { PathSvgElement } from './svg_path';
import { normalizeEnum } from '../../../../viz/core/utils';

export interface Hatching {
  step?: number;
  opacity?: number;
  width?: number;
  direction?: 'left' | 'right';
}

export const viewFunction = ({
  step, d, props: { id, color, hatching },
}: SvgPattern): JSX.Element => (
  <pattern
    id={id}
    width={step}
    height={step}
    patternUnits="userSpaceOnUse"
  >
    <RectSvgElement
      x={0}
      y={0}
      width={step}
      height={step}
      fill={color}
      opacity={hatching?.opacity}
    />
    <PathSvgElement
      d={d}
      strokeWidth={hatching?.width || 1}
      stroke={color}
    />
  </pattern>
);

@ComponentBindings()
export class SvgPatternProps {
  @OneWay() id?: string;

  @OneWay() color = '';

  @OneWay() hatching?: Hatching;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class SvgPattern extends JSXComponent(SvgPatternProps) {
  get step(): number {
    return this.props.hatching?.step || 6;
  }

  get d(): string {
    const stepTo2 = this.step / 2;
    const stepBy15 = this.step * 1.5;

    return normalizeEnum(this.props.hatching?.direction) === 'right'
      ? `M ${stepTo2} ${-stepTo2} L ${-stepTo2} ${stepTo2} M 0 ${this.step} L ${this.step} 0 M ${stepBy15} ${stepTo2} L ${stepTo2} ${stepBy15}`
      : `M 0 0 L ${this.step} ${this.step} M ${-stepTo2} ${stepTo2} L ${stepTo2} ${stepBy15} M ${stepTo2} ${-stepTo2} L ${stepBy15} ${stepTo2}`;
  }
}
