"use client"
import dxVectorMap, {
    Properties
} from "devextreme/viz/vector_map";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClickEvent, DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent, dxVectorMapAnnotationConfig, MapLayerElement, VectorMapLegendItem } from "devextreme/viz/vector_map";
import type { Font as ChartsFont } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";
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

class VectorMap extends BaseComponent<React.PropsWithChildren<IVectorMapOptions>> {

  public get instance(): dxVectorMap {
    return this._instance;
  }

  protected _WidgetClass = dxVectorMap;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show"];

  protected independentEvents = ["onClick","onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onTooltipHidden","onTooltipShown"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator"
  };

  protected _expectedChildren = {
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
  };
}
(VectorMap as any).propTypes = {
  annotations: PropTypes.array,
  background: PropTypes.object,
  bounds: PropTypes.array,
  center: PropTypes.array,
  commonAnnotationSettings: PropTypes.object,
  controlBar: PropTypes.object,
  customizeAnnotation: PropTypes.func,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  layers: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  legends: PropTypes.array,
  loadingIndicator: PropTypes.object,
  maxZoomFactor: PropTypes.number,
  onCenterChanged: PropTypes.func,
  onClick: PropTypes.func,
  onDisposing: PropTypes.func,
  onDrawn: PropTypes.func,
  onExported: PropTypes.func,
  onExporting: PropTypes.func,
  onFileSaving: PropTypes.func,
  onIncidentOccurred: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onTooltipHidden: PropTypes.func,
  onTooltipShown: PropTypes.func,
  onZoomFactorChanged: PropTypes.func,
  panningEnabled: PropTypes.bool,
  pathModified: PropTypes.bool,
  projection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "equirectangular",
      "lambert",
      "mercator",
      "miller"])
  ])
  ]),
  redrawOnResize: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
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
  touchEnabled: PropTypes.bool,
  wheelEnabled: PropTypes.bool,
  zoomFactor: PropTypes.number,
  zoomingEnabled: PropTypes.bool
};


// owners:
// VectorMap
type IAnnotationProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template;
  type?: "text" | "image" | "custom";
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
// VectorMap
type IBackgroundProps = React.PropsWithChildren<{
  borderColor?: string;
  color?: string;
}>
class Background extends NestedOption<IBackgroundProps> {
  public static OptionName = "background";
}

// owners:
// Annotation
// Legend
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
// VectorMap
type ICommonAnnotationSettingsProps = React.PropsWithChildren<{
  allowDragging?: boolean;
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
  textOverflow?: "ellipsis" | "hide" | "none";
  tooltipEnabled?: boolean;
  tooltipTemplate?: ((annotation: dxVectorMapAnnotationConfig | any, element: any) => string | any) | template;
  type?: "text" | "image" | "custom";
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
// VectorMap
type IControlBarProps = React.PropsWithChildren<{
  borderColor?: string;
  color?: string;
  enabled?: boolean;
  horizontalAlignment?: "center" | "left" | "right";
  margin?: number;
  opacity?: number;
  panVisible?: boolean;
  verticalAlignment?: "bottom" | "top";
  zoomVisible?: boolean;
}>
class ControlBar extends NestedOption<IControlBarProps> {
  public static OptionName = "controlBar";
}

// owners:
// VectorMap
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
class Font extends NestedOption<IFontProps> {
  public static OptionName = "font";
}

// owners:
// Annotation
type IImageProps = React.PropsWithChildren<{
  height?: number;
  url?: string;
  width?: number;
}>
class Image extends NestedOption<IImageProps> {
  public static OptionName = "image";
}

// owners:
// Layer
type ILabelProps = React.PropsWithChildren<{
  dataField?: string;
  enabled?: boolean;
  font?: ChartsFont;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

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
  elementType?: "bubble" | "dot" | "image" | "pie";
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
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  paletteIndex?: number;
  paletteSize?: number;
  selectedBorderColor?: string;
  selectedBorderWidth?: number;
  selectedColor?: string;
  selectionMode?: "single" | "multiple" | "none";
  size?: number;
  sizeGroupingField?: string;
  sizeGroups?: Array<number>;
  type?: "area" | "line" | "marker";
}>
class Layer extends NestedOption<ILayerProps> {
  public static OptionName = "layers";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    label: { optionName: "label", isCollectionItem: false }
  };
}

// owners:
// VectorMap
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
  customizeHint?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string);
  customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
  customizeText?: ((itemInfo: { color: string, end: number, index: number, size: number, start: number }) => string);
  font?: ChartsFont;
  horizontalAlignment?: "center" | "left" | "right";
  itemsAlignment?: "center" | "left" | "right";
  itemTextPosition?: "bottom" | "left" | "right" | "top";
  margin?: number | Record<string, any> | {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  markerColor?: string;
  markerShape?: "circle" | "square";
  markerSize?: number;
  markerTemplate?: ((legendItem: VectorMapLegendItem, element: any) => string | any) | template;
  orientation?: "horizontal" | "vertical";
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
  public static OptionName = "legends";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    annotationBorder: { optionName: "border", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    legendTitle: { optionName: "title", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    source: { optionName: "source", isCollectionItem: false },
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
// VectorMapTitle
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
// VectorMap
type IProjectionProps = React.PropsWithChildren<{
  aspectRatio?: number;
  from?: ((coordinates: Array<number>) => Array<number>);
  to?: ((coordinates: Array<number>) => Array<number>);
}>
class Projection extends NestedOption<IProjectionProps> {
  public static OptionName = "projection";
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
// VectorMap
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
class Size extends NestedOption<ISizeProps> {
  public static OptionName = "size";
}

// owners:
// Legend
type ISourceProps = React.PropsWithChildren<{
  grouping?: string;
  layer?: string;
}>
class Source extends NestedOption<ISourceProps> {
  public static OptionName = "source";
}

// owners:
// LegendTitle
// VectorMapTitle
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
// Legend
// VectorMap
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
// VectorMap
type ITooltipProps = React.PropsWithChildren<{
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
  contentKeyFn?: (data: any) => string;
}>
class Tooltip extends NestedOption<ITooltipProps> {
  public static OptionName = "tooltip";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
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
// VectorMap
type IVectorMapTitleProps = React.PropsWithChildren<{
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
class VectorMapTitle extends NestedOption<IVectorMapTitleProps> {
  public static OptionName = "title";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false },
    vectorMapTitleSubtitle: { optionName: "subtitle", isCollectionItem: false }
  };
}

// owners:
// VectorMapTitle
type IVectorMapTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class VectorMapTitleSubtitle extends NestedOption<IVectorMapTitleSubtitleProps> {
  public static OptionName = "subtitle";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

export default VectorMap;
export {
  VectorMap,
  IVectorMapOptions,
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

