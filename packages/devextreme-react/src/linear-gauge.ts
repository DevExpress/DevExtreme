"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxLinearGauge, {
    Properties
} from "devextreme/viz/linear_gauge";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent } from "devextreme/viz/linear_gauge";
import type { AnimationEaseMode, DashStyle, Font as ChartsFont, LabelOverlap, ChartsColor, Palette, PaletteExtensionMode, TextOverflow, WordWrap } from "devextreme/common/charts";
import type { ExportFormat, Format as CommonFormat, Orientation, HorizontalAlignment, VerticalAlignment, HorizontalEdge, VerticalEdge } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/localization";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ILinearGaugeOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onDrawn?: ((e: DrawnEvent) => void);
  onExported?: ((e: ExportedEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onFileSaving?: ((e: FileSavingEvent) => void);
  onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
  onTooltipShown?: ((e: TooltipShownEvent) => void);
}

type ILinearGaugeOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ILinearGaugeOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  defaultSubvalues?: Array<number>;
  defaultValue?: number;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onSubvaluesChange?: (value: Array<number>) => void;
  onValueChange?: (value: number) => void;
}>

interface LinearGaugeRef {
  instance: () => dxLinearGauge;
}

const LinearGauge = memo(
  forwardRef(
    (props: React.PropsWithChildren<ILinearGaugeOptions>, ref: ForwardedRef<LinearGaugeRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show","subvalues","value"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onTooltipHidden","onTooltipShown"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
        defaultSubvalues: "subvalues",
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        animation: { optionName: "animation", isCollectionItem: false },
        export: { optionName: "export", isCollectionItem: false },
        geometry: { optionName: "geometry", isCollectionItem: false },
        loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        rangeContainer: { optionName: "rangeContainer", isCollectionItem: false },
        scale: { optionName: "scale", isCollectionItem: false },
        size: { optionName: "size", isCollectionItem: false },
        subvalueIndicator: { optionName: "subvalueIndicator", isCollectionItem: false },
        title: { optionName: "title", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false },
        valueIndicator: { optionName: "valueIndicator", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ILinearGaugeOptions>>, {
          WidgetClass: dxLinearGauge,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ILinearGaugeOptions> & { ref?: Ref<LinearGaugeRef> }) => ReactElement | null;


// owners:
// LinearGauge
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: AnimationEaseMode;
  enabled?: boolean;
}>
const _componentAnimation = memo(
  (props: IAnimationProps) => {
    return React.createElement(NestedOption<IAnimationProps>, { ...props });
  }
);

const Animation: typeof _componentAnimation & IElementDescriptor = Object.assign(_componentAnimation, {
  OptionName: "animation",
})

// owners:
// RangeContainer
type IBackgroundColorProps = React.PropsWithChildren<{
  base?: string;
  fillId?: string;
}>
const _componentBackgroundColor = memo(
  (props: IBackgroundColorProps) => {
    return React.createElement(NestedOption<IBackgroundColorProps>, { ...props });
  }
);

const BackgroundColor: typeof _componentBackgroundColor & IElementDescriptor = Object.assign(_componentBackgroundColor, {
  OptionName: "backgroundColor",
})

// owners:
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentBorder = memo(
  (props: IBorderProps) => {
    return React.createElement(NestedOption<IBorderProps>, { ...props });
  }
);

const Border: typeof _componentBorder & IElementDescriptor = Object.assign(_componentBorder, {
  OptionName: "border",
})

// owners:
// Range
// SubvalueIndicator
type IColorProps = React.PropsWithChildren<{
  base?: string;
  fillId?: string;
}>
const _componentColor = memo(
  (props: IColorProps) => {
    return React.createElement(NestedOption<IColorProps>, { ...props });
  }
);

const Color: typeof _componentColor & IElementDescriptor = Object.assign(_componentColor, {
  OptionName: "color",
})

// owners:
// LinearGauge
type IExportProps = React.PropsWithChildren<{
  backgroundColor?: string;
  enabled?: boolean;
  fileName?: string;
  formats?: Array<ExportFormat>;
  margin?: number;
  printingEnabled?: boolean;
  svgToCanvas?: ((svg: any, canvas: any) => any);
}>
const _componentExport = memo(
  (props: IExportProps) => {
    return React.createElement(NestedOption<IExportProps>, { ...props });
  }
);

const Export: typeof _componentExport & IElementDescriptor = Object.assign(_componentExport, {
  OptionName: "export",
})

// owners:
// Label
// Text
// LoadingIndicator
// Tooltip
// Title
// Subtitle
type IFontProps = React.PropsWithChildren<{
  color?: string;
  family?: string;
  opacity?: number;
  size?: number | string;
  weight?: number;
}>
const _componentFont = memo(
  (props: IFontProps) => {
    return React.createElement(NestedOption<IFontProps>, { ...props });
  }
);

const Font: typeof _componentFont & IElementDescriptor = Object.assign(_componentFont, {
  OptionName: "font",
})

// owners:
// Label
// Text
// Tooltip
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: CommonFormat | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentFormat = memo(
  (props: IFormatProps) => {
    return React.createElement(NestedOption<IFormatProps>, { ...props });
  }
);

const Format: typeof _componentFormat & IElementDescriptor = Object.assign(_componentFormat, {
  OptionName: "format",
})

// owners:
// LinearGauge
type IGeometryProps = React.PropsWithChildren<{
  orientation?: Orientation;
}>
const _componentGeometry = memo(
  (props: IGeometryProps) => {
    return React.createElement(NestedOption<IGeometryProps>, { ...props });
  }
);

const Geometry: typeof _componentGeometry & IElementDescriptor = Object.assign(_componentGeometry, {
  OptionName: "geometry",
})

// owners:
// Scale
type ILabelProps = React.PropsWithChildren<{
  customizeText?: ((scaleValue: { value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationFormat;
  indentFromTick?: number;
  overlappingBehavior?: LabelOverlap;
  useRangeColors?: boolean;
  visible?: boolean;
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
  },
})

// owners:
// LinearGauge
type ILoadingIndicatorProps = React.PropsWithChildren<{
  backgroundColor?: string;
  font?: ChartsFont;
  show?: boolean;
  text?: string;
  defaultShow?: boolean;
  onShowChange?: (value: boolean) => void;
}>
const _componentLoadingIndicator = memo(
  (props: ILoadingIndicatorProps) => {
    return React.createElement(NestedOption<ILoadingIndicatorProps>, { ...props });
  }
);

const LoadingIndicator: typeof _componentLoadingIndicator & IElementDescriptor = Object.assign(_componentLoadingIndicator, {
  OptionName: "loadingIndicator",
  DefaultsProps: {
    defaultShow: "show"
  },
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

// owners:
// LinearGauge
// Title
type IMarginProps = React.PropsWithChildren<{
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}>
const _componentMargin = memo(
  (props: IMarginProps) => {
    return React.createElement(NestedOption<IMarginProps>, { ...props });
  }
);

const Margin: typeof _componentMargin & IElementDescriptor = Object.assign(_componentMargin, {
  OptionName: "margin",
})

// owners:
// Scale
type IMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentMinorTick = memo(
  (props: IMinorTickProps) => {
    return React.createElement(NestedOption<IMinorTickProps>, { ...props });
  }
);

const MinorTick: typeof _componentMinorTick & IElementDescriptor = Object.assign(_componentMinorTick, {
  OptionName: "minorTick",
})

// owners:
// RangeContainer
type IRangeProps = React.PropsWithChildren<{
  color?: ChartsColor | string;
  endValue?: number;
  startValue?: number;
}>
const _componentRange = memo(
  (props: IRangeProps) => {
    return React.createElement(NestedOption<IRangeProps>, { ...props });
  }
);

const Range: typeof _componentRange & IElementDescriptor = Object.assign(_componentRange, {
  OptionName: "ranges",
  IsCollectionItem: true,
  ExpectedChildren: {
    color: { optionName: "color", isCollectionItem: false }
  },
})

// owners:
// LinearGauge
type IRangeContainerProps = React.PropsWithChildren<{
  backgroundColor?: ChartsColor | string;
  horizontalOrientation?: HorizontalAlignment;
  offset?: number;
  palette?: Array<string> | Palette;
  paletteExtensionMode?: PaletteExtensionMode;
  ranges?: Array<Record<string, any>> | {
    color?: ChartsColor | string;
    endValue?: number;
    startValue?: number;
  }[];
  verticalOrientation?: VerticalAlignment;
  width?: number | Record<string, any> | {
    end?: number;
    start?: number;
  };
}>
const _componentRangeContainer = memo(
  (props: IRangeContainerProps) => {
    return React.createElement(NestedOption<IRangeContainerProps>, { ...props });
  }
);

const RangeContainer: typeof _componentRangeContainer & IElementDescriptor = Object.assign(_componentRangeContainer, {
  OptionName: "rangeContainer",
  ExpectedChildren: {
    backgroundColor: { optionName: "backgroundColor", isCollectionItem: false },
    range: { optionName: "ranges", isCollectionItem: true },
    width: { optionName: "width", isCollectionItem: false }
  },
})

// owners:
// LinearGauge
type IScaleProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
  customMinorTicks?: Array<number>;
  customTicks?: Array<number>;
  endValue?: number;
  horizontalOrientation?: HorizontalAlignment;
  label?: Record<string, any> | {
    customizeText?: ((scaleValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat;
    indentFromTick?: number;
    overlappingBehavior?: LabelOverlap;
    useRangeColors?: boolean;
    visible?: boolean;
  };
  minorTick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  minorTickInterval?: number;
  scaleDivisionFactor?: number;
  startValue?: number;
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  tickInterval?: number;
  verticalOrientation?: VerticalAlignment;
}>
const _componentScale = memo(
  (props: IScaleProps) => {
    return React.createElement(NestedOption<IScaleProps>, { ...props });
  }
);

const Scale: typeof _componentScale & IElementDescriptor = Object.assign(_componentScale, {
  OptionName: "scale",
  ExpectedChildren: {
    label: { optionName: "label", isCollectionItem: false },
    minorTick: { optionName: "minorTick", isCollectionItem: false },
    tick: { optionName: "tick", isCollectionItem: false }
  },
})

// owners:
// Tooltip
type IShadowProps = React.PropsWithChildren<{
  blur?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
}>
const _componentShadow = memo(
  (props: IShadowProps) => {
    return React.createElement(NestedOption<IShadowProps>, { ...props });
  }
);

const Shadow: typeof _componentShadow & IElementDescriptor = Object.assign(_componentShadow, {
  OptionName: "shadow",
})

// owners:
// LinearGauge
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
const _componentSize = memo(
  (props: ISizeProps) => {
    return React.createElement(NestedOption<ISizeProps>, { ...props });
  }
);

const Size: typeof _componentSize & IElementDescriptor = Object.assign(_componentSize, {
  OptionName: "size",
})

// owners:
// Title
type ISubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentSubtitle = memo(
  (props: ISubtitleProps) => {
    return React.createElement(NestedOption<ISubtitleProps>, { ...props });
  }
);

const Subtitle: typeof _componentSubtitle & IElementDescriptor = Object.assign(_componentSubtitle, {
  OptionName: "subtitle",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

// owners:
// LinearGauge
type ISubvalueIndicatorProps = React.PropsWithChildren<{
  arrowLength?: number;
  backgroundColor?: string;
  baseValue?: number;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: HorizontalEdge;
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | Palette;
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: VerticalEdge;
  width?: number;
}>
const _componentSubvalueIndicator = memo(
  (props: ISubvalueIndicatorProps) => {
    return React.createElement(NestedOption<ISubvalueIndicatorProps>, { ...props });
  }
);

const SubvalueIndicator: typeof _componentSubvalueIndicator & IElementDescriptor = Object.assign(_componentSubvalueIndicator, {
  OptionName: "subvalueIndicator",
  ExpectedChildren: {
    color: { optionName: "color", isCollectionItem: false },
    text: { optionName: "text", isCollectionItem: false }
  },
})

// owners:
// SubvalueIndicator
type ITextProps = React.PropsWithChildren<{
  customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationFormat;
  indent?: number;
}>
const _componentText = memo(
  (props: ITextProps) => {
    return React.createElement(NestedOption<ITextProps>, { ...props });
  }
);

const Text: typeof _componentText & IElementDescriptor = Object.assign(_componentText, {
  OptionName: "text",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
  },
})

// owners:
// Scale
type ITickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentTick = memo(
  (props: ITickProps) => {
    return React.createElement(NestedOption<ITickProps>, { ...props });
  }
);

const Tick: typeof _componentTick & IElementDescriptor = Object.assign(_componentTick, {
  OptionName: "tick",
})

// owners:
// LinearGauge
type ITitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  placeholderSize?: number;
  subtitle?: Record<string, any> | string | {
    font?: ChartsFont;
    offset?: number;
    text?: string;
    textOverflow?: TextOverflow;
    wordWrap?: WordWrap;
  };
  text?: string;
  textOverflow?: TextOverflow;
  verticalAlignment?: VerticalEdge;
  wordWrap?: WordWrap;
}>
const _componentTitle = memo(
  (props: ITitleProps) => {
    return React.createElement(NestedOption<ITitleProps>, { ...props });
  }
);

const Title: typeof _componentTitle & IElementDescriptor = Object.assign(_componentTitle, {
  OptionName: "title",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// LinearGauge
type ITooltipProps = React.PropsWithChildren<{
  arrowLength?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  container?: any | string;
  contentTemplate?: ((scaleValue: { value: number, valueText: string }, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((scaleValue: { value: number, valueText: string }) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationFormat;
  interactive?: boolean;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  zIndex?: number;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
}>
const _componentTooltip = memo(
  (props: ITooltipProps) => {
    return React.createElement(NestedOption<ITooltipProps>, { ...props });
  }
);

const Tooltip: typeof _componentTooltip & IElementDescriptor = Object.assign(_componentTooltip, {
  OptionName: "tooltip",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    shadow: { optionName: "shadow", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent"
  }],
})

// owners:
// LinearGauge
type IValueIndicatorProps = React.PropsWithChildren<{
  arrowLength?: number;
  backgroundColor?: string;
  baseValue?: number;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: HorizontalEdge;
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | Palette;
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: VerticalEdge;
  width?: number;
}>
const _componentValueIndicator = memo(
  (props: IValueIndicatorProps) => {
    return React.createElement(NestedOption<IValueIndicatorProps>, { ...props });
  }
);

const ValueIndicator: typeof _componentValueIndicator & IElementDescriptor = Object.assign(_componentValueIndicator, {
  OptionName: "valueIndicator",
})

// owners:
// RangeContainer
type IWidthProps = React.PropsWithChildren<{
  end?: number;
  start?: number;
}>
const _componentWidth = memo(
  (props: IWidthProps) => {
    return React.createElement(NestedOption<IWidthProps>, { ...props });
  }
);

const Width: typeof _componentWidth & IElementDescriptor = Object.assign(_componentWidth, {
  OptionName: "width",
})

export default LinearGauge;
export {
  LinearGauge,
  ILinearGaugeOptions,
  LinearGaugeRef,
  Animation,
  IAnimationProps,
  BackgroundColor,
  IBackgroundColorProps,
  Border,
  IBorderProps,
  Color,
  IColorProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Geometry,
  IGeometryProps,
  Label,
  ILabelProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  MinorTick,
  IMinorTickProps,
  Range,
  IRangeProps,
  RangeContainer,
  IRangeContainerProps,
  Scale,
  IScaleProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Subtitle,
  ISubtitleProps,
  SubvalueIndicator,
  ISubvalueIndicatorProps,
  Text,
  ITextProps,
  Tick,
  ITickProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  ValueIndicator,
  IValueIndicatorProps,
  Width,
  IWidthProps
};
import type * as LinearGaugeTypes from 'devextreme/viz/linear_gauge_types';
export { LinearGaugeTypes };

