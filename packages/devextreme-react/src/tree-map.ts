"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxTreeMap, {
    Properties
} from "devextreme/viz/tree_map";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClickEvent, DisposingEvent, DrawnEvent, DrillEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, NodesInitializedEvent, NodesRenderingEvent, TreeMapColorizerType, dxTreeMapNode } from "devextreme/viz/tree_map";
import type { DashStyle, Palette, PaletteExtensionMode, Font as ChartsFont, TextOverflow, WordWrap } from "devextreme/common/charts";
import type { ExportFormat, Format as CommonFormat, HorizontalAlignment, VerticalEdge, template } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";

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

interface TreeMapRef {
  instance: () => dxTreeMap;
}

const TreeMap = memo(
  forwardRef(
    (props: React.PropsWithChildren<ITreeMapOptions>, ref: ForwardedRef<TreeMapRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show"]), []);
      const independentEvents = useMemo(() => (["onClick","onDisposing","onDrawn","onDrill","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onNodesInitialized","onNodesRendering"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
      }), []);

      const expectedChildren = useMemo(() => ({
        colorizer: { optionName: "colorizer", isCollectionItem: false },
        export: { optionName: "export", isCollectionItem: false },
        group: { optionName: "group", isCollectionItem: false },
        loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
        size: { optionName: "size", isCollectionItem: false },
        tile: { optionName: "tile", isCollectionItem: false },
        title: { optionName: "title", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ITreeMapOptions>>, {
          WidgetClass: dxTreeMap,
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
) as (props: React.PropsWithChildren<ITreeMapOptions> & { ref?: Ref<TreeMapRef> }) => ReactElement | null;


// owners:
// Group
// HoverStyle
// SelectionStyle
// Tile
// HoverStyle
// SelectionStyle
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string | undefined;
  width?: number | undefined;
  dashStyle?: DashStyle;
  opacity?: number | undefined;
  visible?: boolean;
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
// TreeMap
type IColorizerProps = React.PropsWithChildren<{
  colorCodeField?: string | undefined;
  colorizeGroups?: boolean;
  palette?: Array<string> | Palette;
  paletteExtensionMode?: PaletteExtensionMode;
  range?: Array<number>;
  type?: TreeMapColorizerType | undefined;
}>
const _componentColorizer = (props: IColorizerProps) => {
  return React.createElement(NestedOption<IColorizerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "colorizer",
    },
  });
};

const Colorizer = Object.assign<typeof _componentColorizer, NestedComponentMeta>(_componentColorizer, {
  componentType: "option",
});

// owners:
// TreeMap
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
// TreeMap
type IGroupProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    width?: number | undefined;
  };
  color?: string;
  headerHeight?: number | undefined;
  hoverEnabled?: boolean | undefined;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      width?: number | undefined;
    };
    color?: string | undefined;
  };
  label?: Record<string, any> | {
    font?: ChartsFont;
    textOverflow?: TextOverflow;
    visible?: boolean;
  };
  padding?: number;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      width?: number | undefined;
    };
    color?: string | undefined;
  };
}>
const _componentGroup = (props: IGroupProps) => {
  return React.createElement(NestedOption<IGroupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "group",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        groupLabel: { optionName: "label", isCollectionItem: false },
        hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false },
        selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
        treeMapborder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const Group = Object.assign<typeof _componentGroup, NestedComponentMeta>(_componentGroup, {
  componentType: "option",
});

// owners:
// Group
type IGroupLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  textOverflow?: TextOverflow;
  visible?: boolean;
}>
const _componentGroupLabel = (props: IGroupLabelProps) => {
  return React.createElement(NestedOption<IGroupLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const GroupLabel = Object.assign<typeof _componentGroupLabel, NestedComponentMeta>(_componentGroupLabel, {
  componentType: "option",
});

// owners:
// Group
// Tile
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    width?: number | undefined;
  };
  color?: string | undefined;
}>
const _componentHoverStyle = (props: IHoverStyleProps) => {
  return React.createElement(NestedOption<IHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
    },
  });
};

const HoverStyle = Object.assign<typeof _componentHoverStyle, NestedComponentMeta>(_componentHoverStyle, {
  componentType: "option",
});

// owners:
// Group
// Tile
type ILabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
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
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

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
// Title
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
// Group
// Tile
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    width?: number | undefined;
  };
  color?: string | undefined;
}>
const _componentSelectionStyle = (props: ISelectionStyleProps) => {
  return React.createElement(NestedOption<ISelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
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
// TreeMap
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
// Title
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
// TreeMap
type ITileProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    width?: number | undefined;
  };
  color?: string;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      width?: number | undefined;
    };
    color?: string | undefined;
  };
  label?: Record<string, any> | {
    font?: ChartsFont;
    textOverflow?: TextOverflow;
    visible?: boolean;
    wordWrap?: WordWrap;
  };
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      width?: number | undefined;
    };
    color?: string | undefined;
  };
}>
const _componentTile = (props: ITileProps) => {
  return React.createElement(NestedOption<ITileProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tile",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false },
        selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
        tileLabel: { optionName: "label", isCollectionItem: false },
        treeMapborder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const Tile = Object.assign<typeof _componentTile, NestedComponentMeta>(_componentTile, {
  componentType: "option",
});

// owners:
// Tile
type ITileLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  textOverflow?: TextOverflow;
  visible?: boolean;
  wordWrap?: WordWrap;
}>
const _componentTileLabel = (props: ITileLabelProps) => {
  return React.createElement(NestedOption<ITileLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false }
      },
    },
  });
};

const TileLabel = Object.assign<typeof _componentTileLabel, NestedComponentMeta>(_componentTileLabel, {
  componentType: "option",
});

// owners:
// TreeMap
type ITitleProps = React.PropsWithChildren<{
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
const _componentTitle = (props: ITitleProps) => {
  return React.createElement(NestedOption<ITitleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "title",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        subtitle: { optionName: "subtitle", isCollectionItem: false }
      },
    },
  });
};

const Title = Object.assign<typeof _componentTitle, NestedComponentMeta>(_componentTitle, {
  componentType: "option",
});

// owners:
// TreeMap
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
  contentTemplate?: ((info: { node: dxTreeMapNode, value: number, valueText: string }, element: any) => string | any) | template | undefined;
  cornerRadius?: number;
  customizeTooltip?: ((info: { node: dxTreeMapNode, value: number, valueText: string }) => Record<string, any>) | undefined;
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

// owners:
// Group
// HoverStyle
// SelectionStyle
// Tile
// HoverStyle
// SelectionStyle
type ITreeMapborderProps = React.PropsWithChildren<{
  color?: string | undefined;
  width?: number | undefined;
}>
const _componentTreeMapborder = (props: ITreeMapborderProps) => {
  return React.createElement(NestedOption<ITreeMapborderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const TreeMapborder = Object.assign<typeof _componentTreeMapborder, NestedComponentMeta>(_componentTreeMapborder, {
  componentType: "option",
});

export default TreeMap;
export {
  TreeMap,
  ITreeMapOptions,
  TreeMapRef,
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

