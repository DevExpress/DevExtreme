import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState, RefObject,
} from 'devextreme-generator/component_declaration/common';

import { PathSvgElement } from './renderers/svg_path';
import { TextSvgElement } from './renderers/svg_text';

import { Size } from './common/types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle,
} from './common/tooltip_utils';

export const viewFunction = ({
  textRef,
  size,
  fullSize,
  props: {
    color, border, text, x, y,
    cornerRadius, arrowWidth, offset, canvas, arrowLength,
  },
}: Tooltip): JSX.Element => {
  const correctedCoordinates = recalculateCoordinates({
    canvas, anchorX: x, anchorY: y, size: fullSize, offset, arrowLength,
  });
  const angle = getCloudAngle(fullSize, correctedCoordinates);
  return (
    <g pointerEvents="none">
      <PathSvgElement
        d={getCloudPoints(fullSize, correctedCoordinates, angle,
          { cornerRadius, arrowWidth }, true)}
        fill={color}
        stroke={border.color}
        strokeWidth={border.width}
        transform={`rotate(${angle} ${correctedCoordinates.x} ${correctedCoordinates.y})`}
      />
      <g textAnchor="middle" ref={textRef} transform={`translate(${correctedCoordinates.x}, ${correctedCoordinates.y - size.height / 2 - size.y})`}>
        <TextSvgElement text={text} />
      </g>
    </g>
  );
};

@ComponentBindings()
export class TooltipProps {
  @OneWay() color = '#fff';

  @OneWay() border = { color: '#000', width: 1 };

  @OneWay() text = '';

  @OneWay() paddingLeftRight = 18;

  @OneWay() paddingTopBottom = 15;

  @OneWay() x = 0;

  @OneWay() y = 0;

  @OneWay() cornerRadius = 0;

  @OneWay() arrowWidth = 20;

  @OneWay() arrowLength = 10;

  @OneWay() offset = 0;

  @OneWay() canvas = {
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

  @Ref() textRef!: RefObject<SVGGElement>;

  @Effect()
  calculateSize(): void {
    this.size = this.textRef.getBBox();
  }

  get fullSize(): Size {
    const { paddingLeftRight, paddingTopBottom } = this.props;
    return {
      width: this.size.width + paddingLeftRight * 2,
      height: this.size.height + paddingTopBottom * 2,
    };
  }
}
