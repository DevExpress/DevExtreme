import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState, Portal,
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
  Size, Border, InitialBorder, CustomizedOptions,
  CustomizeTooltipFn, TooltipData, Location, Container, TooltipCoordinates,
} from './common/types.d';
import { Format, Point } from '../common/types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle, prepareData, getCanvas, isTextEmpty,
} from './common/tooltip_utils';
import { getFormatValue } from '../common/utils';
import { normalizeEnum } from '../../../viz/core/utils';
import domAdapter from '../../../core/dom_adapter';

export const viewFunction = ({
  textRef,
  cloudRef,
  htmlRef,
  textSize,
  cloudSize,
  textSizeWithPaddings,
  border,
  filterId,
  container,
  customizedOptions,
  pointerEvents,
  cssClassName,
  correctedCoordinates,
  props: {
    font, shadow, opacity, interactive, zIndex,
    contentTemplate: TooltipTemplate, data, visible, rtl,
    cornerRadius, arrowWidth,
  },
}: Tooltip): JSX.Element => {
  if (!visible || !correctedCoordinates || isTextEmpty(customizedOptions)) {
    return <div />;
  }
  const angle = getCloudAngle(textSizeWithPaddings, correctedCoordinates);
  const d = getCloudPoints(textSizeWithPaddings, correctedCoordinates, angle,
    { cornerRadius, arrowWidth }, true);
  const styles = interactive ? {
    msUserSelect: 'text',
    MozUserSelect: 'auto',
    WebkitUserSelect: 'auto',
  } : {};
  return (
    <Portal container={container}>
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
              blur={shadow.blur}
              color={shadow.color}
              offsetX={shadow.offsetX}
              offsetY={shadow.offsetY}
              opacity={shadow.opacity}
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
                      fontFamily: font.family,
                      fontSize: font.size,
                      fontWeight: font.weight,
                      opacity: font.opacity,
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
                fontFamily: font.family,
                fontSize: font.size,
                fontWeight: font.weight,
                opacity: font.opacity,
                pointerEvents,
                direction: rtl ? 'rtl' : 'ltr',
              }}
            >
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              {TooltipTemplate && (<TooltipTemplate {...data} />)}
            </div>
          )}
      </div>
    </Portal>
  );
};

@ComponentBindings()
export class TooltipProps {
  @OneWay() color = '#fff';

  @OneWay() border: InitialBorder = {
    color: '#d3d3d3', width: 1, dashStyle: 'solid', visible: true,
  };

  @OneWay() data: TooltipData = {};

  @OneWay() paddingLeftRight = 18;

  @OneWay() paddingTopBottom = 15;

  @OneWay() x = 0;

  @OneWay() y = 0;

  @OneWay() cornerRadius = 0;

  @OneWay() arrowWidth = 20;

  @OneWay() arrowLength = 10;

  @OneWay() container?: Container;

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

  @OneWay() enabled = true;

  @OneWay() shared = false;

  @OneWay() location: Location = 'center';

  @OneWay() zIndex?: number;

  @Template() contentTemplate?: (data: TooltipData) => JSX.Element;

  @OneWay() visible = false;

  @OneWay() rtl = false;

  @OneWay() className?: string;

  @OneWay() target: Point = {} as Point;

  @Event() onTooltipHidden?: (e: {target: Point}) => void;

  @Event() onTooltipShown?: (e: {target: Point}) => void;
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

  @Ref() cloudRef!: RefObject<SVGGElement>;

  @Ref() textRef!: RefObject<SVGGElement>;

  @Ref() htmlRef!: RefObject<HTMLElement>;

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

  @Method()
  formatValue(value, specialFormat): string {
    const { format, argumentFormat } = this.props;
    return getFormatValue(value, specialFormat, { format, argumentFormat });
  }

  @Method()
  isEnabled(): boolean {
    return this.props.enabled;
  }

  @Method()
  isShared(): boolean {
    return this.props.shared;
  }

  @Method()
  getLocation(): string {
    return normalizeEnum(this.props.location);
  }

  get textSizeWithPaddings(): Size {
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

  get container(): HTMLElement {
    const propsContainer = this.props.container;
    if (propsContainer) {
      if (typeof propsContainer === 'string') {
        const node = domAdapter.getDocument().querySelector(propsContainer);
        if (node) {
          return node as HTMLElement;
        }
      } else {
        return propsContainer;
      }
    }
    return domAdapter.getBody();
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
    const canvas = getCanvas(this.container);
    const {
      x, y, offset, arrowLength,
    } = this.props;
    return recalculateCoordinates({
      canvas, anchorX: x, anchorY: y, size: this.textSizeWithPaddings, offset, arrowLength,
    });
  }
}
