"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxTreeMap, {
    Properties
} from "devextreme/viz/tree_map";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ClickEvent, DisposingEvent, DrawnEvent, DrillEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, NodesInitializedEvent, NodesRenderingEvent, TreeMapColorizerType, dxTreeMapNode } from "devextreme/viz/tree_map";
import type { DashStyle, Palette, PaletteExtensionMode, Font as ChartsFont, TextOverflow, WordWrap } from "devextreme/common/charts";
import type { ExportFormat, HorizontalAlignment, VerticalEdge } from "devextreme/common";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/common";
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
  color?: string;
  width?: number;
  dashStyle?: DashStyle;
  opacity?: number;
  visible?: boolean;
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
// TreeMap
type IColorizerProps = React.PropsWithChildren<{
  colorCodeField?: string;
  colorizeGroups?: boolean;
  palette?: Array<string> | Palette;
  paletteExtensionMode?: PaletteExtensionMode;
  range?: Array<number>;
  type?: TreeMapColorizerType;
}>
const _componentColorizer = memo(
  (props: IColorizerProps) => {
    return React.createElement(NestedOption<IColorizerProps>, { ...props });
  }
);

const Colorizer: typeof _componentColorizer & IElementDescriptor = Object.assign(_componentColorizer, {
  OptionName: "colorizer",
})

// owners:
// TreeMap
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
const _componentFont = memo(
  (props: IFontProps) => {
    return React.createElement(NestedOption<IFontProps>, { ...props });
  }
);

const Font: typeof _componentFont & IElementDescriptor = Object.assign(_componentFont, {
  OptionName: "font",
})

// owners:
// Tooltip
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: LocalizationTypes.Format | string;
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
    textOverflow?: TextOverflow;
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
const _componentGroup = memo(
  (props: IGroupProps) => {
    return React.createElement(NestedOption<IGroupProps>, { ...props });
  }
);

const Group: typeof _componentGroup & IElementDescriptor = Object.assign(_componentGroup, {
  OptionName: "group",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    groupLabel: { optionName: "label", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    treeMapborder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// Group
type IGroupLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  textOverflow?: TextOverflow;
  visible?: boolean;
}>
const _componentGroupLabel = memo(
  (props: IGroupLabelProps) => {
    return React.createElement(NestedOption<IGroupLabelProps>, { ...props });
  }
);

const GroupLabel: typeof _componentGroupLabel & IElementDescriptor = Object.assign(_componentGroupLabel, {
  OptionName: "label",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

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
const _componentHoverStyle = memo(
  (props: IHoverStyleProps) => {
    return React.createElement(NestedOption<IHoverStyleProps>, { ...props });
  }
);

const HoverStyle: typeof _componentHoverStyle & IElementDescriptor = Object.assign(_componentHoverStyle, {
  OptionName: "hoverStyle",
})

// owners:
// Group
// Tile
type ILabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
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
})

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
// Title
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
// Group
// Tile
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    width?: number;
  };
  color?: string;
}>
const _componentSelectionStyle = memo(
  (props: ISelectionStyleProps) => {
    return React.createElement(NestedOption<ISelectionStyleProps>, { ...props });
  }
);

const SelectionStyle: typeof _componentSelectionStyle & IElementDescriptor = Object.assign(_componentSelectionStyle, {
  OptionName: "selectionStyle",
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
// TreeMap
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
// Title
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
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

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
    textOverflow?: TextOverflow;
    visible?: boolean;
    wordWrap?: WordWrap;
  };
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      width?: number;
    };
    color?: string;
  };
}>
const _componentTile = memo(
  (props: ITileProps) => {
    return React.createElement(NestedOption<ITileProps>, { ...props });
  }
);

const Tile: typeof _componentTile & IElementDescriptor = Object.assign(_componentTile, {
  OptionName: "tile",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
    label: { optionName: "label", isCollectionItem: false },
    selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
    tileLabel: { optionName: "label", isCollectionItem: false },
    treeMapborder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// Tile
type ITileLabelProps = React.PropsWithChildren<{
  font?: ChartsFont;
  textOverflow?: TextOverflow;
  visible?: boolean;
  wordWrap?: WordWrap;
}>
const _componentTileLabel = memo(
  (props: ITileLabelProps) => {
    return React.createElement(NestedOption<ITileLabelProps>, { ...props });
  }
);

const TileLabel: typeof _componentTileLabel & IElementDescriptor = Object.assign(_componentTileLabel, {
  OptionName: "label",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false }
  },
})

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
const _componentTitle = memo(
  (props: ITitleProps) => {
    return React.createElement(NestedOption<ITitleProps>, { ...props });
  }
);

const Title: typeof _componentTitle & IElementDescriptor = Object.assign(_componentTitle, {
  OptionName: "title",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    margin: { optionName: "margin", isCollectionItem: false },
    subtitle: { optionName: "subtitle", isCollectionItem: false }
  },
})

// owners:
// TreeMap
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
const _componentTreeMapborder = memo(
  (props: ITreeMapborderProps) => {
    return React.createElement(NestedOption<ITreeMapborderProps>, { ...props });
  }
);

const TreeMapborder: typeof _componentTreeMapborder & IElementDescriptor = Object.assign(_componentTreeMapborder, {
  OptionName: "border",
})

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

