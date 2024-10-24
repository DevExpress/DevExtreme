"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxChart, {
    Properties
} from "devextreme/viz/chart";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
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
const _componentAdaptiveLayout = (props: IAdaptiveLayoutProps) => {
  return React.createElement(NestedOption<IAdaptiveLayoutProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "adaptiveLayout",
    },
  });
};

const AdaptiveLayout = Object.assign<typeof _componentAdaptiveLayout, NestedComponentMeta>(_componentAdaptiveLayout, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type IAggregationProps = React.PropsWithChildren<{
  calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
  enabled?: boolean;
  method?: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom";
}>
const _componentAggregation = (props: IAggregationProps) => {
  return React.createElement(NestedOption<IAggregationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aggregation",
    },
  });
};

const Aggregation = Object.assign<typeof _componentAggregation, NestedComponentMeta>(_componentAggregation, {
  componentType: "option",
});

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
const _componentAggregationInterval = (props: IAggregationIntervalProps) => {
  return React.createElement(NestedOption<IAggregationIntervalProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aggregationInterval",
    },
  });
};

const AggregationInterval = Object.assign<typeof _componentAggregationInterval, NestedComponentMeta>(_componentAggregationInterval, {
  componentType: "option",
});

// owners:
// Chart
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: "easeOutCubic" | "linear";
  enabled?: boolean;
  maxPointCountSupported?: number;
}>
const _componentAnimation = (props: IAnimationProps) => {
  return React.createElement(NestedOption<IAnimationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "animation",
    },
  });
};

const Animation = Object.assign<typeof _componentAnimation, NestedComponentMeta>(_componentAnimation, {
  componentType: "option",
});

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
  tooltipRender?: (...params: any) => React.ReactNode;
  tooltipComponent?: React.ComponentType<any>;
}>
const _componentAnnotation = (props: IAnnotationProps) => {
  return React.createElement(NestedOption<IAnnotationProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Annotation = Object.assign<typeof _componentAnnotation, NestedComponentMeta>(_componentAnnotation, {
  componentType: "option",
});

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
const _componentAnnotationBorder = (props: IAnnotationBorderProps) => {
  return React.createElement(NestedOption<IAnnotationBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const AnnotationBorder = Object.assign<typeof _componentAnnotationBorder, NestedComponentMeta>(_componentAnnotationBorder, {
  componentType: "option",
});

// owners:
// Annotation
type IAnnotationImageProps = React.PropsWithChildren<{
  height?: number;
  url?: string;
  width?: number;
}>
const _componentAnnotationImage = (props: IAnnotationImageProps) => {
  return React.createElement(NestedOption<IAnnotationImageProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "image",
    },
  });
};

const AnnotationImage = Object.assign<typeof _componentAnnotationImage, NestedComponentMeta>(_componentAnnotationImage, {
  componentType: "option",
});

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
const _componentArgumentAxis = (props: IArgumentAxisProps) => {
  return React.createElement(NestedOption<IArgumentAxisProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const ArgumentAxis = Object.assign<typeof _componentArgumentAxis, NestedComponentMeta>(_componentArgumentAxis, {
  componentType: "option",
});

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
const _componentArgumentFormat = (props: IArgumentFormatProps) => {
  return React.createElement(NestedOption<IArgumentFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "argumentFormat",
    },
  });
};

const ArgumentFormat = Object.assign<typeof _componentArgumentFormat, NestedComponentMeta>(_componentArgumentFormat, {
  componentType: "option",
});

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
const _componentAxisConstantLineStyle = (props: IAxisConstantLineStyleProps) => {
  return React.createElement(NestedOption<IAxisConstantLineStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "constantLineStyle",
    },
  });
};

const AxisConstantLineStyle = Object.assign<typeof _componentAxisConstantLineStyle, NestedComponentMeta>(_componentAxisConstantLineStyle, {
  componentType: "option",
});

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
const _componentAxisConstantLineStyleLabel = (props: IAxisConstantLineStyleLabelProps) => {
  return React.createElement(NestedOption<IAxisConstantLineStyleLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const AxisConstantLineStyleLabel = Object.assign<typeof _componentAxisConstantLineStyleLabel, NestedComponentMeta>(_componentAxisConstantLineStyleLabel, {
  componentType: "option",
});

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
}>
const _componentAxisLabel = (props: IAxisLabelProps) => {
  return React.createElement(NestedOption<IAxisLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const AxisLabel = Object.assign<typeof _componentAxisLabel, NestedComponentMeta>(_componentAxisLabel, {
  componentType: "option",
});

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
const _componentAxisTitle = (props: IAxisTitleProps) => {
  return React.createElement(NestedOption<IAxisTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
    },
  });
};

const AxisTitle = Object.assign<typeof _componentAxisTitle, NestedComponentMeta>(_componentAxisTitle, {
  componentType: "option",
});

// owners:
// CommonPaneSettings
type IBackgroundColorProps = React.PropsWithChildren<{
  base?: string;
  fillId?: string;
}>
const _componentBackgroundColor = (props: IBackgroundColorProps) => {
  return React.createElement(NestedOption<IBackgroundColorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "backgroundColor",
    },
  });
};

const BackgroundColor = Object.assign<typeof _componentBackgroundColor, NestedComponentMeta>(_componentBackgroundColor, {
  componentType: "option",
});

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
const _componentBorder = (props: IBorderProps) => {
  return React.createElement(NestedOption<IBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const Border = Object.assign<typeof _componentBorder, NestedComponentMeta>(_componentBorder, {
  componentType: "option",
});

// owners:
// ArgumentAxis
// ValueAxis
type IBreakProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  startValue?: Date | number | string;
}>
const _componentBreak = (props: IBreakProps) => {
  return React.createElement(NestedOption<IBreakProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "breaks",
      IsCollectionItem: true,
    },
  });
};

const Break = Object.assign<typeof _componentBreak, NestedComponentMeta>(_componentBreak, {
  componentType: "option",
});

// owners:
// ArgumentAxis
type IBreakStyleProps = React.PropsWithChildren<{
  color?: string;
  line?: "straight" | "waved";
  width?: number;
}>
const _componentBreakStyle = (props: IBreakStyleProps) => {
  return React.createElement(NestedOption<IBreakStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "breakStyle",
    },
  });
};

const BreakStyle = Object.assign<typeof _componentBreakStyle, NestedComponentMeta>(_componentBreakStyle, {
  componentType: "option",
});

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
const _componentChartTitle = (props: IChartTitleProps) => {
  return React.createElement(NestedOption<IChartTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        chartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        font: { optionName: "font", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        subtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const ChartTitle = Object.assign<typeof _componentChartTitle, NestedComponentMeta>(_componentChartTitle, {
  componentType: "option",
});

// owners:
// ChartTitle
type IChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
const _componentChartTitleSubtitle = (props: IChartTitleSubtitleProps) => {
  return React.createElement(NestedOption<IChartTitleSubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const ChartTitleSubtitle = Object.assign<typeof _componentChartTitleSubtitle, NestedComponentMeta>(_componentChartTitleSubtitle, {
  componentType: "option",
});

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
const _componentColor = (props: IColorProps) => {
  return React.createElement(NestedOption<IColorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "color",
    },
  });
};

const Color = Object.assign<typeof _componentColor, NestedComponentMeta>(_componentColor, {
  componentType: "option",
});

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
  tooltipRender?: (...params: any) => React.ReactNode;
  tooltipComponent?: React.ComponentType<any>;
}>
const _componentCommonAnnotationSettings = (props: ICommonAnnotationSettingsProps) => {
  return React.createElement(NestedOption<ICommonAnnotationSettingsProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const CommonAnnotationSettings = Object.assign<typeof _componentCommonAnnotationSettings, NestedComponentMeta>(_componentCommonAnnotationSettings, {
  componentType: "option",
});

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
const _componentCommonAxisSettings = (props: ICommonAxisSettingsProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "commonAxisSettings",
      ExpectedChildren: {
        commonAxisSettingsConstantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
        commonAxisSettingsLabel: { optionName: "label", isCollectionItem: false },
        commonAxisSettingsTitle: { optionName: "title", isCollectionItem: false },
        constantLineStyle: { optionName: "constantLineStyle", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false },
        title: { optionName: "title", isCollectionItem: false }
      },
    },
  });
};

const CommonAxisSettings = Object.assign<typeof _componentCommonAxisSettings, NestedComponentMeta>(_componentCommonAxisSettings, {
  componentType: "option",
});

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
const _componentCommonAxisSettingsConstantLineStyle = (props: ICommonAxisSettingsConstantLineStyleProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsConstantLineStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "constantLineStyle",
      ExpectedChildren: {
        commonAxisSettingsConstantLineStyleLabel: { optionName: "label", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false }
      },
    },
  });
};

const CommonAxisSettingsConstantLineStyle = Object.assign<typeof _componentCommonAxisSettingsConstantLineStyle, NestedComponentMeta>(_componentCommonAxisSettingsConstantLineStyle, {
  componentType: "option",
});

// owners:
// CommonAxisSettingsConstantLineStyle
type ICommonAxisSettingsConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  position?: "inside" | "outside";
  visible?: boolean;
}>
const _componentCommonAxisSettingsConstantLineStyleLabel = (props: ICommonAxisSettingsConstantLineStyleLabelProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsConstantLineStyleLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const CommonAxisSettingsConstantLineStyleLabel = Object.assign<typeof _componentCommonAxisSettingsConstantLineStyleLabel, NestedComponentMeta>(_componentCommonAxisSettingsConstantLineStyleLabel, {
  componentType: "option",
});

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
}>
const _componentCommonAxisSettingsLabel = (props: ICommonAxisSettingsLabelProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const CommonAxisSettingsLabel = Object.assign<typeof _componentCommonAxisSettingsLabel, NestedComponentMeta>(_componentCommonAxisSettingsLabel, {
  componentType: "option",
});

// owners:
// CommonAxisSettings
type ICommonAxisSettingsTitleProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  font?: ChartsFont;
  margin?: number;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
const _componentCommonAxisSettingsTitle = (props: ICommonAxisSettingsTitleProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
    },
  });
};

const CommonAxisSettingsTitle = Object.assign<typeof _componentCommonAxisSettingsTitle, NestedComponentMeta>(_componentCommonAxisSettingsTitle, {
  componentType: "option",
});

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
const _componentCommonPaneSettings = (props: ICommonPaneSettingsProps) => {
  return React.createElement(NestedOption<ICommonPaneSettingsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "commonPaneSettings",
      ExpectedChildren: {
        backgroundColor: { optionName: "backgroundColor", isCollectionItem: false },
        border: { optionName: "border", isCollectionItem: false },
        paneBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const CommonPaneSettings = Object.assign<typeof _componentCommonPaneSettings, NestedComponentMeta>(_componentCommonPaneSettings, {
  componentType: "option",
});

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
const _componentCommonSeriesSettings = (props: ICommonSeriesSettingsProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const CommonSeriesSettings = Object.assign<typeof _componentCommonSeriesSettings, NestedComponentMeta>(_componentCommonSeriesSettings, {
  componentType: "option",
});

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
const _componentCommonSeriesSettingsHoverStyle = (props: ICommonSeriesSettingsHoverStyleProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const CommonSeriesSettingsHoverStyle = Object.assign<typeof _componentCommonSeriesSettingsHoverStyle, NestedComponentMeta>(_componentCommonSeriesSettingsHoverStyle, {
  componentType: "option",
});

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
const _componentCommonSeriesSettingsLabel = (props: ICommonSeriesSettingsLabelProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        argumentFormat: { optionName: "argumentFormat", isCollectionItem: false },
        border: { optionName: "border", isCollectionItem: false },
        connector: { optionName: "connector", isCollectionItem: false },
        font: { optionName: "font", isCollectionItem: false },
        format: { optionName: "format", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const CommonSeriesSettingsLabel = Object.assign<typeof _componentCommonSeriesSettingsLabel, NestedComponentMeta>(_componentCommonSeriesSettingsLabel, {
  componentType: "option",
});

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
const _componentCommonSeriesSettingsSelectionStyle = (props: ICommonSeriesSettingsSelectionStyleProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsSelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const CommonSeriesSettingsSelectionStyle = Object.assign<typeof _componentCommonSeriesSettingsSelectionStyle, NestedComponentMeta>(_componentCommonSeriesSettingsSelectionStyle, {
  componentType: "option",
});

// owners:
// CommonSeriesSettingsLabel
type IConnectorProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
const _componentConnector = (props: IConnectorProps) => {
  return React.createElement(NestedOption<IConnectorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "connector",
    },
  });
};

const Connector = Object.assign<typeof _componentConnector, NestedComponentMeta>(_componentConnector, {
  componentType: "option",
});

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
const _componentConstantLine = (props: IConstantLineProps) => {
  return React.createElement(NestedOption<IConstantLineProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "constantLines",
      IsCollectionItem: true,
    },
  });
};

const ConstantLine = Object.assign<typeof _componentConstantLine, NestedComponentMeta>(_componentConstantLine, {
  componentType: "option",
});

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
const _componentConstantLineLabel = (props: IConstantLineLabelProps) => {
  return React.createElement(NestedOption<IConstantLineLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const ConstantLineLabel = Object.assign<typeof _componentConstantLineLabel, NestedComponentMeta>(_componentConstantLineLabel, {
  componentType: "option",
});

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
const _componentConstantLineStyle = (props: IConstantLineStyleProps) => {
  return React.createElement(NestedOption<IConstantLineStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "constantLineStyle",
    },
  });
};

const ConstantLineStyle = Object.assign<typeof _componentConstantLineStyle, NestedComponentMeta>(_componentConstantLineStyle, {
  componentType: "option",
});

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
const _componentCrosshair = (props: ICrosshairProps) => {
  return React.createElement(NestedOption<ICrosshairProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "crosshair",
      ExpectedChildren: {
        horizontalLine: { optionName: "horizontalLine", isCollectionItem: false },
        horizontalLineLabel: { optionName: "label", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false },
        verticalLine: { optionName: "verticalLine", isCollectionItem: false }
      },
    },
  });
};

const Crosshair = Object.assign<typeof _componentCrosshair, NestedComponentMeta>(_componentCrosshair, {
  componentType: "option",
});

// owners:
// Chart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: any, b: any) => number);
}>
const _componentDataPrepareSettings = (props: IDataPrepareSettingsProps) => {
  return React.createElement(NestedOption<IDataPrepareSettingsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dataPrepareSettings",
    },
  });
};

const DataPrepareSettings = Object.assign<typeof _componentDataPrepareSettings, NestedComponentMeta>(_componentDataPrepareSettings, {
  componentType: "option",
});

// owners:
// ZoomAndPan
type IDragBoxStyleProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
}>
const _componentDragBoxStyle = (props: IDragBoxStyleProps) => {
  return React.createElement(NestedOption<IDragBoxStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dragBoxStyle",
    },
  });
};

const DragBoxStyle = Object.assign<typeof _componentDragBoxStyle, NestedComponentMeta>(_componentDragBoxStyle, {
  componentType: "option",
});

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
const _componentExport = (props: IExportProps) => {
  return React.createElement(NestedOption<IExportProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "export",
    },
  });
};

const Export = Object.assign<typeof _componentExport, NestedComponentMeta>(_componentExport, {
  componentType: "option",
});

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
const _componentFont = (props: IFontProps) => {
  return React.createElement(NestedOption<IFontProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "font",
    },
  });
};

const Font = Object.assign<typeof _componentFont, NestedComponentMeta>(_componentFont, {
  componentType: "option",
});

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
const _componentFormat = (props: IFormatProps) => {
  return React.createElement(NestedOption<IFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "format",
    },
  });
};

const Format = Object.assign<typeof _componentFormat, NestedComponentMeta>(_componentFormat, {
  componentType: "option",
});

// owners:
// ArgumentAxis
type IGridProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentGrid = (props: IGridProps) => {
  return React.createElement(NestedOption<IGridProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "grid",
    },
  });
};

const Grid = Object.assign<typeof _componentGrid, NestedComponentMeta>(_componentGrid, {
  componentType: "option",
});

// owners:
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsSelectionStyle
type IHatchingProps = React.PropsWithChildren<{
  direction?: "left" | "none" | "right";
  opacity?: number;
  step?: number;
  width?: number;
}>
const _componentHatching = (props: IHatchingProps) => {
  return React.createElement(NestedOption<IHatchingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hatching",
    },
  });
};

const Hatching = Object.assign<typeof _componentHatching, NestedComponentMeta>(_componentHatching, {
  componentType: "option",
});

// owners:
// PointImage
type IHeightProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentHeight = (props: IHeightProps) => {
  return React.createElement(NestedOption<IHeightProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "height",
    },
  });
};

const Height = Object.assign<typeof _componentHeight, NestedComponentMeta>(_componentHeight, {
  componentType: "option",
});

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
const _componentHorizontalLine = (props: IHorizontalLineProps) => {
  return React.createElement(NestedOption<IHorizontalLineProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "horizontalLine",
      ExpectedChildren: {
        horizontalLineLabel: { optionName: "label", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false }
      },
    },
  });
};

const HorizontalLine = Object.assign<typeof _componentHorizontalLine, NestedComponentMeta>(_componentHorizontalLine, {
  componentType: "option",
});

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
const _componentHorizontalLineLabel = (props: IHorizontalLineLabelProps) => {
  return React.createElement(NestedOption<IHorizontalLineLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const HorizontalLineLabel = Object.assign<typeof _componentHorizontalLineLabel, NestedComponentMeta>(_componentHorizontalLineLabel, {
  componentType: "option",
});

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
const _componentHoverStyle = (props: IHoverStyleProps) => {
  return React.createElement(NestedOption<IHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
    },
  });
};

const HoverStyle = Object.assign<typeof _componentHoverStyle, NestedComponentMeta>(_componentHoverStyle, {
  componentType: "option",
});

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
const _componentImage = (props: IImageProps) => {
  return React.createElement(NestedOption<IImageProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "image",
    },
  });
};

const Image = Object.assign<typeof _componentImage, NestedComponentMeta>(_componentImage, {
  componentType: "option",
});

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
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

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
}>
const _componentLegend = (props: ILegendProps) => {
  return React.createElement(NestedOption<ILegendProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Legend = Object.assign<typeof _componentLegend, NestedComponentMeta>(_componentLegend, {
  componentType: "option",
});

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
const _componentLegendTitle = (props: ILegendTitleProps) => {
  return React.createElement(NestedOption<ILegendTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        legendTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        subtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const LegendTitle = Object.assign<typeof _componentLegendTitle, NestedComponentMeta>(_componentLegendTitle, {
  componentType: "option",
});

// owners:
// LegendTitle
type ILegendTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
}>
const _componentLegendTitleSubtitle = (props: ILegendTitleSubtitleProps) => {
  return React.createElement(NestedOption<ILegendTitleSubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const LegendTitleSubtitle = Object.assign<typeof _componentLegendTitleSubtitle, NestedComponentMeta>(_componentLegendTitleSubtitle, {
  componentType: "option",
});

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
const _componentLength = (props: ILengthProps) => {
  return React.createElement(NestedOption<ILengthProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "length",
    },
  });
};

const Length = Object.assign<typeof _componentLength, NestedComponentMeta>(_componentLength, {
  componentType: "option",
});

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
const _componentLoadingIndicator = (props: ILoadingIndicatorProps) => {
  return React.createElement(NestedOption<ILoadingIndicatorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "loadingIndicator",
      DefaultsProps: {
        defaultShow: "show"
      },
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const LoadingIndicator = Object.assign<typeof _componentLoadingIndicator, NestedComponentMeta>(_componentLoadingIndicator, {
  componentType: "option",
});

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
const _componentMargin = (props: IMarginProps) => {
  return React.createElement(NestedOption<IMarginProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "margin",
    },
  });
};

const Margin = Object.assign<typeof _componentMargin, NestedComponentMeta>(_componentMargin, {
  componentType: "option",
});

// owners:
// ArgumentAxis
type IMinorGridProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentMinorGrid = (props: IMinorGridProps) => {
  return React.createElement(NestedOption<IMinorGridProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minorGrid",
    },
  });
};

const MinorGrid = Object.assign<typeof _componentMinorGrid, NestedComponentMeta>(_componentMinorGrid, {
  componentType: "option",
});

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
const _componentMinorTick = (props: IMinorTickProps) => {
  return React.createElement(NestedOption<IMinorTickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minorTick",
    },
  });
};

const MinorTick = Object.assign<typeof _componentMinorTick, NestedComponentMeta>(_componentMinorTick, {
  componentType: "option",
});

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
const _componentMinorTickInterval = (props: IMinorTickIntervalProps) => {
  return React.createElement(NestedOption<IMinorTickIntervalProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minorTickInterval",
    },
  });
};

const MinorTickInterval = Object.assign<typeof _componentMinorTickInterval, NestedComponentMeta>(_componentMinorTickInterval, {
  componentType: "option",
});

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
const _componentMinVisualRangeLength = (props: IMinVisualRangeLengthProps) => {
  return React.createElement(NestedOption<IMinVisualRangeLengthProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minVisualRangeLength",
    },
  });
};

const MinVisualRangeLength = Object.assign<typeof _componentMinVisualRangeLength, NestedComponentMeta>(_componentMinVisualRangeLength, {
  componentType: "option",
});

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
const _componentPane = (props: IPaneProps) => {
  return React.createElement(NestedOption<IPaneProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "panes",
      IsCollectionItem: true,
    },
  });
};

const Pane = Object.assign<typeof _componentPane, NestedComponentMeta>(_componentPane, {
  componentType: "option",
});

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
const _componentPaneBorder = (props: IPaneBorderProps) => {
  return React.createElement(NestedOption<IPaneBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const PaneBorder = Object.assign<typeof _componentPaneBorder, NestedComponentMeta>(_componentPaneBorder, {
  componentType: "option",
});

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
const _componentPoint = (props: IPointProps) => {
  return React.createElement(NestedOption<IPointProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Point = Object.assign<typeof _componentPoint, NestedComponentMeta>(_componentPoint, {
  componentType: "option",
});

// owners:
// Point
// PointHoverStyle
// PointSelectionStyle
type IPointBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
const _componentPointBorder = (props: IPointBorderProps) => {
  return React.createElement(NestedOption<IPointBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const PointBorder = Object.assign<typeof _componentPointBorder, NestedComponentMeta>(_componentPointBorder, {
  componentType: "option",
});

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
const _componentPointHoverStyle = (props: IPointHoverStyleProps) => {
  return React.createElement(NestedOption<IPointHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        pointBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const PointHoverStyle = Object.assign<typeof _componentPointHoverStyle, NestedComponentMeta>(_componentPointHoverStyle, {
  componentType: "option",
});

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
const _componentPointImage = (props: IPointImageProps) => {
  return React.createElement(NestedOption<IPointImageProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "image",
      ExpectedChildren: {
        height: { optionName: "height", isCollectionItem: false },
        url: { optionName: "url", isCollectionItem: false },
        width: { optionName: "width", isCollectionItem: false }
      },
    },
  });
};

const PointImage = Object.assign<typeof _componentPointImage, NestedComponentMeta>(_componentPointImage, {
  componentType: "option",
});

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
const _componentPointSelectionStyle = (props: IPointSelectionStyleProps) => {
  return React.createElement(NestedOption<IPointSelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        pointBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const PointSelectionStyle = Object.assign<typeof _componentPointSelectionStyle, NestedComponentMeta>(_componentPointSelectionStyle, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type IReductionProps = React.PropsWithChildren<{
  color?: string;
  level?: "close" | "high" | "low" | "open";
}>
const _componentReduction = (props: IReductionProps) => {
  return React.createElement(NestedOption<IReductionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "reduction",
    },
  });
};

const Reduction = Object.assign<typeof _componentReduction, NestedComponentMeta>(_componentReduction, {
  componentType: "option",
});

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
const _componentScrollBar = (props: IScrollBarProps) => {
  return React.createElement(NestedOption<IScrollBarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "scrollBar",
    },
  });
};

const ScrollBar = Object.assign<typeof _componentScrollBar, NestedComponentMeta>(_componentScrollBar, {
  componentType: "option",
});

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
const _componentSelectionStyle = (props: ISelectionStyleProps) => {
  return React.createElement(NestedOption<ISelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
    },
  });
};

const SelectionStyle = Object.assign<typeof _componentSelectionStyle, NestedComponentMeta>(_componentSelectionStyle, {
  componentType: "option",
});

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
const _componentSeries = (props: ISeriesProps) => {
  return React.createElement(NestedOption<ISeriesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "series",
      IsCollectionItem: true,
    },
  });
};

const Series = Object.assign<typeof _componentSeries, NestedComponentMeta>(_componentSeries, {
  componentType: "option",
});

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
const _componentSeriesBorder = (props: ISeriesBorderProps) => {
  return React.createElement(NestedOption<ISeriesBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const SeriesBorder = Object.assign<typeof _componentSeriesBorder, NestedComponentMeta>(_componentSeriesBorder, {
  componentType: "option",
});

// owners:
// Chart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => ChartSeries);
  nameField?: string;
}>
const _componentSeriesTemplate = (props: ISeriesTemplateProps) => {
  return React.createElement(NestedOption<ISeriesTemplateProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "seriesTemplate",
    },
  });
};

const SeriesTemplate = Object.assign<typeof _componentSeriesTemplate, NestedComponentMeta>(_componentSeriesTemplate, {
  componentType: "option",
});

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
const _componentShadow = (props: IShadowProps) => {
  return React.createElement(NestedOption<IShadowProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "shadow",
    },
  });
};

const Shadow = Object.assign<typeof _componentShadow, NestedComponentMeta>(_componentShadow, {
  componentType: "option",
});

// owners:
// Chart
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
const _componentSize = (props: ISizeProps) => {
  return React.createElement(NestedOption<ISizeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "size",
    },
  });
};

const Size = Object.assign<typeof _componentSize, NestedComponentMeta>(_componentSize, {
  componentType: "option",
});

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
const _componentStrip = (props: IStripProps) => {
  return React.createElement(NestedOption<IStripProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "strips",
      IsCollectionItem: true,
    },
  });
};

const Strip = Object.assign<typeof _componentStrip, NestedComponentMeta>(_componentStrip, {
  componentType: "option",
});

// owners:
// Strip
// Strip
type IStripLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  text?: string;
  verticalAlignment?: "bottom" | "center" | "top";
}>
const _componentStripLabel = (props: IStripLabelProps) => {
  return React.createElement(NestedOption<IStripLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const StripLabel = Object.assign<typeof _componentStripLabel, NestedComponentMeta>(_componentStripLabel, {
  componentType: "option",
});

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
const _componentStripStyle = (props: IStripStyleProps) => {
  return React.createElement(NestedOption<IStripStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "stripStyle",
      ExpectedChildren: {
        label: { optionName: "label", isCollectionItem: false },
        stripStyleLabel: { optionName: "label", isCollectionItem: false }
      },
    },
  });
};

const StripStyle = Object.assign<typeof _componentStripStyle, NestedComponentMeta>(_componentStripStyle, {
  componentType: "option",
});

// owners:
// StripStyle
type IStripStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  verticalAlignment?: "bottom" | "center" | "top";
}>
const _componentStripStyleLabel = (props: IStripStyleLabelProps) => {
  return React.createElement(NestedOption<IStripStyleLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const StripStyleLabel = Object.assign<typeof _componentStripStyleLabel, NestedComponentMeta>(_componentStripStyleLabel, {
  componentType: "option",
});

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
const _componentSubtitle = (props: ISubtitleProps) => {
  return React.createElement(NestedOption<ISubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
    },
  });
};

const Subtitle = Object.assign<typeof _componentSubtitle, NestedComponentMeta>(_componentSubtitle, {
  componentType: "option",
});

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
const _componentTick = (props: ITickProps) => {
  return React.createElement(NestedOption<ITickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tick",
    },
  });
};

const Tick = Object.assign<typeof _componentTick, NestedComponentMeta>(_componentTick, {
  componentType: "option",
});

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
const _componentTickInterval = (props: ITickIntervalProps) => {
  return React.createElement(NestedOption<ITickIntervalProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tickInterval",
    },
  });
};

const TickInterval = Object.assign<typeof _componentTickInterval, NestedComponentMeta>(_componentTickInterval, {
  componentType: "option",
});

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
const _componentTitle = (props: ITitleProps) => {
  return React.createElement(NestedOption<ITitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
    },
  });
};

const Title = Object.assign<typeof _componentTitle, NestedComponentMeta>(_componentTitle, {
  componentType: "option",
});

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
}>
const _componentTooltip = (props: ITooltipProps) => {
  return React.createElement(NestedOption<ITooltipProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Tooltip = Object.assign<typeof _componentTooltip, NestedComponentMeta>(_componentTooltip, {
  componentType: "option",
});

// owners:
// Tooltip
type ITooltipBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentTooltipBorder = (props: ITooltipBorderProps) => {
  return React.createElement(NestedOption<ITooltipBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const TooltipBorder = Object.assign<typeof _componentTooltipBorder, NestedComponentMeta>(_componentTooltipBorder, {
  componentType: "option",
});

// owners:
// PointImage
type IUrlProps = React.PropsWithChildren<{
  rangeMaxPoint?: string;
  rangeMinPoint?: string;
}>
const _componentUrl = (props: IUrlProps) => {
  return React.createElement(NestedOption<IUrlProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "url",
    },
  });
};

const Url = Object.assign<typeof _componentUrl, NestedComponentMeta>(_componentUrl, {
  componentType: "option",
});

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
const _componentValueAxis = (props: IValueAxisProps) => {
  return React.createElement(NestedOption<IValueAxisProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const ValueAxis = Object.assign<typeof _componentValueAxis, NestedComponentMeta>(_componentValueAxis, {
  componentType: "option",
});

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
const _componentValueErrorBar = (props: IValueErrorBarProps) => {
  return React.createElement(NestedOption<IValueErrorBarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "valueErrorBar",
    },
  });
};

const ValueErrorBar = Object.assign<typeof _componentValueErrorBar, NestedComponentMeta>(_componentValueErrorBar, {
  componentType: "option",
});

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
const _componentVerticalLine = (props: IVerticalLineProps) => {
  return React.createElement(NestedOption<IVerticalLineProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "verticalLine",
      ExpectedChildren: {
        horizontalLineLabel: { optionName: "label", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false }
      },
    },
  });
};

const VerticalLine = Object.assign<typeof _componentVerticalLine, NestedComponentMeta>(_componentVerticalLine, {
  componentType: "option",
});

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
const _componentVisualRange = (props: IVisualRangeProps) => {
  return React.createElement(NestedOption<IVisualRangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "visualRange",
      DefaultsProps: {
        defaultEndValue: "endValue",
        defaultStartValue: "startValue"
      },
    },
  });
};

const VisualRange = Object.assign<typeof _componentVisualRange, NestedComponentMeta>(_componentVisualRange, {
  componentType: "option",
});

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
const _componentWholeRange = (props: IWholeRangeProps) => {
  return React.createElement(NestedOption<IWholeRangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "wholeRange",
      DefaultsProps: {
        defaultEndValue: "endValue",
        defaultStartValue: "startValue"
      },
    },
  });
};

const WholeRange = Object.assign<typeof _componentWholeRange, NestedComponentMeta>(_componentWholeRange, {
  componentType: "option",
});

// owners:
// PointImage
type IWidthProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentWidth = (props: IWidthProps) => {
  return React.createElement(NestedOption<IWidthProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "width",
    },
  });
};

const Width = Object.assign<typeof _componentWidth, NestedComponentMeta>(_componentWidth, {
  componentType: "option",
});

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
const _componentZoomAndPan = (props: IZoomAndPanProps) => {
  return React.createElement(NestedOption<IZoomAndPanProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "zoomAndPan",
      ExpectedChildren: {
        dragBoxStyle: { optionName: "dragBoxStyle", isCollectionItem: false }
      },
    },
  });
};

const ZoomAndPan = Object.assign<typeof _componentZoomAndPan, NestedComponentMeta>(_componentZoomAndPan, {
  componentType: "option",
});

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

