"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxFunnel, {
    Properties
} from "devextreme/viz/funnel";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, ItemClickEvent, LegendClickEvent, dxFunnelItem, FunnelLegendItem } from "devextreme/viz/funnel";
import type { DashStyle, Font as ChartsFont, TextOverflow, WordWrap, HatchDirection, LabelPosition } from "devextreme/common/charts";
import type { ExportFormat, Format as CommonFormat, HorizontalAlignment, VerticalEdge, HorizontalEdge, Position, Orientation } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/localization";
import type { template } from "devextreme/core/templates/template";

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

interface FunnelRef {
  instance: () => dxFunnel;
}

const Funnel = memo(
  forwardRef(
    (props: React.PropsWithChildren<IFunnelOptions>, ref: ForwardedRef<FunnelRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onItemClick","onLegendClick"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
      }), []);

      const expectedChildren = useMemo(() => ({
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
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IFunnelOptions>>, {
          WidgetClass: dxFunnel,
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
) as (props: React.PropsWithChildren<IFunnelOptions> & { ref?: Ref<FunnelRef> }) => ReactElement | null;


// owners:
// Funnel
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
  dashStyle?: DashStyle;
  cornerRadius?: number;
  opacity?: number;
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
// Label
type IConnectorProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
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
// Funnel
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
  type?: CommonFormat | string;
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
// Funnel
type IFunnelTitleProps = React.PropsWithChildren<{
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
const _componentFunnelTitle = memo(
  (props: IFunnelTitleProps) => {
    return React.createElement(NestedOption<IFunnelTitleProps>, { ...props });
  }
);

const FunnelTitle: typeof _componentFunnelTitle & IElementDescriptor = Object.assign(_componentFunnelTitle, {
  OptionName: "title",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    funnelTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// FunnelTitle
type IFunnelTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentFunnelTitleSubtitle = memo(
  (props: IFunnelTitleSubtitleProps) => {
    return React.createElement(NestedOption<IFunnelTitleSubtitleProps>, { ...props });
  }
);

const FunnelTitleSubtitle: typeof _componentFunnelTitleSubtitle & IElementDescriptor = Object.assign(_componentFunnelTitleSubtitle, {
  OptionName: "subtitle",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

// owners:
// HoverStyle
// SelectionStyle
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
// Item
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
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
    hatching: { optionName: "hatching", isCollectionItem: false },
    itemBorder: { optionName: "border", isCollectionItem: false }
  },
})

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
      direction?: HatchDirection;
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
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
  };
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "item",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    itemBorder: { optionName: "border", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false }
  },
})

// owners:
// Item
// HoverStyle
// SelectionStyle
type IItemBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
const _componentItemBorder = memo(
  (props: IItemBorderProps) => {
    return React.createElement(NestedOption<IItemBorderProps>, { ...props });
  }
);

const ItemBorder: typeof _componentItemBorder & IElementDescriptor = Object.assign(_componentItemBorder, {
  OptionName: "border",
})

// owners:
// Funnel
type ILabelProps = React.PropsWithChildren<{
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
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
  format?: LocalizationFormat;
  horizontalAlignment?: HorizontalEdge;
  horizontalOffset?: number;
  position?: LabelPosition;
  showForZeroValues?: boolean;
  textOverflow?: TextOverflow;
  visible?: boolean;
  wordWrap?: WordWrap;
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    connector: { optionName: "connector", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    labelBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// Label
type ILabelBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  visible?: boolean;
  width?: number;
}>
const _componentLabelBorder = memo(
  (props: ILabelBorderProps) => {
    return React.createElement(NestedOption<ILabelBorderProps>, { ...props });
  }
);

const LabelBorder: typeof _componentLabelBorder & IElementDescriptor = Object.assign(_componentLabelBorder, {
  OptionName: "border",
})

// owners:
// Funnel
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
  customizeHint?: ((itemInfo: { item: dxFunnelItem, text: string }) => string);
  customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
  customizeText?: ((itemInfo: { item: dxFunnelItem, text: string }) => string);
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
  markerSize?: number;
  markerTemplate?: ((legendItem: FunnelLegendItem, element: any) => string | any) | template;
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
    border: { optionName: "border", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    legendBorder: { optionName: "border", isCollectionItem: false },
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
type ILegendBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentLegendBorder = memo(
  (props: ILegendBorderProps) => {
    return React.createElement(NestedOption<ILegendBorderProps>, { ...props });
  }
);

const LegendBorder: typeof _componentLegendBorder & IElementDescriptor = Object.assign(_componentLegendBorder, {
  OptionName: "border",
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
// Funnel
// FunnelTitle
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
// Item
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
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
    hatching: { optionName: "hatching", isCollectionItem: false },
    itemBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
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
// Funnel
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
// LegendTitle
// FunnelTitle
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
// Funnel
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
// Funnel
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
  contentTemplate?: ((info: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((info: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationFormat;
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

export default Funnel;
export {
  Funnel,
  IFunnelOptions,
  FunnelRef,
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

