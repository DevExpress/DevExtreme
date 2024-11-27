"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxVectorMap, {
    Properties
} from "devextreme/viz/vector_map";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClickEvent, DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent, dxVectorMapAnnotationConfig, MapLayerElement, VectorMapMarkerType, VectorMapLayerType, VectorMapLegendItem, VectorMapMarkerShape } from "devextreme/viz/vector_map";
import type { DashStyle, Font as ChartsFont, TextOverflow, AnnotationType, WordWrap, Palette } from "devextreme/common/charts";
import type { template, HorizontalAlignment, VerticalEdge, ExportFormat, SingleMultipleOrNone, Position, Orientation } from "devextreme/common";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

import type DataSource from "devextreme/data/data_source";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IVectorMapOptionsNarrowedEvents = {
  onClick?: ((e: ClickEvent) => void);
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

type IVectorMapOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IVectorMapOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
}>

interface VectorMapRef {
  instance: () => dxVectorMap;
}

const VectorMap = memo(
  forwardRef(
    (props: React.PropsWithChildren<IVectorMapOptions>, ref: ForwardedRef<VectorMapRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show"]), []);
      const independentEvents = useMemo(() => (["onClick","onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onTooltipHidden","onTooltipShown"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
      }), []);

      const expectedChildren = useMemo(() => ({
        annotation: { optionName: "annotations", isCollectionItem: true },
        background: { optionName: "background", isCollectionItem: false },
        commonAnnotationSettings: { optionName: "commonAnnotationSettings", isCollectionItem: false },
        controlBar: { optionName: "controlBar", isCollectionItem: false },
        export: { optionName: "export", isCollectionItem: false },
        layer: { optionName: "layers", isCollectionItem: true },
        legend: { optionName: "legends", isCollectionItem: true },
        loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
        projection: { optionName: "projection", isCollectionItem: false },
        size: { optionName: "size", isCollectionItem: false },
        title: { optionName: "title", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false },
        vectorMapTitle: { optionName: "title", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IVectorMapOptions>>, {
          WidgetClass: dxVectorMap,
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
) as (props: React.PropsWithChildren<IVectorMapOptions> & { ref?: Ref<VectorMapRef> }) => ReactElement | null;


// owners:
// VectorMap
type IAnnotationProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  coordinates?: Array<number>;
  customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>) | undefined;
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
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template | undefined;
  text?: string | undefined;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template | undefined;
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
// VectorMap
type IBackgroundProps = React.PropsWithChildren<{
  borderColor?: string;
  color?: string;
}>
const _componentBackground = (props: IBackgroundProps) => {
  return React.createElement(NestedOption<IBackgroundProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "background",
    },
  });
};

const Background = Object.assign<typeof _componentBackground, NestedComponentMeta>(_componentBackground, {
  componentType: "option",
});

// owners:
// Annotation
// Legend
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
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
// VectorMap
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  coordinates?: Array<number>;
  customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>) | undefined;
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
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template | undefined;
  text?: string | undefined;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template | undefined;
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
// VectorMap
type IControlBarProps = React.PropsWithChildren<{
  borderColor?: string;
  color?: string;
  enabled?: boolean;
  horizontalAlignment?: HorizontalAlignment;
  margin?: number;
  opacity?: number;
  panVisible?: boolean;
  verticalAlignment?: VerticalEdge;
  zoomVisible?: boolean;
}>
const _componentControlBar = (props: IControlBarProps) => {
  return React.createElement(NestedOption<IControlBarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "controlBar",
    },
  });
};

const ControlBar = Object.assign<typeof _componentControlBar, NestedComponentMeta>(_componentControlBar, {
  componentType: "option",
});

// owners:
// VectorMap
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
// VectorMapTitle
// VectorMapTitleSubtitle
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
// Layer
type ILabelProps = React.PropsWithChildren<{
  dataField?: string;
  enabled?: boolean;
  font?: ChartsFont;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// VectorMap
type ILayerProps = React.PropsWithChildren<{
  borderColor?: string;
  borderWidth?: number;
  color?: string;
  colorGroupingField?: string | undefined;
  colorGroups?: Array<number>;
  customize?: ((elements: Array<MapLayerElement>) => void);
  dataField?: string | undefined;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Record<string, any> | Store | string;
  elementType?: VectorMapMarkerType;
  hoveredBorderColor?: string;
  hoveredBorderWidth?: number;
  hoveredColor?: string;
  hoverEnabled?: boolean;
  label?: Record<string, any> | {
    dataField?: string;
    enabled?: boolean;
    font?: ChartsFont;
  };
  maxSize?: number;
  minSize?: number;
  name?: string;
  opacity?: number;
  palette?: Array<string> | Palette;
  paletteIndex?: number;
  paletteSize?: number;
  selectedBorderColor?: string;
  selectedBorderWidth?: number;
  selectedColor?: string;
  selectionMode?: SingleMultipleOrNone;
  size?: number;
  sizeGroupingField?: string | undefined;
  sizeGroups?: Array<number>;
  type?: VectorMapLayerType;
}>
const _componentLayer = (props: ILayerProps) => {
  return React.createElement(NestedOption<ILayerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "layers",
      IsCollectionItem: true,
      ExpectedChildren: {
        label: { optionName: "label", isCollectionItem: false }
      },
    },
  });
};

const Layer = Object.assign<typeof _componentLayer, NestedComponentMeta>(_componentLayer, {
  componentType: "option",
});

// owners:
// VectorMap
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
  customizeHint?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string);
  customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
  customizeText?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string);
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  itemsAlignment?: HorizontalAlignment | undefined;
  itemTextPosition?: Position | undefined;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerColor?: string | undefined;
  markerShape?: VectorMapMarkerShape;
  markerSize?: number;
  markerTemplate?: ((legendItem: VectorMapLegendItem, element: any) => string | any) | template | undefined;
  orientation?: Orientation | undefined;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  rowCount?: number;
  rowItemSpacing?: number;
  source?: Record<string, any> | {
    grouping?: string;
    layer?: string;
  };
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
      OptionName: "legends",
      IsCollectionItem: true,
      ExpectedChildren: {
        annotationBorder: { optionName: "border", isCollectionItem: false },
        border: { optionName: "border", isCollectionItem: false },
        font: { optionName: "font", isCollectionItem: false },
        legendTitle: { optionName: "title", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        source: { optionName: "source", isCollectionItem: false },
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
// VectorMap
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
// VectorMapTitle
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
// VectorMap
type IProjectionProps = React.PropsWithChildren<{
  aspectRatio?: number;
  from?: ((coordinates: Array<number>) => Array<number>);
  to?: ((coordinates: Array<number>) => Array<number>);
}>
const _componentProjection = (props: IProjectionProps) => {
  return React.createElement(NestedOption<IProjectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "projection",
    },
  });
};

const Projection = Object.assign<typeof _componentProjection, NestedComponentMeta>(_componentProjection, {
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
// VectorMap
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
// Legend
type ISourceProps = React.PropsWithChildren<{
  grouping?: string;
  layer?: string;
}>
const _componentSource = (props: ISourceProps) => {
  return React.createElement(NestedOption<ISourceProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "source",
    },
  });
};

const Source = Object.assign<typeof _componentSource, NestedComponentMeta>(_componentSource, {
  componentType: "option",
});

// owners:
// LegendTitle
// VectorMapTitle
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
// VectorMap
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
        vectorMapTitleSubtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const Title = Object.assign<typeof _componentTitle, NestedComponentMeta>(_componentTitle, {
  componentType: "option",
});

// owners:
// VectorMap
type ITooltipProps = React.PropsWithChildren<{
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
  contentTemplate?: ((info: MapLayerElement, element: any) => string | any) | template | undefined;
  cornerRadius?: number;
  customizeTooltip?: ((info: MapLayerElement) => Record<string, any>) | undefined;
  enabled?: boolean;
  font?: ChartsFont;
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
        border: { optionName: "border", isCollectionItem: false },
        font: { optionName: "font", isCollectionItem: false },
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
// VectorMap
type IVectorMapTitleProps = React.PropsWithChildren<{
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
const _componentVectorMapTitle = (props: IVectorMapTitleProps) => {
  return React.createElement(NestedOption<IVectorMapTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        subtitle: { optionName: "subtitle", isCollectionItem: false },
        vectorMapTitleSubtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const VectorMapTitle = Object.assign<typeof _componentVectorMapTitle, NestedComponentMeta>(_componentVectorMapTitle, {
  componentType: "option",
});

// owners:
// VectorMapTitle
type IVectorMapTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentVectorMapTitleSubtitle = (props: IVectorMapTitleSubtitleProps) => {
  return React.createElement(NestedOption<IVectorMapTitleSubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const VectorMapTitleSubtitle = Object.assign<typeof _componentVectorMapTitleSubtitle, NestedComponentMeta>(_componentVectorMapTitleSubtitle, {
  componentType: "option",
});

export default VectorMap;
export {
  VectorMap,
  IVectorMapOptions,
  VectorMapRef,
  Annotation,
  IAnnotationProps,
  AnnotationBorder,
  IAnnotationBorderProps,
  Background,
  IBackgroundProps,
  Border,
  IBorderProps,
  CommonAnnotationSettings,
  ICommonAnnotationSettingsProps,
  ControlBar,
  IControlBarProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Image,
  IImageProps,
  Label,
  ILabelProps,
  Layer,
  ILayerProps,
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
  Projection,
  IProjectionProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Source,
  ISourceProps,
  Subtitle,
  ISubtitleProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  TooltipBorder,
  ITooltipBorderProps,
  VectorMapTitle,
  IVectorMapTitleProps,
  VectorMapTitleSubtitle,
  IVectorMapTitleSubtitleProps
};
import type * as VectorMapTypes from 'devextreme/viz/vector_map_types';
export { VectorMapTypes };

