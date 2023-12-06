"use client"
import dxRangeSelector, {
    Properties
} from "devextreme/viz/range_selector";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, ValueChangedEvent } from "devextreme/viz/range_selector";
import type { chartPointAggregationInfoObject, chartSeriesObject, dxChartCommonSeriesSettings } from "devextreme/viz/chart";
import type { ChartSeries } from "devextreme/viz/common";
import type { ChartsColor, Font as ChartsFont, ScaleBreak } from "devextreme/common/charts";

import type * as CommonChartTypes from "devextreme/common/charts";
import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IRangeSelectorOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onDrawn?: ((e: DrawnEvent) => void);
  onExported?: ((e: ExportedEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onFileSaving?: ((e: FileSavingEvent) => void);
  onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IRangeSelectorOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IRangeSelectorOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  defaultValue?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onValueChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>

class RangeSelector extends BaseComponent<React.PropsWithChildren<IRangeSelectorOptions>> {

  public get instance(): dxRangeSelector {
    return this._instance;
  }

  protected _WidgetClass = dxRangeSelector;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show","value"];

  protected independentEvents = ["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator",
    defaultValue: "value"
  };

  protected _expectedChildren = {
    background: { optionName: "background", isCollectionItem: false },
    behavior: { optionName: "behavior", isCollectionItem: false },
    chart: { optionName: "chart", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    indent: { optionName: "indent", isCollectionItem: false },
    loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    scale: { optionName: "scale", isCollectionItem: false },
    shutter: { optionName: "shutter", isCollectionItem: false },
    size: { optionName: "size", isCollectionItem: false },
    sliderHandle: { optionName: "sliderHandle", isCollectionItem: false },
    sliderMarker: { optionName: "sliderMarker", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    value: { optionName: "value", isCollectionItem: false }
  };
}
(RangeSelector as any).propTypes = {
  background: PropTypes.object,
  behavior: PropTypes.object,
  chart: PropTypes.object,
  containerBackgroundColor: PropTypes.string,
  dataSourceField: PropTypes.string,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  indent: PropTypes.object,
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
  onValueChanged: PropTypes.func,
  pathModified: PropTypes.bool,
  redrawOnResize: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  scale: PropTypes.object,
  selectedRangeColor: PropTypes.string,
  selectedRangeUpdateMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto",
      "keep",
      "reset",
      "shift"])
  ]),
  shutter: PropTypes.object,
  size: PropTypes.object,
  sliderHandle: PropTypes.object,
  sliderMarker: PropTypes.object,
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
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
};


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
// Scale
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
// CommonSeriesSettingsLabel
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
// RangeSelector
type IBackgroundProps = React.PropsWithChildren<{
  color?: string;
  image?: Record<string, any> | {
    location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop";
    url?: string;
  };
  visible?: boolean;
}>
class Background extends NestedOption<IBackgroundProps> {
  public static OptionName = "background";
  public static ExpectedChildren = {
    backgroundImage: { optionName: "image", isCollectionItem: false },
    image: { optionName: "image", isCollectionItem: false }
  };
}

// owners:
// Background
type IBackgroundImageProps = React.PropsWithChildren<{
  location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop";
  url?: string;
}>
class BackgroundImage extends NestedOption<IBackgroundImageProps> {
  public static OptionName = "image";
}

// owners:
// RangeSelector
type IBehaviorProps = React.PropsWithChildren<{
  allowSlidersSwap?: boolean;
  animationEnabled?: boolean;
  callValueChanged?: "onMoving" | "onMovingComplete";
  manualRangeSelectionEnabled?: boolean;
  moveSelectedRangeByClick?: boolean;
  snapToTicks?: boolean;
  valueChangeMode?: "onHandleMove" | "onHandleRelease";
}>
class Behavior extends NestedOption<IBehaviorProps> {
  public static OptionName = "behavior";
}

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsLabel
// CommonSeriesSettingsSelectionStyle
// Point
// PointHoverStyle
// PointSelectionStyle
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  visible?: boolean;
  width?: number;
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
}

// owners:
// Scale
type IBreakProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  startValue?: Date | number | string;
}>
class Break extends NestedOption<IBreakProps> {
  public static OptionName = "breaks";
  public static IsCollectionItem = true;
}

// owners:
// Scale
type IBreakStyleProps = React.PropsWithChildren<{
  color?: string;
  line?: "straight" | "waved";
  width?: number;
}>
class BreakStyle extends NestedOption<IBreakStyleProps> {
  public static OptionName = "breakStyle";
}

// owners:
// RangeSelector
type IChartProps = React.PropsWithChildren<{
  barGroupPadding?: number;
  barGroupWidth?: number;
  bottomIndent?: number;
  commonSeriesSettings?: dxChartCommonSeriesSettings;
  dataPrepareSettings?: Record<string, any> | {
    checkTypeForAllData?: boolean;
    convertToAxisDataType?: boolean;
    sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
  };
  maxBubbleSize?: number;
  minBubbleSize?: number;
  negativesAsZeroes?: boolean;
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  paletteExtensionMode?: "alternate" | "blend" | "extrapolate";
  series?: Array<ChartSeries> | ChartSeries;
  seriesTemplate?: Record<string, any> | {
    customizeSeries?: ((seriesName: any) => ChartSeries);
    nameField?: string;
  };
  topIndent?: number;
  valueAxis?: Record<string, any> | {
    inverted?: boolean;
    logarithmBase?: number;
    max?: number;
    min?: number;
    type?: "continuous" | "logarithmic";
    valueType?: "datetime" | "numeric" | "string";
  };
}>
class Chart extends NestedOption<IChartProps> {
  public static OptionName = "chart";
  public static ExpectedChildren = {
    commonSeriesSettings: { optionName: "commonSeriesSettings", isCollectionItem: false },
    dataPrepareSettings: { optionName: "dataPrepareSettings", isCollectionItem: false },
    series: { optionName: "series", isCollectionItem: true },
    seriesTemplate: { optionName: "seriesTemplate", isCollectionItem: false },
    valueAxis: { optionName: "valueAxis", isCollectionItem: false }
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
// Chart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
}>
class DataPrepareSettings extends NestedOption<IDataPrepareSettingsProps> {
  public static OptionName = "dataPrepareSettings";
}

// owners:
// RangeSelector
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
// CommonSeriesSettingsLabel
// ScaleLabel
// SliderMarker
// LoadingIndicator
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
// CommonSeriesSettingsLabel
// ScaleLabel
// MarkerLabel
// SliderMarker
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
// Background
// Point
type IImageProps = React.PropsWithChildren<{
  location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop";
  url?: string | Record<string, any> | {
    rangeMaxPoint?: string;
    rangeMinPoint?: string;
  };
  height?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
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
// RangeSelector
type IIndentProps = React.PropsWithChildren<{
  left?: number;
  right?: number;
}>
class Indent extends NestedOption<IIndentProps> {
  public static OptionName = "indent";
}

// owners:
// CommonSeriesSettings
// Scale
// Marker
type ILabelProps = React.PropsWithChildren<{
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
  overlappingBehavior?: "hide" | "none";
  topIndent?: number;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
}

// owners:
// Value
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
// RangeSelector
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
// RangeSelector
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
type IMarkerProps = React.PropsWithChildren<{
  label?: Record<string, any> | {
    customizeText?: ((markerValue: { value: Date | number, valueText: string }) => string);
    format?: LocalizationTypes.Format;
  };
  separatorHeight?: number;
  textLeftIndent?: number;
  textTopIndent?: number;
  topIndent?: number;
  visible?: boolean;
}>
class Marker extends NestedOption<IMarkerProps> {
  public static OptionName = "marker";
  public static ExpectedChildren = {
    label: { optionName: "label", isCollectionItem: false },
    markerLabel: { optionName: "label", isCollectionItem: false }
  };
}

// owners:
// Marker
type IMarkerLabelProps = React.PropsWithChildren<{
  customizeText?: ((markerValue: { value: Date | number, valueText: string }) => string);
  format?: LocalizationTypes.Format;
}>
class MarkerLabel extends NestedOption<IMarkerLabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    format: { optionName: "format", isCollectionItem: false }
  };
}

// owners:
// Scale
type IMaxRangeProps = React.PropsWithChildren<{
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
class MaxRange extends NestedOption<IMaxRangeProps> {
  public static OptionName = "maxRange";
}

// owners:
// Scale
type IMinorTickProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class MinorTick extends NestedOption<IMinorTickProps> {
  public static OptionName = "minorTick";
}

// owners:
// Scale
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
// Scale
type IMinRangeProps = React.PropsWithChildren<{
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
class MinRange extends NestedOption<IMinRangeProps> {
  public static OptionName = "minRange";
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
// RangeSelector
type IScaleProps = React.PropsWithChildren<{
  aggregateByCategory?: boolean;
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
  discreteAxisDivisionMode?: "betweenLabels" | "crossLabels";
  endOnTick?: boolean;
  endValue?: Date | number | string;
  holidays?: Array<Date | string> | Array<number>;
  label?: Record<string, any> | {
    customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    overlappingBehavior?: "hide" | "none";
    topIndent?: number;
    visible?: boolean;
  };
  linearThreshold?: number;
  logarithmBase?: number;
  marker?: Record<string, any> | {
    label?: Record<string, any> | {
      customizeText?: ((markerValue: { value: Date | number, valueText: string }) => string);
      format?: LocalizationTypes.Format;
    };
    separatorHeight?: number;
    textLeftIndent?: number;
    textTopIndent?: number;
    topIndent?: number;
    visible?: boolean;
  };
  maxRange?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
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
  minorTick?: Record<string, any> | {
    color?: string;
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
  minRange?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
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
  placeholderHeight?: number;
  showCustomBoundaryTicks?: boolean;
  singleWorkdays?: Array<Date | string> | Array<number>;
  startValue?: Date | number | string;
  tick?: Record<string, any> | {
    color?: string;
    opacity?: number;
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
  type?: "continuous" | "discrete" | "logarithmic" | "semidiscrete";
  valueType?: "datetime" | "numeric" | "string";
  workdaysOnly?: boolean;
  workWeek?: Array<number>;
}>
class Scale extends NestedOption<IScaleProps> {
  public static OptionName = "scale";
  public static ExpectedChildren = {
    aggregationInterval: { optionName: "aggregationInterval", isCollectionItem: false },
    break: { optionName: "breaks", isCollectionItem: true },
    breakStyle: { optionName: "breakStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    marker: { optionName: "marker", isCollectionItem: false },
    maxRange: { optionName: "maxRange", isCollectionItem: false },
    minorTick: { optionName: "minorTick", isCollectionItem: false },
    minorTickInterval: { optionName: "minorTickInterval", isCollectionItem: false },
    minRange: { optionName: "minRange", isCollectionItem: false },
    scaleLabel: { optionName: "label", isCollectionItem: false },
    tick: { optionName: "tick", isCollectionItem: false },
    tickInterval: { optionName: "tickInterval", isCollectionItem: false }
  };
}

// owners:
// Scale
type IScaleLabelProps = React.PropsWithChildren<{
  customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  overlappingBehavior?: "hide" | "none";
  topIndent?: number;
  visible?: boolean;
}>
class ScaleLabel extends NestedOption<IScaleLabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
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
// RangeSelector
type IShutterProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
}>
class Shutter extends NestedOption<IShutterProps> {
  public static OptionName = "shutter";
}

// owners:
// RangeSelector
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
class Size extends NestedOption<ISizeProps> {
  public static OptionName = "size";
}

// owners:
// RangeSelector
type ISliderHandleProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  width?: number;
}>
class SliderHandle extends NestedOption<ISliderHandleProps> {
  public static OptionName = "sliderHandle";
}

// owners:
// RangeSelector
type ISliderMarkerProps = React.PropsWithChildren<{
  color?: string;
  customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  invalidRangeColor?: string;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  placeholderHeight?: number;
  visible?: boolean;
}>
class SliderMarker extends NestedOption<ISliderMarkerProps> {
  public static OptionName = "sliderMarker";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
  };
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
// Scale
type ITickProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  width?: number;
}>
class Tick extends NestedOption<ITickProps> {
  public static OptionName = "tick";
}

// owners:
// Scale
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
// RangeSelector
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
// PointImage
type IUrlProps = React.PropsWithChildren<{
  rangeMaxPoint?: string;
  rangeMinPoint?: string;
}>
class Url extends NestedOption<IUrlProps> {
  public static OptionName = "url";
}

// owners:
// RangeSelector
type IValueProps = React.PropsWithChildren<{
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
class Value extends NestedOption<IValueProps> {
  public static OptionName = "value";
  public static DefaultsProps = {
    defaultEndValue: "endValue",
    defaultStartValue: "startValue"
  };
  public static ExpectedChildren = {
    length: { optionName: "length", isCollectionItem: false }
  };
}

// owners:
// Chart
type IValueAxisProps = React.PropsWithChildren<{
  inverted?: boolean;
  logarithmBase?: number;
  max?: number;
  min?: number;
  type?: "continuous" | "logarithmic";
  valueType?: "datetime" | "numeric" | "string";
}>
class ValueAxis extends NestedOption<IValueAxisProps> {
  public static OptionName = "valueAxis";
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
// PointImage
type IWidthProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
class Width extends NestedOption<IWidthProps> {
  public static OptionName = "width";
}

export default RangeSelector;
export {
  RangeSelector,
  IRangeSelectorOptions,
  Aggregation,
  IAggregationProps,
  AggregationInterval,
  IAggregationIntervalProps,
  ArgumentFormat,
  IArgumentFormatProps,
  Background,
  IBackgroundProps,
  BackgroundImage,
  IBackgroundImageProps,
  Behavior,
  IBehaviorProps,
  Border,
  IBorderProps,
  Break,
  IBreakProps,
  BreakStyle,
  IBreakStyleProps,
  Chart,
  IChartProps,
  Color,
  IColorProps,
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
  DataPrepareSettings,
  IDataPrepareSettingsProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Hatching,
  IHatchingProps,
  Height,
  IHeightProps,
  HoverStyle,
  IHoverStyleProps,
  Image,
  IImageProps,
  Indent,
  IIndentProps,
  Label,
  ILabelProps,
  Length,
  ILengthProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  Marker,
  IMarkerProps,
  MarkerLabel,
  IMarkerLabelProps,
  MaxRange,
  IMaxRangeProps,
  MinorTick,
  IMinorTickProps,
  MinorTickInterval,
  IMinorTickIntervalProps,
  MinRange,
  IMinRangeProps,
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
  Scale,
  IScaleProps,
  ScaleLabel,
  IScaleLabelProps,
  SelectionStyle,
  ISelectionStyleProps,
  Series,
  ISeriesProps,
  SeriesBorder,
  ISeriesBorderProps,
  SeriesTemplate,
  ISeriesTemplateProps,
  Shutter,
  IShutterProps,
  Size,
  ISizeProps,
  SliderHandle,
  ISliderHandleProps,
  SliderMarker,
  ISliderMarkerProps,
  Subtitle,
  ISubtitleProps,
  Tick,
  ITickProps,
  TickInterval,
  ITickIntervalProps,
  Title,
  ITitleProps,
  Url,
  IUrlProps,
  Value,
  IValueProps,
  ValueAxis,
  IValueAxisProps,
  ValueErrorBar,
  IValueErrorBarProps,
  Width,
  IWidthProps
};
import type * as RangeSelectorTypes from 'devextreme/viz/range_selector_types';
export { RangeSelectorTypes };

