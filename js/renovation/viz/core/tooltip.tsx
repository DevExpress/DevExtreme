import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState,
} from 'devextreme-generator/component_declaration/common';

import { Canvas, RecalculateCoordinatesFn } from './utils/types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle, rotateSize, rotateX, rotateY,
} from './utils/tooltip';

export const viewFunction = ({
  textRef,
  size,
  props: {
    color, border, text, paddingLeftRight, paddingTopBottom, x, y,
    cornerRadius = 0, arrowWidth = 0, offset, canvas, arrowLength,
  },
}: Tooltip): JSX.Element => {
  const width = size.width + (paddingLeftRight || 0) * 2;
  const height = size.height + (paddingTopBottom || 0) * 2;
  const fullSize = { width, height };
  const correctedCoordinates = recalculateCoordinates({
    canvas, anchorX: x, anchorY: y, size: fullSize, offset, arrowLength,
  } as RecalculateCoordinatesFn);
  const { rotationAngle, radRotationAngle } = getCloudAngle(fullSize, correctedCoordinates);
  return (
    <g pointerEvents="none">
      <path
        d={getCloudPoints(
          rotateSize(fullSize, rotationAngle),
          correctedCoordinates.x, correctedCoordinates.y,
          rotateX(correctedCoordinates, radRotationAngle),
          rotateY(correctedCoordinates, radRotationAngle),
          { cornerRadius, arrowWidth }, true,
        )}
        fill={color}
        stroke={border?.color}
        strokeWidth={border?.width}
        transform={`rotate(${rotationAngle} ${correctedCoordinates.x} ${correctedCoordinates.y})`}
      />
      <g textAnchor="middle" ref={textRef as any} transform={`translate(${correctedCoordinates.x}, ${correctedCoordinates.y - size.height / 2 - size.y})`}>
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

  @OneWay() border?: { color: string; width: number } = { color: '#000', width: 1 };

  @OneWay() text?: string = '';

  @OneWay() paddingLeftRight?: number = 18;

  @OneWay() paddingTopBottom?: number = 15;

  @OneWay() x?: number = 0;

  @OneWay() y?: number = 0;

  @OneWay() cornerRadius?: number = 0;

  @OneWay() arrowWidth?: number = 20;

  @OneWay() arrowLength?: number = 10;

  @OneWay() offset?: number = 0;

  @OneWay() canvas?: Canvas = {
    left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0,
  };
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
