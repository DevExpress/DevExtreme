"use client"
import dxSankey, {
    Properties
} from "devextreme/viz/sankey";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LinkClickEvent, NodeClickEvent, dxSankeyNode } from "devextreme/viz/sankey";
import type { Font as ChartsFont } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISankeyOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onDrawn?: ((e: DrawnEvent) => void);
  onExported?: ((e: ExportedEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onFileSaving?: ((e: FileSavingEvent) => void);
  onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onLinkClick?: ((e: LinkClickEvent) => void);
  onNodeClick?: ((e: NodeClickEvent) => void);
}

type ISankeyOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISankeyOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
}>

class Sankey extends BaseComponent<React.PropsWithChildren<ISankeyOptions>> {

  public get instance(): dxSankey {
    return this._instance;
  }

  protected _WidgetClass = dxSankey;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show"];

  protected independentEvents = ["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onLinkClick","onNodeClick"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator"
  };

  protected _expectedChildren = {
    adaptiveLayout: { optionName: "adaptiveLayout", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    link: { optionName: "link", isCollectionItem: false },
    loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    node: { optionName: "node", isCollectionItem: false },
    size: { optionName: "size", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false }
  };
}
(Sankey as any).propTypes = {
  adaptiveLayout: PropTypes.object,
  alignment: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "center",
      "top"])
  ])
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  hoverEnabled: PropTypes.bool,
  label: PropTypes.object,
  link: PropTypes.object,
  loadingIndicator: PropTypes.object,
  margin: PropTypes.object,
  node: PropTypes.object,
  onDisposing: PropTypes.func,
  onDrawn: PropTypes.func,
  onExported: PropTypes.func,
  onExporting: PropTypes.func,
  onFileSaving: PropTypes.func,
  onIncidentOccurred: PropTypes.func,
  onInitialized: PropTypes.func,
  onLinkClick: PropTypes.func,
  onLinkHoverChanged: PropTypes.func,
  onNodeClick: PropTypes.func,
  onNodeHoverChanged: PropTypes.func,
  onOptionChanged: PropTypes.func,
  palette: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "Bright",
      "Harmony Light",
      "Ocean",
      "Pastel",
      "Soft",
      "Soft Pastel",
      "Vintage",
      "Violet",
      "Carmine",
      "Dark Moon",
      "Dark Violet",
      "Green Mist",
      "Soft Blue",
      "Material",
      "Office"])
  ])
  ]),
  paletteExtensionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "alternate",
      "blend",
      "extrapolate"])
  ]),
  pathModified: PropTypes.bool,
  redrawOnResize: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  size: PropTypes.object,
  sourceField: PropTypes.string,
  targetField: PropTypes.string,
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
  weightField: PropTypes.string
};


// owners:
// Sankey
type IAdaptiveLayoutProps = React.PropsWithChildren<{
  height?: number;
  keepLabels?: boolean;
  width?: number;
}>
class AdaptiveLayout extends NestedOption<IAdaptiveLayoutProps> {
  public static OptionName = "adaptiveLayout";
}

// owners:
// Label
// Link
// HoverStyle
// Node
// HoverStyle
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
}

// owners:
// Sankey
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
// Label
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
// HoverStyle
// HoverStyle
type IHatchingProps = React.PropsWithChildren<{
  direction?: "left" | "none" | "right";
  opacity?: number;
  step?: number;
  width?: number;
}>
class Hatching extends NestedOption<IHatchingProps> {
  public static OptionName = "hatching";
}

// owners:
// Link
// Node
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  opacity?: number;
}>
class HoverStyle extends NestedOption<IHoverStyleProps> {
  public static OptionName = "hoverStyle";
}

// owners:
// Sankey
type ILabelProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  customizeText?: ((itemInfo: dxSankeyNode) => string);
  font?: ChartsFont;
  horizontalOffset?: number;
  overlappingBehavior?: "ellipsis" | "hide" | "none";
  shadow?: Record<string, any> | {
    blur?: number;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  useNodeColors?: boolean;
  verticalOffset?: number;
  visible?: boolean;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    sankeyborder: { optionName: "border", isCollectionItem: false },
    shadow: { optionName: "shadow", isCollectionItem: false }
  };
}

// owners:
// Sankey
type ILinkProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  colorMode?: "none" | "source" | "target" | "gradient";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: string;
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    opacity?: number;
  };
  opacity?: number;
}>
class Link extends NestedOption<ILinkProps> {
  public static OptionName = "link";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    sankeyborder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Sankey
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
// Sankey
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
// Sankey
type INodeProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: string;
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    opacity?: number;
  };
  opacity?: number;
  padding?: number;
  width?: number;
}>
class Node extends NestedOption<INodeProps> {
  public static OptionName = "node";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    sankeyborder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Label
// Link
// HoverStyle
// Node
// HoverStyle
type ISankeyborderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
class Sankeyborder extends NestedOption<ISankeyborderProps> {
  public static OptionName = "border";
}

// owners:
// Label
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
// Sankey
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
// Sankey
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
// Sankey
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
  cornerRadius?: number;
  customizeLinkTooltip?: ((info: { source: string, target: string, weight: number }) => Record<string, any>);
  customizeNodeTooltip?: ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  linkTooltipTemplate?: ((info: { source: string, target: string, weight: number }, element: any) => string | any) | template;
  nodeTooltipTemplate?: ((info: { label: string, weightIn: number, weightOut: number }, element: any) => string | any) | template;
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
  linkTooltipRender?: (...params: any) => React.ReactNode;
  linkTooltipComponent?: React.ComponentType<any>;
  linkTooltipKeyFn?: (data: any) => string;
  nodeTooltipRender?: (...params: any) => React.ReactNode;
  nodeTooltipComponent?: React.ComponentType<any>;
  nodeTooltipKeyFn?: (data: any) => string;
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
    tmplOption: "linkTooltipTemplate",
    render: "linkTooltipRender",
    component: "linkTooltipComponent",
    keyFn: "linkTooltipKeyFn"
  }, {
    tmplOption: "nodeTooltipTemplate",
    render: "nodeTooltipRender",
    component: "nodeTooltipComponent",
    keyFn: "nodeTooltipKeyFn"
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

export default Sankey;
export {
  Sankey,
  ISankeyOptions,
  AdaptiveLayout,
  IAdaptiveLayoutProps,
  Border,
  IBorderProps,
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
  Label,
  ILabelProps,
  Link,
  ILinkProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  Node,
  INodeProps,
  Sankeyborder,
  ISankeyborderProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Subtitle,
  ISubtitleProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  TooltipBorder,
  ITooltipBorderProps
};
import type * as SankeyTypes from 'devextreme/viz/sankey_types';
export { SankeyTypes };

