"use client"
import dxCircularGauge, {
    Properties
} from "devextreme/viz/circular_gauge";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent } from "devextreme/viz/circular_gauge";
import type { Font as ChartsFont, ChartsColor } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ICircularGaugeOptionsNarrowedEvents = {
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

type ICircularGaugeOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ICircularGaugeOptionsNarrowedEvents> & IHtmlOptions & {
  centerRender?: (...params: any) => React.ReactNode;
  centerComponent?: React.ComponentType<any>;
  centerKeyFn?: (data: any) => string;
  defaultLoadingIndicator?: Record<string, any>;
  defaultSubvalues?: Array<number>;
  defaultValue?: number;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onSubvaluesChange?: (value: Array<number>) => void;
  onValueChange?: (value: number) => void;
}>

class CircularGauge extends BaseComponent<React.PropsWithChildren<ICircularGaugeOptions>> {

  public get instance(): dxCircularGauge {
    return this._instance;
  }

  protected _WidgetClass = dxCircularGauge;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show","subvalues","value"];

  protected independentEvents = ["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onTooltipHidden","onTooltipShown"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator",
    defaultSubvalues: "subvalues",
    defaultValue: "value"
  };

  protected _expectedChildren = {
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
  };

  protected _templateProps = [{
    tmplOption: "centerTemplate",
    render: "centerRender",
    component: "centerComponent",
    keyFn: "centerKeyFn"
  }];
}
(CircularGauge as any).propTypes = {
  animation: PropTypes.object,
  containerBackgroundColor: PropTypes.string,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  geometry: PropTypes.object,
  loadingIndicator: PropTypes.object,
  margin: PropTypes.object,
  onDisposing: PropTypes.func,
  onDrawn: PropTypes.func,
  onExported: PropTypes.func,
  onExporting: PropTypes.func,
  onFileSaving: PropTypes.func,
  onIncidentOccurred: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onTooltipHidden: PropTypes.func,
  onTooltipShown: PropTypes.func,
  pathModified: PropTypes.bool,
  rangeContainer: PropTypes.object,
  redrawOnResize: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  scale: PropTypes.object,
  size: PropTypes.object,
  subvalueIndicator: PropTypes.object,
  subvalues: PropTypes.array,
  theme: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "generic.dark",
      "generic.light",
      "generic.contrast",
      "generic.carmine",
      "generic.darkmoon",
      "generic.darkviolet",
      "generic.greenmist",
      "generic.softblue",
      "material.blue.light",
      "material.lime.light",
      "material.orange.light",
      "material.purple.light",
      "material.teal.light"])
  ]),
  title: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  tooltip: PropTypes.object,
  value: PropTypes.number,
  valueIndicator: PropTypes.object
};


// owners:
// CircularGauge
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: "easeOutCubic" | "linear";
  enabled?: boolean;
}>
class Animation extends NestedOption<IAnimationProps> {
  public static OptionName = "animation";
}

// owners:
// RangeContainer
type IBackgroundColorProps = React.PropsWithChildren<{
  base?: string;
  fillId?: string;
}>
class BackgroundColor extends NestedOption<IBackgroundColorProps> {
  public static OptionName = "backgroundColor";
}

// owners:
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
}

// owners:
// Range
// SubvalueIndicator
type IColorProps = React.PropsWithChildren<{
  base?: string;
  fillId?: string;
}>
class Color extends NestedOption<IColorProps> {
  public static OptionName = "color";
}

// owners:
// CircularGauge
type IExportProps = React.PropsWithChildren<{
  backgroundColor?: string;
  enabled?: boolean;
  fileName?: string;
  formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">;
  margin?: number;
  printingEnabled?: boolean;
  svgToCanvas?: ((svg: any, canvas: any) => any);
}>
class Export extends NestedOption<IExportProps> {
  public static OptionName = "export";
}

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
class Font extends NestedOption<IFontProps> {
  public static OptionName = "font";
}

// owners:
// Label
// Text
// Tooltip
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class Format extends NestedOption<IFormatProps> {
  public static OptionName = "format";
}

// owners:
// CircularGauge
type IGeometryProps = React.PropsWithChildren<{
  endAngle?: number;
  startAngle?: number;
}>
class Geometry extends NestedOption<IGeometryProps> {
  public static OptionName = "geometry";
}

// owners:
// Scale
type ILabelProps = React.PropsWithChildren<{
  customizeText?: ((scaleValue: { value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  hideFirstOrLast?: "first" | "last";
  indentFromTick?: number;
  overlappingBehavior?: "hide" | "none";
  useRangeColors?: boolean;
  visible?: boolean;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
  };
}

// owners:
// CircularGauge
type ILoadingIndicatorProps = React.PropsWithChildren<{
  backgroundColor?: string;
  font?: ChartsFont;
  show?: boolean;
  text?: string;
  defaultShow?: boolean;
  onShowChange?: (value: boolean) => void;
}>
class LoadingIndicator extends NestedOption<ILoadingIndicatorProps> {
  public static OptionName = "loadingIndicator";
  public static DefaultsProps = {
    defaultShow: "show"
  };
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// CircularGauge
// Title
type IMarginProps = React.PropsWithChildren<{
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}>
class Margin extends NestedOption<IMarginProps> {
  public static OptionName = "margin";
}

// owners:
// Scale
type IMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class MinorTick extends NestedOption<IMinorTickProps> {
  public static OptionName = "minorTick";
}

// owners:
// RangeContainer
type IRangeProps = React.PropsWithChildren<{
  color?: ChartsColor | string;
  endValue?: number;
  startValue?: number;
}>
class Range extends NestedOption<IRangeProps> {
  public static OptionName = "ranges";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    color: { optionName: "color", isCollectionItem: false }
  };
}

// owners:
// CircularGauge
type IRangeContainerProps = React.PropsWithChildren<{
  backgroundColor?: ChartsColor | string;
  offset?: number;
  orientation?: "center" | "inside" | "outside";
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  paletteExtensionMode?: "alternate" | "blend" | "extrapolate";
  ranges?: Array<Record<string, any>> | {
    color?: ChartsColor | string;
    endValue?: number;
    startValue?: number;
  }[];
  width?: number;
}>
class RangeContainer extends NestedOption<IRangeContainerProps> {
  public static OptionName = "rangeContainer";
  public static ExpectedChildren = {
    backgroundColor: { optionName: "backgroundColor", isCollectionItem: false },
    range: { optionName: "ranges", isCollectionItem: true }
  };
}

// owners:
// CircularGauge
type IScaleProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
  customMinorTicks?: Array<number>;
  customTicks?: Array<number>;
  endValue?: number;
  label?: Record<string, any> | {
    customizeText?: ((scaleValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    hideFirstOrLast?: "first" | "last";
    indentFromTick?: number;
    overlappingBehavior?: "hide" | "none";
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
  orientation?: "center" | "inside" | "outside";
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
}>
class Scale extends NestedOption<IScaleProps> {
  public static OptionName = "scale";
  public static ExpectedChildren = {
    label: { optionName: "label", isCollectionItem: false },
    minorTick: { optionName: "minorTick", isCollectionItem: false },
    tick: { optionName: "tick", isCollectionItem: false }
  };
}

// owners:
// Tooltip
type IShadowProps = React.PropsWithChildren<{
  blur?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
}>
class Shadow extends NestedOption<IShadowProps> {
  public static OptionName = "shadow";
}

// owners:
// CircularGauge
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
class Size extends NestedOption<ISizeProps> {
  public static OptionName = "size";
}

// owners:
// Title
type ISubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class Subtitle extends NestedOption<ISubtitleProps> {
  public static OptionName = "subtitle";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// CircularGauge
type ISubvalueIndicatorProps = React.PropsWithChildren<{
  arrowLength?: number;
  backgroundColor?: string;
  baseValue?: number;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: "left" | "right";
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: "bottom" | "top";
  width?: number;
}>
class SubvalueIndicator extends NestedOption<ISubvalueIndicatorProps> {
  public static OptionName = "subvalueIndicator";
  public static ExpectedChildren = {
    color: { optionName: "color", isCollectionItem: false },
    text: { optionName: "text", isCollectionItem: false }
  };
}

// owners:
// SubvalueIndicator
type ITextProps = React.PropsWithChildren<{
  customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  indent?: number;
}>
class Text extends NestedOption<ITextProps> {
  public static OptionName = "text";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
  };
}

// owners:
// Scale
type ITickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class Tick extends NestedOption<ITickProps> {
  public static OptionName = "tick";
}

// owners:
// CircularGauge
type ITitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
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
    textOverflow?: "ellipsis" | "hide" | "none";
    wordWrap?: "normal" | "breakWord" | "none";
  };
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  verticalAlignment?: "bottom" | "top";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class Title extends NestedOption<ITitleProps> {
  public static OptionName = "title";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  };
}

// owners:
// CircularGauge
type ITooltipProps = React.PropsWithChildren<{
  arrowLength?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
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
  format?: LocalizationTypes.Format;
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
  contentKeyFn?: (data: any) => string;
}>
class Tooltip extends NestedOption<ITooltipProps> {
  public static OptionName = "tooltip";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    shadow: { optionName: "shadow", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent",
    keyFn: "contentKeyFn"
  }];
}

// owners:
// CircularGauge
type IValueIndicatorProps = React.PropsWithChildren<{
  arrowLength?: number;
  backgroundColor?: string;
  baseValue?: number;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: "left" | "right";
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: "bottom" | "top";
  width?: number;
}>
class ValueIndicator extends NestedOption<IValueIndicatorProps> {
  public static OptionName = "valueIndicator";
}

export default CircularGauge;
export {
  CircularGauge,
  ICircularGaugeOptions,
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
  IValueIndicatorProps
};
import type * as CircularGaugeTypes from 'devextreme/viz/circular_gauge_types';
export { CircularGaugeTypes };

