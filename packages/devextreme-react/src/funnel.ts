"use client"
import dxFunnel, {
    Properties
} from "devextreme/viz/funnel";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, ItemClickEvent, LegendClickEvent, dxFunnelItem, FunnelLegendItem } from "devextreme/viz/funnel";
import type { Font as ChartsFont } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IFunnelOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onDrawn?: ((e: DrawnEvent) => void);
  onExported?: ((e: ExportedEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onFileSaving?: ((e: FileSavingEvent) => void);
  onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
  onLegendClick?: ((e: LegendClickEvent) => void);
}

type IFunnelOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IFunnelOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
}>

class Funnel extends BaseComponent<React.PropsWithChildren<IFunnelOptions>> {

  public get instance(): dxFunnel {
    return this._instance;
  }

  protected _WidgetClass = dxFunnel;

  protected subscribableOptions = ["loadingIndicator","loadingIndicator.show"];

  protected independentEvents = ["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onItemClick","onLegendClick"];

  protected _defaults = {
    defaultLoadingIndicator: "loadingIndicator"
  };

  protected _expectedChildren = {
    adaptiveLayout: { optionName: "adaptiveLayout", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    funnelTitle: { optionName: "title", isCollectionItem: false },
    item: { optionName: "item", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    legend: { optionName: "legend", isCollectionItem: false },
    loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    size: { optionName: "size", isCollectionItem: false },
    title: { optionName: "title", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false }
  };
}
(Funnel as any).propTypes = {
  adaptiveLayout: PropTypes.object,
  algorithm: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "dynamicHeight",
      "dynamicSlope"])
  ]),
  argumentField: PropTypes.string,
  colorField: PropTypes.string,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  export: PropTypes.object,
  hoverEnabled: PropTypes.bool,
  inverted: PropTypes.bool,
  item: PropTypes.object,
  label: PropTypes.object,
  legend: PropTypes.object,
  loadingIndicator: PropTypes.object,
  margin: PropTypes.object,
  neckHeight: PropTypes.number,
  neckWidth: PropTypes.number,
  onDisposing: PropTypes.func,
  onDrawn: PropTypes.func,
  onExported: PropTypes.func,
  onExporting: PropTypes.func,
  onFileSaving: PropTypes.func,
  onHoverChanged: PropTypes.func,
  onIncidentOccurred: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onLegendClick: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
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
  resolveLabelOverlapping: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "hide",
      "none",
      "shift"])
  ]),
  rtlEnabled: PropTypes.bool,
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple",
      "none"])
  ]),
  size: PropTypes.object,
  sortData: PropTypes.bool,
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
  valueField: PropTypes.string
};


// owners:
// Funnel
type IAdaptiveLayoutProps = React.PropsWithChildren<{
  height?: number;
  keepLabels?: boolean;
  width?: number;
}>
class AdaptiveLayout extends NestedOption<IAdaptiveLayoutProps> {
  public static OptionName = "adaptiveLayout";
}

// owners:
// Item
// HoverStyle
// SelectionStyle
// Label
// Legend
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  cornerRadius?: number;
  opacity?: number;
}>
class Border extends NestedOption<IBorderProps> {
  public static OptionName = "border";
}

// owners:
// Label
type IConnectorProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class Connector extends NestedOption<IConnectorProps> {
  public static OptionName = "connector";
}

// owners:
// Funnel
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
// Legend
// LegendTitle
// LegendTitleSubtitle
// Tooltip
// LoadingIndicator
// FunnelTitle
// FunnelTitleSubtitle
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
class Format extends NestedOption<IFormatProps> {
  public static OptionName = "format";
}

// owners:
// Funnel
type IFunnelTitleProps = React.PropsWithChildren<{
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
class FunnelTitle extends NestedOption<IFunnelTitleProps> {
  public static OptionName = "title";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false },
    funnelTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  };
}

// owners:
// FunnelTitle
type IFunnelTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
}>
class FunnelTitleSubtitle extends NestedOption<IFunnelTitleSubtitleProps> {
  public static OptionName = "subtitle";
  public static ExpectedChildren = {
    font: { optionName: "font", isCollectionItem: false }
  };
}

// owners:
// HoverStyle
// SelectionStyle
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
// Item
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
}>
class HoverStyle extends NestedOption<IHoverStyleProps> {
  public static OptionName = "hoverStyle";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    itemBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Funnel
type IItemProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
  };
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
  };
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "item";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    itemBorder: { optionName: "border", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false }
  };
}

// owners:
// Item
// HoverStyle
// SelectionStyle
type IItemBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
class ItemBorder extends NestedOption<IItemBorderProps> {
  public static OptionName = "border";
}

// owners:
// Funnel
type ILabelProps = React.PropsWithChildren<{
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  connector?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  customizeText?: ((itemInfo: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  horizontalAlignment?: "left" | "right";
  horizontalOffset?: number;
  position?: "columns" | "inside" | "outside";
  showForZeroValues?: boolean;
  textOverflow?: "ellipsis" | "hide" | "none";
  visible?: boolean;
  wordWrap?: "normal" | "breakWord" | "none";
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    connector: { optionName: "connector", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    labelBorder: { optionName: "border", isCollectionItem: false }
  };
}

// owners:
// Label
type ILabelBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  visible?: boolean;
  width?: number;
}>
class LabelBorder extends NestedOption<ILabelBorderProps> {
  public static OptionName = "border";
}

// owners:
// Funnel
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
  customizeHint?: ((itemInfo: { item: dxFunnelItem, text: string }) => string);
  customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
  customizeText?: ((itemInfo: { item: dxFunnelItem, text: string }) => string);
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
  markerSize?: number;
  markerTemplate?: ((legendItem: FunnelLegendItem, element: any) => string | any) | template;
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
  markerKeyFn?: (data: any) => string;
}>
class Legend extends NestedOption<ILegendProps> {
  public static OptionName = "legend";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    legendBorder: { optionName: "border", isCollectionItem: false },
    legendTitle: { optionName: "title", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
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
type ILegendBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
class LegendBorder extends NestedOption<ILegendBorderProps> {
  public static OptionName = "border";
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
// Funnel
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
// Funnel
// FunnelTitle
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
// Item
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
}>
class SelectionStyle extends NestedOption<ISelectionStyleProps> {
  public static OptionName = "selectionStyle";
  public static ExpectedChildren = {
    border: { optionName: "border", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    itemBorder: { optionName: "border", isCollectionItem: false }
  };
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
// Funnel
type ISizeProps = React.PropsWithChildren<{
  height?: number;
  width?: number;
}>
class Size extends NestedOption<ISizeProps> {
  public static OptionName = "size";
}

// owners:
// LegendTitle
// FunnelTitle
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
// Funnel
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
// Funnel
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
  contentTemplate?: ((info: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((info: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => Record<string, any>);
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

export default Funnel;
export {
  Funnel,
  IFunnelOptions,
  AdaptiveLayout,
  IAdaptiveLayoutProps,
  Border,
  IBorderProps,
  Connector,
  IConnectorProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  FunnelTitle,
  IFunnelTitleProps,
  FunnelTitleSubtitle,
  IFunnelTitleSubtitleProps,
  Hatching,
  IHatchingProps,
  HoverStyle,
  IHoverStyleProps,
  Item,
  IItemProps,
  ItemBorder,
  IItemBorderProps,
  Label,
  ILabelProps,
  LabelBorder,
  ILabelBorderProps,
  Legend,
  ILegendProps,
  LegendBorder,
  ILegendBorderProps,
  LegendTitle,
  ILegendTitleProps,
  LegendTitleSubtitle,
  ILegendTitleSubtitleProps,
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
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  TooltipBorder,
  ITooltipBorderProps
};
import type * as FunnelTypes from 'devextreme/viz/funnel_types';
export { FunnelTypes };

