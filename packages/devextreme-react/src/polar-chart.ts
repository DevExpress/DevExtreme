"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPolarChart, {
    Properties
} from "devextreme/viz/polar_chart";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, PointClickEvent, SeriesClickEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomEndEvent, ZoomStartEvent, dxPolarChartAnnotationConfig, dxPolarChartCommonAnnotationConfig, PolarChartSeriesType, PolarChartSeries, ValueAxisVisualRangeUpdateMode } from "devextreme/viz/polar_chart";
import type { AnimationEaseMode, DashStyle, Font as ChartsFont, TextOverflow, AnnotationType, WordWrap, ChartsDataType, DiscreteAxisDivisionMode, ArgumentAxisHoverMode, LabelOverlap, TimeInterval, AxisScaleType, ChartsColor, SeriesHoverMode, HatchDirection, RelativePosition, PointInteractionMode, PointSymbol, SeriesSelectionMode, ValueErrorBarDisplayMode, ValueErrorBarType, LegendItem, LegendHoverMode } from "devextreme/common/charts";
import type { template, Format as CommonFormat, ExportFormat, HorizontalAlignment, Position, Orientation, VerticalEdge } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";

import type * as CommonChartTypes from "devextreme/common/charts";

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

interface PolarChartRef {
  instance: () => dxPolarChart;
}

const PolarChart = memo(
  forwardRef(
    (props: React.PropsWithChildren<IPolarChartOptions>, ref: ForwardedRef<PolarChartRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show","valueAxis","valueAxis.visualRange"]), []);
      const independentEvents = useMemo(() => (["onArgumentAxisClick","onDisposing","onDone","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onLegendClick","onPointClick","onSeriesClick","onTooltipHidden","onTooltipShown","onZoomEnd","onZoomStart"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
        defaultValueAxis: "valueAxis",
      }), []);

      const expectedChildren = useMemo(() => ({
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
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IPolarChartOptions>>, {
          WidgetClass: dxPolarChart,
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
) as (props: React.PropsWithChildren<IPolarChartOptions> & { ref?: Ref<PolarChartRef> }) => ReactElement | null;


// owners:
// PolarChart
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
// PolarChart
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: AnimationEaseMode;
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
// PolarChart
type IAnnotationProps = React.PropsWithChildren<{
  allowDragging?: boolean;
  angle?: number | undefined;
  argument?: Date | number | string | undefined;
  arrowLength?: number;
  arrowWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: DashStyle;
    opacity?: number | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => Record<string, any>) | undefined;
  data?: any;
  description?: string | undefined;
  font?: ChartsFont;
  height?: number | undefined;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string | undefined;
    width?: number;
  };
  name?: string | undefined;
  offsetX?: number | undefined;
  offsetY?: number | undefined;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  radius?: number | undefined;
  series?: string | undefined;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxPolarChartCommonAnnotationConfig | any, element: any) => string | any) | template | undefined;
  text?: string | undefined;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPolarChartAnnotationConfig | any, element: any) => string | any) | template | undefined;
  type?: AnnotationType | undefined;
  value?: Date | number | string | undefined;
  width?: number | undefined;
  wordWrap?: WordWrap;
  x?: number | undefined;
  y?: number | undefined;
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
  dashStyle?: DashStyle;
  opacity?: number | undefined;
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
// PolarChart
type IArgumentAxisProps = React.PropsWithChildren<{
  allowDecimals?: boolean | undefined;
  argumentType?: ChartsDataType | undefined;
  axisDivisionFactor?: number;
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: DashStyle;
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string | undefined;
      visible?: boolean;
    };
    value?: Date | number | string | undefined;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      font?: ChartsFont;
      visible?: boolean;
    };
    width?: number;
  };
  discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
  endOnTick?: boolean | undefined;
  firstPointOnStartAngle?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number | undefined;
    visible?: boolean;
    width?: number;
  };
  hoverMode?: ArgumentAxisHoverMode;
  inverted?: boolean;
  label?: Record<string, any> | {
    customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat | undefined;
    indentFromAxis?: number;
    overlappingBehavior?: LabelOverlap;
    visible?: boolean;
  };
  linearThreshold?: number | undefined;
  logarithmBase?: number;
  minorGrid?: Record<string, any> | {
    color?: string;
    opacity?: number | undefined;
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
  minorTickCount?: number | undefined;
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
  opacity?: number | undefined;
  originValue?: number | undefined;
  period?: number | undefined;
  startAngle?: number;
  strips?: Array<Record<string, any>> | {
    color?: string | undefined;
    endValue?: Date | number | string | undefined;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string | undefined;
    };
    startValue?: Date | number | string | undefined;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
    };
  };
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number | undefined;
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
  type?: AxisScaleType | undefined;
  visible?: boolean;
  width?: number;
}>
const _componentArgumentAxis = (props: IArgumentAxisProps) => {
  return React.createElement(NestedOption<IArgumentAxisProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "argumentAxis",
      ExpectedChildren: {
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
      },
    },
  });
};

const ArgumentAxis = Object.assign<typeof _componentArgumentAxis, NestedComponentMeta>(_componentArgumentAxis, {
  componentType: "option",
});

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
const _componentArgumentAxisMinorTick = (props: IArgumentAxisMinorTickProps) => {
  return React.createElement(NestedOption<IArgumentAxisMinorTickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minorTick",
    },
  });
};

const ArgumentAxisMinorTick = Object.assign<typeof _componentArgumentAxisMinorTick, NestedComponentMeta>(_componentArgumentAxisMinorTick, {
  componentType: "option",
});

// owners:
// ArgumentAxis
type IArgumentAxisTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number | undefined;
  shift?: number;
  visible?: boolean;
  width?: number;
}>
const _componentArgumentAxisTick = (props: IArgumentAxisTickProps) => {
  return React.createElement(NestedOption<IArgumentAxisTickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tick",
    },
  });
};

const ArgumentAxisTick = Object.assign<typeof _componentArgumentAxisTick, NestedComponentMeta>(_componentArgumentAxisTick, {
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
  type?: CommonFormat | string;
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
type IAxisLabelProps = React.PropsWithChildren<{
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  indentFromAxis?: number;
  overlappingBehavior?: LabelOverlap;
  visible?: boolean;
}>
const _componentAxisLabel = (props: IAxisLabelProps) => {
  return React.createElement(NestedOption<IAxisLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const AxisLabel = Object.assign<typeof _componentAxisLabel, NestedComponentMeta>(_componentAxisLabel, {
  componentType: "option",
});

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
  color?: string | undefined;
  cornerRadius?: number;
  dashStyle?: DashStyle | undefined;
  opacity?: number | undefined;
  visible?: boolean;
  width?: number;
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
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// Point
// PointHoverStyle
// PointSelectionStyle
// CommonSeriesSettingsSelectionStyle
type IColorProps = React.PropsWithChildren<{
  base?: string | undefined;
  fillId?: string | undefined;
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
// PolarChart
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
  angle?: number | undefined;
  argument?: Date | number | string | undefined;
  arrowLength?: number;
  arrowWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: DashStyle;
    opacity?: number | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => Record<string, any>) | undefined;
  data?: any;
  description?: string | undefined;
  font?: ChartsFont;
  height?: number | undefined;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string | undefined;
    width?: number;
  };
  offsetX?: number | undefined;
  offsetY?: number | undefined;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  radius?: number | undefined;
  series?: string | undefined;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxPolarChartCommonAnnotationConfig | any, element: any) => string | any) | template | undefined;
  text?: string | undefined;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPolarChartAnnotationConfig | any, element: any) => string | any) | template | undefined;
  type?: AnnotationType | undefined;
  value?: Date | number | string | undefined;
  width?: number | undefined;
  wordWrap?: WordWrap;
  x?: number | undefined;
  y?: number | undefined;
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
// PolarChart
type ICommonAxisSettingsProps = React.PropsWithChildren<{
  allowDecimals?: boolean | undefined;
  color?: string;
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      font?: ChartsFont;
      visible?: boolean;
    };
    width?: number;
  };
  discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
  endOnTick?: boolean | undefined;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number | undefined;
    visible?: boolean;
    width?: number;
  };
  inverted?: boolean;
  label?: Record<string, any> | {
    font?: ChartsFont;
    indentFromAxis?: number;
    overlappingBehavior?: LabelOverlap;
    visible?: boolean;
  };
  minorGrid?: Record<string, any> | {
    color?: string;
    opacity?: number | undefined;
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
  opacity?: number | undefined;
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
    };
  };
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number | undefined;
    visible?: boolean;
    width?: number;
  };
  visible?: boolean;
  width?: number;
}>
const _componentCommonAxisSettings = (props: ICommonAxisSettingsProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "commonAxisSettings",
      ExpectedChildren: {
        commonAxisSettingsLabel: { optionName: "label", isCollectionItem: false },
        commonAxisSettingsMinorTick: { optionName: "minorTick", isCollectionItem: false },
        commonAxisSettingsTick: { optionName: "tick", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false },
        minorTick: { optionName: "minorTick", isCollectionItem: false },
        tick: { optionName: "tick", isCollectionItem: false }
      },
    },
  });
};

const CommonAxisSettings = Object.assign<typeof _componentCommonAxisSettings, NestedComponentMeta>(_componentCommonAxisSettings, {
  componentType: "option",
});

// owners:
// CommonAxisSettings
type ICommonAxisSettingsLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  indentFromAxis?: number;
  overlappingBehavior?: LabelOverlap;
  visible?: boolean;
}>
const _componentCommonAxisSettingsLabel = (props: ICommonAxisSettingsLabelProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const CommonAxisSettingsLabel = Object.assign<typeof _componentCommonAxisSettingsLabel, NestedComponentMeta>(_componentCommonAxisSettingsLabel, {
  componentType: "option",
});

// owners:
// CommonAxisSettings
type ICommonAxisSettingsMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentCommonAxisSettingsMinorTick = (props: ICommonAxisSettingsMinorTickProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsMinorTickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minorTick",
    },
  });
};

const CommonAxisSettingsMinorTick = Object.assign<typeof _componentCommonAxisSettingsMinorTick, NestedComponentMeta>(_componentCommonAxisSettingsMinorTick, {
  componentType: "option",
});

// owners:
// CommonAxisSettings
// ValueAxis
type ICommonAxisSettingsTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number | undefined;
  visible?: boolean;
  width?: number;
}>
const _componentCommonAxisSettingsTick = (props: ICommonAxisSettingsTickProps) => {
  return React.createElement(NestedOption<ICommonAxisSettingsTickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tick",
    },
  });
};

const CommonAxisSettingsTick = Object.assign<typeof _componentCommonAxisSettingsTick, NestedComponentMeta>(_componentCommonAxisSettingsTick, {
  componentType: "option",
});

// owners:
// PolarChart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  area?: any;
  argumentField?: string;
  bar?: any;
  barPadding?: number | undefined;
  barWidth?: number | undefined;
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  closed?: boolean;
  color?: ChartsColor | string | undefined;
  dashStyle?: DashStyle;
  hoverMode?: SeriesHoverMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
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
  label?: Record<string, any> | {
    argumentFormat?: LocalizationFormat | undefined;
    backgroundColor?: string | undefined;
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    connector?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean;
      width?: number;
    };
    customizeText?: ((pointInfo: any) => string);
    displayFormat?: string | undefined;
    font?: ChartsFont;
    format?: LocalizationFormat | undefined;
    position?: RelativePosition;
    rotationAngle?: number;
    showForZeroValues?: boolean;
    visible?: boolean;
  };
  line?: any;
  maxLabelCount?: number | undefined;
  minBarSize?: number | undefined;
  opacity?: number;
  point?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    hoverMode?: PointInteractionMode;
    hoverStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string | undefined;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string | undefined;
      size?: number;
    };
    image?: Record<string, any> | string | undefined | {
      height?: number;
      url?: string | undefined;
      width?: number;
    };
    selectionMode?: PointInteractionMode;
    selectionStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string | undefined;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string | undefined;
      size?: number;
    };
    size?: number;
    symbol?: PointSymbol;
    visible?: boolean;
  };
  scatter?: any;
  selectionMode?: SeriesSelectionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
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
  stack?: string;
  stackedbar?: any;
  tagField?: string;
  type?: PolarChartSeriesType;
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: ValueErrorBarDisplayMode;
    edgeLength?: number;
    highValueField?: string | undefined;
    lineWidth?: number;
    lowValueField?: string | undefined;
    opacity?: number | undefined;
    type?: undefined | ValueErrorBarType;
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
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
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
  argumentFormat?: LocalizationFormat | undefined;
  backgroundColor?: string | undefined;
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  connector?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean;
    width?: number;
  };
  customizeText?: ((pointInfo: any) => string);
  displayFormat?: string | undefined;
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  position?: RelativePosition;
  rotationAngle?: number;
  showForZeroValues?: boolean;
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
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
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
  color?: string | undefined;
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
  dashStyle?: DashStyle;
  displayBehindSeries?: boolean;
  extendAxis?: boolean;
  label?: Record<string, any> | {
    font?: ChartsFont;
    text?: string | undefined;
    visible?: boolean;
  };
  value?: Date | number | string | undefined;
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
  text?: string | undefined;
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
type IConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  label?: Record<string, any> | {
    font?: ChartsFont;
    visible?: boolean;
  };
  width?: number;
}>
const _componentConstantLineStyle = (props: IConstantLineStyleProps) => {
  return React.createElement(NestedOption<IConstantLineStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "constantLineStyle",
      ExpectedChildren: {
        constantLineStyleLabel: { optionName: "label", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false }
      },
    },
  });
};

const ConstantLineStyle = Object.assign<typeof _componentConstantLineStyle, NestedComponentMeta>(_componentConstantLineStyle, {
  componentType: "option",
});

// owners:
// ConstantLineStyle
type IConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  visible?: boolean;
}>
const _componentConstantLineStyleLabel = (props: IConstantLineStyleLabelProps) => {
  return React.createElement(NestedOption<IConstantLineStyleLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const ConstantLineStyleLabel = Object.assign<typeof _componentConstantLineStyleLabel, NestedComponentMeta>(_componentConstantLineStyleLabel, {
  componentType: "option",
});

// owners:
// PolarChart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
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
// PolarChart
type IExportProps = React.PropsWithChildren<{
  backgroundColor?: string;
  enabled?: boolean;
  fileName?: string;
  formats?: Array<ExportFormat>;
  margin?: number;
  printingEnabled?: boolean;
  svgToCanvas?: ((svg: any, canvas: any) => any) | undefined;
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
  opacity?: number | undefined;
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
  direction?: HatchDirection;
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
// CommonSeriesSettings
// Point
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
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
const _componentHoverStyle = (props: IHoverStyleProps) => {
  return React.createElement(NestedOption<IHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        pointBorder: { optionName: "border", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
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
  height?: number;
  url?: string | undefined;
  width?: number;
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
  text?: string | undefined;
  visible?: boolean;
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  format?: LocalizationFormat | undefined;
  indentFromAxis?: number;
  overlappingBehavior?: LabelOverlap;
  argumentFormat?: LocalizationFormat | undefined;
  backgroundColor?: string | undefined;
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  connector?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean;
    width?: number;
  };
  displayFormat?: string | undefined;
  position?: RelativePosition;
  rotationAngle?: number;
  showForZeroValues?: boolean;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
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

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// PolarChart
type ILegendProps = React.PropsWithChildren<{
  backgroundColor?: string | undefined;
  border?: Record<string, any> | {
    color?: string;
    cornerRadius?: number;
    dashStyle?: DashStyle;
    opacity?: number | undefined;
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
  itemsAlignment?: HorizontalAlignment | undefined;
  itemTextPosition?: Position | undefined;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerSize?: number;
  markerTemplate?: ((legendItem: LegendItem, element: any) => string | any) | template | undefined;
  orientation?: Orientation | undefined;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  rowCount?: number;
  rowItemSpacing?: number;
  title?: Record<string, any> | string | {
    font?: ChartsFont;
    horizontalAlignment?: HorizontalAlignment | undefined;
    margin?: Record<string, any> | {
      bottom?: number;
      left?: number;
      right?: number;
      top?: number;
    };
    placeholderSize?: number | undefined;
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
  horizontalAlignment?: HorizontalAlignment | undefined;
  margin?: Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  placeholderSize?: number | undefined;
  subtitle?: Record<string, any> | string | {
    font?: ChartsFont;
    offset?: number;
    text?: string;
  };
  text?: string;
  verticalAlignment?: VerticalEdge;
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
// PolarChart
// PolarChartTitle
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
  opacity?: number | undefined;
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
// CommonAxisSettings
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
// CommonSeriesSettings
type IPointProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
  hoverMode?: PointInteractionMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    size?: number;
  };
  image?: Record<string, any> | string | undefined | {
    height?: number;
    url?: string | undefined;
    width?: number;
  };
  selectionMode?: PointInteractionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    size?: number;
  };
  size?: number;
  symbol?: PointSymbol;
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
  color?: string | undefined;
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
    color?: string | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
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
type IPointSelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
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
// PolarChart
type IPolarChartTitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  placeholderSize?: number | undefined;
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
const _componentPolarChartTitle = (props: IPolarChartTitleProps) => {
  return React.createElement(NestedOption<IPolarChartTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        polarChartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        subtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const PolarChartTitle = Object.assign<typeof _componentPolarChartTitle, NestedComponentMeta>(_componentPolarChartTitle, {
  componentType: "option",
});

// owners:
// PolarChartTitle
type IPolarChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentPolarChartTitleSubtitle = (props: IPolarChartTitleSubtitleProps) => {
  return React.createElement(NestedOption<IPolarChartTitleSubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const PolarChartTitleSubtitle = Object.assign<typeof _componentPolarChartTitleSubtitle, NestedComponentMeta>(_componentPolarChartTitleSubtitle, {
  componentType: "option",
});

// owners:
// Point
// CommonSeriesSettings
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean;
    width?: number;
    dashStyle?: DashStyle | undefined;
  };
  color?: ChartsColor | string | undefined;
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
const _componentSelectionStyle = (props: ISelectionStyleProps) => {
  return React.createElement(NestedOption<ISelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        pointBorder: { optionName: "border", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const SelectionStyle = Object.assign<typeof _componentSelectionStyle, NestedComponentMeta>(_componentSelectionStyle, {
  componentType: "option",
});

// owners:
// PolarChart
type ISeriesProps = React.PropsWithChildren<{
  argumentField?: string;
  barPadding?: number | undefined;
  barWidth?: number | undefined;
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  closed?: boolean;
  color?: ChartsColor | string | undefined;
  dashStyle?: DashStyle;
  hoverMode?: SeriesHoverMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
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
  label?: Record<string, any> | {
    argumentFormat?: LocalizationFormat | undefined;
    backgroundColor?: string | undefined;
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    connector?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean;
      width?: number;
    };
    customizeText?: ((pointInfo: any) => string);
    displayFormat?: string | undefined;
    font?: ChartsFont;
    format?: LocalizationFormat | undefined;
    position?: RelativePosition;
    rotationAngle?: number;
    showForZeroValues?: boolean;
    visible?: boolean;
  };
  maxLabelCount?: number | undefined;
  minBarSize?: number | undefined;
  name?: string | undefined;
  opacity?: number;
  point?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    hoverMode?: PointInteractionMode;
    hoverStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string | undefined;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string | undefined;
      size?: number;
    };
    image?: Record<string, any> | string | undefined | {
      height?: number;
      url?: string | undefined;
      width?: number;
    };
    selectionMode?: PointInteractionMode;
    selectionStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string | undefined;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string | undefined;
      size?: number;
    };
    size?: number;
    symbol?: PointSymbol;
    visible?: boolean;
  };
  selectionMode?: SeriesSelectionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
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
  stack?: string;
  tag?: any | undefined;
  tagField?: string;
  type?: PolarChartSeriesType;
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: ValueErrorBarDisplayMode;
    edgeLength?: number;
    highValueField?: string | undefined;
    lineWidth?: number;
    lowValueField?: string | undefined;
    opacity?: number | undefined;
    type?: undefined | ValueErrorBarType;
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
  color?: string | undefined;
  dashStyle?: DashStyle | undefined;
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
// PolarChart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => PolarChartSeries);
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
// PolarChart
type ISizeProps = React.PropsWithChildren<{
  height?: number | undefined;
  width?: number | undefined;
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
  color?: string | undefined;
  endValue?: Date | number | string | undefined;
  label?: Record<string, any> | {
    font?: ChartsFont;
    text?: string | undefined;
  };
  startValue?: Date | number | string | undefined;
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
  text?: string | undefined;
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
  };
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
// PolarChartTitle
type ISubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentSubtitle = (props: ISubtitleProps) => {
  return React.createElement(NestedOption<ISubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const Subtitle = Object.assign<typeof _componentSubtitle, NestedComponentMeta>(_componentSubtitle, {
  componentType: "option",
});

// owners:
// ArgumentAxis
// CommonAxisSettings
// ValueAxis
type ITickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number | undefined;
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
// Legend
// PolarChart
type ITitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment | undefined;
  margin?: Record<string, any> | number | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  placeholderSize?: number | undefined;
  subtitle?: Record<string, any> | string | {
    font?: ChartsFont;
    offset?: number;
    text?: string;
    textOverflow?: TextOverflow;
    wordWrap?: WordWrap;
  };
  text?: string;
  verticalAlignment?: VerticalEdge;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentTitle = (props: ITitleProps) => {
  return React.createElement(NestedOption<ITitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        legendTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        polarChartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const Title = Object.assign<typeof _componentTitle, NestedComponentMeta>(_componentTitle, {
  componentType: "option",
});

// owners:
// PolarChart
type ITooltipProps = React.PropsWithChildren<{
  argumentFormat?: LocalizationFormat | undefined;
  arrowLength?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    opacity?: number | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  container?: any | string | undefined;
  contentTemplate?: ((pointInfo: any, element: any) => string | any) | template | undefined;
  cornerRadius?: number;
  customizeTooltip?: ((pointInfo: any) => Record<string, any>) | undefined;
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  interactive?: boolean;
  opacity?: number | undefined;
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
  zIndex?: number | undefined;
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
  dashStyle?: DashStyle;
  opacity?: number | undefined;
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
// PolarChart
type IValueAxisProps = React.PropsWithChildren<{
  allowDecimals?: boolean | undefined;
  axisDivisionFactor?: number;
  categories?: Array<Date | number | string>;
  color?: string;
  constantLines?: Array<Record<string, any>> | {
    color?: string;
    dashStyle?: DashStyle;
    displayBehindSeries?: boolean;
    extendAxis?: boolean;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string | undefined;
      visible?: boolean;
    };
    value?: Date | number | string | undefined;
    width?: number;
  }[];
  constantLineStyle?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    label?: Record<string, any> | {
      font?: ChartsFont;
      visible?: boolean;
    };
    width?: number;
  };
  discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
  endOnTick?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number | undefined;
    visible?: boolean;
    width?: number;
  };
  inverted?: boolean;
  label?: Record<string, any> | {
    customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat | undefined;
    indentFromAxis?: number;
    overlappingBehavior?: LabelOverlap;
    visible?: boolean;
  };
  linearThreshold?: number | undefined;
  logarithmBase?: number;
  maxValueMargin?: number | undefined;
  minorGrid?: Record<string, any> | {
    color?: string;
    opacity?: number | undefined;
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
  minorTickCount?: number | undefined;
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
  minValueMargin?: number | undefined;
  minVisualRangeLength?: number | Record<string, any> | TimeInterval | undefined | {
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
  opacity?: number | undefined;
  showZero?: boolean | undefined;
  strips?: Array<Record<string, any>> | {
    color?: string | undefined;
    endValue?: Date | number | string | undefined;
    label?: Record<string, any> | {
      font?: ChartsFont;
      text?: string | undefined;
    };
    startValue?: Date | number | string | undefined;
  }[];
  stripStyle?: Record<string, any> | {
    label?: Record<string, any> | {
      font?: ChartsFont;
    };
  };
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number | undefined;
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
  type?: AxisScaleType | undefined;
  valueMarginsEnabled?: boolean;
  valueType?: ChartsDataType | undefined;
  visible?: boolean;
  visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode;
  wholeRange?: Array<Date | number | string> | undefined | CommonChartTypes.VisualRange;
  width?: number;
  defaultVisualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onVisualRangeChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>
const _componentValueAxis = (props: IValueAxisProps) => {
  return React.createElement(NestedOption<IValueAxisProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "valueAxis",
      DefaultsProps: {
        defaultVisualRange: "visualRange"
      },
      ExpectedChildren: {
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
  displayMode?: ValueErrorBarDisplayMode;
  edgeLength?: number;
  highValueField?: string | undefined;
  lineWidth?: number;
  lowValueField?: string | undefined;
  opacity?: number | undefined;
  type?: undefined | ValueErrorBarType;
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
// ValueAxis
type IVisualRangeProps = React.PropsWithChildren<{
  endValue?: Date | number | string | undefined;
  length?: number | Record<string, any> | TimeInterval | undefined | {
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
  startValue?: Date | number | string | undefined;
  defaultEndValue?: Date | number | string | undefined;
  onEndValueChange?: (value: Date | number | string | undefined) => void;
  defaultStartValue?: Date | number | string | undefined;
  onStartValueChange?: (value: Date | number | string | undefined) => void;
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
      ExpectedChildren: {
        length: { optionName: "length", isCollectionItem: false }
      },
    },
  });
};

const VisualRange = Object.assign<typeof _componentVisualRange, NestedComponentMeta>(_componentVisualRange, {
  componentType: "option",
});

// owners:
// ValueAxis
type IWholeRangeProps = React.PropsWithChildren<{
  endValue?: Date | number | string | undefined;
  length?: number | Record<string, any> | TimeInterval | undefined | {
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
  startValue?: Date | number | string | undefined;
  defaultEndValue?: Date | number | string | undefined;
  onEndValueChange?: (value: Date | number | string | undefined) => void;
  defaultStartValue?: Date | number | string | undefined;
  onStartValueChange?: (value: Date | number | string | undefined) => void;
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

export default PolarChart;
export {
  PolarChart,
  IPolarChartOptions,
  PolarChartRef,
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

