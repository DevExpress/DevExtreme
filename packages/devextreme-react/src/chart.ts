"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxChart, {
    Properties
} from "devextreme/viz/chart";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, PointClickEvent, SeriesClickEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomEndEvent, ZoomStartEvent, chartPointAggregationInfoObject, chartSeriesObject, ChartSeriesAggregationMethod, dxChartAnnotationConfig, AggregatedPointsPosition, ChartLabelDisplayMode, FinancialChartReductionLevel, chartPointObject, ChartTooltipLocation, ChartZoomAndPanMode, EventKeyModifier } from "devextreme/viz/chart";
import type { AnimationEaseMode, DashStyle, Font as ChartsFont, TextOverflow, AnnotationType, WordWrap, TimeInterval, ChartsDataType, ScaleBreak, ScaleBreakLineStyle, RelativePosition, DiscreteAxisDivisionMode, ArgumentAxisHoverMode, ChartsAxisLabelOverlap, AxisScaleType, VisualRangeUpdateMode, ChartsColor, SeriesHoverMode, HatchDirection, PointInteractionMode, PointSymbol, SeriesSelectionMode, SeriesType, ValueErrorBarDisplayMode, ValueErrorBarType, LegendItem, LegendHoverMode } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";
import type { HorizontalAlignment, VerticalAlignment, Format as CommonFormat, Position, VerticalEdge, ExportFormat, Orientation } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/localization";
import type { ChartSeries } from "devextreme/viz/common";

import type * as CommonChartTypes from "devextreme/common/charts";

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

interface ChartRef {
  instance: () => dxChart;
}

const Chart = memo(
  forwardRef(
    (props: React.PropsWithChildren<IChartOptions>, ref: ForwardedRef<ChartRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["argumentAxis","argumentAxis.categories","argumentAxis.visualRange","loadingIndicator","loadingIndicator.show","valueAxis","valueAxis.categories","valueAxis.visualRange"]), []);
      const independentEvents = useMemo(() => (["onArgumentAxisClick","onDisposing","onDone","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onLegendClick","onPointClick","onSeriesClick","onTooltipHidden","onTooltipShown","onZoomEnd","onZoomStart"]), []);

      const defaults = useMemo(() => ({
        defaultArgumentAxis: "argumentAxis",
        defaultLoadingIndicator: "loadingIndicator",
        defaultValueAxis: "valueAxis",
      }), []);

      const expectedChildren = useMemo(() => ({
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
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IChartOptions>>, {
          WidgetClass: dxChart,
          ref: baseRef,
          useRequestAnimationFrameFlag: true,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IChartOptions> & { ref?: Ref<ChartRef> }) => ReactElement | null;


// owners:
// Chart
type IAdaptiveLayoutProps = React.PropsWithChildren<{
  height?: number;
  keepLabels?: boolean;
  width?: number;
}>
const _componentAdaptiveLayout = memo(
  (props: IAdaptiveLayoutProps) => {
    return React.createElement(NestedOption<IAdaptiveLayoutProps>, { ...props });
  }
);

const AdaptiveLayout: typeof _componentAdaptiveLayout & IElementDescriptor = Object.assign(_componentAdaptiveLayout, {
  OptionName: "adaptiveLayout",
})

// owners:
// CommonSeriesSettings
type IAggregationProps = React.PropsWithChildren<{
  calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
  enabled?: boolean;
  method?: ChartSeriesAggregationMethod;
}>
const _componentAggregation = memo(
  (props: IAggregationProps) => {
    return React.createElement(NestedOption<IAggregationProps>, { ...props });
  }
);

const Aggregation: typeof _componentAggregation & IElementDescriptor = Object.assign(_componentAggregation, {
  OptionName: "aggregation",
})

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
const _componentAggregationInterval = memo(
  (props: IAggregationIntervalProps) => {
    return React.createElement(NestedOption<IAggregationIntervalProps>, { ...props });
  }
);

const AggregationInterval: typeof _componentAggregationInterval & IElementDescriptor = Object.assign(_componentAggregationInterval, {
  OptionName: "aggregationInterval",
})

// owners:
// Chart
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: AnimationEaseMode;
  enabled?: boolean;
  maxPointCountSupported?: number;
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
    dashStyle?: DashStyle;
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
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxChartAnnotationConfig | any, element: any) => string | any) | template;
  type?: AnnotationType;
  value?: Date | number | string;
  width?: number;
  wordWrap?: WordWrap;
  x?: number;
  y?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  tooltipRender?: (...params: any) => React.ReactNode;
  tooltipComponent?: React.ComponentType<any>;
}>
const _componentAnnotation = memo(
  (props: IAnnotationProps) => {
    return React.createElement(NestedOption<IAnnotationProps>, { ...props });
  }
);

const Annotation: typeof _componentAnnotation & IElementDescriptor = Object.assign(_componentAnnotation, {
  OptionName: "annotations",
  IsCollectionItem: true,
  ExpectedChildren: {
    annotationBorder: { optionName: "border", isCollectionItem: false },
    annotationImage: { optionName: "image", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    image: { optionName: "image", isCollectionItem: false },
    shadow: { optionName: "shadow", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }, {
    tmplOption: "tooltipTemplate",
    render: "tooltipRender",
    component: "tooltipComponent"
  }],
})

// owners:
// Annotation
// Legend
type IAnnotationBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentAnnotationBorder = memo(
  (props: IAnnotationBorderProps) => {
    return React.createElement(NestedOption<IAnnotationBorderProps>, { ...props });
  }
);

const AnnotationBorder: typeof _componentAnnotationBorder & IElementDescriptor = Object.assign(_componentAnnotationBorder, {
  OptionName: "border",
})

// owners:
// Annotation
type IAnnotationImageProps = React.PropsWithChildren<{
  height?: number;
  url?: string;
  width?: number;
}>
const _componentAnnotationImage = memo(
  (props: IAnnotationImageProps) => {
    return React.createElement(NestedOption<IAnnotationImageProps>, { ...props });
  }
);

const AnnotationImage: typeof _componentAnnotationImage & IElementDescriptor = Object.assign(_componentAnnotationImage, {
  OptionName: "image",
})

// owners:
// Chart
type IArgumentAxisProps = React.PropsWithChildren<{
  aggregateByCategory?: boolean;
  aggregatedPointsPosition?: AggregatedPointsPosition;
  aggregationGroupWidth?: number;
  aggregationInterval?: number | Record<string, any> | TimeInterval | {
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
  argumentType?: ChartsDataType;
  axisDivisionFactor?: number;
  breaks?: Array<ScaleBreak> | {
    endValue?: Date | number | string;
    startValue?: Date | number | string;
  }[];
  breakStyle?: Record<string, any> | {
    color?: string;
    line?: ScaleBreakLineStyle;
    width?: number;
  };
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: DashStyle;
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      position?: RelativePosition;
      text?: string;
      verticalAlignment?: VerticalAlignment;
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    value?: Date | number | string;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      position?: RelativePosition;
      verticalAlignment?: VerticalAlignment;
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    width?: number;
  };
  customPosition?: Date | number | string;
  customPositionAxis?: string;
  discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
  endOnTick?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  holidays?: Array<Date | string> | Array<number>;
  hoverMode?: ArgumentAxisHoverMode;
  inverted?: boolean;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
    displayMode?: ChartLabelDisplayMode;
    font?: ChartsFont;
    format?: LocalizationFormat;
    indentFromAxis?: number;
    overlappingBehavior?: ChartsAxisLabelOverlap;
    position?: Position | RelativePosition;
    rotationAngle?: number;
    staggeringSpacing?: number;
    template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
    textOverflow?: TextOverflow;
    visible?: boolean;
    wordWrap?: WordWrap;
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
  minorTickInterval?: number | Record<string, any> | TimeInterval | {
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
  minVisualRangeLength?: number | Record<string, any> | TimeInterval | {
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
  position?: Position;
  singleWorkdays?: Array<Date | string> | Array<number>;
  strips?: Array<Record<string, any>> | {
    color?: string;
    endValue?: Date | number | string;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      text?: string;
      verticalAlignment?: VerticalAlignment;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    startValue?: Date | number | string;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      verticalAlignment?: VerticalAlignment;
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
  tickInterval?: number | Record<string, any> | TimeInterval | {
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
    alignment?: HorizontalAlignment;
    font?: ChartsFont;
    margin?: number;
    text?: string;
    textOverflow?: TextOverflow;
    wordWrap?: WordWrap;
  };
  type?: AxisScaleType;
  valueMarginsEnabled?: boolean;
  visible?: boolean;
  visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  visualRangeUpdateMode?: VisualRangeUpdateMode;
  wholeRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  width?: number;
  workdaysOnly?: boolean;
  workWeek?: Array<number>;
  defaultCategories?: Array<Date | number | string>;
  onCategoriesChange?: (value: Array<Date | number | string>) => void;
  defaultVisualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onVisualRangeChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>
const _componentArgumentAxis = memo(
  (props: IArgumentAxisProps) => {
    return React.createElement(NestedOption<IArgumentAxisProps>, { ...props });
  }
);

const ArgumentAxis: typeof _componentArgumentAxis & IElementDescriptor = Object.assign(_componentArgumentAxis, {
  OptionName: "argumentAxis",
  DefaultsProps: {
    defaultCategories: "categories",
    defaultVisualRange: "visualRange"
  },
  ExpectedChildren: {
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
  },
})

// owners:
// CommonSeriesSettingsLabel
// Tooltip
type IArgumentFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: CommonFormat | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentArgumentFormat = memo(
  (props: IArgumentFormatProps) => {
    return React.createElement(NestedOption<IArgumentFormatProps>, { ...props });
  }
);

const ArgumentFormat: typeof _componentArgumentFormat & IElementDescriptor = Object.assign(_componentArgumentFormat, {
  OptionName: "argumentFormat",
})

// owners:
// ArgumentAxis
// ValueAxis
type IAxisConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: HorizontalAlignment;
    position?: RelativePosition;
    verticalAlignment?: VerticalAlignment;
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  width?: number;
}>
const _componentAxisConstantLineStyle = memo(
  (props: IAxisConstantLineStyleProps) => {
    return React.createElement(NestedOption<IAxisConstantLineStyleProps>, { ...props });
  }
);

const AxisConstantLineStyle: typeof _componentAxisConstantLineStyle & IElementDescriptor = Object.assign(_componentAxisConstantLineStyle, {
  OptionName: "constantLineStyle",
})

// owners:
// AxisConstantLineStyle
// ConstantLineStyle
type IAxisConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  position?: RelativePosition;
  verticalAlignment?: VerticalAlignment;
  visible?: boolean;
}>
const _componentAxisConstantLineStyleLabel = memo(
  (props: IAxisConstantLineStyleLabelProps) => {
    return React.createElement(NestedOption<IAxisConstantLineStyleLabelProps>, { ...props });
  }
);

const AxisConstantLineStyleLabel: typeof _componentAxisConstantLineStyleLabel & IElementDescriptor = Object.assign(_componentAxisConstantLineStyleLabel, {
  OptionName: "label",
})

// owners:
// ArgumentAxis
// ValueAxis
type IAxisLabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  displayMode?: ChartLabelDisplayMode;
  font?: ChartsFont;
  format?: LocalizationFormat;
  indentFromAxis?: number;
  overlappingBehavior?: ChartsAxisLabelOverlap;
  position?: Position | RelativePosition;
  rotationAngle?: number;
  staggeringSpacing?: number;
  template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
  textOverflow?: TextOverflow;
  visible?: boolean;
  wordWrap?: WordWrap;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentAxisLabel = memo(
  (props: IAxisLabelProps) => {
    return React.createElement(NestedOption<IAxisLabelProps>, { ...props });
  }
);

const AxisLabel: typeof _componentAxisLabel & IElementDescriptor = Object.assign(_componentAxisLabel, {
  OptionName: "label",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// ArgumentAxis
// ValueAxis
type IAxisTitleProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  font?: ChartsFont;
  margin?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentAxisTitle = memo(
  (props: IAxisTitleProps) => {
    return React.createElement(NestedOption<IAxisTitleProps>, { ...props });
  }
);

const AxisTitle: typeof _componentAxisTitle & IElementDescriptor = Object.assign(_componentAxisTitle, {
  OptionName: "title",
})

// owners:
// CommonPaneSettings
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
  dashStyle?: DashStyle;
  opacity?: number;
  visible?: boolean;
  width?: number;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  top?: boolean;
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
// ArgumentAxis
// ValueAxis
type IBreakProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  startValue?: Date | number | string;
}>
const _componentBreak = memo(
  (props: IBreakProps) => {
    return React.createElement(NestedOption<IBreakProps>, { ...props });
  }
);

const Break: typeof _componentBreak & IElementDescriptor = Object.assign(_componentBreak, {
  OptionName: "breaks",
  IsCollectionItem: true,
})

// owners:
// ArgumentAxis
type IBreakStyleProps = React.PropsWithChildren<{
  color?: string;
  line?: ScaleBreakLineStyle;
  width?: number;
}>
const _componentBreakStyle = memo(
  (props: IBreakStyleProps) => {
    return React.createElement(NestedOption<IBreakStyleProps>, { ...props });
  }
);

const BreakStyle: typeof _componentBreakStyle & IElementDescriptor = Object.assign(_componentBreakStyle, {
  OptionName: "breakStyle",
})

// owners:
// Chart
type IChartTitleProps = React.PropsWithChildren<{
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
const _componentChartTitle = memo(
  (props: IChartTitleProps) => {
    return React.createElement(NestedOption<IChartTitleProps>, { ...props });
  }
);

const ChartTitle: typeof _componentChartTitle & IElementDescriptor = Object.assign(_componentChartTitle, {
  OptionName: "title",
  ExpectedChildren: {
    chartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// ChartTitle
type IChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentChartTitleSubtitle = memo(
  (props: IChartTitleSubtitleProps) => {
    return React.createElement(NestedOption<IChartTitleSubtitleProps>, { ...props });
  }
);

const ChartTitleSubtitle: typeof _componentChartTitleSubtitle & IElementDescriptor = Object.assign(_componentChartTitleSubtitle, {
  OptionName: "subtitle",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

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
const _componentColor = memo(
  (props: IColorProps) => {
    return React.createElement(NestedOption<IColorProps>, { ...props });
  }
);

const Color: typeof _componentColor & IElementDescriptor = Object.assign(_componentColor, {
  OptionName: "color",
})

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
    dashStyle?: DashStyle;
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
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxChartAnnotationConfig | any, element: any) => string | any) | template;
  type?: AnnotationType;
  value?: Date | number | string;
  width?: number;
  wordWrap?: WordWrap;
  x?: number;
  y?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  tooltipRender?: (...params: any) => React.ReactNode;
  tooltipComponent?: React.ComponentType<any>;
}>
const _componentCommonAnnotationSettings = memo(
  (props: ICommonAnnotationSettingsProps) => {
    return React.createElement(NestedOption<ICommonAnnotationSettingsProps>, { ...props });
  }
);

const CommonAnnotationSettings: typeof _componentCommonAnnotationSettings & IElementDescriptor = Object.assign(_componentCommonAnnotationSettings, {
  OptionName: "commonAnnotationSettings",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }, {
    tmplOption: "tooltipTemplate",
    render: "tooltipRender",
    component: "tooltipComponent"
  }],
})

// owners:
// Chart
type ICommonAxisSettingsProps = React.PropsWithChildren<{
  aggregatedPointsPosition?: AggregatedPointsPosition;
  allowDecimals?: boolean;
  breakStyle?: Record<string, any> | {
    color?: string;
    line?: ScaleBreakLineStyle;
    width?: number;
  };
  color?: string;
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      font?: ChartsFont;
      position?: RelativePosition;
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    width?: number;
  };
  discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
  endOnTick?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  inverted?: boolean;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    displayMode?: ChartLabelDisplayMode;
    font?: ChartsFont;
    indentFromAxis?: number;
    overlappingBehavior?: ChartsAxisLabelOverlap;
    position?: Position | RelativePosition;
    rotationAngle?: number;
    staggeringSpacing?: number;
    template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
    textOverflow?: TextOverflow;
    visible?: boolean;
    wordWrap?: WordWrap;
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
      horizontalAlignment?: HorizontalAlignment;
      verticalAlignment?: VerticalAlignment;
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
    alignment?: HorizontalAlignment;
    font?: ChartsFont;
    margin?: number;
    textOverflow?: TextOverflow;
    wordWrap?: WordWrap;
  };
  valueMarginsEnabled?: boolean;
  visible?: boolean;
  width?: number;
}>
const _componentCommonAxisSettings = memo(
  (props: ICommonAxisSettingsProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsProps>, { ...props });
  }
);

const CommonAxisSettings: typeof _componentCommonAxisSettings & IElementDescriptor = Object.assign(_componentCommonAxisSettings, {
  OptionName: "commonAxisSettings",
  ExpectedChildren: {
    commonAxisSettingsConstantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    commonAxisSettingsLabel: { optionName: "label", isCollectionItem: false },
    commonAxisSettingsTitle: { optionName: "title", isCollectionItem: false },
    constantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false }
  },
})

// owners:
// CommonAxisSettings
type ICommonAxisSettingsConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  label?: Record<string, any> | {
    font?: ChartsFont;
    position?: RelativePosition;
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  width?: number;
}>
const _componentCommonAxisSettingsConstantLineStyle = memo(
  (props: ICommonAxisSettingsConstantLineStyleProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsConstantLineStyleProps>, { ...props });
  }
);

const CommonAxisSettingsConstantLineStyle: typeof _componentCommonAxisSettingsConstantLineStyle & IElementDescriptor = Object.assign(_componentCommonAxisSettingsConstantLineStyle, {
  OptionName: "constantLineStyle",
  ExpectedChildren: {
    commonAxisSettingsConstantLineStyleLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  },
})

// owners:
// CommonAxisSettingsConstantLineStyle
type ICommonAxisSettingsConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  position?: RelativePosition;
  visible?: boolean;
}>
const _componentCommonAxisSettingsConstantLineStyleLabel = memo(
  (props: ICommonAxisSettingsConstantLineStyleLabelProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsConstantLineStyleLabelProps>, { ...props });
  }
);

const CommonAxisSettingsConstantLineStyleLabel: typeof _componentCommonAxisSettingsConstantLineStyleLabel & IElementDescriptor = Object.assign(_componentCommonAxisSettingsConstantLineStyleLabel, {
  OptionName: "label",
})

// owners:
// CommonAxisSettings
type ICommonAxisSettingsLabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  displayMode?: ChartLabelDisplayMode;
  font?: ChartsFont;
  indentFromAxis?: number;
  overlappingBehavior?: ChartsAxisLabelOverlap;
  position?: Position | RelativePosition;
  rotationAngle?: number;
  staggeringSpacing?: number;
  template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
  textOverflow?: TextOverflow;
  visible?: boolean;
  wordWrap?: WordWrap;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentCommonAxisSettingsLabel = memo(
  (props: ICommonAxisSettingsLabelProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsLabelProps>, { ...props });
  }
);

const CommonAxisSettingsLabel: typeof _componentCommonAxisSettingsLabel & IElementDescriptor = Object.assign(_componentCommonAxisSettingsLabel, {
  OptionName: "label",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// CommonAxisSettings
type ICommonAxisSettingsTitleProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  font?: ChartsFont;
  margin?: number;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentCommonAxisSettingsTitle = memo(
  (props: ICommonAxisSettingsTitleProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsTitleProps>, { ...props });
  }
);

const CommonAxisSettingsTitle: typeof _componentCommonAxisSettingsTitle & IElementDescriptor = Object.assign(_componentCommonAxisSettingsTitle, {
  OptionName: "title",
})

// owners:
// Chart
type ICommonPaneSettingsProps = React.PropsWithChildren<{
  backgroundColor?: ChartsColor | string;
  border?: Record<string, any> | {
    bottom?: boolean;
    color?: string;
    dashStyle?: DashStyle;
    left?: boolean;
    opacity?: number;
    right?: boolean;
    top?: boolean;
    visible?: boolean;
    width?: number;
  };
}>
const _componentCommonPaneSettings = memo(
  (props: ICommonPaneSettingsProps) => {
    return React.createElement(NestedOption<ICommonPaneSettingsProps>, { ...props });
  }
);

const CommonPaneSettings: typeof _componentCommonPaneSettings & IElementDescriptor = Object.assign(_componentCommonPaneSettings, {
  OptionName: "commonPaneSettings",
  ExpectedChildren: {
    backgroundColor: { optionName: "backgroundColor", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    paneBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// Chart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: ChartSeriesAggregationMethod;
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
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  bubble?: any;
  candlestick?: any;
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
  fullstackedarea?: any;
  fullstackedbar?: any;
  fullstackedline?: any;
  fullstackedspline?: any;
  fullstackedsplinearea?: any;
  highValueField?: string;
  hoverMode?: SeriesHoverMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
    alignment?: HorizontalAlignment;
    argumentFormat?: LocalizationFormat;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
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
    format?: LocalizationFormat;
    horizontalOffset?: number;
    position?: RelativePosition;
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
    hoverMode?: PointInteractionMode;
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
    selectionMode?: PointInteractionMode;
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
    symbol?: PointSymbol;
    visible?: boolean;
  };
  rangearea?: any;
  rangebar?: any;
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: FinancialChartReductionLevel;
  };
  scatter?: any;
  selectionMode?: SeriesSelectionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
  type?: SeriesType;
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: ValueErrorBarDisplayMode;
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: ValueErrorBarType;
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettings = memo(
  (props: ICommonSeriesSettingsProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsProps>, { ...props });
  }
);

const CommonSeriesSettings: typeof _componentCommonSeriesSettings & IElementDescriptor = Object.assign(_componentCommonSeriesSettings, {
  OptionName: "commonSeriesSettings",
  ExpectedChildren: {
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
  },
})

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettingsHoverStyle = memo(
  (props: ICommonSeriesSettingsHoverStyleProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsHoverStyleProps>, { ...props });
  }
);

const CommonSeriesSettingsHoverStyle: typeof _componentCommonSeriesSettingsHoverStyle & IElementDescriptor = Object.assign(_componentCommonSeriesSettingsHoverStyle, {
  OptionName: "hoverStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsLabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  argumentFormat?: LocalizationFormat;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
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
  format?: LocalizationFormat;
  horizontalOffset?: number;
  position?: RelativePosition;
  rotationAngle?: number;
  showForZeroValues?: boolean;
  verticalOffset?: number;
  visible?: boolean;
}>
const _componentCommonSeriesSettingsLabel = memo(
  (props: ICommonSeriesSettingsLabelProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsLabelProps>, { ...props });
  }
);

const CommonSeriesSettingsLabel: typeof _componentCommonSeriesSettingsLabel & IElementDescriptor = Object.assign(_componentCommonSeriesSettingsLabel, {
  OptionName: "label",
  ExpectedChildren: {
    argumentFormat: { optionName: "argumentFormat", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    connector: { optionName: "connector", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsSelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettingsSelectionStyle = memo(
  (props: ICommonSeriesSettingsSelectionStyleProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsSelectionStyleProps>, { ...props });
  }
);

const CommonSeriesSettingsSelectionStyle: typeof _componentCommonSeriesSettingsSelectionStyle & IElementDescriptor = Object.assign(_componentCommonSeriesSettingsSelectionStyle, {
  OptionName: "selectionStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettingsLabel
type IConnectorProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
const _componentConnector = memo(
  (props: IConnectorProps) => {
    return React.createElement(NestedOption<IConnectorProps>, { ...props });
  }
);

const Connector: typeof _componentConnector & IElementDescriptor = Object.assign(_componentConnector, {
  OptionName: "connector",
})

// owners:
// ArgumentAxis
// ValueAxis
type IConstantLineProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  displayBehindSeries?: boolean;
  extendAxis?: boolean;
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: HorizontalAlignment;
    position?: RelativePosition;
    text?: string;
    verticalAlignment?: VerticalAlignment;
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  value?: Date | number | string;
  width?: number;
}>
const _componentConstantLine = memo(
  (props: IConstantLineProps) => {
    return React.createElement(NestedOption<IConstantLineProps>, { ...props });
  }
);

const ConstantLine: typeof _componentConstantLine & IElementDescriptor = Object.assign(_componentConstantLine, {
  OptionName: "constantLines",
  IsCollectionItem: true,
})

// owners:
// ConstantLine
// ConstantLine
type IConstantLineLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  position?: RelativePosition;
  text?: string;
  verticalAlignment?: VerticalAlignment;
  visible?: boolean;
}>
const _componentConstantLineLabel = memo(
  (props: IConstantLineLabelProps) => {
    return React.createElement(NestedOption<IConstantLineLabelProps>, { ...props });
  }
);

const ConstantLineLabel: typeof _componentConstantLineLabel & IElementDescriptor = Object.assign(_componentConstantLineLabel, {
  OptionName: "label",
})

// owners:
// ArgumentAxis
// ValueAxis
// CommonAxisSettings
type IConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: HorizontalAlignment;
    position?: RelativePosition;
    verticalAlignment?: VerticalAlignment;
    visible?: boolean;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  width?: number;
}>
const _componentConstantLineStyle = memo(
  (props: IConstantLineStyleProps) => {
    return React.createElement(NestedOption<IConstantLineStyleProps>, { ...props });
  }
);

const ConstantLineStyle: typeof _componentConstantLineStyle & IElementDescriptor = Object.assign(_componentConstantLineStyle, {
  OptionName: "constantLineStyle",
})

// owners:
// Chart
type ICrosshairProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  enabled?: boolean;
  horizontalLine?: boolean | Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      backgroundColor?: string;
      customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
      font?: ChartsFont;
      format?: LocalizationFormat;
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
    format?: LocalizationFormat;
    visible?: boolean;
  };
  opacity?: number;
  verticalLine?: boolean | Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      backgroundColor?: string;
      customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
      font?: ChartsFont;
      format?: LocalizationFormat;
      visible?: boolean;
    };
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  width?: number;
}>
const _componentCrosshair = memo(
  (props: ICrosshairProps) => {
    return React.createElement(NestedOption<ICrosshairProps>, { ...props });
  }
);

const Crosshair: typeof _componentCrosshair & IElementDescriptor = Object.assign(_componentCrosshair, {
  OptionName: "crosshair",
  ExpectedChildren: {
    horizontalLine: { optionName: "horizontalLine", isCollectionItem: false },
    horizontalLineLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    verticalLine: { optionName: "verticalLine", isCollectionItem: false }
  },
})

// owners:
// Chart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: any, b: any) => number);
}>
const _componentDataPrepareSettings = memo(
  (props: IDataPrepareSettingsProps) => {
    return React.createElement(NestedOption<IDataPrepareSettingsProps>, { ...props });
  }
);

const DataPrepareSettings: typeof _componentDataPrepareSettings & IElementDescriptor = Object.assign(_componentDataPrepareSettings, {
  OptionName: "dataPrepareSettings",
})

// owners:
// ZoomAndPan
type IDragBoxStyleProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
}>
const _componentDragBoxStyle = memo(
  (props: IDragBoxStyleProps) => {
    return React.createElement(NestedOption<IDragBoxStyleProps>, { ...props });
  }
);

const DragBoxStyle: typeof _componentDragBoxStyle & IElementDescriptor = Object.assign(_componentDragBoxStyle, {
  OptionName: "dragBoxStyle",
})

// owners:
// Chart
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
const _componentFont = memo(
  (props: IFontProps) => {
    return React.createElement(NestedOption<IFontProps>, { ...props });
  }
);

const Font: typeof _componentFont & IElementDescriptor = Object.assign(_componentFont, {
  OptionName: "font",
})

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
// ArgumentAxis
type IGridProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentGrid = memo(
  (props: IGridProps) => {
    return React.createElement(NestedOption<IGridProps>, { ...props });
  }
);

const Grid: typeof _componentGrid & IElementDescriptor = Object.assign(_componentGrid, {
  OptionName: "grid",
})

// owners:
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsSelectionStyle
type IHatchingProps = React.PropsWithChildren<{
  direction?: HatchDirection;
  opacity?: number;
  step?: number;
  width?: number;
}>
const _componentHatching = memo(
  (props: IHatchingProps) => {
    return React.createElement(NestedOption<IHatchingProps>, { ...props });
  }
);

const Hatching: typeof _componentHatching & IElementDescriptor = Object.assign(_componentHatching, {
  OptionName: "hatching",
})

// owners:
// PointImage
type IHeightProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentHeight = memo(
  (props: IHeightProps) => {
    return React.createElement(NestedOption<IHeightProps>, { ...props });
  }
);

const Height: typeof _componentHeight & IElementDescriptor = Object.assign(_componentHeight, {
  OptionName: "height",
})

// owners:
// Crosshair
type IHorizontalLineProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  label?: Record<string, any> | {
    backgroundColor?: string;
    customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat;
    visible?: boolean;
  };
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentHorizontalLine = memo(
  (props: IHorizontalLineProps) => {
    return React.createElement(NestedOption<IHorizontalLineProps>, { ...props });
  }
);

const HorizontalLine: typeof _componentHorizontalLine & IElementDescriptor = Object.assign(_componentHorizontalLine, {
  OptionName: "horizontalLine",
  ExpectedChildren: {
    horizontalLineLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  },
})

// owners:
// HorizontalLine
// Crosshair
// VerticalLine
type IHorizontalLineLabelProps = React.PropsWithChildren<{
  backgroundColor?: string;
  customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationFormat;
  visible?: boolean;
}>
const _componentHorizontalLineLabel = memo(
  (props: IHorizontalLineLabelProps) => {
    return React.createElement(NestedOption<IHorizontalLineLabelProps>, { ...props });
  }
);

const HorizontalLineLabel: typeof _componentHorizontalLineLabel & IElementDescriptor = Object.assign(_componentHorizontalLineLabel, {
  OptionName: "label",
})

// owners:
// CommonSeriesSettings
// Point
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
  size?: number;
}>
const _componentHoverStyle = memo(
  (props: IHoverStyleProps) => {
    return React.createElement(NestedOption<IHoverStyleProps>, { ...props });
  }
);

const HoverStyle: typeof _componentHoverStyle & IElementDescriptor = Object.assign(_componentHoverStyle, {
  OptionName: "hoverStyle",
})

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
const _componentImage = memo(
  (props: IImageProps) => {
    return React.createElement(NestedOption<IImageProps>, { ...props });
  }
);

const Image: typeof _componentImage & IElementDescriptor = Object.assign(_componentImage, {
  OptionName: "image",
})

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
  horizontalAlignment?: HorizontalAlignment;
  position?: RelativePosition | Position;
  verticalAlignment?: VerticalAlignment;
  visible?: boolean;
  text?: string;
  alignment?: HorizontalAlignment;
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  displayMode?: ChartLabelDisplayMode;
  format?: LocalizationFormat;
  indentFromAxis?: number;
  overlappingBehavior?: ChartsAxisLabelOverlap;
  rotationAngle?: number;
  staggeringSpacing?: number;
  template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
  argumentFormat?: LocalizationFormat;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
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
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Chart
type ILegendProps = React.PropsWithChildren<{
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: DashStyle;
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
  horizontalAlignment?: HorizontalAlignment;
  hoverMode?: LegendHoverMode;
  itemsAlignment?: HorizontalAlignment;
  itemTextPosition?: Position;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerSize?: number;
  markerTemplate?: ((legendItem: LegendItem, element: any) => string | any) | template;
  orientation?: Orientation;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  position?: RelativePosition;
  rowCount?: number;
  rowItemSpacing?: number;
  title?: Record<string, any> | string | {
    font?: ChartsFont;
    horizontalAlignment?: HorizontalAlignment;
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
    verticalAlignment?: VerticalEdge;
  };
  verticalAlignment?: VerticalEdge;
  visible?: boolean;
  markerRender?: (...params: any) => React.ReactNode;
  markerComponent?: React.ComponentType<any>;
}>
const _componentLegend = memo(
  (props: ILegendProps) => {
    return React.createElement(NestedOption<ILegendProps>, { ...props });
  }
);

const Legend: typeof _componentLegend & IElementDescriptor = Object.assign(_componentLegend, {
  OptionName: "legend",
  ExpectedChildren: {
    annotationBorder: { optionName: "border", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    legendTitle: { optionName: "title", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "markerTemplate",
    render: "markerRender",
    component: "markerComponent"
  }],
})

// owners:
// Legend
type ILegendTitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
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
  verticalAlignment?: VerticalEdge;
}>
const _componentLegendTitle = memo(
  (props: ILegendTitleProps) => {
    return React.createElement(NestedOption<ILegendTitleProps>, { ...props });
  }
);

const LegendTitle: typeof _componentLegendTitle & IElementDescriptor = Object.assign(_componentLegendTitle, {
  OptionName: "title",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    legendTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// LegendTitle
type ILegendTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
}>
const _componentLegendTitleSubtitle = memo(
  (props: ILegendTitleSubtitleProps) => {
    return React.createElement(NestedOption<ILegendTitleSubtitleProps>, { ...props });
  }
);

const LegendTitleSubtitle: typeof _componentLegendTitleSubtitle & IElementDescriptor = Object.assign(_componentLegendTitleSubtitle, {
  OptionName: "subtitle",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

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
const _componentLength = memo(
  (props: ILengthProps) => {
    return React.createElement(NestedOption<ILengthProps>, { ...props });
  }
);

const Length: typeof _componentLength & IElementDescriptor = Object.assign(_componentLength, {
  OptionName: "length",
})

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
const _componentMargin = memo(
  (props: IMarginProps) => {
    return React.createElement(NestedOption<IMarginProps>, { ...props });
  }
);

const Margin: typeof _componentMargin & IElementDescriptor = Object.assign(_componentMargin, {
  OptionName: "margin",
})

// owners:
// ArgumentAxis
type IMinorGridProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentMinorGrid = memo(
  (props: IMinorGridProps) => {
    return React.createElement(NestedOption<IMinorGridProps>, { ...props });
  }
);

const MinorGrid: typeof _componentMinorGrid & IElementDescriptor = Object.assign(_componentMinorGrid, {
  OptionName: "minorGrid",
})

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
const _componentMinorTick = memo(
  (props: IMinorTickProps) => {
    return React.createElement(NestedOption<IMinorTickProps>, { ...props });
  }
);

const MinorTick: typeof _componentMinorTick & IElementDescriptor = Object.assign(_componentMinorTick, {
  OptionName: "minorTick",
})

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
const _componentMinorTickInterval = memo(
  (props: IMinorTickIntervalProps) => {
    return React.createElement(NestedOption<IMinorTickIntervalProps>, { ...props });
  }
);

const MinorTickInterval: typeof _componentMinorTickInterval & IElementDescriptor = Object.assign(_componentMinorTickInterval, {
  OptionName: "minorTickInterval",
})

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
const _componentMinVisualRangeLength = memo(
  (props: IMinVisualRangeLengthProps) => {
    return React.createElement(NestedOption<IMinVisualRangeLengthProps>, { ...props });
  }
);

const MinVisualRangeLength: typeof _componentMinVisualRangeLength & IElementDescriptor = Object.assign(_componentMinVisualRangeLength, {
  OptionName: "minVisualRangeLength",
})

// owners:
// Chart
type IPaneProps = React.PropsWithChildren<{
  backgroundColor?: ChartsColor | string;
  border?: Record<string, any> | {
    bottom?: boolean;
    color?: string;
    dashStyle?: DashStyle;
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
const _componentPane = memo(
  (props: IPaneProps) => {
    return React.createElement(NestedOption<IPaneProps>, { ...props });
  }
);

const Pane: typeof _componentPane & IElementDescriptor = Object.assign(_componentPane, {
  OptionName: "panes",
  IsCollectionItem: true,
})

// owners:
// CommonPaneSettings
type IPaneBorderProps = React.PropsWithChildren<{
  bottom?: boolean;
  color?: string;
  dashStyle?: DashStyle;
  left?: boolean;
  opacity?: number;
  right?: boolean;
  top?: boolean;
  visible?: boolean;
  width?: number;
}>
const _componentPaneBorder = memo(
  (props: IPaneBorderProps) => {
    return React.createElement(NestedOption<IPaneBorderProps>, { ...props });
  }
);

const PaneBorder: typeof _componentPaneBorder & IElementDescriptor = Object.assign(_componentPaneBorder, {
  OptionName: "border",
})

// owners:
// CommonSeriesSettings
type IPointProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hoverMode?: PointInteractionMode;
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
  selectionMode?: PointInteractionMode;
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
  symbol?: PointSymbol;
  visible?: boolean;
}>
const _componentPoint = memo(
  (props: IPointProps) => {
    return React.createElement(NestedOption<IPointProps>, { ...props });
  }
);

const Point: typeof _componentPoint & IElementDescriptor = Object.assign(_componentPoint, {
  OptionName: "point",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    image: { optionName: "image", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false },
    pointHoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    pointImage: { optionName: "image", isCollectionItem: false },
    pointSelectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false }
  },
})

// owners:
// Point
// PointHoverStyle
// PointSelectionStyle
type IPointBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
const _componentPointBorder = memo(
  (props: IPointBorderProps) => {
    return React.createElement(NestedOption<IPointBorderProps>, { ...props });
  }
);

const PointBorder: typeof _componentPointBorder & IElementDescriptor = Object.assign(_componentPointBorder, {
  OptionName: "border",
})

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
const _componentPointHoverStyle = memo(
  (props: IPointHoverStyleProps) => {
    return React.createElement(NestedOption<IPointHoverStyleProps>, { ...props });
  }
);

const PointHoverStyle: typeof _componentPointHoverStyle & IElementDescriptor = Object.assign(_componentPointHoverStyle, {
  OptionName: "hoverStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false }
  },
})

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
const _componentPointImage = memo(
  (props: IPointImageProps) => {
    return React.createElement(NestedOption<IPointImageProps>, { ...props });
  }
);

const PointImage: typeof _componentPointImage & IElementDescriptor = Object.assign(_componentPointImage, {
  OptionName: "image",
  ExpectedChildren: {
    height: { optionName: "height", isCollectionItem: false },
    url: { optionName: "url", isCollectionItem: false },
    width: { optionName: "width", isCollectionItem: false }
  },
})

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
const _componentPointSelectionStyle = memo(
  (props: IPointSelectionStyleProps) => {
    return React.createElement(NestedOption<IPointSelectionStyleProps>, { ...props });
  }
);

const PointSelectionStyle: typeof _componentPointSelectionStyle & IElementDescriptor = Object.assign(_componentPointSelectionStyle, {
  OptionName: "selectionStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettings
type IReductionProps = React.PropsWithChildren<{
  color?: string;
  level?: FinancialChartReductionLevel;
}>
const _componentReduction = memo(
  (props: IReductionProps) => {
    return React.createElement(NestedOption<IReductionProps>, { ...props });
  }
);

const Reduction: typeof _componentReduction & IElementDescriptor = Object.assign(_componentReduction, {
  OptionName: "reduction",
})

// owners:
// Chart
type IScrollBarProps = React.PropsWithChildren<{
  color?: string;
  offset?: number;
  opacity?: number;
  position?: Position;
  visible?: boolean;
  width?: number;
}>
const _componentScrollBar = memo(
  (props: IScrollBarProps) => {
    return React.createElement(NestedOption<IScrollBarProps>, { ...props });
  }
);

const ScrollBar: typeof _componentScrollBar & IElementDescriptor = Object.assign(_componentScrollBar, {
  OptionName: "scrollBar",
})

// owners:
// Point
// CommonSeriesSettings
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
    dashStyle?: DashStyle;
  };
  color?: ChartsColor | string;
  size?: number;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
const _componentSelectionStyle = memo(
  (props: ISelectionStyleProps) => {
    return React.createElement(NestedOption<ISelectionStyleProps>, { ...props });
  }
);

const SelectionStyle: typeof _componentSelectionStyle & IElementDescriptor = Object.assign(_componentSelectionStyle, {
  OptionName: "selectionStyle",
})

// owners:
// Chart
type ISeriesProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: ChartSeriesAggregationMethod;
  };
  argumentField?: string;
  axis?: string;
  barOverlapGroup?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
  highValueField?: string;
  hoverMode?: SeriesHoverMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
    alignment?: HorizontalAlignment;
    argumentFormat?: LocalizationFormat;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
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
    format?: LocalizationFormat;
    horizontalOffset?: number;
    position?: RelativePosition;
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
    hoverMode?: PointInteractionMode;
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
    selectionMode?: PointInteractionMode;
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
    symbol?: PointSymbol;
    visible?: boolean;
  };
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: FinancialChartReductionLevel;
  };
  selectionMode?: SeriesSelectionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
  type?: SeriesType;
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: ValueErrorBarDisplayMode;
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: ValueErrorBarType;
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
const _componentSeries = memo(
  (props: ISeriesProps) => {
    return React.createElement(NestedOption<ISeriesProps>, { ...props });
  }
);

const Series: typeof _componentSeries & IElementDescriptor = Object.assign(_componentSeries, {
  OptionName: "series",
  IsCollectionItem: true,
})

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsLabel
// CommonSeriesSettingsSelectionStyle
type ISeriesBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  visible?: boolean;
  width?: number;
}>
const _componentSeriesBorder = memo(
  (props: ISeriesBorderProps) => {
    return React.createElement(NestedOption<ISeriesBorderProps>, { ...props });
  }
);

const SeriesBorder: typeof _componentSeriesBorder & IElementDescriptor = Object.assign(_componentSeriesBorder, {
  OptionName: "border",
})

// owners:
// Chart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => ChartSeries);
  nameField?: string;
}>
const _componentSeriesTemplate = memo(
  (props: ISeriesTemplateProps) => {
    return React.createElement(NestedOption<ISeriesTemplateProps>, { ...props });
  }
);

const SeriesTemplate: typeof _componentSeriesTemplate & IElementDescriptor = Object.assign(_componentSeriesTemplate, {
  OptionName: "seriesTemplate",
})

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
const _componentShadow = memo(
  (props: IShadowProps) => {
    return React.createElement(NestedOption<IShadowProps>, { ...props });
  }
);

const Shadow: typeof _componentShadow & IElementDescriptor = Object.assign(_componentShadow, {
  OptionName: "shadow",
})

// owners:
// Chart
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
// ArgumentAxis
// ValueAxis
type IStripProps = React.PropsWithChildren<{
  color?: string;
  endValue?: Date | number | string;
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: HorizontalAlignment;
    text?: string;
    verticalAlignment?: VerticalAlignment;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  startValue?: Date | number | string;
}>
const _componentStrip = memo(
  (props: IStripProps) => {
    return React.createElement(NestedOption<IStripProps>, { ...props });
  }
);

const Strip: typeof _componentStrip & IElementDescriptor = Object.assign(_componentStrip, {
  OptionName: "strips",
  IsCollectionItem: true,
})

// owners:
// Strip
// Strip
type IStripLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  text?: string;
  verticalAlignment?: VerticalAlignment;
}>
const _componentStripLabel = memo(
  (props: IStripLabelProps) => {
    return React.createElement(NestedOption<IStripLabelProps>, { ...props });
  }
);

const StripLabel: typeof _componentStripLabel & IElementDescriptor = Object.assign(_componentStripLabel, {
  OptionName: "label",
})

// owners:
// ArgumentAxis
type IStripStyleProps = React.PropsWithChildren<{
  label?: Record<string, any> | {
    font?: ChartsFont;
    horizontalAlignment?: HorizontalAlignment;
    verticalAlignment?: VerticalAlignment;
  };
  paddingLeftRight?: number;
  paddingTopBottom?: number;
}>
const _componentStripStyle = memo(
  (props: IStripStyleProps) => {
    return React.createElement(NestedOption<IStripStyleProps>, { ...props });
  }
);

const StripStyle: typeof _componentStripStyle & IElementDescriptor = Object.assign(_componentStripStyle, {
  OptionName: "stripStyle",
  ExpectedChildren: {
    label: { optionName: "label", isCollectionItem: false },
    stripStyleLabel: { optionName: "label", isCollectionItem: false }
  },
})

// owners:
// StripStyle
type IStripStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  verticalAlignment?: VerticalAlignment;
}>
const _componentStripStyleLabel = memo(
  (props: IStripStyleLabelProps) => {
    return React.createElement(NestedOption<IStripStyleLabelProps>, { ...props });
  }
);

const StripStyleLabel: typeof _componentStripStyleLabel & IElementDescriptor = Object.assign(_componentStripStyleLabel, {
  OptionName: "label",
})

// owners:
// LegendTitle
// ChartTitle
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
})

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
const _componentTick = memo(
  (props: ITickProps) => {
    return React.createElement(NestedOption<ITickProps>, { ...props });
  }
);

const Tick: typeof _componentTick & IElementDescriptor = Object.assign(_componentTick, {
  OptionName: "tick",
})

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
const _componentTickInterval = memo(
  (props: ITickIntervalProps) => {
    return React.createElement(NestedOption<ITickIntervalProps>, { ...props });
  }
);

const TickInterval: typeof _componentTickInterval & IElementDescriptor = Object.assign(_componentTickInterval, {
  OptionName: "tickInterval",
})

// owners:
// ArgumentAxis
// ValueAxis
// CommonAxisSettings
// Legend
// Chart
type ITitleProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  font?: ChartsFont;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
  horizontalAlignment?: HorizontalAlignment;
  placeholderSize?: number;
  subtitle?: Record<string, any> | string | {
    font?: ChartsFont;
    offset?: number;
    text?: string;
    textOverflow?: TextOverflow;
    wordWrap?: WordWrap;
  };
  verticalAlignment?: VerticalEdge;
}>
const _componentTitle = memo(
  (props: ITitleProps) => {
    return React.createElement(NestedOption<ITitleProps>, { ...props });
  }
);

const Title: typeof _componentTitle & IElementDescriptor = Object.assign(_componentTitle, {
  OptionName: "title",
})

// owners:
// Chart
type ITooltipProps = React.PropsWithChildren<{
  argumentFormat?: LocalizationFormat;
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
  contentTemplate?: ((pointInfo: any, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((pointInfo: any) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationFormat;
  interactive?: boolean;
  location?: ChartTooltipLocation;
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
}>
const _componentTooltip = memo(
  (props: ITooltipProps) => {
    return React.createElement(NestedOption<ITooltipProps>, { ...props });
  }
);

const Tooltip: typeof _componentTooltip & IElementDescriptor = Object.assign(_componentTooltip, {
  OptionName: "tooltip",
  ExpectedChildren: {
    argumentFormat: { optionName: "argumentFormat", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    shadow: { optionName: "shadow", isCollectionItem: false },
    tooltipBorder: { optionName: "border", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent"
  }],
})

// owners:
// Tooltip
type ITooltipBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentTooltipBorder = memo(
  (props: ITooltipBorderProps) => {
    return React.createElement(NestedOption<ITooltipBorderProps>, { ...props });
  }
);

const TooltipBorder: typeof _componentTooltipBorder & IElementDescriptor = Object.assign(_componentTooltipBorder, {
  OptionName: "border",
})

// owners:
// PointImage
type IUrlProps = React.PropsWithChildren<{
  rangeMaxPoint?: string;
  rangeMinPoint?: string;
}>
const _componentUrl = memo(
  (props: IUrlProps) => {
    return React.createElement(NestedOption<IUrlProps>, { ...props });
  }
);

const Url: typeof _componentUrl & IElementDescriptor = Object.assign(_componentUrl, {
  OptionName: "url",
})

// owners:
// Chart
type IValueAxisProps = React.PropsWithChildren<{
  aggregatedPointsPosition?: AggregatedPointsPosition;
  allowDecimals?: boolean;
  autoBreaksEnabled?: boolean;
  axisDivisionFactor?: number;
  breaks?: Array<ScaleBreak> | {
    endValue?: Date | number | string;
    startValue?: Date | number | string;
  }[];
  breakStyle?: Record<string, any> | {
    color?: string;
    line?: ScaleBreakLineStyle;
    width?: number;
  };
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: DashStyle;
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      position?: RelativePosition;
      text?: string;
      verticalAlignment?: VerticalAlignment;
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    value?: Date | number | string;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      position?: RelativePosition;
      verticalAlignment?: VerticalAlignment;
      visible?: boolean;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    width?: number;
  };
  customPosition?: Date | number | string;
  discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
  endOnTick?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  inverted?: boolean;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    displayMode?: ChartLabelDisplayMode;
    font?: ChartsFont;
    format?: LocalizationFormat;
    indentFromAxis?: number;
    overlappingBehavior?: ChartsAxisLabelOverlap;
    position?: Position | RelativePosition;
    rotationAngle?: number;
    staggeringSpacing?: number;
    template?: ((data: { value: Date | number | string, valueText: string }, element: any) => string | any) | template;
    textOverflow?: TextOverflow;
    visible?: boolean;
    wordWrap?: WordWrap;
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
  minorTickInterval?: number | Record<string, any> | TimeInterval | {
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
  minVisualRangeLength?: number | Record<string, any> | TimeInterval | {
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
  position?: Position;
  showZero?: boolean;
  strips?: Array<Record<string, any>> | {
    color?: string;
    endValue?: Date | number | string;
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      text?: string;
      verticalAlignment?: VerticalAlignment;
    };
    paddingLeftRight?: number;
    paddingTopBottom?: number;
    startValue?: Date | number | string;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
      horizontalAlignment?: HorizontalAlignment;
      verticalAlignment?: VerticalAlignment;
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
  tickInterval?: number | Record<string, any> | TimeInterval | {
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
    alignment?: HorizontalAlignment;
    font?: ChartsFont;
    margin?: number;
    text?: string;
    textOverflow?: TextOverflow;
    wordWrap?: WordWrap;
  };
  type?: AxisScaleType;
  valueMarginsEnabled?: boolean;
  valueType?: ChartsDataType;
  visible?: boolean;
  visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  visualRangeUpdateMode?: VisualRangeUpdateMode;
  wholeRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  width?: number;
  defaultCategories?: Array<Date | number | string>;
  onCategoriesChange?: (value: Array<Date | number | string>) => void;
  defaultVisualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onVisualRangeChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>
const _componentValueAxis = memo(
  (props: IValueAxisProps) => {
    return React.createElement(NestedOption<IValueAxisProps>, { ...props });
  }
);

const ValueAxis: typeof _componentValueAxis & IElementDescriptor = Object.assign(_componentValueAxis, {
  OptionName: "valueAxis",
  IsCollectionItem: true,
  DefaultsProps: {
    defaultCategories: "categories",
    defaultVisualRange: "visualRange"
  },
  ExpectedChildren: {
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
  },
})

// owners:
// CommonSeriesSettings
type IValueErrorBarProps = React.PropsWithChildren<{
  color?: string;
  displayMode?: ValueErrorBarDisplayMode;
  edgeLength?: number;
  highValueField?: string;
  lineWidth?: number;
  lowValueField?: string;
  opacity?: number;
  type?: ValueErrorBarType;
  value?: number;
}>
const _componentValueErrorBar = memo(
  (props: IValueErrorBarProps) => {
    return React.createElement(NestedOption<IValueErrorBarProps>, { ...props });
  }
);

const ValueErrorBar: typeof _componentValueErrorBar & IElementDescriptor = Object.assign(_componentValueErrorBar, {
  OptionName: "valueErrorBar",
})

// owners:
// Crosshair
type IVerticalLineProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  label?: Record<string, any> | {
    backgroundColor?: string;
    customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat;
    visible?: boolean;
  };
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentVerticalLine = memo(
  (props: IVerticalLineProps) => {
    return React.createElement(NestedOption<IVerticalLineProps>, { ...props });
  }
);

const VerticalLine: typeof _componentVerticalLine & IElementDescriptor = Object.assign(_componentVerticalLine, {
  OptionName: "verticalLine",
  ExpectedChildren: {
    horizontalLineLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  },
})

// owners:
// ArgumentAxis
// ValueAxis
type IVisualRangeProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  length?: number | Record<string, any> | TimeInterval | {
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
const _componentVisualRange = memo(
  (props: IVisualRangeProps) => {
    return React.createElement(NestedOption<IVisualRangeProps>, { ...props });
  }
);

const VisualRange: typeof _componentVisualRange & IElementDescriptor = Object.assign(_componentVisualRange, {
  OptionName: "visualRange",
  DefaultsProps: {
    defaultEndValue: "endValue",
    defaultStartValue: "startValue"
  },
})

// owners:
// ArgumentAxis
// ValueAxis
type IWholeRangeProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  length?: number | Record<string, any> | TimeInterval | {
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
const _componentWholeRange = memo(
  (props: IWholeRangeProps) => {
    return React.createElement(NestedOption<IWholeRangeProps>, { ...props });
  }
);

const WholeRange: typeof _componentWholeRange & IElementDescriptor = Object.assign(_componentWholeRange, {
  OptionName: "wholeRange",
  DefaultsProps: {
    defaultEndValue: "endValue",
    defaultStartValue: "startValue"
  },
})

// owners:
// PointImage
type IWidthProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentWidth = memo(
  (props: IWidthProps) => {
    return React.createElement(NestedOption<IWidthProps>, { ...props });
  }
);

const Width: typeof _componentWidth & IElementDescriptor = Object.assign(_componentWidth, {
  OptionName: "width",
})

// owners:
// Chart
type IZoomAndPanProps = React.PropsWithChildren<{
  allowMouseWheel?: boolean;
  allowTouchGestures?: boolean;
  argumentAxis?: ChartZoomAndPanMode;
  dragBoxStyle?: Record<string, any> | {
    color?: string;
    opacity?: number;
  };
  dragToZoom?: boolean;
  panKey?: EventKeyModifier;
  valueAxis?: ChartZoomAndPanMode;
}>
const _componentZoomAndPan = memo(
  (props: IZoomAndPanProps) => {
    return React.createElement(NestedOption<IZoomAndPanProps>, { ...props });
  }
);

const ZoomAndPan: typeof _componentZoomAndPan & IElementDescriptor = Object.assign(_componentZoomAndPan, {
  OptionName: "zoomAndPan",
  ExpectedChildren: {
    dragBoxStyle: { optionName: "dragBoxStyle", isCollectionItem: false }
  },
})

export default Chart;
export {
  Chart,
  IChartOptions,
  ChartRef,
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

