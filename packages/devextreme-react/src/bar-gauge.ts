"use client"
import dxBarGauge, {
    Properties
} from "devextreme/viz/bar_gauge";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent, BarGaugeBarInfo, BarGaugeLegendItem } from "devextreme/viz/bar_gauge";
import type { Font as ChartsFont } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IBarGaugeOptionsNarrowedEvents = {
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

type IBarGaugeOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IBarGaugeOptionsNarrowedEvents> & IHtmlOptions & {
  centerRender?: (...params: any) => React.ReactNode;
  centerComponent?: React.ComponentType<any>;
  centerKeyFn?: (data: any) => string;
  defaultLoadingIndicator?: Record<string, any>;
  defaultValues?: Array<number>;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onValuesChange?: (value: Array<number>) => void;
}>

class BarGauge extends BaseComponent<React.PropsWithChildren<IBarGaugeOptions>> {

  public get instance(): dxBarGauge {
    return this._instance;
  }

  protected _WidgetClass = dxBarGauge;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show","values"];

  protected independentEvents = ["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onTooltipHidden","onTooltipShown"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator",
    defaultValues: "values"
  };

  protected _expectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false },
    barGaugeTitle: { optionName: "title", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    geometry: { optionName: "geometry", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    legend: { optionName: "legend", isCollectionItem: false },
    loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    size: { optionName: "size", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "centerTemplate",
    render: "centerRender",
    component: "centerComponent",
    keyFn: "centerKeyFn"
  }];
}
(BarGauge as any).propTypes = {
  backgroundColor: PropTypes.string,
  barSpacing: PropTypes.number,
  baseValue: PropTypes.number,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  endValue: PropTypes.number,
  export: PropTypes.object,
  geometry: PropTypes.object,
  label: PropTypes.object,
  legend: PropTypes.object,
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
  palette: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "Bright",
      "Harmony Light",
      "Ocean",
      "Pastel",
      "Soft",
      "Soft Pastel",
      "Vintage",
      "Violet",
      "Carmine",
      "Dark Moon",
      "Dark Violet",
      "Green Mist",
      "Soft Blue",
      "Material",
      "Office"])
  ])
  ]),
  paletteExtensionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "alternate",
      "blend",
      "extrapolate"])
  ]),
  pathModified: PropTypes.bool,
  redrawOnResize: PropTypes.bool,
  relativeInnerRadius: PropTypes.number,
  resolveLabelOverlapping: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "hide",
      "none",
      "shift"])
  ]),
  rtlEnabled: PropTypes.bool,
  size: PropTypes.object,
  startValue: PropTypes.number,
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
  values: PropTypes.array
};


// owners:
// BarGauge
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: "easeOutCubic" | "linear";
  enabled?: boolean;
}>
class Animation extends NestedOption<IAnimationProps> {
  public static OptionName = "animation";
}

// owners:
// BarGauge
type IBarGaugeTitleProps = React.PropsWithChildren<{
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
class BarGaugeTitle extends NestedOption<IBarGaugeTitleProps> {
  public static OptionName = "title";
  public static ExpectedChildren = {
    barGaugeTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  };
}

// owners:
// BarGaugeTitle
type IBarGaugeTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class BarGaugeTitleSubtitle extends NestedOption<IBarGaugeTitleSubtitleProps> {
  public static OptionName = "subtitle";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// Legend
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
}

// owners:
// BarGauge
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
// Legend
// LegendTitle
// LegendTitleSubtitle
// LoadingIndicator
// Tooltip
// BarGaugeTitle
// BarGaugeTitleSubtitle
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
// BarGauge
type IGeometryProps = React.PropsWithChildren<{
  endAngle?: number;
  startAngle?: number;
}>
class Geometry extends NestedOption<IGeometryProps> {
  public static OptionName = "geometry";
}

// owners:
// Legend
type IItemTextFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class ItemTextFormat extends NestedOption<IItemTextFormatProps> {
  public static OptionName = "itemTextFormat";
}

// owners:
// BarGauge
type ILabelProps = React.PropsWithChildren<{
  connectorColor?: string;
  connectorWidth?: number;
  customizeText?: ((barValue: { value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  indent?: number;
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
// BarGauge
type ILegendProps = React.PropsWithChildren<{
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  columnCount?: number;
  columnItemSpacing?: number;
  customizeHint?: ((arg: { item: BarGaugeBarInfo, text: string }) => string);
  customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
  customizeText?: ((arg: { item: BarGaugeBarInfo, text: string }) => string);
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  itemsAlignment?: "center" | "left" | "right";
  itemTextFormat?: LocalizationTypes.Format;
  itemTextPosition?: "bottom" | "left" | "right" | "top";
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerSize?: number;
  markerTemplate?: ((legendItem: BarGaugeLegendItem, element: any) => string | any) | template;
  orientation?: "horizontal" | "vertical";
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  rowCount?: number;
  rowItemSpacing?: number;
  title?: Record<string, any> | string | {
    font?: ChartsFont;
    horizontalAlignment?: "center" | "left" | "right";
    margin?: Record<string, any> | {
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
    };
    text?: string;
    verticalAlignment?: "bottom" | "top";
  };
  verticalAlignment?: "bottom" | "top";
  visible?: boolean;
  markerRender?: (...params: any) => React.ReactNode;
  markerComponent?: React.ComponentType<any>;
  markerKeyFn?: (data: any) => string;
}>
class Legend extends NestedOption<ILegendProps> {
  public static OptionName = "legend";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    itemTextFormat: { optionName: "itemTextFormat", isCollectionItem: false },
    legendBorder: { optionName: "border", isCollectionItem: false },
    legendTitle: { optionName: "title", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "markerTemplate",
    render: "markerRender",
    component: "markerComponent",
    keyFn: "markerKeyFn"
  }];
}

// owners:
// Legend
type ILegendBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class LegendBorder extends NestedOption<ILegendBorderProps> {
  public static OptionName = "border";
}

// owners:
// Legend
type ILegendTitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  margin?: Record<string, any> | {
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
  };
  text?: string;
  verticalAlignment?: "bottom" | "top";
}>
class LegendTitle extends NestedOption<ILegendTitleProps> {
  public static OptionName = "title";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    legendTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  };
}

// owners:
// LegendTitle
type ILegendTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
}>
class LegendTitleSubtitle extends NestedOption<ILegendTitleSubtitleProps> {
  public static OptionName = "subtitle";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// BarGauge
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
// Legend
// LegendTitle
// BarGauge
// BarGaugeTitle
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
// BarGauge
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
class Size extends NestedOption<ISizeProps> {
  public static OptionName = "size";
}

// owners:
// LegendTitle
// BarGaugeTitle
type ISubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class Subtitle extends NestedOption<ISubtitleProps> {
  public static OptionName = "subtitle";
}

// owners:
// Legend
// BarGauge
type ITitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  margin?: Record<string, any> | number | {
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
  verticalAlignment?: "bottom" | "top";
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class Title extends NestedOption<ITitleProps> {
  public static OptionName = "title";
}

// owners:
// BarGauge
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
  contentTemplate?: ((scaleValue: { index: number, value: number, valueText: string }, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((scaleValue: { index: number, value: number, valueText: string }) => Record<string, any>);
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
    shadow: { optionName: "shadow", isCollectionItem: false },
    tooltipBorder: { optionName: "border", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent",
    keyFn: "contentKeyFn"
  }];
}

// owners:
// Tooltip
type ITooltipBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class TooltipBorder extends NestedOption<ITooltipBorderProps> {
  public static OptionName = "border";
}

export default BarGauge;
export {
  BarGauge,
  IBarGaugeOptions,
  Animation,
  IAnimationProps,
  BarGaugeTitle,
  IBarGaugeTitleProps,
  BarGaugeTitleSubtitle,
  IBarGaugeTitleSubtitleProps,
  Border,
  IBorderProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Geometry,
  IGeometryProps,
  ItemTextFormat,
  IItemTextFormatProps,
  Label,
  ILabelProps,
  Legend,
  ILegendProps,
  LegendBorder,
  ILegendBorderProps,
  LegendTitle,
  ILegendTitleProps,
  LegendTitleSubtitle,
  ILegendTitleSubtitleProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Subtitle,
  ISubtitleProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  TooltipBorder,
  ITooltipBorderProps
};
import type * as BarGaugeTypes from 'devextreme/viz/bar_gauge_types';
export { BarGaugeTypes };

