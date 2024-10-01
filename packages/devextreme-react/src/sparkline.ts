"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSparkline, {
    Properties
} from "devextreme/viz/sparkline";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent } from "devextreme/viz/sparkline";
import type { DashStyle, Font as ChartsFont } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/common";
import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISparklineOptionsNarrowedEvents = {
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

type ISparklineOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISparklineOptionsNarrowedEvents> & IHtmlOptions>

interface SparklineRef {
  instance: () => dxSparkline;
}

const Sparkline = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISparklineOptions>, ref: ForwardedRef<SparklineRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onTooltipHidden","onTooltipShown"]), []);

      const expectedChildren = useMemo(() => ({
        margin: { optionName: "margin", isCollectionItem: false },
        size: { optionName: "size", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISparklineOptions>>, {
          WidgetClass: dxSparkline,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ISparklineOptions> & { ref?: Ref<SparklineRef> }) => ReactElement | null;


// owners:
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
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
// Tooltip
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
// Sparkline
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
// Sparkline
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
// Sparkline
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
  contentTemplate?: ((pointsInfo: any, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((pointsInfo: any) => Record<string, any>);
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  interactive?: boolean;
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
    shadow: { optionName: "shadow", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent"
  }],
})

export default Sparkline;
export {
  Sparkline,
  ISparklineOptions,
  SparklineRef,
  Border,
  IBorderProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Margin,
  IMarginProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Tooltip,
  ITooltipProps
};
import type * as SparklineTypes from 'devextreme/viz/sparkline_types';
export { SparklineTypes };

