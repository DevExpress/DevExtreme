import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({
  props: {
    id, x, y, width, height, blur, offsetX, offsetY, color, opacity,
  },
}: ShadowFilter): JSX.Element => (
  <filter
    id={id}
    x={x}
    y={y}
    width={width}
    height={height}
  >
    <feGaussianBlur
      in="SourceGraphic"
      result="gaussianBlurResult"
      stdDeviation={blur}
    />
    <feOffset
      in="gaussianBlurResult"
      result="offsetResult"
      dx={offsetX}
      dy={offsetY}
    />
    <feFlood
      result="floodResult"
      floodColor={color}
      floodOpacity={opacity}
    />
    <feComposite
      in="floodResult"
      in2="offsetResult"
      operator="in"
      result="compositeResult"
    />
    <feComposite
      in="SourceGraphic"
      in2="compositeResult"
      operator="over"
    />
  </filter>
);

@ComponentBindings()
export class ShadowFilterProps {
  @OneWay() id?: string;

  @OneWay() x: number|string = 0;

  @OneWay() y: number|string = 0;

  @OneWay() width: number|string = 0;

  @OneWay() height: number|string = 0;

  @OneWay() offsetX: number|string = 0;

  @OneWay() offsetY: number|string = 0;

  @OneWay() blur = 0;

  @OneWay() color = '';

  @OneWay() opacity?: number;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class ShadowFilter extends JSXComponent(ShadowFilterProps) {}
