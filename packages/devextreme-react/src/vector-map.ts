"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxVectorMap, {
    Properties
} from "devextreme/viz/vector_map";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClickEvent, DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent, dxVectorMapAnnotationConfig, MapLayerElement, VectorMapMarkerType, VectorMapLayerType, VectorMapLegendItem, VectorMapMarkerShape } from "devextreme/viz/vector_map";
import type { DashStyle, Font as ChartsFont, TextOverflow, AnnotationType, WordWrap, Palette } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";
import type { HorizontalAlignment, VerticalEdge, ExportFormat, SingleMultipleOrNone, Position, Orientation } from "devextreme/common";
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
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  coordinates?: Array<number>;
  customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>);
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
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template;
  type?: AnnotationType;
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
// VectorMap
type IBackgroundProps = React.PropsWithChildren<{
  borderColor?: string;
  color?: string;
}>
const _componentBackground = memo(
  (props: IBackgroundProps) => {
    return React.createElement(NestedOption<IBackgroundProps>, { ...props });
  }
);

const Background: typeof _componentBackground & IElementDescriptor = Object.assign(_componentBackground, {
  OptionName: "background",
})

// owners:
// Annotation
// Legend
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
// VectorMap
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  coordinates?: Array<number>;
  customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => Record<string, any>);
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
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  template?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template;
  text?: string;
  textOverflow?: TextOverflow;
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template;
  type?: AnnotationType;
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
const _componentControlBar = memo(
  (props: IControlBarProps) => {
    return React.createElement(NestedOption<IControlBarProps>, { ...props });
  }
);

const ControlBar: typeof _componentControlBar & IElementDescriptor = Object.assign(_componentControlBar, {
  OptionName: "controlBar",
})

// owners:
// VectorMap
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
const _componentFont = memo(
  (props: IFontProps) => {
    return React.createElement(NestedOption<IFontProps>, { ...props });
  }
);

const Font: typeof _componentFont & IElementDescriptor = Object.assign(_componentFont, {
  OptionName: "font",
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
// Layer
type ILabelProps = React.PropsWithChildren<{
  dataField?: string;
  enabled?: boolean;
  font?: ChartsFont;
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

// owners:
// VectorMap
type ILayerProps = React.PropsWithChildren<{
  borderColor?: string;
  borderWidth?: number;
  color?: string;
  colorGroupingField?: string;
  colorGroups?: Array<number>;
  customize?: ((elements: Array<MapLayerElement>) => void);
  dataField?: string;
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
  sizeGroupingField?: string;
  sizeGroups?: Array<number>;
  type?: VectorMapLayerType;
}>
const _componentLayer = memo(
  (props: ILayerProps) => {
    return React.createElement(NestedOption<ILayerProps>, { ...props });
  }
);

const Layer: typeof _componentLayer & IElementDescriptor = Object.assign(_componentLayer, {
  OptionName: "layers",
  IsCollectionItem: true,
  ExpectedChildren: {
    label: { optionName: "label", isCollectionItem: false }
  },
})

// owners:
// VectorMap
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
  customizeHint?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string);
  customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
  customizeText?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string);
  font?: ChartsFont;
  horizontalAlignment?: HorizontalAlignment;
  itemsAlignment?: HorizontalAlignment;
  itemTextPosition?: Position;
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerColor?: string;
  markerShape?: VectorMapMarkerShape;
  markerSize?: number;
  markerTemplate?: ((legendItem: VectorMapLegendItem, element: any) => string | any) | template;
  orientation?: Orientation;
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
// VectorMapTitle
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
// VectorMap
type IProjectionProps = React.PropsWithChildren<{
  aspectRatio?: number;
  from?: ((coordinates: Array<number>) => Array<number>);
  to?: ((coordinates: Array<number>) => Array<number>);
}>
const _componentProjection = memo(
  (props: IProjectionProps) => {
    return React.createElement(NestedOption<IProjectionProps>, { ...props });
  }
);

const Projection: typeof _componentProjection & IElementDescriptor = Object.assign(_componentProjection, {
  OptionName: "projection",
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
// VectorMap
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
// Legend
type ISourceProps = React.PropsWithChildren<{
  grouping?: string;
  layer?: string;
}>
const _componentSource = memo(
  (props: ISourceProps) => {
    return React.createElement(NestedOption<ISourceProps>, { ...props });
  }
);

const Source: typeof _componentSource & IElementDescriptor = Object.assign(_componentSource, {
  OptionName: "source",
})

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
// VectorMap
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
// VectorMap
type ITooltipProps = React.PropsWithChildren<{
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
  contentTemplate?: ((info: MapLayerElement, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((info: MapLayerElement) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
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
const _componentVectorMapTitle = memo(
  (props: IVectorMapTitleProps) => {
    return React.createElement(NestedOption<IVectorMapTitleProps>, { ...props });
  }
);

const VectorMapTitle: typeof _componentVectorMapTitle & IElementDescriptor = Object.assign(_componentVectorMapTitle, {
  OptionName: "title",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false },
    vectorMapTitleSubtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// VectorMapTitle
type IVectorMapTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentVectorMapTitleSubtitle = memo(
  (props: IVectorMapTitleSubtitleProps) => {
    return React.createElement(NestedOption<IVectorMapTitleSubtitleProps>, { ...props });
  }
);

const VectorMapTitleSubtitle: typeof _componentVectorMapTitleSubtitle & IElementDescriptor = Object.assign(_componentVectorMapTitleSubtitle, {
  OptionName: "subtitle",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

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

