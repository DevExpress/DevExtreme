import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, InternalState, Portal,
  RefObject, Method, Template, Event, ForwardRef,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../utils/combine_classes';

import { PathSvgElement } from './renderers/svg_path';
import { TextSvgElement } from './renderers/svg_text';
import { ShadowFilter } from './renderers/shadow_filter';
import { getNextDefsSvgId, getFuncIri } from './renderers/utils';
import { RootSvgElement } from './renderers/svg_root';
import { isDefined } from '../../../core/utils/type';

import {
  Size, Border, InitialBorder, CustomizedOptions, CustomizeTooltipFn, TooltipData, Location,
  Font, TooltipCoordinates, Container,

  Format, EventData, OnTooltipHiddenFn, OnTooltipShownFn,
} from './types.d';

import {
  getCloudPoints, recalculateCoordinates, getCloudAngle, prepareData, getCanvas, isTextEmpty,
} from './tooltip_utils';
import { normalizeEnum } from '../../../viz/core/utils';
import domAdapter from '../../../core/dom_adapter';
import { isUpdatedFlatObject } from './utils';

interface PinnedSize extends Required<Size> {
  x: number;
  y: number;
}

const DEFAULT_CANVAS: ClientRect = {
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

const DEFAULT_SIZE: PinnedSize = {
  x: 0, y: 0, width: 0, height: 0,
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
  container,
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
  if (!visible || !correctedCoordinates
    || isTextEmpty(customizedOptions) || isEmptyContainer) {
    return <div />;
  }
  const angle = getCloudAngle(textSizeWithPaddings, correctedCoordinates);
  const d = getCloudPoints(textSizeWithPaddings, correctedCoordinates, angle,
    { cornerRadius: Number(cornerRadius), arrowWidth: Number(arrowWidth) }, true);
  let styles = interactive ? {
    msUserSelect: 'text',
    MozUserSelect: 'auto',
    WebkitUserSelect: 'auto',
  } : {};
  styles = {
    ...styles,
    ...{ position: 'absolute' },
  };
  const textFont = font || DEFAULT_FONT;
  const cloudShadow = shadow || DEFAULT_SHADOW;
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
          styles={styles}
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
    </Portal>
  );
};

@ComponentBindings()
export class TooltipProps {
  @OneWay() color? = '#fff';

  @OneWay() border?: InitialBorder = DEFAULT_BORDER;

  @OneWay() data?: TooltipData = {};

  @ForwardRef() rootWidget?: RefObject<HTMLDivElement>;

  @OneWay() paddingLeftRight? = 18;

  @OneWay() paddingTopBottom? = 15;

  @OneWay() x? = 0;

  @OneWay() y? = 0;

  @OneWay() cornerRadius? = 0;

  @OneWay() arrowWidth? = 20;

  @OneWay() arrowLength? = 10;

  @OneWay() offset? = 0;

  @OneWay() container?: Container;

  @OneWay() opacity?: number;

  @OneWay() format?: Format;

  @OneWay() argumentFormat?: Format;

  @OneWay() customizeTooltip?: CustomizeTooltipFn;

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

  @OneWay() eventData?: EventData<unknown>;

  @Event() onTooltipHidden?: OnTooltipHiddenFn<EventData<unknown>>;

  @Event() onTooltipShown?: OnTooltipShownFn<EventData<unknown>>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Tooltip extends JSXComponent(TooltipProps) {
  @InternalState() filterId: string = getNextDefsSvgId();

  @InternalState() textSize: PinnedSize = DEFAULT_SIZE;

  @InternalState() cloudSize: PinnedSize = DEFAULT_SIZE;

  @InternalState() currentEventData?: EventData<unknown>;

  @InternalState() isEmptyContainer = false;

  @InternalState() canvas = DEFAULT_CANVAS;

  @Ref() cloudRef!: RefObject<SVGGElement>;

  @Ref() textRef!: RefObject<SVGGElement>;

  @Ref() htmlRef!: RefObject<HTMLDivElement>;

  @Effect()
  setHtmlText(): void {
    const htmlText = this.customizedOptions.html;
    if (htmlText && this.htmlRef.current && this.props.visible) {
      this.htmlRef.current.innerHTML = htmlText;
    }
  }

  @Effect()
  calculateSize(): void {
    const contentSize = this.calculateContentSize();
    const cloudSize = this.calculateCloudSize();
    if (isUpdatedFlatObject(this.textSize, contentSize)) {
      this.textSize = contentSize;
    }
    if (isUpdatedFlatObject(this.cloudSize, cloudSize)) {
      this.cloudSize = cloudSize;
    }
  }

  @Effect()
  eventsEffect(): void {
    const {
      onTooltipShown, onTooltipHidden, visible,
      eventData = {} as EventData<unknown>, // TODO: remove {} after fix nested props + test
    } = this.props;
    const isEqual = (object1: EventData<unknown> | undefined,
      object2: EventData<unknown>): boolean => {
      if (!object1) {
        return false;
      }
      return JSON.stringify(object1.target) === JSON.stringify(object2.target);
    };
    if (visible && this.correctedCoordinates && !isEqual(this.currentEventData, eventData)) {
      this.currentEventData && onTooltipHidden?.(this.currentEventData);
      onTooltipShown?.(eventData);
      this.currentEventData = eventData;
    }
    if (!visible && this.currentEventData) {
      onTooltipHidden?.(this.currentEventData);
      this.currentEventData = undefined;
    }
  }

  @Effect()
  checkContainer(): void {
    if (this.htmlRef.current && this.props.visible) {
      const htmlTextSize = this.htmlRef.current.getBoundingClientRect();
      if (!htmlTextSize.width && !htmlTextSize.height) {
        this.isEmptyContainer = true;
      }
    }
  }

  @Effect()
  setCanvas(): void {
    this.canvas = getCanvas(this.container);
  }

  @Method()
  getLocation(): string {
    return normalizeEnum(this.props.location);
  }

  get textSizeWithPaddings(): Required<Size> {
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

  get container(): HTMLElement {
    const propsContainer = this.props.container;
    if (propsContainer) {
      if (typeof propsContainer === 'string') {
        const tmp = this.props.rootWidget?.current;
        let node = tmp?.closest(propsContainer);
        if (!node) {
          node = domAdapter.getDocument().querySelector(propsContainer);
        }
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
      x, y, offset, arrowLength,
    } = this.props;
    return recalculateCoordinates({
      canvas: this.canvas,
      anchorX: Number(x),
      anchorY: Number(y),
      size: this.textSizeWithPaddings,
      offset: Number(offset),
      arrowLength: Number(arrowLength),
    });
  }

  calculateContentSize(): PinnedSize {
    let size = DEFAULT_SIZE;
    if (this.props.visible) {
      if (this.textRef.current) {
        size = this.textRef.current.getBBox();
      } else if (this.htmlRef.current) {
        size = this.htmlRef.current.getBoundingClientRect();
      }
    }

    return size;
  }

  calculateCloudSize(): PinnedSize {
    let cloudSize = DEFAULT_SIZE;
    if (isDefined(this.props.x) && isDefined(this.props.y)
      && this.props.visible && this.cloudRef.current) {
      const size = this.cloudRef.current.getBBox();
      const {
        lm, tm, rm, bm,
      } = this.margins;

      cloudSize = {
        x: Math.floor(size.x - lm),
        y: Math.floor(size.y - tm),
        width: size.width + lm + rm,
        height: size.height + tm + bm,
      };
    }
    return cloudSize;
  }
}
