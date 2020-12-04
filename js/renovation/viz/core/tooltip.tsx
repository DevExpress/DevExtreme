import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState, Fragment,
  RefObject, Method,
} from 'devextreme-generator/component_declaration/common';

import { PathSvgElement } from './renderers/svg_path';
import { TextSvgElement } from './renderers/svg_text';
import { ShadowFilter } from './renderers/shadow_filter';
import { getNextDefsSvgId } from './renderers/utils';

import { Size, Border, CustomizedOptions } from './common/types.d';
import { Format } from '../common/types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle, prepareData,
} from './common/tooltip_utils';
import { formatValue } from '../common/utils';

export const viewFunction = ({
  textRef,
  size,
  fullSize,
  border,
  customizedOptions,
  props: {
    x, y, font, shadow, opacity,
    cornerRadius, arrowWidth, offset, canvas, arrowLength,
  },
}: Tooltip): JSX.Element => {
  const filterId = getNextDefsSvgId();
  const correctedCoordinates = recalculateCoordinates({
    canvas, anchorX: x, anchorY: y, size: fullSize, offset, arrowLength,
  });
  const angle = getCloudAngle(fullSize, correctedCoordinates);
  return (
    <Fragment>
      <defs>
        <ShadowFilter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          blur={shadow.blur}
          color={shadow.color}
          offsetX={shadow.offsetX}
          offsetY={shadow.offsetY}
          opacity={shadow.opacity}
        />
      </defs>
      <g pointerEvents="none" filter={`url(#${filterId})`}>
        <PathSvgElement
          d={getCloudPoints(fullSize, correctedCoordinates, angle,
            { cornerRadius, arrowWidth }, true)}
          fill={customizedOptions.color}
          stroke={customizedOptions.borderColor}
          strokeWidth={border.strokeWidth}
          strokeOpacity={border.strokeOpacity}
          dashStyle={border.dashStyle}
          opacity={opacity}
          transform={`rotate(${angle} ${correctedCoordinates.x} ${correctedCoordinates.y})`}
        />
        <g textAnchor="middle" ref={textRef as any} transform={`translate(${correctedCoordinates.x}, ${correctedCoordinates.y - size.height / 2 - size.y})`}>
          <TextSvgElement
            text={customizedOptions.text}
            styles={{
              fill: customizedOptions.fontColor,
              fontFamily: font.family,
              fontSize: font.size,
              fontWeight: font.weight,
              opacity: font.opacity,
            }}
          />
        </g>
      </g>
    </Fragment>
  );
};

@ComponentBindings()
export class TooltipProps {
  @OneWay() color = '#fff';

  @OneWay() border: { color: string; width: number; dashStyle: string;
    opacity?: number; visible: boolean; } = {
    color: '#d3d3d3', width: 1, dashStyle: 'solid', opacity: undefined, visible: true,
  };

  @OneWay() data: any = {};

  @OneWay() paddingLeftRight = 18;

  @OneWay() paddingTopBottom = 15;

  @OneWay() x = 0;

  @OneWay() y = 0;

  @OneWay() cornerRadius = 0;

  @OneWay() arrowWidth = 20;

  @OneWay() arrowLength = 10;

  @OneWay() offset = 0;

  @OneWay() opacity?: number;

  @OneWay() format?: Format;

  @OneWay() argumentFormat?: Format;

  @OneWay() customizeTooltip?: (info: any) => CustomizedOptions;

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

  @OneWay() shadow = {
    blur: 2,
    color: '#000',
    offsetX: 0,
    offsetY: 4,
    opacity: 0.4,
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

  @Method()
  formatValue(value, _specialFormat): string {
    const { format, argumentFormat } = this.props;
    return formatValue(value, _specialFormat, { format, argumentFormat });
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

  get customizedOptions(): CustomizedOptions {
    const {
      data, customizeTooltip, color, border, font,
    } = this.props;

    return prepareData(data, customizeTooltip, color, border, font);
  }
}
