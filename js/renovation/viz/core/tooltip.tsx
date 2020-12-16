import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState,
  RefObject, Method,
} from 'devextreme-generator/component_declaration/common';

import { PathSvgElement } from './renderers/svg_path';
import { TextSvgElement } from './renderers/svg_text';
import { ShadowFilter } from './renderers/shadow_filter';
import { getNextDefsSvgId } from './renderers/utils';

import {
  Size, Border, CustomizedOptions, CustomizeTooltipFn,
} from './common/types.d';
import { Format } from '../common/types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle, prepareData,
} from './common/tooltip_utils';
import { getFormatValue } from '../common/utils';

export const viewFunction = ({
  textRef,
  cloudRef,
  htmlRef,
  textSize,
  cloudSize,
  textSizeWPaddings,
  border,
  filterId,
  customizedOptions,
  setCurrentState,
  props: {
    x, y, font, shadow, opacity, interactive,
    cornerRadius, arrowWidth, offset, canvas, arrowLength,
  },
}: Tooltip): JSX.Element => {
  const correctedCoordinates = recalculateCoordinates({
    canvas, anchorX: x, anchorY: y, size: textSizeWPaddings, offset, arrowLength,
  });
  const angle = getCloudAngle(textSizeWPaddings, correctedCoordinates);
  const d = getCloudPoints(textSizeWPaddings, correctedCoordinates, angle,
    { cornerRadius, arrowWidth }, true);
  setCurrentState(d);
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: cloudSize.x,
        top: cloudSize.y,
      }}
    >
      <svg width={cloudSize.width} height={cloudSize.height} style={{ position: 'absolute' }}>
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
        <g
          pointerEvents={interactive ? 'all' : 'none'}
          filter={`url(#${filterId})`}
          ref={cloudRef as any}
          transform={`translate(${-cloudSize.x}, ${-cloudSize.y})`}
        >
          <PathSvgElement
            d={d}
            fill={customizedOptions.color}
            stroke={customizedOptions.borderColor}
            strokeWidth={border.strokeWidth}
            strokeOpacity={border.strokeOpacity}
            dashStyle={border.dashStyle}
            opacity={opacity}
            rotate={angle}
            rotateX={correctedCoordinates.x}
            rotateY={correctedCoordinates.y}
          />
          {customizedOptions.html ? null
            : (
              <g
                textAnchor="middle"
                ref={textRef as any}
                transform={`translate(${correctedCoordinates.x}, ${correctedCoordinates.y - textSize.height / 2 - textSize.y})`}
              >
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
            )}
        </g>
      </svg>
      {!customizedOptions.html ? null
        : (
          <div
            ref={htmlRef as any}
            style={{
              position: 'relative',
              display: 'inline-block',
              left: correctedCoordinates.x - cloudSize.x - textSize.width / 2,
              top: correctedCoordinates.y - cloudSize.y - textSize.height / 2,
              fill: customizedOptions.fontColor,
              fontFamily: font.family,
              fontSize: font.size,
              fontWeight: font.weight,
              opacity: font.opacity,
            }}
          />
        )}
    </div>
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

  @OneWay() customizeTooltip?: CustomizeTooltipFn;

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

  @OneWay() interactive = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class Tooltip extends JSXComponent(TooltipProps) {
  @InternalState() filterId: string = getNextDefsSvgId();

  @InternalState() textSize = {
    x: 0, y: 0, width: 0, height: 0,
  };

  @InternalState() cloudSize = {
    x: 0, y: 0, width: 0, height: 0,
  };

  @InternalState() d?: string;

  setCurrentState(d: string): void {
    if (this.d !== d) {
      this.d = d;
    }
  }

  @Ref() cloudRef!: RefObject<SVGGElement>;

  @Ref() textRef!: RefObject<SVGGElement>;

  @Ref() htmlRef!: RefObject<HTMLElement>;

  @Effect()
  setHtmlText(): void {
    const htmlText = this.customizedOptions.html;
    if (htmlText) {
      this.htmlRef.innerHTML = htmlText;
    }
  }

  @Effect()
  calculateSize(): void {
    this.textSize = this.textRef ? this.textRef.getBBox() : this.htmlRef.getBoundingClientRect();
  }

  @Effect()
  calculateCloudSize(): void {
    if (this.d) {
      const size = this.cloudRef.getBBox();
      this.cloudSize = {
        x: Math.floor(size.x - this.margins.lm),
        y: Math.floor(size.y - this.margins.tm),
        width: size.width + this.margins.lm + this.margins.rm,
        height: size.height + this.margins.tm + this.margins.bm,
      };
    }
  }

  @Method()
  formatValue(value, specialFormat): string {
    const { format, argumentFormat } = this.props;
    return getFormatValue(value, specialFormat, { format, argumentFormat });
  }

  get textSizeWPaddings(): Size {
    const { paddingLeftRight, paddingTopBottom } = this.props;
    return {
      width: this.textSize.width + paddingLeftRight * 2,
      height: this.textSize.height + paddingTopBottom * 2,
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

    return prepareData(data, color, border, font, customizeTooltip);
  }

  get margins(): { lm: number; rm: number; tm: number; bm: number } {
    const { max } = Math;
    const { shadow } = this.props;
    const xOff = shadow.offsetX;
    const yOff = shadow.offsetY;
    const blur = shadow.blur * 2 + 1;
    return {
      lm: max(blur - xOff, 0), // left margin
      rm: max(blur + xOff, 0), // right margin
      tm: max(blur - yOff, 0), // top margin
      bm: max(blur + yOff, 0), // bottom margin
    };
  }
}
