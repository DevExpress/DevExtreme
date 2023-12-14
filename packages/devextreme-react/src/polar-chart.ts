"use client"
import dxPolarChart, {
    Properties
} from "devextreme/viz/polar_chart";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, PointClickEvent, SeriesClickEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomEndEvent, ZoomStartEvent, dxPolarChartAnnotationConfig, dxPolarChartCommonAnnotationConfig, PolarChartSeries } from "devextreme/viz/polar_chart";
import type { Font as ChartsFont, ChartsColor, LegendItem } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as CommonChartTypes from "devextreme/common/charts";
import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IPolarChartOptionsNarrowedEvents = {
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

type IPolarChartOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IPolarChartOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  defaultValueAxis?: Record<string, any>;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onValueAxisChange?: (value: Record<string, any>) => void;
}>

class PolarChart extends BaseComponent<React.PropsWithChildren<IPolarChartOptions>> {

  public get instance(): dxPolarChart {
    return this._instance;
  }

  protected _WidgetClass = dxPolarChart;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show","valueAxis","valueAxis.visualRange"];

  protected independentEvents = ["onArgumentAxisClick","onDisposing","onDone","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onLegendClick","onPointClick","onSeriesClick","onTooltipHidden","onTooltipShown","onZoomEnd","onZoomStart"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator",
    defaultValueAxis: "valueAxis"
  };

  protected _expectedChildren = {
    adaptiveLayout: { optionName: "adaptiveLayout", isCollectionItem: false },
    animation: { optionName: "animation", isCollectionItem: false },
    annotation: { optionName: "annotations", isCollectionItem: true },
    argumentAxis: { optionName: "argumentAxis", isCollectionItem: false },
    commonAnnotationSettings: { optionName: "commonAnnotationSettings", isCollectionItem: false },
    commonAxisSettings: { optionName: "commonAxisSettings", isCollectionItem: false },
    commonSeriesSettings: { optionName: "commonSeriesSettings", isCollectionItem: false },
    dataPrepareSettings: { optionName: "dataPrepareSettings", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    legend: { optionName: "legend", isCollectionItem: false },
    loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    polarChartTitle: { optionName: "title", isCollectionItem: false },
    series: { optionName: "series", isCollectionItem: true },
    seriesTemplate: { optionName: "seriesTemplate", isCollectionItem: false },
    size: { optionName: "size", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false },
    valueAxis: { optionName: "valueAxis", isCollectionItem: false }
  };
}
(PolarChart as any).propTypes = {
  adaptiveLayout: PropTypes.object,
  animation: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  annotations: PropTypes.array,
  argumentAxis: PropTypes.object,
  barGroupPadding: PropTypes.number,
  barGroupWidth: PropTypes.number,
  commonAnnotationSettings: PropTypes.object,
  commonAxisSettings: PropTypes.object,
  commonSeriesSettings: PropTypes.object,
  containerBackgroundColor: PropTypes.string,
  customizeAnnotation: PropTypes.func,
  customizeLabel: PropTypes.func,
  customizePoint: PropTypes.func,
  dataPrepareSettings: PropTypes.object,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  legend: PropTypes.object,
  loadingIndicator: PropTypes.object,
  margin: PropTypes.object,
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
  pathModified: PropTypes.bool,
  pointSelectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple"])
  ]),
  redrawOnResize: PropTypes.bool,
  resolveLabelOverlapping: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "hide",
      "none"])
  ]),
  rtlEnabled: PropTypes.bool,
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
  useSpiderWeb: PropTypes.bool,
  valueAxis: PropTypes.object
};


// owners:
// PolarChart
type IAdaptiveLayoutProps = React.PropsWithChildren<{
  height?: number;
  keepLabels?: boolean;
  width?: number;
}>
class AdaptiveLayout extends NestedOption<IAdaptiveLayoutProps> {
  public static OptionName = "adaptiveLayout";
}

// owners:
// PolarChart
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
// PolarChart
type IAnnotationProps = React.PropsWithChildren<{
  allowDragging?: boolean;
  angle?: number;
  argument?: Date | number | string;
  arrowLength?: number;
  arrowWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => Record<string, any>);
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
  radius?: number;
  series?: string;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxPolarChartCommonAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPolarChartAnnotationConfig | any, element: any) => string | any) | template;
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
// PolarChart
type IArgumentAxisProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
  argumentType?: "datetime" | "numeric" | "string";
  axisDivisionFactor?: number;
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string;
      visible?: boolean;
    };
    value?: Date | number | string;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      font?: ChartsFont;
      visible?: boolean;
    };
    width?: number;
  };
  discreteAxisDivisionMode?: "betweenLabels" | "crossLabels";
  endOnTick?: boolean;
  firstPointOnStartAngle?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  hoverMode?: "allArgumentPoints" | "none";
  inverted?: boolean;
  label?: Record<string, any> | {
    customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indentFromAxis?: number;
    overlappingBehavior?: "hide" | "none";
    visible?: boolean;
  };
  linearThreshold?: number;
  logarithmBase?: number;
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
  opacity?: number;
  originValue?: number;
  period?: number;
  startAngle?: number;
  strips?: Array<Record<string, any>> | {
    color?: string;
    endValue?: Date | number | string;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string;
    };
    startValue?: Date | number | string;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
    };
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
  type?: "continuous" | "discrete" | "logarithmic";
  visible?: boolean;
  width?: number;
}>
class ArgumentAxis extends NestedOption<IArgumentAxisProps> {
  public static OptionName = "argumentAxis";
  public static ExpectedChildren = {
    argumentAxisMinorTick: { optionName: "minorTick", isCollectionItem: false },
    argumentAxisTick: { optionName: "tick", isCollectionItem: false },
    axisLabel: { optionName: "label", isCollectionItem: false },
    constantLine: { optionName: "constantLines", isCollectionItem: true },
    constantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    grid: { optionName: "grid", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    minorGrid: { optionName: "minorGrid", isCollectionItem: false },
    minorTick: { optionName: "minorTick", isCollectionItem: false },
    minorTickInterval: { optionName: "minorTickInterval", isCollectionItem: false },
    strip: { optionName: "strips", isCollectionItem: true },
    stripStyle: { optionName: "stripStyle", isCollectionItem: false },
    tick: { optionName: "tick", isCollectionItem: false },
    tickInterval: { optionName: "tickInterval", isCollectionItem: false }
  };
}

// owners:
// ArgumentAxis
type IArgumentAxisMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  shift?: number;
  visible?: boolean;
  width?: number;
}>
class ArgumentAxisMinorTick extends NestedOption<IArgumentAxisMinorTickProps> {
  public static OptionName = "minorTick";
}

// owners:
// ArgumentAxis
type IArgumentAxisTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  shift?: number;
  visible?: boolean;
  width?: number;
}>
class ArgumentAxisTick extends NestedOption<IArgumentAxisTickProps> {
  public static OptionName = "tick";
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
type IAxisLabelProps = React.PropsWithChildren<{
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  indentFromAxis?: number;
  overlappingBehavior?: "hide" | "none";
  visible?: boolean;
}>
class AxisLabel extends NestedOption<IAxisLabelProps> {
  public static OptionName = "label";
}

// owners:
// Annotation
// Legend
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
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
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
// PolarChart
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
  angle?: number;
  argument?: Date | number | string;
  arrowLength?: number;
  arrowWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => Record<string, any>);
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
  radius?: number;
  series?: string;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxPolarChartCommonAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPolarChartAnnotationConfig | any, element: any) => string | any) | template;
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
// PolarChart
type ICommonAxisSettingsProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
  color?: string;
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      font?: ChartsFont;
      visible?: boolean;
    };
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
    font?: ChartsFont;
    indentFromAxis?: number;
    overlappingBehavior?: "hide" | "none";
    visible?: boolean;
  };
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
    visible?: boolean;
    width?: number;
  };
  opacity?: number;
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
    };
  };
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  visible?: boolean;
  width?: number;
}>
class CommonAxisSettings extends NestedOption<ICommonAxisSettingsProps> {
  public static OptionName = "commonAxisSettings";
  public static ExpectedChildren = {
    commonAxisSettingsLabel: { optionName: "label", isCollectionItem: false },
    commonAxisSettingsMinorTick: { optionName: "minorTick", isCollectionItem: false },
    commonAxisSettingsTick: { optionName: "tick", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    minorTick: { optionName: "minorTick", isCollectionItem: false },
    tick: { optionName: "tick", isCollectionItem: false }
  };
}

// owners:
// CommonAxisSettings
type ICommonAxisSettingsLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  indentFromAxis?: number;
  overlappingBehavior?: "hide" | "none";
  visible?: boolean;
}>
class CommonAxisSettingsLabel extends NestedOption<ICommonAxisSettingsLabelProps> {
  public static OptionName = "label";
}

// owners:
// CommonAxisSettings
type ICommonAxisSettingsMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class CommonAxisSettingsMinorTick extends NestedOption<ICommonAxisSettingsMinorTickProps> {
  public static OptionName = "minorTick";
}

// owners:
// CommonAxisSettings
// ValueAxis
type ICommonAxisSettingsTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class CommonAxisSettingsTick extends NestedOption<ICommonAxisSettingsTickProps> {
  public static OptionName = "tick";
}

// owners:
// PolarChart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  area?: any;
  argumentField?: string;
  bar?: any;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  closed?: boolean;
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
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
  label?: Record<string, any> | {
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
    position?: "inside" | "outside";
    rotationAngle?: number;
    showForZeroValues?: boolean;
    visible?: boolean;
  };
  line?: any;
  maxLabelCount?: number;
  minBarSize?: number;
  opacity?: number;
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
      height?: number;
      url?: string;
      width?: number;
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
  stack?: string;
  stackedbar?: any;
  tagField?: string;
  type?: "area" | "bar" | "line" | "scatter" | "stackedbar";
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
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    commonSeriesSettingsHoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    commonSeriesSettingsLabel: { optionName: "label", isCollectionItem: false },
    commonSeriesSettingsSelectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    point: { optionName: "point", isCollectionItem: false },
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
  position?: "inside" | "outside";
  rotationAngle?: number;
  showForZeroValues?: boolean;
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
    text?: string;
    visible?: boolean;
  };
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
  text?: string;
  visible?: boolean;
}>
class ConstantLineLabel extends NestedOption<IConstantLineLabelProps> {
  public static OptionName = "label";
}

// owners:
// ArgumentAxis
type IConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  label?: Record<string, any> | {
    font?: ChartsFont;
    visible?: boolean;
  };
  width?: number;
}>
class ConstantLineStyle extends NestedOption<IConstantLineStyleProps> {
  public static OptionName = "constantLineStyle";
  public static ExpectedChildren = {
    constantLineStyleLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  };
}

// owners:
// ConstantLineStyle
type IConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  visible?: boolean;
}>
class ConstantLineStyleLabel extends NestedOption<IConstantLineStyleLabelProps> {
  public static OptionName = "label";
}

// owners:
// PolarChart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
}>
class DataPrepareSettings extends NestedOption<IDataPrepareSettingsProps> {
  public static OptionName = "dataPrepareSettings";
}

// owners:
// PolarChart
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
// CommonSeriesSettingsLabel
// Legend
// LegendTitle
// LegendTitleSubtitle
// Tooltip
// LoadingIndicator
// PolarChartTitle
// PolarChartTitleSubtitle
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
  height?: number;
  url?: string;
  width?: number;
}>
class Image extends NestedOption<IImageProps> {
  public static OptionName = "image";
}

// owners:
// ConstantLine
// ConstantLine
// ArgumentAxis
// ValueAxis
// Strip
// Strip
// ConstantLineStyle
// StripStyle
// CommonAxisSettings
// CommonSeriesSettings
type ILabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  text?: string;
  visible?: boolean;
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  format?: LocalizationTypes.Format;
  indentFromAxis?: number;
  overlappingBehavior?: "hide" | "none";
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
  position?: "inside" | "outside";
  rotationAngle?: number;
  showForZeroValues?: boolean;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
}

// owners:
// PolarChart
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
// PolarChart
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
// PolarChart
// PolarChartTitle
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
// CommonAxisSettings
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
    height?: number;
    url?: string;
    width?: number;
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
// PolarChart
type IPolarChartTitleProps = React.PropsWithChildren<{
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
class PolarChartTitle extends NestedOption<IPolarChartTitleProps> {
  public static OptionName = "title";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    polarChartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  };
}

// owners:
// PolarChartTitle
type IPolarChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class PolarChartTitleSubtitle extends NestedOption<IPolarChartTitleSubtitleProps> {
  public static OptionName = "subtitle";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
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
// PolarChart
type ISeriesProps = React.PropsWithChildren<{
  argumentField?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  closed?: boolean;
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
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
  label?: Record<string, any> | {
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
    position?: "inside" | "outside";
    rotationAngle?: number;
    showForZeroValues?: boolean;
    visible?: boolean;
  };
  maxLabelCount?: number;
  minBarSize?: number;
  name?: string;
  opacity?: number;
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
      height?: number;
      url?: string;
      width?: number;
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
  stack?: string;
  tag?: any;
  tagField?: string;
  type?: "area" | "bar" | "line" | "scatter" | "stackedbar";
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
// PolarChart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => PolarChartSeries);
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
// PolarChart
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
    text?: string;
  };
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
  text?: string;
}>
class StripLabel extends NestedOption<IStripLabelProps> {
  public static OptionName = "label";
}

// owners:
// ArgumentAxis
type IStripStyleProps = React.PropsWithChildren<{
  label?: Record<string, any> | {
    font?: ChartsFont;
  };
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
}>
class StripStyleLabel extends NestedOption<IStripStyleLabelProps> {
  public static OptionName = "label";
}

// owners:
// LegendTitle
// PolarChartTitle
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
// CommonAxisSettings
// ValueAxis
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
// Legend
// PolarChart
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
// PolarChart
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
// PolarChart
type IValueAxisProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
  axisDivisionFactor?: number;
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string;
      visible?: boolean;
    };
    value?: Date | number | string;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    label?: Record<string, any> | {
      font?: ChartsFont;
      visible?: boolean;
    };
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
    customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indentFromAxis?: number;
    overlappingBehavior?: "hide" | "none";
    visible?: boolean;
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
  opacity?: number;
  showZero?: boolean;
  strips?: Array<Record<string, any>> | {
    color?: string;
    endValue?: Date | number | string;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string;
    };
    startValue?: Date | number | string;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
    };
  };
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
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
  type?: "continuous" | "discrete" | "logarithmic";
  valueMarginsEnabled?: boolean;
  valueType?: "datetime" | "numeric" | "string";
  visible?: boolean;
  visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  visualRangeUpdateMode?: "auto" | "keep" | "reset";
  wholeRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  width?: number;
  defaultVisualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onVisualRangeChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>
class ValueAxis extends NestedOption<IValueAxisProps> {
  public static OptionName = "valueAxis";
  public static DefaultsProps = {
    defaultVisualRange: "visualRange"
  };
  public static ExpectedChildren = {
    axisLabel: { optionName: "label", isCollectionItem: false },
    commonAxisSettingsTick: { optionName: "tick", isCollectionItem: false },
    constantLine: { optionName: "constantLines", isCollectionItem: true },
    label: { optionName: "label", isCollectionItem: false },
    minorTickInterval: { optionName: "minorTickInterval", isCollectionItem: false },
    minVisualRangeLength: { optionName: "minVisualRangeLength", isCollectionItem: false },
    strip: { optionName: "strips", isCollectionItem: true },
    tick: { optionName: "tick", isCollectionItem: false },
    tickInterval: { optionName: "tickInterval", isCollectionItem: false },
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
  public static ExpectedChildren = {
    length: { optionName: "length", isCollectionItem: false }
  };
}

// owners:
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

export default PolarChart;
export {
  PolarChart,
  IPolarChartOptions,
  AdaptiveLayout,
  IAdaptiveLayoutProps,
  Animation,
  IAnimationProps,
  Annotation,
  IAnnotationProps,
  AnnotationBorder,
  IAnnotationBorderProps,
  ArgumentAxis,
  IArgumentAxisProps,
  ArgumentAxisMinorTick,
  IArgumentAxisMinorTickProps,
  ArgumentAxisTick,
  IArgumentAxisTickProps,
  ArgumentFormat,
  IArgumentFormatProps,
  AxisLabel,
  IAxisLabelProps,
  Border,
  IBorderProps,
  Color,
  IColorProps,
  CommonAnnotationSettings,
  ICommonAnnotationSettingsProps,
  CommonAxisSettings,
  ICommonAxisSettingsProps,
  CommonAxisSettingsLabel,
  ICommonAxisSettingsLabelProps,
  CommonAxisSettingsMinorTick,
  ICommonAxisSettingsMinorTickProps,
  CommonAxisSettingsTick,
  ICommonAxisSettingsTickProps,
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
  ConstantLineStyleLabel,
  IConstantLineStyleLabelProps,
  DataPrepareSettings,
  IDataPrepareSettingsProps,
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
  Point,
  IPointProps,
  PointBorder,
  IPointBorderProps,
  PointHoverStyle,
  IPointHoverStyleProps,
  PointSelectionStyle,
  IPointSelectionStyleProps,
  PolarChartTitle,
  IPolarChartTitleProps,
  PolarChartTitleSubtitle,
  IPolarChartTitleSubtitleProps,
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
  ValueAxis,
  IValueAxisProps,
  ValueErrorBar,
  IValueErrorBarProps,
  VisualRange,
  IVisualRangeProps,
  WholeRange,
  IWholeRangeProps
};
import type * as PolarChartTypes from 'devextreme/viz/polar_chart_types';
export { PolarChartTypes };

