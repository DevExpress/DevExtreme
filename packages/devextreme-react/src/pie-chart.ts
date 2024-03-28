"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPieChart, {
    Properties
} from "devextreme/viz/pie_chart";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, PointClickEvent, TooltipHiddenEvent, TooltipShownEvent, dxPieChartAnnotationConfig, dxPieChartCommonAnnotationConfig, PieChartLegendItem, PieChartSeries } from "devextreme/viz/pie_chart";
import type { Font as ChartsFont, ChartsColor } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IPieChartOptionsNarrowedEvents = {
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
  onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
  onTooltipShown?: ((e: TooltipShownEvent) => void);
}

type IPieChartOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IPieChartOptionsNarrowedEvents> & IHtmlOptions & {
  centerRender?: (...params: any) => React.ReactNode;
  centerComponent?: React.ComponentType<any>;
  defaultLoadingIndicator?: Record<string, any>;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
}>

interface PieChartRef {
  instance: () => dxPieChart;
}

const PieChart = memo(
  forwardRef(
    (props: React.PropsWithChildren<IPieChartOptions>, ref: ForwardedRef<PieChartRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onDone","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onLegendClick","onPointClick","onTooltipHidden","onTooltipShown"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
      }), []);

      const expectedChildren = useMemo(() => ({
        adaptiveLayout: { optionName: "adaptiveLayout", isCollectionItem: false },
        animation: { optionName: "animation", isCollectionItem: false },
        annotation: { optionName: "annotations", isCollectionItem: true },
        commonAnnotationSettings: { optionName: "commonAnnotationSettings", isCollectionItem: false },
        commonSeriesSettings: { optionName: "commonSeriesSettings", isCollectionItem: false },
        export: { optionName: "export", isCollectionItem: false },
        legend: { optionName: "legend", isCollectionItem: false },
        loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        pieChartTitle: { optionName: "title", isCollectionItem: false },
        series: { optionName: "series", isCollectionItem: true },
        seriesTemplate: { optionName: "seriesTemplate", isCollectionItem: false },
        size: { optionName: "size", isCollectionItem: false },
        title: { optionName: "title", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "centerTemplate",
          render: "centerRender",
          component: "centerComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IPieChartOptions>>, {
          WidgetClass: dxPieChart,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IPieChartOptions> & { ref?: Ref<PieChartRef> }) => ReactElement | null;


// owners:
// PieChart
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
// PieChart
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: "easeOutCubic" | "linear";
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
// PieChart
type IAnnotationProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => Record<string, any>);
  data?: any;
  description?: string;
  font?: ChartsFont;
  height?: number;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string;
    width?: number;
  };
  location?: "center" | "edge";
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
  template?: ((annotation: dxPieChartCommonAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPieChartAnnotationConfig | any, element: any) => string | any) | template;
  type?: "text" | "image" | "custom";
  width?: number;
  wordWrap?: "normal" | "breakWord" | "none";
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
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
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
// Label
// Tooltip
type IArgumentFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
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
// Annotation
// Legend
// CommonSeriesSettings
// HoverStyle
// Label
// SelectionStyle
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
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
// HoverStyle
// SelectionStyle
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
// PieChart
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => Record<string, any>);
  data?: any;
  description?: string;
  font?: ChartsFont;
  height?: number;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string;
    width?: number;
  };
  location?: "center" | "edge";
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
  template?: ((annotation: dxPieChartCommonAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPieChartAnnotationConfig | any, element: any) => string | any) | template;
  type?: "text" | "image" | "custom";
  width?: number;
  wordWrap?: "normal" | "breakWord" | "none";
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
// PieChart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  argumentField?: string;
  argumentType?: "datetime" | "numeric" | "string";
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hoverMode?: "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
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
    position?: "columns" | "inside" | "outside";
    radialOffset?: number;
    rotationAngle?: number;
    textOverflow?: "ellipsis" | "hide" | "none";
    visible?: boolean;
    wordWrap?: "normal" | "breakWord" | "none";
  };
  maxLabelCount?: number;
  minSegmentSize?: number;
  selectionMode?: "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
  smallValuesGrouping?: Record<string, any> | {
    groupName?: string;
    mode?: "none" | "smallValueThreshold" | "topN";
    threshold?: number;
    topCount?: number;
  };
  tagField?: string;
  valueField?: string;
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
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false },
    smallValuesGrouping: { optionName: "smallValuesGrouping", isCollectionItem: false }
  },
})

// owners:
// Label
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
// PieChart
type IExportProps = React.PropsWithChildren<{
  backgroundColor?: string;
  enabled?: boolean;
  fileName?: string;
  formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">;
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
// Legend
// LegendTitle
// LegendTitleSubtitle
// Tooltip
// LoadingIndicator
// PieChartTitle
// PieChartTitleSubtitle
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
// Tooltip
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
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
// HoverStyle
// SelectionStyle
type IHatchingProps = React.PropsWithChildren<{
  direction?: "left" | "none" | "right";
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
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
}>
const _componentHoverStyle = memo(
  (props: IHoverStyleProps) => {
    return React.createElement(NestedOption<IHoverStyleProps>, { ...props });
  }
);

const HoverStyle: typeof _componentHoverStyle & IElementDescriptor = Object.assign(_componentHoverStyle, {
  OptionName: "hoverStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// Annotation
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
// CommonSeriesSettings
type ILabelProps = React.PropsWithChildren<{
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
  position?: "columns" | "inside" | "outside";
  radialOffset?: number;
  rotationAngle?: number;
  textOverflow?: "ellipsis" | "hide" | "none";
  visible?: boolean;
  wordWrap?: "normal" | "breakWord" | "none";
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
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
// PieChart
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
  customizeHint?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string);
  customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
  customizeText?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string);
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  hoverMode?: "none" | "allArgumentPoints";
  itemsAlignment?: "center" | "left" | "right";
  itemTextPosition?: "bottom" | "left" | "right" | "top";
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerSize?: number;
  markerTemplate?: ((legendItem: PieChartLegendItem, element: any) => string | any) | template;
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
// PieChart
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
// PieChart
// PieChartTitle
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
// PieChart
type IPieChartTitleProps = React.PropsWithChildren<{
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
const _componentPieChartTitle = memo(
  (props: IPieChartTitleProps) => {
    return React.createElement(NestedOption<IPieChartTitleProps>, { ...props });
  }
);

const PieChartTitle: typeof _componentPieChartTitle & IElementDescriptor = Object.assign(_componentPieChartTitle, {
  OptionName: "title",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    pieChartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// PieChartTitle
type IPieChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
const _componentPieChartTitleSubtitle = memo(
  (props: IPieChartTitleSubtitleProps) => {
    return React.createElement(NestedOption<IPieChartTitleSubtitleProps>, { ...props });
  }
);

const PieChartTitleSubtitle: typeof _componentPieChartTitleSubtitle & IElementDescriptor = Object.assign(_componentPieChartTitleSubtitle, {
  OptionName: "subtitle",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettings
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
}>
const _componentSelectionStyle = memo(
  (props: ISelectionStyleProps) => {
    return React.createElement(NestedOption<ISelectionStyleProps>, { ...props });
  }
);

const SelectionStyle: typeof _componentSelectionStyle & IElementDescriptor = Object.assign(_componentSelectionStyle, {
  OptionName: "selectionStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// PieChart
type ISeriesProps = React.PropsWithChildren<{
  argumentField?: string;
  argumentType?: "datetime" | "numeric" | "string";
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hoverMode?: "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
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
    position?: "columns" | "inside" | "outside";
    radialOffset?: number;
    rotationAngle?: number;
    textOverflow?: "ellipsis" | "hide" | "none";
    visible?: boolean;
    wordWrap?: "normal" | "breakWord" | "none";
  };
  maxLabelCount?: number;
  minSegmentSize?: number;
  name?: string;
  selectionMode?: "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
  smallValuesGrouping?: Record<string, any> | {
    groupName?: string;
    mode?: "none" | "smallValueThreshold" | "topN";
    threshold?: number;
    topCount?: number;
  };
  tag?: any;
  tagField?: string;
  valueField?: string;
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
// HoverStyle
// Label
// SelectionStyle
type ISeriesBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
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
// PieChart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => PieChartSeries);
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
// PieChart
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
// CommonSeriesSettings
type ISmallValuesGroupingProps = React.PropsWithChildren<{
  groupName?: string;
  mode?: "none" | "smallValueThreshold" | "topN";
  threshold?: number;
  topCount?: number;
}>
const _componentSmallValuesGrouping = memo(
  (props: ISmallValuesGroupingProps) => {
    return React.createElement(NestedOption<ISmallValuesGroupingProps>, { ...props });
  }
);

const SmallValuesGrouping: typeof _componentSmallValuesGrouping & IElementDescriptor = Object.assign(_componentSmallValuesGrouping, {
  OptionName: "smallValuesGrouping",
})

// owners:
// LegendTitle
// PieChartTitle
type ISubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
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
// Legend
// PieChart
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
const _componentTitle = memo(
  (props: ITitleProps) => {
    return React.createElement(NestedOption<ITitleProps>, { ...props });
  }
);

const Title: typeof _componentTitle & IElementDescriptor = Object.assign(_componentTitle, {
  OptionName: "title",
})

// owners:
// PieChart
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
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
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

export default PieChart;
export {
  PieChart,
  IPieChartOptions,
  PieChartRef,
  AdaptiveLayout,
  IAdaptiveLayoutProps,
  Animation,
  IAnimationProps,
  Annotation,
  IAnnotationProps,
  AnnotationBorder,
  IAnnotationBorderProps,
  ArgumentFormat,
  IArgumentFormatProps,
  Border,
  IBorderProps,
  Color,
  IColorProps,
  CommonAnnotationSettings,
  ICommonAnnotationSettingsProps,
  CommonSeriesSettings,
  ICommonSeriesSettingsProps,
  Connector,
  IConnectorProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
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
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  PieChartTitle,
  IPieChartTitleProps,
  PieChartTitleSubtitle,
  IPieChartTitleSubtitleProps,
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
  SmallValuesGrouping,
  ISmallValuesGroupingProps,
  Subtitle,
  ISubtitleProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  TooltipBorder,
  ITooltipBorderProps
};
import type * as PieChartTypes from 'devextreme/viz/pie_chart_types';
export { PieChartTypes };

