"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCircularGauge, {
    Properties
} from "devextreme/viz/circular_gauge";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent, CircularGaugeLabelOverlap, CircularGaugeElementOrientation } from "devextreme/viz/circular_gauge";
import type { AnimationEaseMode, DashStyle, Font as ChartsFont, LabelOverlap, ChartsColor, Palette, PaletteExtensionMode, TextOverflow, WordWrap } from "devextreme/common/charts";
import type { ExportFormat, Format as CommonFormat, HorizontalEdge, VerticalEdge, HorizontalAlignment, template } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ICircularGaugeOptionsNarrowedEvents = {
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

type ICircularGaugeOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ICircularGaugeOptionsNarrowedEvents> & IHtmlOptions & {
  centerRender?: (...params: any) => React.ReactNode;
  centerComponent?: React.ComponentType<any>;
  defaultLoadingIndicator?: Record<string, any>;
  defaultSubvalues?: Array<number>;
  defaultValue?: number | undefined;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onSubvaluesChange?: (value: Array<number>) => void;
  onValueChange?: (value: number | undefined) => void;
}>

interface CircularGaugeRef {
  instance: () => dxCircularGauge;
}

const CircularGauge = memo(
  forwardRef(
    (props: React.PropsWithChildren<ICircularGaugeOptions>, ref: ForwardedRef<CircularGaugeRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show","subvalues","value"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onTooltipHidden","onTooltipShown"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
        defaultSubvalues: "subvalues",
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        animation: { optionName: "animation", isCollectionItem: false },
        export: { optionName: "export", isCollectionItem: false },
        geometry: { optionName: "geometry", isCollectionItem: false },
        loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        rangeContainer: { optionName: "rangeContainer", isCollectionItem: false },
        scale: { optionName: "scale", isCollectionItem: false },
        size: { optionName: "size", isCollectionItem: false },
        subvalueIndicator: { optionName: "subvalueIndicator", isCollectionItem: false },
        title: { optionName: "title", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false },
        valueIndicator: { optionName: "valueIndicator", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "centerTemplate",
          render: "centerRender",
          component: "centerComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ICircularGaugeOptions>>, {
          WidgetClass: dxCircularGauge,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ICircularGaugeOptions> & { ref?: Ref<CircularGaugeRef> }) => ReactElement | null;


// owners:
// CircularGauge
type IAnimationProps = React.PropsWithChildren<{
  duration?: number;
  easing?: AnimationEaseMode;
  enabled?: boolean;
}>
const _componentAnimation = (props: IAnimationProps) => {
  return React.createElement(NestedOption<IAnimationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "animation",
    },
  });
};

const Animation = Object.assign<typeof _componentAnimation, NestedComponentMeta>(_componentAnimation, {
  componentType: "option",
});

// owners:
// RangeContainer
type IBackgroundColorProps = React.PropsWithChildren<{
  base?: string | undefined;
  fillId?: string | undefined;
}>
const _componentBackgroundColor = (props: IBackgroundColorProps) => {
  return React.createElement(NestedOption<IBackgroundColorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "backgroundColor",
    },
  });
};

const BackgroundColor = Object.assign<typeof _componentBackgroundColor, NestedComponentMeta>(_componentBackgroundColor, {
  componentType: "option",
});

// owners:
// Tooltip
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  opacity?: number | undefined;
  visible?: boolean;
  width?: number;
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
// Range
// SubvalueIndicator
type IColorProps = React.PropsWithChildren<{
  base?: string | undefined;
  fillId?: string | undefined;
}>
const _componentColor = (props: IColorProps) => {
  return React.createElement(NestedOption<IColorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "color",
    },
  });
};

const Color = Object.assign<typeof _componentColor, NestedComponentMeta>(_componentColor, {
  componentType: "option",
});

// owners:
// CircularGauge
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
// Text
// LoadingIndicator
// Tooltip
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
// Label
// Text
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
// CircularGauge
type IGeometryProps = React.PropsWithChildren<{
  endAngle?: number;
  startAngle?: number;
}>
const _componentGeometry = (props: IGeometryProps) => {
  return React.createElement(NestedOption<IGeometryProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "geometry",
    },
  });
};

const Geometry = Object.assign<typeof _componentGeometry, NestedComponentMeta>(_componentGeometry, {
  componentType: "option",
});

// owners:
// Scale
type ILabelProps = React.PropsWithChildren<{
  customizeText?: ((scaleValue: { value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  hideFirstOrLast?: CircularGaugeLabelOverlap;
  indentFromTick?: number;
  overlappingBehavior?: LabelOverlap;
  useRangeColors?: boolean;
  visible?: boolean;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        format: { optionName: "format", isCollectionItem: false }
      },
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// CircularGauge
type ILoadingIndicatorProps = React.PropsWithChildren<{
  backgroundColor?: string;
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
// CircularGauge
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
// Scale
type IMinorTickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentMinorTick = (props: IMinorTickProps) => {
  return React.createElement(NestedOption<IMinorTickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minorTick",
    },
  });
};

const MinorTick = Object.assign<typeof _componentMinorTick, NestedComponentMeta>(_componentMinorTick, {
  componentType: "option",
});

// owners:
// RangeContainer
type IRangeProps = React.PropsWithChildren<{
  color?: ChartsColor | string;
  endValue?: number;
  startValue?: number;
}>
const _componentRange = (props: IRangeProps) => {
  return React.createElement(NestedOption<IRangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "ranges",
      IsCollectionItem: true,
      ExpectedChildren: {
        color: { optionName: "color", isCollectionItem: false }
      },
    },
  });
};

const Range = Object.assign<typeof _componentRange, NestedComponentMeta>(_componentRange, {
  componentType: "option",
});

// owners:
// CircularGauge
type IRangeContainerProps = React.PropsWithChildren<{
  backgroundColor?: ChartsColor | string;
  offset?: number;
  orientation?: CircularGaugeElementOrientation;
  palette?: Array<string> | Palette;
  paletteExtensionMode?: PaletteExtensionMode;
  ranges?: Array<Record<string, any>> | {
    color?: ChartsColor | string;
    endValue?: number;
    startValue?: number;
  }[];
  width?: number;
}>
const _componentRangeContainer = (props: IRangeContainerProps) => {
  return React.createElement(NestedOption<IRangeContainerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "rangeContainer",
      ExpectedChildren: {
        backgroundColor: { optionName: "backgroundColor", isCollectionItem: false },
        range: { optionName: "ranges", isCollectionItem: true }
      },
    },
  });
};

const RangeContainer = Object.assign<typeof _componentRangeContainer, NestedComponentMeta>(_componentRangeContainer, {
  componentType: "option",
});

// owners:
// CircularGauge
type IScaleProps = React.PropsWithChildren<{
  allowDecimals?: boolean | undefined;
  customMinorTicks?: Array<number>;
  customTicks?: Array<number>;
  endValue?: number;
  label?: Record<string, any> | {
    customizeText?: ((scaleValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationFormat | undefined;
    hideFirstOrLast?: CircularGaugeLabelOverlap;
    indentFromTick?: number;
    overlappingBehavior?: LabelOverlap;
    useRangeColors?: boolean;
    visible?: boolean;
  };
  minorTick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  minorTickInterval?: number | undefined;
  orientation?: CircularGaugeElementOrientation;
  scaleDivisionFactor?: number;
  startValue?: number;
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  tickInterval?: number | undefined;
}>
const _componentScale = (props: IScaleProps) => {
  return React.createElement(NestedOption<IScaleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "scale",
      ExpectedChildren: {
        label: { optionName: "label", isCollectionItem: false },
        minorTick: { optionName: "minorTick", isCollectionItem: false },
        tick: { optionName: "tick", isCollectionItem: false }
      },
    },
  });
};

const Scale = Object.assign<typeof _componentScale, NestedComponentMeta>(_componentScale, {
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
// CircularGauge
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
// CircularGauge
type ISubvalueIndicatorProps = React.PropsWithChildren<{
  arrowLength?: number;
  backgroundColor?: string;
  baseValue?: number | undefined;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: HorizontalEdge;
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | Palette;
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string) | undefined;
    font?: ChartsFont;
    format?: LocalizationFormat | undefined;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: VerticalEdge;
  width?: number;
}>
const _componentSubvalueIndicator = (props: ISubvalueIndicatorProps) => {
  return React.createElement(NestedOption<ISubvalueIndicatorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "subvalueIndicator",
      ExpectedChildren: {
        color: { optionName: "color", isCollectionItem: false },
        text: { optionName: "text", isCollectionItem: false }
      },
    },
  });
};

const SubvalueIndicator = Object.assign<typeof _componentSubvalueIndicator, NestedComponentMeta>(_componentSubvalueIndicator, {
  componentType: "option",
});

// owners:
// SubvalueIndicator
type ITextProps = React.PropsWithChildren<{
  customizeText?: ((indicatedValue: { value: number, valueText: string }) => string) | undefined;
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  indent?: number;
}>
const _componentText = (props: ITextProps) => {
  return React.createElement(NestedOption<ITextProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "text",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        format: { optionName: "format", isCollectionItem: false }
      },
    },
  });
};

const Text = Object.assign<typeof _componentText, NestedComponentMeta>(_componentText, {
  componentType: "option",
});

// owners:
// Scale
type ITickProps = React.PropsWithChildren<{
  color?: string;
  length?: number;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentTick = (props: ITickProps) => {
  return React.createElement(NestedOption<ITickProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tick",
    },
  });
};

const Tick = Object.assign<typeof _componentTick, NestedComponentMeta>(_componentTick, {
  componentType: "option",
});

// owners:
// CircularGauge
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
// CircularGauge
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
  contentTemplate?: ((scaleValue: { value: number, valueText: string }, element: any) => string | any) | template | undefined;
  cornerRadius?: number;
  customizeTooltip?: ((scaleValue: { value: number, valueText: string }) => Record<string, any>) | undefined;
  enabled?: boolean;
  font?: ChartsFont;
  format?: LocalizationFormat | undefined;
  interactive?: boolean;
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
        shadow: { optionName: "shadow", isCollectionItem: false }
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
// CircularGauge
type IValueIndicatorProps = React.PropsWithChildren<{
  arrowLength?: number;
  backgroundColor?: string;
  baseValue?: number | undefined;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: HorizontalEdge;
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | Palette;
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string) | undefined;
    font?: ChartsFont;
    format?: LocalizationFormat | undefined;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: VerticalEdge;
  width?: number;
}>
const _componentValueIndicator = (props: IValueIndicatorProps) => {
  return React.createElement(NestedOption<IValueIndicatorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "valueIndicator",
    },
  });
};

const ValueIndicator = Object.assign<typeof _componentValueIndicator, NestedComponentMeta>(_componentValueIndicator, {
  componentType: "option",
});

export default CircularGauge;
export {
  CircularGauge,
  ICircularGaugeOptions,
  CircularGaugeRef,
  Animation,
  IAnimationProps,
  BackgroundColor,
  IBackgroundColorProps,
  Border,
  IBorderProps,
  Color,
  IColorProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Geometry,
  IGeometryProps,
  Label,
  ILabelProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  MinorTick,
  IMinorTickProps,
  Range,
  IRangeProps,
  RangeContainer,
  IRangeContainerProps,
  Scale,
  IScaleProps,
  Shadow,
  IShadowProps,
  Size,
  ISizeProps,
  Subtitle,
  ISubtitleProps,
  SubvalueIndicator,
  ISubvalueIndicatorProps,
  Text,
  ITextProps,
  Tick,
  ITickProps,
  Title,
  ITitleProps,
  Tooltip,
  ITooltipProps,
  ValueIndicator,
  IValueIndicatorProps
};
import type * as CircularGaugeTypes from 'devextreme/viz/circular_gauge_types';
export { CircularGaugeTypes };

