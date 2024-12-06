"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSankey, {
    Properties
} from "devextreme/viz/sankey";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, LinkClickEvent, NodeClickEvent, dxSankeyNode, SankeyColorMode } from "devextreme/viz/sankey";
import type { DashStyle, HatchDirection, Font as ChartsFont, TextOverflow, WordWrap } from "devextreme/common/charts";
import type { ExportFormat, Format as CommonFormat, HorizontalAlignment, VerticalEdge, template } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";

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

interface SankeyRef {
  instance: () => dxSankey;
}

const Sankey = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISankeyOptions>, ref: ForwardedRef<SankeyRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onLinkClick","onNodeClick"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
      }), []);

      const expectedChildren = useMemo(() => ({
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
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISankeyOptions>>, {
          WidgetClass: dxSankey,
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
) as (props: React.PropsWithChildren<ISankeyOptions> & { ref?: Ref<SankeyRef> }) => ReactElement | null;


// owners:
// Sankey
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
// Label
// Link
// HoverStyle
// Node
// HoverStyle
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string | undefined;
  visible?: boolean | undefined;
  width?: number | undefined;
  dashStyle?: DashStyle;
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
// Sankey
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
// HoverStyle
// HoverStyle
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
// Link
// Node
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean | undefined;
    width?: number | undefined;
  };
  color?: string | undefined;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  opacity?: number | undefined;
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
// Sankey
type ILabelProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean | undefined;
    width?: number | undefined;
  };
  customizeText?: ((itemInfo: dxSankeyNode) => string);
  font?: ChartsFont;
  horizontalOffset?: number;
  overlappingBehavior?: TextOverflow;
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
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        font: { optionName: "font", isCollectionItem: false },
        sankeyborder: { optionName: "border", isCollectionItem: false },
        shadow: { optionName: "shadow", isCollectionItem: false }
      },
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// Sankey
type ILinkProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean | undefined;
    width?: number | undefined;
  };
  color?: string;
  colorMode?: SankeyColorMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean | undefined;
      width?: number | undefined;
    };
    color?: string | undefined;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
    opacity?: number | undefined;
  };
  opacity?: number;
}>
const _componentLink = (props: ILinkProps) => {
  return React.createElement(NestedOption<ILinkProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "link",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        sankeyborder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const Link = Object.assign<typeof _componentLink, NestedComponentMeta>(_componentLink, {
  componentType: "option",
});

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
// Sankey
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
// Sankey
type INodeProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string | undefined;
    visible?: boolean | undefined;
    width?: number | undefined;
  };
  color?: string | undefined;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string | undefined;
      visible?: boolean | undefined;
      width?: number | undefined;
    };
    color?: string | undefined;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
      opacity?: number;
      step?: number;
      width?: number;
    };
    opacity?: number | undefined;
  };
  opacity?: number;
  padding?: number;
  width?: number;
}>
const _componentNode = (props: INodeProps) => {
  return React.createElement(NestedOption<INodeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "node",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        sankeyborder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const Node = Object.assign<typeof _componentNode, NestedComponentMeta>(_componentNode, {
  componentType: "option",
});

// owners:
// Label
// Link
// HoverStyle
// Node
// HoverStyle
type ISankeyborderProps = React.PropsWithChildren<{
  color?: string | undefined;
  visible?: boolean | undefined;
  width?: number | undefined;
}>
const _componentSankeyborder = (props: ISankeyborderProps) => {
  return React.createElement(NestedOption<ISankeyborderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const Sankeyborder = Object.assign<typeof _componentSankeyborder, NestedComponentMeta>(_componentSankeyborder, {
  componentType: "option",
});

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
// Sankey
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
// Sankey
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
// Sankey
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
  cornerRadius?: number;
  customizeLinkTooltip?: ((info: { source: string, target: string, weight: number }) => Record<string, any>) | undefined;
  customizeNodeTooltip?: ((info: { label: string, title: string, weightIn: number, weightOut: number }) => Record<string, any>) | undefined;
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  linkTooltipTemplate?: ((info: { source: string, target: string, weight: number }, element: any) => string | any) | template | undefined;
  nodeTooltipTemplate?: ((info: { label: string, weightIn: number, weightOut: number }, element: any) => string | any) | template | undefined;
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
  linkTooltipRender?: (...params: any) => React.ReactNode;
  linkTooltipComponent?: React.ComponentType<any>;
  nodeTooltipRender?: (...params: any) => React.ReactNode;
  nodeTooltipComponent?: React.ComponentType<any>;
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
        tmplOption: "linkTooltipTemplate",
        render: "linkTooltipRender",
        component: "linkTooltipComponent"
      }, {
        tmplOption: "nodeTooltipTemplate",
        render: "nodeTooltipRender",
        component: "nodeTooltipComponent"
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

export default Sankey;
export {
  Sankey,
  ISankeyOptions,
  SankeyRef,
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

