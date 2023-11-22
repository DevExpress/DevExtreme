"use client"
import dxTreeMap, {
    Properties
} from "devextreme/viz/tree_map";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClickEvent, DisposingEvent, DrawnEvent, DrillEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, NodesInitializedEvent, NodesRenderingEvent, dxTreeMapNode } from "devextreme/viz/tree_map";
import type { Font as ChartsFont } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ITreeMapOptionsNarrowedEvents = {
  onClick?: ((e: ClickEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onDrawn?: ((e: DrawnEvent) => void);
  onDrill?: ((e: DrillEvent) => void);
  onExported?: ((e: ExportedEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onFileSaving?: ((e: FileSavingEvent) => void);
  onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onNodesInitialized?: ((e: NodesInitializedEvent) => void);
  onNodesRendering?: ((e: NodesRenderingEvent) => void);
}

type ITreeMapOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ITreeMapOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
}>

class TreeMap extends BaseComponent<React.PropsWithChildren<ITreeMapOptions>> {

  public get instance(): dxTreeMap {
    return this._instance;
  }

  protected _WidgetClass = dxTreeMap;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show"];

  protected independentEvents = ["onClick","onDisposing","onDrawn","onDrill","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onNodesInitialized","onNodesRendering"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator"
  };

  protected _expectedChildren = {
    colorizer: { optionName: "colorizer", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    group: { optionName: "group", isCollectionItem: false },
    loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
    size: { optionName: "size", isCollectionItem: false },
    tile: { optionName: "tile", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false }
  };
}
(TreeMap as any).propTypes = {
  childrenField: PropTypes.string,
  colorField: PropTypes.string,
  colorizer: PropTypes.object,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  group: PropTypes.object,
  hoverEnabled: PropTypes.bool,
  idField: PropTypes.string,
  interactWithGroup: PropTypes.bool,
  labelField: PropTypes.string,
  layoutAlgorithm: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "sliceanddice",
      "squarified",
      "strip"])
  ])
  ]),
  layoutDirection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "leftBottomRightTop",
      "leftTopRightBottom",
      "rightBottomLeftTop",
      "rightTopLeftBottom"])
  ]),
  loadingIndicator: PropTypes.object,
  maxDepth: PropTypes.number,
  onClick: PropTypes.func,
  onDisposing: PropTypes.func,
  onDrawn: PropTypes.func,
  onDrill: PropTypes.func,
  onExported: PropTypes.func,
  onExporting: PropTypes.func,
  onFileSaving: PropTypes.func,
  onHoverChanged: PropTypes.func,
  onIncidentOccurred: PropTypes.func,
  onInitialized: PropTypes.func,
  onNodesInitialized: PropTypes.func,
  onNodesRendering: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  parentField: PropTypes.string,
  pathModified: PropTypes.bool,
  redrawOnResize: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple",
      "none"])
  ]),
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
  tile: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  tooltip: PropTypes.object,
  valueField: PropTypes.string
};


// owners:
// Group
// HoverStyle
// SelectionStyle
// Tile
// HoverStyle
// SelectionStyle
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  width?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
}

// owners:
// TreeMap
type IColorizerProps = React.PropsWithChildren<{
  colorCodeField?: string;
  colorizeGroups?: boolean;
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  paletteExtensionMode?: "alternate" | "blend" | "extrapolate";
  range?: Array<number>;
  type?: "discrete" | "gradient" | "none" | "range";
}>
class Colorizer extends NestedOption<IColorizerProps> {
  public static OptionName = "colorizer";
}

// owners:
// TreeMap
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
// GroupLabel
// TileLabel
// Tooltip
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
// Tooltip
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
// TreeMap
type IGroupProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    width?: number;
  };
  color?: string;
  headerHeight?: number;
  hoverEnabled?: boolean;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      width?: number;
    };
    color?: string;
  };
  label?: Record<string, any> | {
    font?: ChartsFont;
    textOverflow?: "ellipsis" | "hide" | "none";
    visible?: boolean;
  };
  padding?: number;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      width?: number;
    };
    color?: string;
  };
}>
class Group extends NestedOption<IGroupProps> {
  public static OptionName = "group";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    groupLabel: { optionName: "label", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    treeMapborder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Group
type IGroupLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  textOverflow?: "ellipsis" | "hide" | "none";
  visible?: boolean;
}>
class GroupLabel extends NestedOption<IGroupLabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// Group
// Tile
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    width?: number;
  };
  color?: string;
}>
class HoverStyle extends NestedOption<IHoverStyleProps> {
  public static OptionName = "hoverStyle";
}

// owners:
// Group
// Tile
type ILabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  textOverflow?: "ellipsis" | "hide" | "none";
  visible?: boolean;
  wordWrap?: "normal" | "breakWord" | "none";
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
}

// owners:
// TreeMap
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
// Group
// Tile
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    width?: number;
  };
  color?: string;
}>
class SelectionStyle extends NestedOption<ISelectionStyleProps> {
  public static OptionName = "selectionStyle";
}

// owners:
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
// TreeMap
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
class Size extends NestedOption<ISizeProps> {
  public static OptionName = "size";
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
// TreeMap
type ITileProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    width?: number;
  };
  color?: string;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      width?: number;
    };
    color?: string;
  };
  label?: Record<string, any> | {
    font?: ChartsFont;
    textOverflow?: "ellipsis" | "hide" | "none";
    visible?: boolean;
    wordWrap?: "normal" | "breakWord" | "none";
  };
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      width?: number;
    };
    color?: string;
  };
}>
class Tile extends NestedOption<ITileProps> {
  public static OptionName = "tile";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    tileLabel: { optionName: "label", isCollectionItem: false },
    treeMapborder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Tile
type ITileLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  textOverflow?: "ellipsis" | "hide" | "none";
  visible?: boolean;
  wordWrap?: "normal" | "breakWord" | "none";
}>
class TileLabel extends NestedOption<ITileLabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// TreeMap
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
// TreeMap
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
  contentTemplate?: ((info: { node: dxTreeMapNode, value: number, valueText: string }, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((info: { node: dxTreeMapNode, value: number, valueText: string }) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
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
    format: { optionName: "format", isCollectionItem: false },
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
// Group
// HoverStyle
// SelectionStyle
// Tile
// HoverStyle
// SelectionStyle
type ITreeMapborderProps = React.PropsWithChildren<{
  color?: string;
  width?: number;
}>
class TreeMapborder extends NestedOption<ITreeMapborderProps> {
  public static OptionName = "border";
}

export default TreeMap;
export {
  TreeMap,
  ITreeMapOptions,
  Border,
  IBorderProps,
  Colorizer,
  IColorizerProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Group,
  IGroupProps,
  GroupLabel,
  IGroupLabelProps,
  HoverStyle,
  IHoverStyleProps,
  Label,
  ILabelProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  SelectionStyle,
  ISelectionStyleProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Subtitle,
  ISubtitleProps,
  Tile,
  ITileProps,
  TileLabel,
  ITileLabelProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  TooltipBorder,
  ITooltipBorderProps,
  TreeMapborder,
  ITreeMapborderProps
};
import type * as TreeMapTypes from 'devextreme/viz/tree_map_types';
export { TreeMapTypes };

