"use client"
import dxChart, {
    Properties
} from "devextreme/viz/chart";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, PointClickEvent, SeriesClickEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomEndEvent, ZoomStartEvent, chartPointAggregationInfoObject, chartSeriesObject, dxChartAnnotationConfig, chartPointObject } from "devextreme/viz/chart";
import type { Font as ChartsFont, ScaleBreak, ChartsColor, LegendItem } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";
import type { ChartSeries } from "devextreme/viz/common";

import type * as CommonChartTypes from "devextreme/common/charts";
import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IChartOptionsNarrowedEvents = {
  onArgumentAxisClick?: ((e: ArgumentAxisClickEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onDone?: ((e: DoneEvent) => void);
  onDrawn?: ((e: DrawnEvent) => void);
  onExported?: ((e: ExportedEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onFileSaving?: ((e: FileSavingEvent) => void);
  onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onLegendClick?: ((e: LegendClickEvent) => void);
  onPointClick?: ((e: PointClickEvent) => void);
  onSeriesClick?: ((e: SeriesClickEvent) => void);
  onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
  onTooltipShown?: ((e: TooltipShownEvent) => void);
  onZoomEnd?: ((e: ZoomEndEvent) => void);
  onZoomStart?: ((e: ZoomStartEvent) => void);
}

type IChartOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IChartOptionsNarrowedEvents> & IHtmlOptions & {
  defaultArgumentAxis?: Record<string, any>;
  defaultLoadingIndicator?: Record<string, any>;
  defaultValueAxis?: Array<Record<string, any>> | Record<string, any>;
  onArgumentAxisChange?: (value: Record<string, any>) => void;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onValueAxisChange?: (value: Array<Record<string, any>> | Record<string, any>) => void;
}>

class Chart extends BaseComponent<React.PropsWithChildren<IChartOptions>> {

  public get instance(): dxChart {
    return this._instance;
  }

  protected _WidgetClass = dxChart;

  protected useRequestAnimationFrameFlag = true;

  protected subscribableOptions = ["argumentAxis","argumentAxis.categories","argumentAxis.visualRange","loadingIndicator","loadingIndicator.show","valueAxis","valueAxis.categories","valueAxis.visualRange"];

  protected independentEvents = ["onArgumentAxisClick","onDisposing","onDone","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onLegendClick","onPointClick","onSeriesClick","onTooltipHidden","onTooltipShown","onZoomEnd","onZoomStart"];

  protected _defaults = {
    defaultArgumentAxis: "argumentAxis",
    defaultLoadingIndicator: "loadingIndicator",
    defaultValueAxis: "valueAxis"
  };

  protected _expectedChildren = {
    adaptiveLayout: { optionName: "adaptiveLayout", isCollectionItem: false },
    animation: { optionName: "animation", isCollectionItem: false },
    annotation: { optionName: "annotations", isCollectionItem: true },
    argumentAxis: { optionName: "argumentAxis", isCollectionItem: false },
    chartTitle: { optionName: "title", isCollectionItem: false },
    commonAnnotationSettings: { optionName: "commonAnnotationSettings", isCollectionItem: false },
    commonAxisSettings: { optionName: "commonAxisSettings", isCollectionItem: false },
    commonPaneSettings: { optionName: "commonPaneSettings", isCollectionItem: false },
    commonSeriesSettings: { optionName: "commonSeriesSettings", isCollectionItem: false },
    crosshair: { optionName: "crosshair", isCollectionItem: false },
    dataPrepareSettings: { optionName: "dataPrepareSettings", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    legend: { optionName: "legend", isCollectionItem: false },
    loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    pane: { optionName: "panes", isCollectionItem: true },
    scrollBar: { optionName: "scrollBar", isCollectionItem: false },
    series: { optionName: "series", isCollectionItem: true },
    seriesTemplate: { optionName: "seriesTemplate", isCollectionItem: false },
    size: { optionName: "size", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false },
    valueAxis: { optionName: "valueAxis", isCollectionItem: true },
    zoomAndPan: { optionName: "zoomAndPan", isCollectionItem: false }
  };
}
(Chart as any).propTypes = {
  adaptiveLayout: PropTypes.object,
  adjustOnZoom: PropTypes.bool,
  animation: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  annotations: PropTypes.array,
  argumentAxis: PropTypes.object,
  autoHidePointMarkers: PropTypes.bool,
  barGroupPadding: PropTypes.number,
  barGroupWidth: PropTypes.number,
  commonAnnotationSettings: PropTypes.object,
  commonAxisSettings: PropTypes.object,
  commonPaneSettings: PropTypes.object,
  commonSeriesSettings: PropTypes.object,
  containerBackgroundColor: PropTypes.string,
  crosshair: PropTypes.object,
  customizeAnnotation: PropTypes.func,
  customizeLabel: PropTypes.func,
  customizePoint: PropTypes.func,
  dataPrepareSettings: PropTypes.object,
  defaultPane: PropTypes.string,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  legend: PropTypes.object,
  loadingIndicator: PropTypes.object,
  margin: PropTypes.object,
  maxBubbleSize: PropTypes.number,
  minBubbleSize: PropTypes.number,
  negativesAsZeroes: PropTypes.bool,
  onArgumentAxisClick: PropTypes.func,
  onDisposing: PropTypes.func,
  onDone: PropTypes.func,
  onDrawn: PropTypes.func,
  onExported: PropTypes.func,
  onExporting: PropTypes.func,
  onFileSaving: PropTypes.func,
  onIncidentOccurred: PropTypes.func,
  onInitialized: PropTypes.func,
  onLegendClick: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onPointClick: PropTypes.func,
  onPointHoverChanged: PropTypes.func,
  onPointSelectionChanged: PropTypes.func,
  onSeriesClick: PropTypes.func,
  onSeriesHoverChanged: PropTypes.func,
  onSeriesSelectionChanged: PropTypes.func,
  onTooltipHidden: PropTypes.func,
  onTooltipShown: PropTypes.func,
  onZoomEnd: PropTypes.func,
  onZoomStart: PropTypes.func,
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
  panes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  pathModified: PropTypes.bool,
  pointSelectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple"])
  ]),
  redrawOnResize: PropTypes.bool,
  resizePanesOnZoom: PropTypes.bool,
  resolveLabelOverlapping: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "hide",
      "none",
      "stack"])
  ]),
  rotated: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  scrollBar: PropTypes.object,
  series: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  seriesSelectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple"])
  ]),
  seriesTemplate: PropTypes.object,
  size: PropTypes.object,
  stickyHovering: PropTypes.bool,
  synchronizeMultiAxes: PropTypes.bool,
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
  valueAxis: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  zoomAndPan: PropTypes.object
};


// owners:
// Chart
type IAdaptiveLayoutProps = React.PropsWithChildren<{
  height?: number;
  keepLabels?: boolean;
  width?: number;
}>
class AdaptiveLayout extends NestedOption<IAdaptiveLayoutProps> {
  public static OptionName = "adaptiveLayout";
}

// owners:
// CommonSeriesSettings
type IAggregationProps = React.PropsWithChildren<{
  calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
  enabled?: boolean;
  method?: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom";
}>
class Aggregation extends NestedOption<IAggregationProps> {
  public static OptionName = "aggregation";
}

// owners:
// ArgumentAxis
type IAggregationIntervalProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
class AggregationInterval extends NestedOption<IAggregationIntervalProps> {
  public static OptionName = "aggregationInterval";
}

// owners:
// Chart
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: "easeOutCubic" | "linear";
  enabled?: boolean;
  maxPointCountSupported?: number;
}>
class Animation extends NestedOption<IAnimationProps> {
  public static OptionName = "animation";
}

// owners:
// Chart
type IAnnotationProps = React.PropsWithChildren<{
  allowDragging?: boolean;
  argument?: Date | number | string;
  arrowLength?: number;
  arrowWidth?: number;
  axis?: string;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => Record<string, any>);
  data?: any;
  description?: string;
  font?: ChartsFont;
  height?: number;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string;
    width?: number;
  };
  name?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  series?: string;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxChartAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxChartAnnotationConfig | any, element: any) => string | any) | template;
  type?: "text" | "image" | "custom";
  value?: Date | number | string;
  width?: number;
  wordWrap?: "normal" | "breakWord" | "none";
  x?: number;
  y?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
  tooltipRender?: (...params: any) => React.ReactNode;
  tooltipComponent?: React.ComponentType<any>;
  tooltipKeyFn?: (data: any) => string;
}>
class Annotation extends NestedOption<IAnnotationProps> {
  public static OptionName = "annotations";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    annotationBorder: { optionName: "border", isCollectionItem: false },
    annotationImage: { optionName: "image", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    image: { optionName: "image", isCollectionItem: false },
    shadow: { optionName: "shadow", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }, {
    tmplOption: "tooltipTemplate",
    render: "tooltipRender",
    component: "tooltipComponent",
    keyFn: "tooltipKeyFn"
  }];
}

// owners:
// Annotation
// Legend
type IAnnotationBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class AnnotationBorder extends NestedOption<IAnnotationBorderProps> {
  public static OptionName = "border";
}

// owners:
// Annotation
type IAnnotationImageProps = React.PropsWithChildren<{
  height?: number;
  url?: string;
  width?: number;
}>
class AnnotationImage extends NestedOption<IAnnotationImageProps> {
  public static OptionName = "image";
}

// owners:
// Chart
type IArgumentAxisProps = React.PropsWithChildren<{
  aggregateByCategory?: boolean;
  aggregatedPointsPosition?: "betweenTicks" | "crossTicks";
  aggregationGroupWidth?: number;
  aggregationInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  allowDecimals?: boolean;
  argumentType?: "datetime" | "numeric" | "string";
  axisDivisionFactor?: number;
  breaks?: Array<ScaleBreak> | {
    endValue?: Date | number | string;
    startValue?: Date | number | string;
  }[];
  breakStyle?: Record<string, any> | {
    color?: string;
    line?: "straight" | "waved";
    width?: number;
  };
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      position?: "inside" | "outside";
      text?: string;
      verticalAlignment?: "bottom" | "center" | "top";
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    value?: Date | number | string;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      position?: "inside" | "outside";
      verticalAlignment?: "bottom" | "center" | "top";
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    width?: number;
  };
  customPosition?: Date | number | string;
  customPositionAxis?: string;
  discreteAxisDivisionMode?: "betweenLabels" | "crossLabels";
  endOnTick?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  holidays?: Array<Date | string> | Array<number>;
  hoverMode?: "allArgumentPoints" | "none";
  inverted?: boolean;
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
    displayMode?: "rotate" | "stagger" | "standard";
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indentFromAxis?: number;
    overlappingBehavior?: "rotate" | "stagger" | "none" | "hide";
    position?: "inside" | "outside" | "bottom" | "left" | "right" | "top";
    rotationAngle?: number;
    staggeringSpacing?: number;
    template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
    textOverflow?: "ellipsis" | "hide" | "none";
    visible?: boolean;
    wordWrap?: "normal" | "breakWord" | "none";
  };
  linearThreshold?: number;
  logarithmBase?: number;
  maxValueMargin?: number;
  minorGrid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  minorTick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    shift?: number;
    visible?: boolean;
    width?: number;
  };
  minorTickCount?: number;
  minorTickInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  minValueMargin?: number;
  minVisualRangeLength?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  offset?: number;
  opacity?: number;
  placeholderSize?: number;
  position?: "bottom" | "left" | "right" | "top";
  singleWorkdays?: Array<Date | string> | Array<number>;
  strips?: Array<Record<string, any>> | {
    color?: string;
    endValue?: Date | number | string;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      text?: string;
      verticalAlignment?: "bottom" | "center" | "top";
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    startValue?: Date | number | string;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      verticalAlignment?: "bottom" | "center" | "top";
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
  };
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    shift?: number;
    visible?: boolean;
    width?: number;
  };
  tickInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  title?: Record<string, any> | string | {
    alignment?: "center" | "left" | "right";
    font?: ChartsFont;
    margin?: number;
    text?: string;
    textOverflow?: "ellipsis" | "hide" | "none";
    wordWrap?: "normal" | "breakWord" | "none";
  };
  type?: "continuous" | "discrete" | "logarithmic";
  valueMarginsEnabled?: boolean;
  visible?: boolean;
  visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  visualRangeUpdateMode?: "auto" | "keep" | "reset" | "shift";
  wholeRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  width?: number;
  workdaysOnly?: boolean;
  workWeek?: Array<number>;
  defaultCategories?: Array<Date | number | string>;
  onCategoriesChange?: (value: Array<Date | number | string>) => void;
  defaultVisualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onVisualRangeChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>
class ArgumentAxis extends NestedOption<IArgumentAxisProps> {
  public static OptionName = "argumentAxis";
  public static DefaultsProps = {
    defaultCategories: "categories",
    defaultVisualRange: "visualRange"
  };
  public static ExpectedChildren = {
    aggregationInterval: { optionName: "aggregationInterval", isCollectionItem: false },
    axisConstantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    axisLabel: { optionName: "label", isCollectionItem: false },
    axisTitle: { optionName: "title", isCollectionItem: false },
    break: { optionName: "breaks", isCollectionItem: true },
    breakStyle: { optionName: "breakStyle", isCollectionItem: false },
    constantLine: { optionName: "constantLines", isCollectionItem: true },
    constantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    grid: { optionName: "grid", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    minorGrid: { optionName: "minorGrid", isCollectionItem: false },
    minorTick: { optionName: "minorTick", isCollectionItem: false },
    minorTickInterval: { optionName: "minorTickInterval", isCollectionItem: false },
    minVisualRangeLength: { optionName: "minVisualRangeLength", isCollectionItem: false },
    strip: { optionName: "strips", isCollectionItem: true },
    stripStyle: { optionName: "stripStyle", isCollectionItem: false },
    tick: { optionName: "tick", isCollectionItem: false },
    tickInterval: { optionName: "tickInterval", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    visualRange: { optionName: "visualRange", isCollectionItem: false },
    wholeRange: { optionName: "wholeRange", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettingsLabel
// Tooltip
type IArgumentFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class ArgumentFormat extends NestedOption<IArgumentFormatProps> {
  public static OptionName = "argumentFormat";
}

// owners:
// ArgumentAxis
// ValueAxis
type IAxisConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: "center" | "left" | "right";
    position?: "inside" | "outside";
    verticalAlignment?: "bottom" | "center" | "top";
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  width?: number;
}>
class AxisConstantLineStyle extends NestedOption<IAxisConstantLineStyleProps> {
  public static OptionName = "constantLineStyle";
}

// owners:
// AxisConstantLineStyle
// ConstantLineStyle
type IAxisConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  position?: "inside" | "outside";
  verticalAlignment?: "bottom" | "center" | "top";
  visible?: boolean;
}>
class AxisConstantLineStyleLabel extends NestedOption<IAxisConstantLineStyleLabelProps> {
  public static OptionName = "label";
}

// owners:
// ArgumentAxis
// ValueAxis
type IAxisLabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  displayMode?: "rotate" | "stagger" | "standard";
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  indentFromAxis?: number;
  overlappingBehavior?: "rotate" | "stagger" | "none" | "hide";
  position?: "inside" | "outside" | "bottom" | "left" | "right" | "top";
  rotationAngle?: number;
  staggeringSpacing?: number;
  template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
  textOverflow?: "ellipsis" | "hide" | "none";
  visible?: boolean;
  wordWrap?: "normal" | "breakWord" | "none";
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class AxisLabel extends NestedOption<IAxisLabelProps> {
  public static OptionName = "label";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// ArgumentAxis
// ValueAxis
type IAxisTitleProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  font?: ChartsFont;
  margin?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class AxisTitle extends NestedOption<IAxisTitleProps> {
  public static OptionName = "title";
}

// owners:
// CommonPaneSettings
type IBackgroundColorProps = React.PropsWithChildren<{
  base?: string;
  fillId?: string;
}>
class BackgroundColor extends NestedOption<IBackgroundColorProps> {
  public static OptionName = "backgroundColor";
}

// owners:
// Annotation
// Legend
// CommonPaneSettings
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsLabel
// CommonSeriesSettingsSelectionStyle
// Point
// PointHoverStyle
// PointSelectionStyle
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  top?: boolean;
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
}

// owners:
// ArgumentAxis
// ValueAxis
type IBreakProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  startValue?: Date | number | string;
}>
class Break extends NestedOption<IBreakProps> {
  public static OptionName = "breaks";
  public static IsCollectionItem = true;
}

// owners:
// ArgumentAxis
type IBreakStyleProps = React.PropsWithChildren<{
  color?: string;
  line?: "straight" | "waved";
  width?: number;
}>
class BreakStyle extends NestedOption<IBreakStyleProps> {
  public static OptionName = "breakStyle";
}

// owners:
// Chart
type IChartTitleProps = React.PropsWithChildren<{
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
class ChartTitle extends NestedOption<IChartTitleProps> {
  public static OptionName = "title";
  public static ExpectedChildren = {
    chartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  };
}

// owners:
// ChartTitle
type IChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class ChartTitleSubtitle extends NestedOption<IChartTitleSubtitleProps> {
  public static OptionName = "subtitle";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// Point
// PointHoverStyle
// PointSelectionStyle
// CommonSeriesSettingsSelectionStyle
type IColorProps = React.PropsWithChildren<{
  base?: string;
  fillId?: string;
}>
class Color extends NestedOption<IColorProps> {
  public static OptionName = "color";
}

// owners:
// Chart
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
  argument?: Date | number | string;
  arrowLength?: number;
  arrowWidth?: number;
  axis?: string;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => Record<string, any>);
  data?: any;
  description?: string;
  font?: ChartsFont;
  height?: number;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string;
    width?: number;
  };
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  series?: string;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxChartAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxChartAnnotationConfig | any, element: any) => string | any) | template;
  type?: "text" | "image" | "custom";
  value?: Date | number | string;
  width?: number;
  wordWrap?: "normal" | "breakWord" | "none";
  x?: number;
  y?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
  tooltipRender?: (...params: any) => React.ReactNode;
  tooltipComponent?: React.ComponentType<any>;
  tooltipKeyFn?: (data: any) => string;
}>
class CommonAnnotationSettings extends NestedOption<ICommonAnnotationSettingsProps> {
  public static OptionName = "commonAnnotationSettings";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }, {
    tmplOption: "tooltipTemplate",
    render: "tooltipRender",
    component: "tooltipComponent",
    keyFn: "tooltipKeyFn"
  }];
}

// owners:
// Chart
type ICommonAxisSettingsProps = React.PropsWithChildren<{
  aggregatedPointsPosition?: "betweenTicks" | "crossTicks";
  allowDecimals?: boolean;
  breakStyle?: Record<string, any> | {
    color?: string;
    line?: "straight" | "waved";
    width?: number;
  };
  color?: string;
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      font?: ChartsFont;
      position?: "inside" | "outside";
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    width?: number;
  };
  discreteAxisDivisionMode?: "betweenLabels" | "crossLabels";
  endOnTick?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  inverted?: boolean;
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    displayMode?: "rotate" | "stagger" | "standard";
    font?: ChartsFont;
    indentFromAxis?: number;
    overlappingBehavior?: "rotate" | "stagger" | "none" | "hide";
    position?: "inside" | "outside" | "bottom" | "left" | "right" | "top";
    rotationAngle?: number;
    staggeringSpacing?: number;
    template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
    textOverflow?: "ellipsis" | "hide" | "none";
    visible?: boolean;
    wordWrap?: "normal" | "breakWord" | "none";
  };
  maxValueMargin?: number;
  minorGrid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  minorTick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    shift?: number;
    visible?: boolean;
    width?: number;
  };
  minValueMargin?: number;
  opacity?: number;
  placeholderSize?: number;
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      verticalAlignment?: "bottom" | "center" | "top";
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
  };
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    shift?: number;
    visible?: boolean;
    width?: number;
  };
  title?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    font?: ChartsFont;
    margin?: number;
    textOverflow?: "ellipsis" | "hide" | "none";
    wordWrap?: "normal" | "breakWord" | "none";
  };
  valueMarginsEnabled?: boolean;
  visible?: boolean;
  width?: number;
}>
class CommonAxisSettings extends NestedOption<ICommonAxisSettingsProps> {
  public static OptionName = "commonAxisSettings";
  public static ExpectedChildren = {
    commonAxisSettingsConstantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    commonAxisSettingsLabel: { optionName: "label", isCollectionItem: false },
    commonAxisSettingsTitle: { optionName: "title", isCollectionItem: false },
    constantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false }
  };
}

// owners:
// CommonAxisSettings
type ICommonAxisSettingsConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  label?: Record<string, any> | {
    font?: ChartsFont;
    position?: "inside" | "outside";
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  width?: number;
}>
class CommonAxisSettingsConstantLineStyle extends NestedOption<ICommonAxisSettingsConstantLineStyleProps> {
  public static OptionName = "constantLineStyle";
  public static ExpectedChildren = {
    commonAxisSettingsConstantLineStyleLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  };
}

// owners:
// CommonAxisSettingsConstantLineStyle
type ICommonAxisSettingsConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  position?: "inside" | "outside";
  visible?: boolean;
}>
class CommonAxisSettingsConstantLineStyleLabel extends NestedOption<ICommonAxisSettingsConstantLineStyleLabelProps> {
  public static OptionName = "label";
}

// owners:
// CommonAxisSettings
type ICommonAxisSettingsLabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  displayMode?: "rotate" | "stagger" | "standard";
  font?: ChartsFont;
  indentFromAxis?: number;
  overlappingBehavior?: "rotate" | "stagger" | "none" | "hide";
  position?: "inside" | "outside" | "bottom" | "left" | "right" | "top";
  rotationAngle?: number;
  staggeringSpacing?: number;
  template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
  textOverflow?: "ellipsis" | "hide" | "none";
  visible?: boolean;
  wordWrap?: "normal" | "breakWord" | "none";
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class CommonAxisSettingsLabel extends NestedOption<ICommonAxisSettingsLabelProps> {
  public static OptionName = "label";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// CommonAxisSettings
type ICommonAxisSettingsTitleProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  font?: ChartsFont;
  margin?: number;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class CommonAxisSettingsTitle extends NestedOption<ICommonAxisSettingsTitleProps> {
  public static OptionName = "title";
}

// owners:
// Chart
type ICommonPaneSettingsProps = React.PropsWithChildren<{
  backgroundColor?: ChartsColor | string;
  border?: Record<string, any> | {
    bottom?: boolean;
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    left?: boolean;
    opacity?: number;
    right?: boolean;
    top?: boolean;
    visible?: boolean;
    width?: number;
  };
}>
class CommonPaneSettings extends NestedOption<ICommonPaneSettingsProps> {
  public static OptionName = "commonPaneSettings";
  public static ExpectedChildren = {
    backgroundColor: { optionName: "backgroundColor", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    paneBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Chart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom";
  };
  area?: any;
  argumentField?: string;
  axis?: string;
  bar?: any;
  barOverlapGroup?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  bubble?: any;
  candlestick?: any;
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  fullstackedarea?: any;
  fullstackedbar?: any;
  fullstackedline?: any;
  fullstackedspline?: any;
  fullstackedsplinearea?: any;
  highValueField?: string;
  hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  ignoreEmptyPoints?: boolean;
  innerColor?: string;
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    argumentFormat?: LocalizationTypes.Format;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    connector?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    customizeText?: ((pointInfo: any) => string);
    displayFormat?: string;
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    horizontalOffset?: number;
    position?: "inside" | "outside";
    rotationAngle?: number;
    showForZeroValues?: boolean;
    verticalOffset?: number;
    visible?: boolean;
  };
  line?: any;
  lowValueField?: string;
  maxLabelCount?: number;
  minBarSize?: number;
  opacity?: number;
  openValueField?: string;
  pane?: string;
  point?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    hoverStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    image?: Record<string, any> | string | {
      height?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
      url?: Record<string, any> | string | {
        rangeMaxPoint?: string;
        rangeMinPoint?: string;
      };
      width?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
    };
    selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    selectionStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    size?: number;
    symbol?: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp";
    visible?: boolean;
  };
  rangearea?: any;
  rangebar?: any;
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: "close" | "high" | "low" | "open";
  };
  scatter?: any;
  selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  showInLegend?: boolean;
  sizeField?: string;
  spline?: any;
  splinearea?: any;
  stack?: string;
  stackedarea?: any;
  stackedbar?: any;
  stackedline?: any;
  stackedspline?: any;
  stackedsplinearea?: any;
  steparea?: any;
  stepline?: any;
  stock?: any;
  tagField?: string;
  type?: "area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock";
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: "auto" | "high" | "low" | "none";
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance";
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
class CommonSeriesSettings extends NestedOption<ICommonSeriesSettingsProps> {
  public static OptionName = "commonSeriesSettings";
  public static ExpectedChildren = {
    aggregation: { optionName: "aggregation", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    commonSeriesSettingsHoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    commonSeriesSettingsLabel: { optionName: "label", isCollectionItem: false },
    commonSeriesSettingsSelectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    point: { optionName: "point", isCollectionItem: false },
    reduction: { optionName: "reduction", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false },
    valueErrorBar: { optionName: "valueErrorBar", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
class CommonSeriesSettingsHoverStyle extends NestedOption<ICommonSeriesSettingsHoverStyleProps> {
  public static OptionName = "hoverStyle";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsLabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  argumentFormat?: LocalizationTypes.Format;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  connector?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  customizeText?: ((pointInfo: any) => string);
  displayFormat?: string;
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  horizontalOffset?: number;
  position?: "inside" | "outside";
  rotationAngle?: number;
  showForZeroValues?: boolean;
  verticalOffset?: number;
  visible?: boolean;
}>
class CommonSeriesSettingsLabel extends NestedOption<ICommonSeriesSettingsLabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    argumentFormat: { optionName: "argumentFormat", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    connector: { optionName: "connector", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsSelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
class CommonSeriesSettingsSelectionStyle extends NestedOption<ICommonSeriesSettingsSelectionStyleProps> {
  public static OptionName = "selectionStyle";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettingsLabel
type IConnectorProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
class Connector extends NestedOption<IConnectorProps> {
  public static OptionName = "connector";
}

// owners:
// ArgumentAxis
// ValueAxis
type IConstantLineProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  displayBehindSeries?: boolean;
  extendAxis?: boolean;
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: "center" | "left" | "right";
    position?: "inside" | "outside";
    text?: string;
    verticalAlignment?: "bottom" | "center" | "top";
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  value?: Date | number | string;
  width?: number;
}>
class ConstantLine extends NestedOption<IConstantLineProps> {
  public static OptionName = "constantLines";
  public static IsCollectionItem = true;
}

// owners:
// ConstantLine
// ConstantLine
type IConstantLineLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  position?: "inside" | "outside";
  text?: string;
  verticalAlignment?: "bottom" | "center" | "top";
  visible?: boolean;
}>
class ConstantLineLabel extends NestedOption<IConstantLineLabelProps> {
  public static OptionName = "label";
}

// owners:
// ArgumentAxis
// ValueAxis
// CommonAxisSettings
type IConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: "center" | "left" | "right";
    position?: "inside" | "outside";
    verticalAlignment?: "bottom" | "center" | "top";
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  width?: number;
}>
class ConstantLineStyle extends NestedOption<IConstantLineStyleProps> {
  public static OptionName = "constantLineStyle";
}

// owners:
// Chart
type ICrosshairProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  enabled?: boolean;
  horizontalLine?: boolean | Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      backgroundColor?: string;
      customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
      font?: ChartsFont;
      format?: LocalizationTypes.Format;
      visible?: boolean;
    };
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  label?: Record<string, any> | {
    backgroundColor?: string;
    customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    visible?: boolean;
  };
  opacity?: number;
  verticalLine?: boolean | Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      backgroundColor?: string;
      customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
      font?: ChartsFont;
      format?: LocalizationTypes.Format;
      visible?: boolean;
    };
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  width?: number;
}>
class Crosshair extends NestedOption<ICrosshairProps> {
  public static OptionName = "crosshair";
  public static ExpectedChildren = {
    horizontalLine: { optionName: "horizontalLine", isCollectionItem: false },
    horizontalLineLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    verticalLine: { optionName: "verticalLine", isCollectionItem: false }
  };
}

// owners:
// Chart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: any, b: any) => number);
}>
class DataPrepareSettings extends NestedOption<IDataPrepareSettingsProps> {
  public static OptionName = "dataPrepareSettings";
}

// owners:
// ZoomAndPan
type IDragBoxStyleProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
}>
class DragBoxStyle extends NestedOption<IDragBoxStyleProps> {
  public static OptionName = "dragBoxStyle";
}

// owners:
// Chart
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
// Annotation
// Label
// AxisLabel
// Label
// AxisTitle
// CommonSeriesSettingsLabel
// Label
// Label
// Label
// Legend
// LegendTitle
// LegendTitleSubtitle
// Tooltip
// LoadingIndicator
// ChartTitle
// ChartTitleSubtitle
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
// AxisLabel
// CommonSeriesSettingsLabel
// Label
// Label
// Label
// Tooltip
// Label
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
// ArgumentAxis
type IGridProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class Grid extends NestedOption<IGridProps> {
  public static OptionName = "grid";
}

// owners:
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsSelectionStyle
type IHatchingProps = React.PropsWithChildren<{
  direction?: "left" | "none" | "right";
  opacity?: number;
  step?: number;
  width?: number;
}>
class Hatching extends NestedOption<IHatchingProps> {
  public static OptionName = "hatching";
}

// owners:
// PointImage
type IHeightProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
class Height extends NestedOption<IHeightProps> {
  public static OptionName = "height";
}

// owners:
// Crosshair
type IHorizontalLineProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  label?: Record<string, any> | {
    backgroundColor?: string;
    customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    visible?: boolean;
  };
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class HorizontalLine extends NestedOption<IHorizontalLineProps> {
  public static OptionName = "horizontalLine";
  public static ExpectedChildren = {
    horizontalLineLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  };
}

// owners:
// HorizontalLine
// Crosshair
// VerticalLine
type IHorizontalLineLabelProps = React.PropsWithChildren<{
  backgroundColor?: string;
  customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  visible?: boolean;
}>
class HorizontalLineLabel extends NestedOption<IHorizontalLineLabelProps> {
  public static OptionName = "label";
}

// owners:
// CommonSeriesSettings
// Point
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
  size?: number;
}>
class HoverStyle extends NestedOption<IHoverStyleProps> {
  public static OptionName = "hoverStyle";
}

// owners:
// Annotation
// Point
type IImageProps = React.PropsWithChildren<{
  height?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
  url?: string | Record<string, any> | {
    rangeMaxPoint?: string;
    rangeMinPoint?: string;
  };
  width?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
}>
class Image extends NestedOption<IImageProps> {
  public static OptionName = "image";
}

// owners:
// AxisConstantLineStyle
// ConstantLineStyle
// ConstantLine
// ConstantLine
// ArgumentAxis
// ValueAxis
// Strip
// Strip
// StripStyle
// CommonAxisSettingsConstantLineStyle
// CommonAxisSettings
// CommonSeriesSettings
// HorizontalLine
// Crosshair
// VerticalLine
type ILabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  position?: "inside" | "outside" | "bottom" | "left" | "right" | "top";
  verticalAlignment?: "bottom" | "center" | "top";
  visible?: boolean;
  text?: string;
  alignment?: "center" | "left" | "right";
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  displayMode?: "rotate" | "stagger" | "standard";
  format?: LocalizationTypes.Format;
  indentFromAxis?: number;
  overlappingBehavior?: "rotate" | "stagger" | "none" | "hide";
  rotationAngle?: number;
  staggeringSpacing?: number;
  template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
  argumentFormat?: LocalizationTypes.Format;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  connector?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  displayFormat?: string;
  horizontalOffset?: number;
  showForZeroValues?: boolean;
  verticalOffset?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Chart
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
  customizeHint?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string);
  customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
  customizeText?: ((seriesInfo: { seriesColor: string, seriesIndex: number, seriesName: any }) => string);
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  hoverMode?: "excludePoints" | "includePoints" | "none";
  itemsAlignment?: "center" | "left" | "right";
  itemTextPosition?: "bottom" | "left" | "right" | "top";
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerSize?: number;
  markerTemplate?: ((legendItem: LegendItem, element: any) => string | any) | template;
  orientation?: "horizontal" | "vertical";
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  position?: "inside" | "outside";
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
    annotationBorder: { optionName: "border", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
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
// VisualRange
type ILengthProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
class Length extends NestedOption<ILengthProps> {
  public static OptionName = "length";
}

// owners:
// Chart
type ILoadingIndicatorProps = React.PropsWithChildren<{
  backgroundColor?: string;
  enabled?: boolean;
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
// Chart
// ChartTitle
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
// ArgumentAxis
type IMinorGridProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class MinorGrid extends NestedOption<IMinorGridProps> {
  public static OptionName = "minorGrid";
}

// owners:
// ArgumentAxis
type IMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  shift?: number;
  visible?: boolean;
  width?: number;
}>
class MinorTick extends NestedOption<IMinorTickProps> {
  public static OptionName = "minorTick";
}

// owners:
// ArgumentAxis
// ValueAxis
type IMinorTickIntervalProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
class MinorTickInterval extends NestedOption<IMinorTickIntervalProps> {
  public static OptionName = "minorTickInterval";
}

// owners:
// ArgumentAxis
// ValueAxis
type IMinVisualRangeLengthProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
class MinVisualRangeLength extends NestedOption<IMinVisualRangeLengthProps> {
  public static OptionName = "minVisualRangeLength";
}

// owners:
// Chart
type IPaneProps = React.PropsWithChildren<{
  backgroundColor?: ChartsColor | string;
  border?: Record<string, any> | {
    bottom?: boolean;
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    left?: boolean;
    opacity?: number;
    right?: boolean;
    top?: boolean;
    visible?: boolean;
    width?: number;
  };
  height?: number | string;
  name?: string;
}>
class Pane extends NestedOption<IPaneProps> {
  public static OptionName = "panes";
  public static IsCollectionItem = true;
}

// owners:
// CommonPaneSettings
type IPaneBorderProps = React.PropsWithChildren<{
  bottom?: boolean;
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  left?: boolean;
  opacity?: number;
  right?: boolean;
  top?: boolean;
  visible?: boolean;
  width?: number;
}>
class PaneBorder extends NestedOption<IPaneBorderProps> {
  public static OptionName = "border";
}

// owners:
// CommonSeriesSettings
type IPointProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    size?: number;
  };
  image?: Record<string, any> | string | {
    height?: number | Record<string, any> | {
      rangeMaxPoint?: number;
      rangeMinPoint?: number;
    };
    url?: Record<string, any> | string | {
      rangeMaxPoint?: string;
      rangeMinPoint?: string;
    };
    width?: number | Record<string, any> | {
      rangeMaxPoint?: number;
      rangeMinPoint?: number;
    };
  };
  selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    size?: number;
  };
  size?: number;
  symbol?: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp";
  visible?: boolean;
}>
class Point extends NestedOption<IPointProps> {
  public static OptionName = "point";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    image: { optionName: "image", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false },
    pointHoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    pointImage: { optionName: "image", isCollectionItem: false },
    pointSelectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false }
  };
}

// owners:
// Point
// PointHoverStyle
// PointSelectionStyle
type IPointBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
class PointBorder extends NestedOption<IPointBorderProps> {
  public static OptionName = "border";
}

// owners:
// Point
type IPointHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  size?: number;
}>
class PointHoverStyle extends NestedOption<IPointHoverStyleProps> {
  public static OptionName = "hoverStyle";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Point
type IPointImageProps = React.PropsWithChildren<{
  height?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
  url?: Record<string, any> | string | {
    rangeMaxPoint?: string;
    rangeMinPoint?: string;
  };
  width?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
}>
class PointImage extends NestedOption<IPointImageProps> {
  public static OptionName = "image";
  public static ExpectedChildren = {
    height: { optionName: "height", isCollectionItem: false },
    url: { optionName: "url", isCollectionItem: false },
    width: { optionName: "width", isCollectionItem: false }
  };
}

// owners:
// Point
type IPointSelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  size?: number;
}>
class PointSelectionStyle extends NestedOption<IPointSelectionStyleProps> {
  public static OptionName = "selectionStyle";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettings
type IReductionProps = React.PropsWithChildren<{
  color?: string;
  level?: "close" | "high" | "low" | "open";
}>
class Reduction extends NestedOption<IReductionProps> {
  public static OptionName = "reduction";
}

// owners:
// Chart
type IScrollBarProps = React.PropsWithChildren<{
  color?: string;
  offset?: number;
  opacity?: number;
  position?: "bottom" | "left" | "right" | "top";
  visible?: boolean;
  width?: number;
}>
class ScrollBar extends NestedOption<IScrollBarProps> {
  public static OptionName = "scrollBar";
}

// owners:
// Point
// CommonSeriesSettings
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
  };
  color?: ChartsColor | string;
  size?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
class SelectionStyle extends NestedOption<ISelectionStyleProps> {
  public static OptionName = "selectionStyle";
}

// owners:
// Chart
type ISeriesProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom";
  };
  argumentField?: string;
  axis?: string;
  barOverlapGroup?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  highValueField?: string;
  hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  ignoreEmptyPoints?: boolean;
  innerColor?: string;
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    argumentFormat?: LocalizationTypes.Format;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    connector?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    customizeText?: ((pointInfo: any) => string);
    displayFormat?: string;
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    horizontalOffset?: number;
    position?: "inside" | "outside";
    rotationAngle?: number;
    showForZeroValues?: boolean;
    verticalOffset?: number;
    visible?: boolean;
  };
  lowValueField?: string;
  maxLabelCount?: number;
  minBarSize?: number;
  name?: string;
  opacity?: number;
  openValueField?: string;
  pane?: string;
  point?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    hoverStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    image?: Record<string, any> | string | {
      height?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
      url?: Record<string, any> | string | {
        rangeMaxPoint?: string;
        rangeMinPoint?: string;
      };
      width?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
    };
    selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    selectionStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    size?: number;
    symbol?: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp";
    visible?: boolean;
  };
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: "close" | "high" | "low" | "open";
  };
  selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  showInLegend?: boolean;
  sizeField?: string;
  stack?: string;
  tag?: any;
  tagField?: string;
  type?: "area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock";
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: "auto" | "high" | "low" | "none";
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance";
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
class Series extends NestedOption<ISeriesProps> {
  public static OptionName = "series";
  public static IsCollectionItem = true;
}

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsLabel
// CommonSeriesSettingsSelectionStyle
type ISeriesBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  visible?: boolean;
  width?: number;
}>
class SeriesBorder extends NestedOption<ISeriesBorderProps> {
  public static OptionName = "border";
}

// owners:
// Chart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => ChartSeries);
  nameField?: string;
}>
class SeriesTemplate extends NestedOption<ISeriesTemplateProps> {
  public static OptionName = "seriesTemplate";
}

// owners:
// Annotation
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
// Chart
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
class Size extends NestedOption<ISizeProps> {
  public static OptionName = "size";
}

// owners:
// ArgumentAxis
// ValueAxis
type IStripProps = React.PropsWithChildren<{
  color?: string;
  endValue?: Date | number | string;
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: "center" | "left" | "right";
    text?: string;
    verticalAlignment?: "bottom" | "center" | "top";
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  startValue?: Date | number | string;
}>
class Strip extends NestedOption<IStripProps> {
  public static OptionName = "strips";
  public static IsCollectionItem = true;
}

// owners:
// Strip
// Strip
type IStripLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  text?: string;
  verticalAlignment?: "bottom" | "center" | "top";
}>
class StripLabel extends NestedOption<IStripLabelProps> {
  public static OptionName = "label";
}

// owners:
// ArgumentAxis
type IStripStyleProps = React.PropsWithChildren<{
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: "center" | "left" | "right";
    verticalAlignment?: "bottom" | "center" | "top";
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
}>
class StripStyle extends NestedOption<IStripStyleProps> {
  public static OptionName = "stripStyle";
  public static ExpectedChildren = {
    label: { optionName: "label", isCollectionItem: false },
    stripStyleLabel: { optionName: "label", isCollectionItem: false }
  };
}

// owners:
// StripStyle
type IStripStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  verticalAlignment?: "bottom" | "center" | "top";
}>
class StripStyleLabel extends NestedOption<IStripStyleLabelProps> {
  public static OptionName = "label";
}

// owners:
// LegendTitle
// ChartTitle
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
// ArgumentAxis
type ITickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  shift?: number;
  visible?: boolean;
  width?: number;
}>
class Tick extends NestedOption<ITickProps> {
  public static OptionName = "tick";
}

// owners:
// ArgumentAxis
// ValueAxis
type ITickIntervalProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
class TickInterval extends NestedOption<ITickIntervalProps> {
  public static OptionName = "tickInterval";
}

// owners:
// ArgumentAxis
// ValueAxis
// CommonAxisSettings
// Legend
// Chart
type ITitleProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  font?: ChartsFont;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
  horizontalAlignment?: "center" | "left" | "right";
  placeholderSize?: number;
  subtitle?: Record<string, any> | string | {
    font?: ChartsFont;
    offset?: number;
    text?: string;
    textOverflow?: "ellipsis" | "hide" | "none";
    wordWrap?: "normal" | "breakWord" | "none";
  };
  verticalAlignment?: "bottom" | "top";
}>
class Title extends NestedOption<ITitleProps> {
  public static OptionName = "title";
}

// owners:
// Chart
type ITooltipProps = React.PropsWithChildren<{
  argumentFormat?: LocalizationTypes.Format;
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
  contentTemplate?: ((pointInfo: any, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((pointInfo: any) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  interactive?: boolean;
  location?: "center" | "edge";
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
  shared?: boolean;
  zIndex?: number;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
}>
class Tooltip extends NestedOption<ITooltipProps> {
  public static OptionName = "tooltip";
  public static ExpectedChildren = {
    argumentFormat: { optionName: "argumentFormat", isCollectionItem: false },
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

// owners:
// PointImage
type IUrlProps = React.PropsWithChildren<{
  rangeMaxPoint?: string;
  rangeMinPoint?: string;
}>
class Url extends NestedOption<IUrlProps> {
  public static OptionName = "url";
}

// owners:
// Chart
type IValueAxisProps = React.PropsWithChildren<{
  aggregatedPointsPosition?: "betweenTicks" | "crossTicks";
  allowDecimals?: boolean;
  autoBreaksEnabled?: boolean;
  axisDivisionFactor?: number;
  breaks?: Array<ScaleBreak> | {
    endValue?: Date | number | string;
    startValue?: Date | number | string;
  }[];
  breakStyle?: Record<string, any> | {
    color?: string;
    line?: "straight" | "waved";
    width?: number;
  };
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      position?: "inside" | "outside";
      text?: string;
      verticalAlignment?: "bottom" | "center" | "top";
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    value?: Date | number | string;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      position?: "inside" | "outside";
      verticalAlignment?: "bottom" | "center" | "top";
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    width?: number;
  };
  customPosition?: Date | number | string;
  discreteAxisDivisionMode?: "betweenLabels" | "crossLabels";
  endOnTick?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  inverted?: boolean;
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    displayMode?: "rotate" | "stagger" | "standard";
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indentFromAxis?: number;
    overlappingBehavior?: "rotate" | "stagger" | "none" | "hide";
    position?: "inside" | "outside" | "bottom" | "left" | "right" | "top";
    rotationAngle?: number;
    staggeringSpacing?: number;
    template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
    textOverflow?: "ellipsis" | "hide" | "none";
    visible?: boolean;
    wordWrap?: "normal" | "breakWord" | "none";
  };
  linearThreshold?: number;
  logarithmBase?: number;
  maxAutoBreakCount?: number;
  maxValueMargin?: number;
  minorGrid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  minorTick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    shift?: number;
    visible?: boolean;
    width?: number;
  };
  minorTickCount?: number;
  minorTickInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  minValueMargin?: number;
  minVisualRangeLength?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  multipleAxesSpacing?: number;
  name?: string;
  offset?: number;
  opacity?: number;
  pane?: string;
  placeholderSize?: number;
  position?: "bottom" | "left" | "right" | "top";
  showZero?: boolean;
  strips?: Array<Record<string, any>> | {
    color?: string;
    endValue?: Date | number | string;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      text?: string;
      verticalAlignment?: "bottom" | "center" | "top";
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    startValue?: Date | number | string;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: "center" | "left" | "right";
      verticalAlignment?: "bottom" | "center" | "top";
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
  };
  synchronizedValue?: number;
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    shift?: number;
    visible?: boolean;
    width?: number;
  };
  tickInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  title?: Record<string, any> | string | {
    alignment?: "center" | "left" | "right";
    font?: ChartsFont;
    margin?: number;
    text?: string;
    textOverflow?: "ellipsis" | "hide" | "none";
    wordWrap?: "normal" | "breakWord" | "none";
  };
  type?: "continuous" | "discrete" | "logarithmic";
  valueMarginsEnabled?: boolean;
  valueType?: "datetime" | "numeric" | "string";
  visible?: boolean;
  visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  visualRangeUpdateMode?: "auto" | "keep" | "reset" | "shift";
  wholeRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  width?: number;
  defaultCategories?: Array<Date | number | string>;
  onCategoriesChange?: (value: Array<Date | number | string>) => void;
  defaultVisualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onVisualRangeChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>
class ValueAxis extends NestedOption<IValueAxisProps> {
  public static OptionName = "valueAxis";
  public static IsCollectionItem = true;
  public static DefaultsProps = {
    defaultCategories: "categories",
    defaultVisualRange: "visualRange"
  };
  public static ExpectedChildren = {
    axisConstantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    axisLabel: { optionName: "label", isCollectionItem: false },
    axisTitle: { optionName: "title", isCollectionItem: false },
    break: { optionName: "breaks", isCollectionItem: true },
    constantLine: { optionName: "constantLines", isCollectionItem: true },
    constantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    minorTickInterval: { optionName: "minorTickInterval", isCollectionItem: false },
    minVisualRangeLength: { optionName: "minVisualRangeLength", isCollectionItem: false },
    strip: { optionName: "strips", isCollectionItem: true },
    tickInterval: { optionName: "tickInterval", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    visualRange: { optionName: "visualRange", isCollectionItem: false },
    wholeRange: { optionName: "wholeRange", isCollectionItem: false }
  };
}

// owners:
// CommonSeriesSettings
type IValueErrorBarProps = React.PropsWithChildren<{
  color?: string;
  displayMode?: "auto" | "high" | "low" | "none";
  edgeLength?: number;
  highValueField?: string;
  lineWidth?: number;
  lowValueField?: string;
  opacity?: number;
  type?: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance";
  value?: number;
}>
class ValueErrorBar extends NestedOption<IValueErrorBarProps> {
  public static OptionName = "valueErrorBar";
}

// owners:
// Crosshair
type IVerticalLineProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  label?: Record<string, any> | {
    backgroundColor?: string;
    customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    visible?: boolean;
  };
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class VerticalLine extends NestedOption<IVerticalLineProps> {
  public static OptionName = "verticalLine";
  public static ExpectedChildren = {
    horizontalLineLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  };
}

// owners:
// ArgumentAxis
// ValueAxis
type IVisualRangeProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  length?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  startValue?: Date | number | string;
  defaultEndValue?: Date | number | string;
  onEndValueChange?: (value: Date | number | string) => void;
  defaultStartValue?: Date | number | string;
  onStartValueChange?: (value: Date | number | string) => void;
}>
class VisualRange extends NestedOption<IVisualRangeProps> {
  public static OptionName = "visualRange";
  public static DefaultsProps = {
    defaultEndValue: "endValue",
    defaultStartValue: "startValue"
  };
}

// owners:
// ArgumentAxis
// ValueAxis
type IWholeRangeProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  length?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  startValue?: Date | number | string;
  defaultEndValue?: Date | number | string;
  onEndValueChange?: (value: Date | number | string) => void;
  defaultStartValue?: Date | number | string;
  onStartValueChange?: (value: Date | number | string) => void;
}>
class WholeRange extends NestedOption<IWholeRangeProps> {
  public static OptionName = "wholeRange";
  public static DefaultsProps = {
    defaultEndValue: "endValue",
    defaultStartValue: "startValue"
  };
}

// owners:
// PointImage
type IWidthProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
class Width extends NestedOption<IWidthProps> {
  public static OptionName = "width";
}

// owners:
// Chart
type IZoomAndPanProps = React.PropsWithChildren<{
  allowMouseWheel?: boolean;
  allowTouchGestures?: boolean;
  argumentAxis?: "both" | "none" | "pan" | "zoom";
  dragBoxStyle?: Record<string, any> | {
    color?: string;
    opacity?: number;
  };
  dragToZoom?: boolean;
  panKey?: "alt" | "ctrl" | "meta" | "shift";
  valueAxis?: "both" | "none" | "pan" | "zoom";
}>
class ZoomAndPan extends NestedOption<IZoomAndPanProps> {
  public static OptionName = "zoomAndPan";
  public static ExpectedChildren = {
    dragBoxStyle: { optionName: "dragBoxStyle", isCollectionItem: false }
  };
}

export default Chart;
export {
  Chart,
  IChartOptions,
  AdaptiveLayout,
  IAdaptiveLayoutProps,
  Aggregation,
  IAggregationProps,
  AggregationInterval,
  IAggregationIntervalProps,
  Animation,
  IAnimationProps,
  Annotation,
  IAnnotationProps,
  AnnotationBorder,
  IAnnotationBorderProps,
  AnnotationImage,
  IAnnotationImageProps,
  ArgumentAxis,
  IArgumentAxisProps,
  ArgumentFormat,
  IArgumentFormatProps,
  AxisConstantLineStyle,
  IAxisConstantLineStyleProps,
  AxisConstantLineStyleLabel,
  IAxisConstantLineStyleLabelProps,
  AxisLabel,
  IAxisLabelProps,
  AxisTitle,
  IAxisTitleProps,
  BackgroundColor,
  IBackgroundColorProps,
  Border,
  IBorderProps,
  Break,
  IBreakProps,
  BreakStyle,
  IBreakStyleProps,
  ChartTitle,
  IChartTitleProps,
  ChartTitleSubtitle,
  IChartTitleSubtitleProps,
  Color,
  IColorProps,
  CommonAnnotationSettings,
  ICommonAnnotationSettingsProps,
  CommonAxisSettings,
  ICommonAxisSettingsProps,
  CommonAxisSettingsConstantLineStyle,
  ICommonAxisSettingsConstantLineStyleProps,
  CommonAxisSettingsConstantLineStyleLabel,
  ICommonAxisSettingsConstantLineStyleLabelProps,
  CommonAxisSettingsLabel,
  ICommonAxisSettingsLabelProps,
  CommonAxisSettingsTitle,
  ICommonAxisSettingsTitleProps,
  CommonPaneSettings,
  ICommonPaneSettingsProps,
  CommonSeriesSettings,
  ICommonSeriesSettingsProps,
  CommonSeriesSettingsHoverStyle,
  ICommonSeriesSettingsHoverStyleProps,
  CommonSeriesSettingsLabel,
  ICommonSeriesSettingsLabelProps,
  CommonSeriesSettingsSelectionStyle,
  ICommonSeriesSettingsSelectionStyleProps,
  Connector,
  IConnectorProps,
  ConstantLine,
  IConstantLineProps,
  ConstantLineLabel,
  IConstantLineLabelProps,
  ConstantLineStyle,
  IConstantLineStyleProps,
  Crosshair,
  ICrosshairProps,
  DataPrepareSettings,
  IDataPrepareSettingsProps,
  DragBoxStyle,
  IDragBoxStyleProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Grid,
  IGridProps,
  Hatching,
  IHatchingProps,
  Height,
  IHeightProps,
  HorizontalLine,
  IHorizontalLineProps,
  HorizontalLineLabel,
  IHorizontalLineLabelProps,
  HoverStyle,
  IHoverStyleProps,
  Image,
  IImageProps,
  Label,
  ILabelProps,
  Legend,
  ILegendProps,
  LegendTitle,
  ILegendTitleProps,
  LegendTitleSubtitle,
  ILegendTitleSubtitleProps,
  Length,
  ILengthProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  MinorGrid,
  IMinorGridProps,
  MinorTick,
  IMinorTickProps,
  MinorTickInterval,
  IMinorTickIntervalProps,
  MinVisualRangeLength,
  IMinVisualRangeLengthProps,
  Pane,
  IPaneProps,
  PaneBorder,
  IPaneBorderProps,
  Point,
  IPointProps,
  PointBorder,
  IPointBorderProps,
  PointHoverStyle,
  IPointHoverStyleProps,
  PointImage,
  IPointImageProps,
  PointSelectionStyle,
  IPointSelectionStyleProps,
  Reduction,
  IReductionProps,
  ScrollBar,
  IScrollBarProps,
  SelectionStyle,
  ISelectionStyleProps,
  Series,
  ISeriesProps,
  SeriesBorder,
  ISeriesBorderProps,
  SeriesTemplate,
  ISeriesTemplateProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Strip,
  IStripProps,
  StripLabel,
  IStripLabelProps,
  StripStyle,
  IStripStyleProps,
  StripStyleLabel,
  IStripStyleLabelProps,
  Subtitle,
  ISubtitleProps,
  Tick,
  ITickProps,
  TickInterval,
  ITickIntervalProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  TooltipBorder,
  ITooltipBorderProps,
  Url,
  IUrlProps,
  ValueAxis,
  IValueAxisProps,
  ValueErrorBar,
  IValueErrorBarProps,
  VerticalLine,
  IVerticalLineProps,
  VisualRange,
  IVisualRangeProps,
  WholeRange,
  IWholeRangeProps,
  Width,
  IWidthProps,
  ZoomAndPan,
  IZoomAndPanProps
};
import type * as ChartTypes from 'devextreme/viz/chart_types';
export { ChartTypes };

