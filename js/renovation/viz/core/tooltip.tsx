import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = ({
  textRef,
  size,
  props: {
    color, border, text, paddingLeftRight, paddingTopBottom,
  },
}: Tooltip): JSX.Element => {
  const width = size.width + (paddingLeftRight || 0) * 2;
  const height = size.height + (paddingTopBottom || 0) * 2;
  return (
    <g>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={color}
        stroke={border?.color}
        strokeWidth={border?.width}
      />
      <g textAnchor="middle" ref={textRef as any} transform={`translate(${width / 2}, ${height / 2 - size.height / 2 - size.y})`}>
        <text x={0} y={0}>
          {text}
        </text>
      </g>
    </g>
  );
};

@ComponentBindings()
export class TooltipProps {
  @OneWay() color?: string = '#fff';

  @OneWay() border?: { color: string; width: number } = { color: '#000', width: 2 };

  @OneWay() text?: string = '';

  @OneWay() paddingLeftRight?: number = 18;

  @OneWay() paddingTopBottom?: number = 15;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class Tooltip extends JSXComponent(TooltipProps) {
  @InternalState() size: { x: number; y: number; width: number; height: number } = {
    x: 0, y: 0, width: 0, height: 0,
  };

  @Ref() textRef!: SVGTextElement;

  @Effect()
  calculateSize(): void {
    this.size = this.textRef.getBBox();
  }
}
