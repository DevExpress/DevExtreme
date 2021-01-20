import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState,
  RefObject, Method, Template, Event,
} from 'devextreme-generator/component_declaration/common';
import { combineClasses } from '../../utils/combine_classes';

import { PathSvgElement } from './renderers/svg_path';
import { TextSvgElement } from './renderers/svg_text';
import { ShadowFilter } from './renderers/shadow_filter';
import { getNextDefsSvgId, getFuncIri } from './renderers/utils';
import { RootSvgElement } from './renderers/svg_root';
import { isDefined } from '../../../core/utils/type';

import {
  StrictSize, Border, InitialBorder, CustomizedOptions, CustomizeTooltipFn, TooltipData, Location, Font,
  TooltipCoordinates,
} from './common/types.d';
import { Format, Point } from '../common/types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle, prepareData, isTextEmpty,
} from './common/tooltip_utils';
import { normalizeEnum } from '../../../viz/core/utils';

const DEFAULT_CANVAS = {
  left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0,
};

const DEFAULT_FONT: Font = {
  color: '#232323',
  family: 'Segoe UI',
  opacity: 1,
  size: 12,
  weight: 400,
};

const DEFAULT_SHADOW = {
  blur: 2,
  color: '#000',
  offsetX: 0,
  offsetY: 4,
  opacity: 0.4,
};

const DEFAULT_BORDER: InitialBorder = {
  color: '#d3d3d3', width: 1, dashStyle: 'solid', visible: true,
};

export const viewFunction = ({
  textRef,
  cloudRef,
  htmlRef,
  textSize,
  cloudSize,
  textSizeWithPaddings,
  border,
  filterId,
  customizedOptions,
  pointerEvents,
  cssClassName,
  correctedCoordinates,
  isEmptyContainer,
  props: {
    font, shadow, opacity, interactive, zIndex,
    contentTemplate: TooltipTemplate, data, visible, rtl,
    cornerRadius, arrowWidth,
  },
}: Tooltip): JSX.Element => {
  if (!visible || !correctedCoordinates || isTextEmpty(customizedOptions) || isEmptyContainer) {
    return <div />;
  }
  const angle = getCloudAngle(textSizeWithPaddings, correctedCoordinates);
  const d = getCloudPoints(textSizeWithPaddings, correctedCoordinates, angle,
    { cornerRadius: Number(cornerRadius), arrowWidth: Number(arrowWidth) }, true);
  const styles = interactive ? {
    msUserSelect: 'text',
    MozUserSelect: 'auto',
    WebkitUserSelect: 'auto',
  } : {};
  const textFont = font ?? DEFAULT_FONT;
  const cloudShadow = shadow ?? DEFAULT_SHADOW;
  return (
    <div
      className={cssClassName}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: cloudSize.x,
        top: cloudSize.y,
        zIndex,
      }}
    >
      <RootSvgElement
        width={cloudSize.width}
        height={cloudSize.height}
        styles={{
          position: 'absolute',
          ...styles,
        }}
      >
        <defs>
          <ShadowFilter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            blur={cloudShadow.blur}
            color={cloudShadow.color}
            offsetX={cloudShadow.offsetX}
            offsetY={cloudShadow.offsetY}
            opacity={cloudShadow.opacity}
          />
        </defs>
        <g
          filter={getFuncIri(filterId)}
          ref={cloudRef}
          transform={`translate(${-cloudSize.x}, ${-cloudSize.y})`}
        >
          <PathSvgElement
            pointerEvents={pointerEvents}
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
          {(customizedOptions.html || TooltipTemplate) ? null
            : (
              <g
                textAnchor="middle"
                ref={textRef}
                transform={`translate(${correctedCoordinates.x}, ${correctedCoordinates.y - textSize.height / 2 - textSize.y})`}
              >
                <TextSvgElement
                  text={customizedOptions.text}
                  styles={{
                    fill: customizedOptions.fontColor,
                    fontFamily: textFont.family,
                    fontSize: textFont.size,
                    fontWeight: textFont.weight,
                    opacity: textFont.opacity,
                    pointerEvents,
                  }}
                />
              </g>
            )}
        </g>
      </RootSvgElement>
      {!(customizedOptions.html || TooltipTemplate) ? null
        : (
          <div
            ref={htmlRef}
            style={{
              position: 'relative',
              display: 'inline-block',
              left: correctedCoordinates.x - cloudSize.x - textSize.width / 2,
              top: correctedCoordinates.y - cloudSize.y - textSize.height / 2,
              fill: customizedOptions.fontColor,
              fontFamily: textFont.family,
              fontSize: textFont.size,
              fontWeight: textFont.weight,
              opacity: textFont.opacity,
              pointerEvents,
              direction: rtl ? 'rtl' : 'ltr',
            }}
          >
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            {TooltipTemplate && (<TooltipTemplate {...data} />)}
          </div>
        )}
    </div>
  );
};

@ComponentBindings()
export class TooltipProps {
  @OneWay() color? = '#fff';

  @OneWay() border?: InitialBorder = DEFAULT_BORDER;

  @OneWay() data?: TooltipData = {};

  @OneWay() paddingLeftRight? = 18;

  @OneWay() paddingTopBottom? = 15;

  @OneWay() x? = 0;

  @OneWay() y? = 0;

  @OneWay() cornerRadius? = 0;

  @OneWay() arrowWidth? = 20;

  @OneWay() arrowLength? = 10;

  @OneWay() offset? = 0;

  @OneWay() opacity?: number;

  @OneWay() format?: Format;

  @OneWay() argumentFormat?: Format;

  @OneWay() customizeTooltip?: CustomizeTooltipFn;

  @OneWay() canvas? = DEFAULT_CANVAS;

  @OneWay() font?: Font = DEFAULT_FONT;

  @OneWay() shadow? = DEFAULT_SHADOW;

  @OneWay() interactive? = false;

  @OneWay() enabled? = true;

  @OneWay() shared? = false;

  @OneWay() location?: Location = 'center';

  @OneWay() zIndex?: number;

  @Template() contentTemplate?: (data: TooltipData) => JSX.Element;

  @OneWay() visible? = false;

  @OneWay() rtl? = false;

  @OneWay() className?: string;

  @OneWay() target?: Point = {} as Point;

  @Event() onTooltipHidden?: (e: {target?: Point}) => void;

  @Event() onTooltipShown?: (e: {target?: Point}) => void;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Tooltip extends JSXComponent(TooltipProps) {
  @InternalState() filterId: string = getNextDefsSvgId();

  @InternalState() textSize = {
    x: 0, y: 0, width: 0, height: 0,
  };

  @InternalState() cloudSize = {
    x: 0, y: 0, width: 0, height: 0,
  };

  @InternalState() currentTarget?: Point;

  @InternalState() isEmptyContainer = false;

  @Ref() cloudRef!: RefObject<SVGGElement>;

  @Ref() textRef!: RefObject<SVGGElement>;

  @Ref() htmlRef!: RefObject<HTMLDivElement>;

  @Effect()
  setHtmlText(): void {
    const htmlText = this.customizedOptions.html;
    if (htmlText && this.htmlRef && this.props.visible) {
      this.htmlRef.innerHTML = htmlText;
    }
  }

  @Effect()
  calculateSize(): void {
    if (this.props.visible && (this.textRef || this.htmlRef)) {
      this.textSize = this.textRef ? this.textRef.getBBox() : this.htmlRef.getBoundingClientRect();
    }
  }

  @Effect()
  calculateCloudSize(): void {
    if (isDefined(this.props.x) && isDefined(this.props.y)
      && this.props.visible && this.cloudRef) {
      const size = this.cloudRef.getBBox();
      const {
        lm, tm, rm, bm,
      } = this.margins;
      this.cloudSize = {
        x: Math.floor(size.x - lm),
        y: Math.floor(size.y - tm),
        width: size.width + lm + rm,
        height: size.height + tm + bm,
      };
    }
  }

  @Effect()
  eventsEffect(): void {
    const {
      onTooltipShown, onTooltipHidden, target, visible,
    } = this.props;

    const triggerTooltipHidden = (): void => {
      if (this.currentTarget && onTooltipHidden) {
        onTooltipHidden({ target: this.currentTarget });
      }
    };

    if (visible && this.correctedCoordinates && this.currentTarget !== target) {
      triggerTooltipHidden();
      onTooltipShown?.({ target });
      this.currentTarget = target;
    }
    if (!visible) {
      triggerTooltipHidden();
      this.currentTarget = undefined;
    }
  }

  @Effect()
  checkContainer(): void {
    if (this.htmlRef && this.props.visible) {
      const htmlTextSize = this.htmlRef.getBoundingClientRect();
      if (!htmlTextSize.width && !htmlTextSize.height) {
        this.isEmptyContainer = true;
      }
    }
  }

  @Method()
  getLocation(): string {
    return normalizeEnum(this.props.location);
  }

  get textSizeWithPaddings(): StrictSize {
    const { paddingLeftRight, paddingTopBottom } = this.props;
    return {
      width: this.textSize.width + (paddingLeftRight ?? 0) * 2,
      height: this.textSize.height + (paddingTopBottom ?? 0) * 2,
    };
  }

  get border(): Border {
    const { border } = this.props;
    const cloudBorder = border ?? DEFAULT_BORDER;
    if (cloudBorder.visible) {
      return {
        stroke: cloudBorder.color,
        strokeWidth: cloudBorder.width,
        strokeOpacity: cloudBorder.opacity,
        dashStyle: cloudBorder.dashStyle,
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
    const cloudShadow = shadow ?? DEFAULT_SHADOW;
    const xOff = cloudShadow.offsetX;
    const yOff = cloudShadow.offsetY;
    const blur = cloudShadow.blur * 2 + 1;
    return {
      lm: max(blur - xOff, 0), // left margin
      rm: max(blur + xOff, 0), // right margin
      tm: max(blur - yOff, 0), // top margin
      bm: max(blur + yOff, 0), // bottom margin
    };
  }

  get pointerEvents(): 'auto' | 'none' {
    const { interactive } = this.props;
    return interactive ? 'auto' : 'none';
  }

  get cssClassName(): string {
    const { className } = this.props;
    const classesMap = {
      [String(className)]: !!className,
    };

    return combineClasses(classesMap);
  }

  get correctedCoordinates(): TooltipCoordinates | false {
    const {
      canvas, x, y, offset, arrowLength,
    } = this.props;
    return recalculateCoordinates({
      canvas: canvas ?? DEFAULT_CANVAS,
      anchorX: Number(x),
      anchorY: Number(y),
      size: this.textSizeWithPaddings,
      offset: Number(offset),
      arrowLength: Number(arrowLength),
    });
  }
}
