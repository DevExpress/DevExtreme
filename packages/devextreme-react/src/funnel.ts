"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxFunnel, {
    Properties
} from "devextreme/viz/funnel";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, ItemClickEvent, LegendClickEvent, dxFunnelItem, FunnelLegendItem } from "devextreme/viz/funnel";
import type { DashStyle, Font as ChartsFont, TextOverflow, WordWrap, HatchDirection, LabelPosition } from "devextreme/common/charts";
import type { ExportFormat, Format as CommonFormat, HorizontalAlignment, VerticalEdge, HorizontalEdge, Position, template, Orientation } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";

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
// Item
// HoverStyle
// SelectionStyle
// Label
// Legend
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string | undefined;
  visible?: boolean | undefined;
  width?: number | undefined;
  dashStyle?: DashStyle;
  cornerRadius?: number;
  opacity?: number | undefined;
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
// Label
type IConnectorProps = React.PropsWithChildren<{
  color?: string | undefined;
  opacity?: number;
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
// Funnel
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
const _componentFunnelTitle = (props: IFunnelTitleProps) => {
  return React.createElement(NestedOption<IFunnelTitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        funnelTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        subtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const FunnelTitle = Object.assign<typeof _componentFunnelTitle, NestedComponentMeta>(_componentFunnelTitle, {
  componentType: "option",
});

// owners:
// FunnelTitle
type IFunnelTitleSubtitleProps = React.PropsWithChildren<{
  font?: ChartsFont;
  offset?: number;
  text?: string;
  textOverflow?: TextOverflow;
  wordWrap?: WordWrap;
}>
const _componentFunnelTitleSubtitle = (props: IFunnelTitleSubtitleProps) => {
  return React.createElement(NestedOption<IFunnelTitleSubtitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subtitle",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const FunnelTitleSubtitle = Object.assign<typeof _componentFunnelTitleSubtitle, NestedComponentMeta>(_componentFunnelTitleSubtitle, {
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
// Item
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean | undefined;
    width?: number | undefined;
  };
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
}>
const _componentHoverStyle = (props: IHoverStyleProps) => {
  return React.createElement(NestedOption<IHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        itemBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const HoverStyle = Object.assign<typeof _componentHoverStyle, NestedComponentMeta>(_componentHoverStyle, {
  componentType: "option",
});

// owners:
// Funnel
type IItemProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean | undefined;
    width?: number | undefined;
  };
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean | undefined;
      width?: number | undefined;
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
      color?: string | undefined;
      visible?: boolean | undefined;
      width?: number | undefined;
    };
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
  };
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "item",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        itemBorder: { optionName: "border", isCollectionItem: false },
        selectionStyle: { optionName: "selectionStyle", isCollectionItem: false }
      },
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// Item
// HoverStyle
// SelectionStyle
type IItemBorderProps = React.PropsWithChildren<{
  color?: string | undefined;
  visible?: boolean | undefined;
  width?: number | undefined;
}>
const _componentItemBorder = (props: IItemBorderProps) => {
  return React.createElement(NestedOption<IItemBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const ItemBorder = Object.assign<typeof _componentItemBorder, NestedComponentMeta>(_componentItemBorder, {
  componentType: "option",
});

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
    color?: string | undefined;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  customizeText?: ((itemInfo: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  horizontalAlignment?: HorizontalEdge;
  horizontalOffset?: number;
  position?: LabelPosition;
  showForZeroValues?: boolean;
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
        border: { optionName: "border", isCollectionItem: false },
        connector: { optionName: "connector", isCollectionItem: false },
        font: { optionName: "font", isCollectionItem: false },
        format: { optionName: "format", isCollectionItem: false },
        labelBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// Label
type ILabelBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  visible?: boolean;
  width?: number;
}>
const _componentLabelBorder = (props: ILabelBorderProps) => {
  return React.createElement(NestedOption<ILabelBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const LabelBorder = Object.assign<typeof _componentLabelBorder, NestedComponentMeta>(_componentLabelBorder, {
  componentType: "option",
});

// owners:
// Funnel
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
  customizeHint?: ((itemInfo: { item: dxFunnelItem, text: string }) => string);
  customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
  customizeText?: ((itemInfo: { item: dxFunnelItem, text: string }) => string);
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
  markerSize?: number;
  markerTemplate?: ((legendItem: FunnelLegendItem, element: any) => string | any) | template | undefined;
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
    },
  });
};

const Legend = Object.assign<typeof _componentLegend, NestedComponentMeta>(_componentLegend, {
  componentType: "option",
});

// owners:
// Legend
type ILegendBorderProps = React.PropsWithChildren<{
  color?: string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
  opacity?: number | undefined;
  visible?: boolean;
  width?: number;
}>
const _componentLegendBorder = (props: ILegendBorderProps) => {
  return React.createElement(NestedOption<ILegendBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const LegendBorder = Object.assign<typeof _componentLegendBorder, NestedComponentMeta>(_componentLegendBorder, {
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
// Funnel
// FunnelTitle
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
// Item
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean | undefined;
    width?: number | undefined;
  };
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
}>
const _componentSelectionStyle = (props: ISelectionStyleProps) => {
  return React.createElement(NestedOption<ISelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        itemBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const SelectionStyle = Object.assign<typeof _componentSelectionStyle, NestedComponentMeta>(_componentSelectionStyle, {
  componentType: "option",
});

// owners:
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
// Funnel
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
// LegendTitle
// FunnelTitle
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
// Funnel
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
        funnelTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        legendTitleSubtitle: { optionName: "subtitle", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false }
      },
    },
  });
};

const Title = Object.assign<typeof _componentTitle, NestedComponentMeta>(_componentTitle, {
  componentType: "option",
});

// owners:
// Funnel
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
  contentTemplate?: ((info: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }, element: any) => string | any) | template | undefined;
  cornerRadius?: number;
  customizeTooltip?: ((info: { item: dxFunnelItem, percent: number, percentText: string, value: number, valueText: string }) => Record<string, any>) | undefined;
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
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

