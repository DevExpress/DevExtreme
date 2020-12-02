import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState, RefObject,
} from 'devextreme-generator/component_declaration/common';

import { PathSvgElement } from './renderers/svg_path';
import { TextSvgElement } from './renderers/svg_text';

import { Size, Border } from './common/types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle,
} from './common/tooltip_utils';

export const viewFunction = ({
  textRef,
  size,
  fullSize,
  border,
  props: {
    color, text, x, y, font,
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
        stroke={border.stroke}
        strokeWidth={border.strokeWidth}
        strokeOpacity={border.strokeOpacity}
        dashStyle={border.dashStyle}
        transform={`rotate(${angle} ${correctedCoordinates.x} ${correctedCoordinates.y})`}
      />
      <g textAnchor="middle" ref={textRef as any} transform={`translate(${correctedCoordinates.x}, ${correctedCoordinates.y - size.height / 2 - size.y})`}>
        <TextSvgElement
          text={text}
          styles={{
            fill: font.color,
            fontFamily: font.family,
            fontSize: font.size,
            fontWeight: font.weight,
            opacity: font.opacity,
          }}
        />
      </g>
    </g>
  );
};

@ComponentBindings()
export class TooltipProps {
  @OneWay() color = '#fff';

  @OneWay() border: { color: string; width: number; dashStyle: string;
    opacity?: number; visible: boolean; } = {
    color: '#d3d3d3', width: 1, dashStyle: 'solid', opacity: undefined, visible: true,
  };

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

  @OneWay() font = {
    color: '#232323',
    family: 'Segoe UI',
    opacity: 1,
    size: 12,
    weight: 400,
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

  get border(): Border {
    const { border } = this.props;
    if (border.visible) {
      return {
        stroke: border.color,
        strokeWidth: border.width,
        strokeOpacity: border.opacity,
        dashStyle: border.dashStyle,
      };
    }
    return {};
  }
}
