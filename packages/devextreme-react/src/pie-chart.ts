"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPieChart, {
    Properties
} from "devextreme/viz/pie_chart";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DoneEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LegendClickEvent, PointClickEvent, TooltipHiddenEvent, TooltipShownEvent, dxPieChartAnnotationConfig, PieChartAnnotationLocation, dxPieChartCommonAnnotationConfig, PieChartSeriesInteractionMode, SmallValuesGroupingMode, PieChartLegendItem, PieChartLegendHoverMode, PieChartSeries } from "devextreme/viz/pie_chart";
import type { AnimationEaseMode, DashStyle, Font as ChartsFont, TextOverflow, AnnotationType, WordWrap, ChartsDataType, ChartsColor, HatchDirection, LabelPosition } from "devextreme/common/charts";
import type { template, Format as CommonFormat, ExportFormat, HorizontalAlignment, Position, Orientation, VerticalEdge } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";

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
// PieChart
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
// PieChart
type IAnnotationProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => Record<string, any>) | undefined;
  data?: any;
  description?: string | undefined;
  font?: ChartsFont;
  height?: number | undefined;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string | undefined;
    width?: number;
  };
  location?: PieChartAnnotationLocation;
  name?: string | undefined;
  offsetX?: number | undefined;
  offsetY?: number | undefined;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  series?: string | undefined;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxPieChartCommonAnnotationConfig | any, element: any) => string | any) | template | undefined;
  text?: string | undefined;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPieChartAnnotationConfig | any, element: any) => string | any) | template | undefined;
  type?: AnnotationType | undefined;
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
// Label
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
// Annotation
// Legend
// CommonSeriesSettings
// HoverStyle
// Label
// SelectionStyle
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
// HoverStyle
// SelectionStyle
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
// PieChart
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => Record<string, any>) | undefined;
  data?: any;
  description?: string | undefined;
  font?: ChartsFont;
  height?: number | undefined;
  image?: Record<string, any> | string | {
    height?: number;
    url?: string | undefined;
    width?: number;
  };
  location?: PieChartAnnotationLocation;
  offsetX?: number | undefined;
  offsetY?: number | undefined;
  opacity?: number;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  series?: string | undefined;
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxPieChartCommonAnnotationConfig | any, element: any) => string | any) | template | undefined;
  text?: string | undefined;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxPieChartAnnotationConfig | any, element: any) => string | any) | template | undefined;
  type?: AnnotationType | undefined;
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
// PieChart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  argumentField?: string;
  argumentType?: ChartsDataType | undefined;
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
  hoverMode?: PieChartSeriesInteractionMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
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
    position?: LabelPosition;
    radialOffset?: number;
    rotationAngle?: number;
    textOverflow?: TextOverflow;
    visible?: boolean;
    wordWrap?: WordWrap;
  };
  maxLabelCount?: number | undefined;
  minSegmentSize?: number | undefined;
  selectionMode?: PieChartSeriesInteractionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
  smallValuesGrouping?: Record<string, any> | {
    groupName?: string;
    mode?: SmallValuesGroupingMode;
    threshold?: number | undefined;
    topCount?: number | undefined;
  };
  tagField?: string;
  valueField?: string;
}>
const _componentCommonSeriesSettings = (props: ICommonSeriesSettingsProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const CommonSeriesSettings = Object.assign<typeof _componentCommonSeriesSettings, NestedComponentMeta>(_componentCommonSeriesSettings, {
  componentType: "option",
});

// owners:
// Label
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
// PieChart
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
// Label
// Tooltip
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
// HoverStyle
// SelectionStyle
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
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
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
// CommonSeriesSettings
type ILabelProps = React.PropsWithChildren<{
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
  position?: LabelPosition;
  radialOffset?: number;
  rotationAngle?: number;
  textOverflow?: TextOverflow;
  visible?: boolean;
  wordWrap?: WordWrap;
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
// PieChart
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
  customizeHint?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string);
  customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
  customizeText?: ((pointInfo: { pointColor: string, pointIndex: number, pointName: any }) => string);
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  hoverMode?: PieChartLegendHoverMode;
  itemsAlignment?: HorizontalAlignment | undefined;
  itemTextPosition?: Position | undefined;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerSize?: number;
  markerTemplate?: ((legendItem: PieChartLegendItem, element: any) => string | any) | template | undefined;
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
// PieChart
// PieChartTitle
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
// PieChart
type IPieChartTitleProps = React.PropsWithChildren<{
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
const _componentPieChartTitle = (props: IPieChartTitleProps) => {
  return React.createElement(NestedOption<IPieChartTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        pieChartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        subtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const PieChartTitle = Object.assign<typeof _componentPieChartTitle, NestedComponentMeta>(_componentPieChartTitle, {
  componentType: "option",
});

// owners:
// PieChartTitle
type IPieChartTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentPieChartTitleSubtitle = (props: IPieChartTitleSubtitleProps) => {
  return React.createElement(NestedOption<IPieChartTitleSubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const PieChartTitleSubtitle = Object.assign<typeof _componentPieChartTitleSubtitle, NestedComponentMeta>(_componentPieChartTitleSubtitle, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
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
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const SelectionStyle = Object.assign<typeof _componentSelectionStyle, NestedComponentMeta>(_componentSelectionStyle, {
  componentType: "option",
});

// owners:
// PieChart
type ISeriesProps = React.PropsWithChildren<{
  argumentField?: string;
  argumentType?: ChartsDataType | undefined;
  border?: Record<string, any> | {
    color?: string | undefined;
    dashStyle?: DashStyle | undefined;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string | undefined;
  hoverMode?: PieChartSeriesInteractionMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
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
    position?: LabelPosition;
    radialOffset?: number;
    rotationAngle?: number;
    textOverflow?: TextOverflow;
    visible?: boolean;
    wordWrap?: WordWrap;
  };
  maxLabelCount?: number | undefined;
  minSegmentSize?: number | undefined;
  name?: string | undefined;
  selectionMode?: PieChartSeriesInteractionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      dashStyle?: DashStyle | undefined;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string | undefined;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
  };
  smallValuesGrouping?: Record<string, any> | {
    groupName?: string;
    mode?: SmallValuesGroupingMode;
    threshold?: number | undefined;
    topCount?: number | undefined;
  };
  tag?: any | undefined;
  tagField?: string;
  valueField?: string;
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
// HoverStyle
// Label
// SelectionStyle
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
// PieChart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => PieChartSeries);
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
// PieChart
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
// CommonSeriesSettings
type ISmallValuesGroupingProps = React.PropsWithChildren<{
  groupName?: string;
  mode?: SmallValuesGroupingMode;
  threshold?: number | undefined;
  topCount?: number | undefined;
}>
const _componentSmallValuesGrouping = (props: ISmallValuesGroupingProps) => {
  return React.createElement(NestedOption<ISmallValuesGroupingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "smallValuesGrouping",
    },
  });
};

const SmallValuesGrouping = Object.assign<typeof _componentSmallValuesGrouping, NestedComponentMeta>(_componentSmallValuesGrouping, {
  componentType: "option",
});

// owners:
// LegendTitle
// PieChartTitle
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
// Legend
// PieChart
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
        pieChartTitleSubtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const Title = Object.assign<typeof _componentTitle, NestedComponentMeta>(_componentTitle, {
  componentType: "option",
});

// owners:
// PieChart
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

