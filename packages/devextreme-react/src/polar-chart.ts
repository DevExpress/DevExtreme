"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPolarChart, {
    Properties
} from "devextreme/viz/polar_chart";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ArgumentAxisClickEvent, DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, PointClickEvent, SeriesClickEvent, TooltipHiddenEvent, TooltipShownEvent, ZoomEndEvent, ZoomStartEvent, dxPolarChartAnnotationConfig, dxPolarChartCommonAnnotationConfig, PolarChartSeriesType, PolarChartSeries, ValueAxisVisualRangeUpdateMode } from "devextreme/viz/polar_chart";
import type { AnimationEaseMode, DashStyle, Font as ChartsFont, TextOverflow, AnnotationType, WordWrap, ChartsDataType, DiscreteAxisDivisionMode, ArgumentAxisHoverMode, LabelOverlap, TimeInterval, AxisScaleType, ChartsColor, SeriesHoverMode, HatchDirection, RelativePosition, PointInteractionMode, PointSymbol, SeriesSelectionMode, ValueErrorBarDisplayMode, ValueErrorBarType, LegendItem, LegendHoverMode } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";
import type { ExportFormat, HorizontalAlignment, Position, Orientation, VerticalEdge } from "devextreme/common";

import type * as CommonChartTypes from "devextreme/common/charts";
import type * as LocalizationTypes from "devextreme/localization";
import type * as LocalizationTypes from "devextreme/common";

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
const _componentAdaptiveLayout = memo(
  (props: IAdaptiveLayoutProps) => {
    return React.createElement(NestedOption<IAdaptiveLayoutProps>, { ...props });
  }
);

const AdaptiveLayout: typeof _componentAdaptiveLayout & IElementDescriptor = Object.assign(_componentAdaptiveLayout, {
  OptionName: "adaptiveLayout",
})

// owners:
// PolarChart
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
    dashStyle?: DashStyle;
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
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPolarChartAnnotationConfig | any, element: any) => string | any) | template;
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
// PolarChart
type IArgumentAxisProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
  argumentType?: ChartsDataType;
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
      text?: string;
      visible?: boolean;
    };
    value?: Date | number | string;
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
  firstPointOnStartAngle?: boolean;
  grid?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  hoverMode?: ArgumentAxisHoverMode;
  inverted?: boolean;
  label?: Record<string, any> | {
    customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
    customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indentFromAxis?: number;
    overlappingBehavior?: LabelOverlap;
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
  type?: AxisScaleType;
  visible?: boolean;
  width?: number;
}>
const _componentArgumentAxis = memo(
  (props: IArgumentAxisProps) => {
    return React.createElement(NestedOption<IArgumentAxisProps>, { ...props });
  }
);

const ArgumentAxis: typeof _componentArgumentAxis & IElementDescriptor = Object.assign(_componentArgumentAxis, {
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
})

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
const _componentArgumentAxisMinorTick = memo(
  (props: IArgumentAxisMinorTickProps) => {
    return React.createElement(NestedOption<IArgumentAxisMinorTickProps>, { ...props });
  }
);

const ArgumentAxisMinorTick: typeof _componentArgumentAxisMinorTick & IElementDescriptor = Object.assign(_componentArgumentAxisMinorTick, {
  OptionName: "minorTick",
})

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
const _componentArgumentAxisTick = memo(
  (props: IArgumentAxisTickProps) => {
    return React.createElement(NestedOption<IArgumentAxisTickProps>, { ...props });
  }
);

const ArgumentAxisTick: typeof _componentArgumentAxisTick & IElementDescriptor = Object.assign(_componentArgumentAxisTick, {
  OptionName: "tick",
})

// owners:
// CommonSeriesSettingsLabel
// Tooltip
type IArgumentFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: LocalizationTypes.Format | string;
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
type IAxisLabelProps = React.PropsWithChildren<{
  customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string);
  customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  indentFromAxis?: number;
  overlappingBehavior?: LabelOverlap;
  visible?: boolean;
}>
const _componentAxisLabel = memo(
  (props: IAxisLabelProps) => {
    return React.createElement(NestedOption<IAxisLabelProps>, { ...props });
  }
);

const AxisLabel: typeof _componentAxisLabel & IElementDescriptor = Object.assign(_componentAxisLabel, {
  OptionName: "label",
})

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
    dashStyle?: DashStyle;
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
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPolarChartAnnotationConfig | any, element: any) => string | any) | template;
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
// PolarChart
type ICommonAxisSettingsProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
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
    overlappingBehavior?: LabelOverlap;
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
const _componentCommonAxisSettings = memo(
  (props: ICommonAxisSettingsProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsProps>, { ...props });
  }
);

const CommonAxisSettings: typeof _componentCommonAxisSettings & IElementDescriptor = Object.assign(_componentCommonAxisSettings, {
  OptionName: "commonAxisSettings",
  ExpectedChildren: {
    commonAxisSettingsLabel: { optionName: "label", isCollectionItem: false },
    commonAxisSettingsMinorTick: { optionName: "minorTick", isCollectionItem: false },
    commonAxisSettingsTick: { optionName: "tick", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    minorTick: { optionName: "minorTick", isCollectionItem: false },
    tick: { optionName: "tick", isCollectionItem: false }
  },
})

// owners:
// CommonAxisSettings
type ICommonAxisSettingsLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  indentFromAxis?: number;
  overlappingBehavior?: LabelOverlap;
  visible?: boolean;
}>
const _componentCommonAxisSettingsLabel = memo(
  (props: ICommonAxisSettingsLabelProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsLabelProps>, { ...props });
  }
);

const CommonAxisSettingsLabel: typeof _componentCommonAxisSettingsLabel & IElementDescriptor = Object.assign(_componentCommonAxisSettingsLabel, {
  OptionName: "label",
})

// owners:
// CommonAxisSettings
type ICommonAxisSettingsMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentCommonAxisSettingsMinorTick = memo(
  (props: ICommonAxisSettingsMinorTickProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsMinorTickProps>, { ...props });
  }
);

const CommonAxisSettingsMinorTick: typeof _componentCommonAxisSettingsMinorTick & IElementDescriptor = Object.assign(_componentCommonAxisSettingsMinorTick, {
  OptionName: "minorTick",
})

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
const _componentCommonAxisSettingsTick = memo(
  (props: ICommonAxisSettingsTickProps) => {
    return React.createElement(NestedOption<ICommonAxisSettingsTickProps>, { ...props });
  }
);

const CommonAxisSettingsTick: typeof _componentCommonAxisSettingsTick & IElementDescriptor = Object.assign(_componentCommonAxisSettingsTick, {
  OptionName: "tick",
})

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
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  closed?: boolean;
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
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
  label?: Record<string, any> | {
    argumentFormat?: LocalizationTypes.Format;
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
    format?: LocalizationTypes.Format;
    position?: RelativePosition;
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
      height?: number;
      url?: string;
      width?: number;
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
  stack?: string;
  stackedbar?: any;
  tagField?: string;
  type?: PolarChartSeriesType;
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
  argumentFormat?: LocalizationTypes.Format;
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
  format?: LocalizationTypes.Format;
  position?: RelativePosition;
  rotationAngle?: number;
  showForZeroValues?: boolean;
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
    text?: string;
    visible?: boolean;
  };
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
  text?: string;
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
type IConstantLineStyleProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  label?: Record<string, any> | {
    font?: ChartsFont;
    visible?: boolean;
  };
  width?: number;
}>
const _componentConstantLineStyle = memo(
  (props: IConstantLineStyleProps) => {
    return React.createElement(NestedOption<IConstantLineStyleProps>, { ...props });
  }
);

const ConstantLineStyle: typeof _componentConstantLineStyle & IElementDescriptor = Object.assign(_componentConstantLineStyle, {
  OptionName: "constantLineStyle",
  ExpectedChildren: {
    constantLineStyleLabel: { optionName: "label", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false }
  },
})

// owners:
// ConstantLineStyle
type IConstantLineStyleLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  visible?: boolean;
}>
const _componentConstantLineStyleLabel = memo(
  (props: IConstantLineStyleLabelProps) => {
    return React.createElement(NestedOption<IConstantLineStyleLabelProps>, { ...props });
  }
);

const ConstantLineStyleLabel: typeof _componentConstantLineStyleLabel & IElementDescriptor = Object.assign(_componentConstantLineStyleLabel, {
  OptionName: "label",
})

// owners:
// PolarChart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
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
// PolarChart
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
// Tooltip
// Label
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: LocalizationTypes.Format | string;
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
  height?: number;
  url?: string;
  width?: number;
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
  overlappingBehavior?: LabelOverlap;
  argumentFormat?: LocalizationTypes.Format;
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
  position?: RelativePosition;
  rotationAngle?: number;
  showForZeroValues?: boolean;
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
})

// owners:
// PolarChart
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
// PolarChart
// PolarChartTitle
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
// CommonAxisSettings
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
    height?: number;
    url?: string;
    width?: number;
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
const _componentPolarChartTitle = memo(
  (props: IPolarChartTitleProps) => {
    return React.createElement(NestedOption<IPolarChartTitleProps>, { ...props });
  }
);

const PolarChartTitle: typeof _componentPolarChartTitle & IElementDescriptor = Object.assign(_componentPolarChartTitle, {
  OptionName: "title",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    polarChartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// PolarChartTitle
type IPolarChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentPolarChartTitleSubtitle = memo(
  (props: IPolarChartTitleSubtitleProps) => {
    return React.createElement(NestedOption<IPolarChartTitleSubtitleProps>, { ...props });
  }
);

const PolarChartTitleSubtitle: typeof _componentPolarChartTitleSubtitle & IElementDescriptor = Object.assign(_componentPolarChartTitleSubtitle, {
  OptionName: "subtitle",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
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
// PolarChart
type ISeriesProps = React.PropsWithChildren<{
  argumentField?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  closed?: boolean;
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
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
  label?: Record<string, any> | {
    argumentFormat?: LocalizationTypes.Format;
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
    format?: LocalizationTypes.Format;
    position?: RelativePosition;
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
      height?: number;
      url?: string;
      width?: number;
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
  stack?: string;
  tag?: any;
  tagField?: string;
  type?: PolarChartSeriesType;
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
// PolarChart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => PolarChartSeries);
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
// PolarChart
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
    text?: string;
  };
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
  text?: string;
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
  };
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
// PolarChartTitle
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
// Legend
// PolarChart
type ITitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
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
    textOverflow?: TextOverflow;
    wordWrap?: WordWrap;
  };
  text?: string;
  verticalAlignment?: VerticalEdge;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
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
// PolarChart
type ITooltipProps = React.PropsWithChildren<{
  argumentFormat?: LocalizationTypes.Format;
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
// PolarChart
type IValueAxisProps = React.PropsWithChildren<{
  allowDecimals?: boolean;
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
      text?: string;
      visible?: boolean;
    };
    value?: Date | number | string;
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
    overlappingBehavior?: LabelOverlap;
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
  type?: AxisScaleType;
  valueMarginsEnabled?: boolean;
  valueType?: ChartsDataType;
  visible?: boolean;
  visualRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode;
  wholeRange?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  width?: number;
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
  ExpectedChildren: {
    length: { optionName: "length", isCollectionItem: false }
  },
})

// owners:
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

