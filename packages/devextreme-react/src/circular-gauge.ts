"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCircularGauge, {
    Properties
} from "devextreme/viz/circular_gauge";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, TooltipHiddenEvent, TooltipShownEvent } from "devextreme/viz/circular_gauge";
import type { Font as ChartsFont, ChartsColor } from "devextreme/common/charts";
import type { template } from "devextreme/core/templates/template";

import type * as LocalizationTypes from "devextreme/localization";

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
  defaultValue?: number;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onSubvaluesChange?: (value: Array<number>) => void;
  onValueChange?: (value: number) => void;
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
  easing?: "easeOutCubic" | "linear";
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
  base?: string;
  fillId?: string;
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
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  opacity?: number;
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
  base?: string;
  fillId?: string;
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
  formats?: Array<"GIF" | "JPEG" | "PDF" | "PNG" | "SVG">;
  margin?: number;
  printingEnabled?: boolean;
  svgToCanvas?: ((svg: any, canvas: any) => any);
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
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
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
  format?: LocalizationTypes.Format;
  hideFirstOrLast?: "first" | "last";
  indentFromTick?: number;
  overlappingBehavior?: "hide" | "none";
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
  orientation?: "center" | "inside" | "outside";
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  paletteExtensionMode?: "alternate" | "blend" | "extrapolate";
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
  allowDecimals?: boolean;
  customMinorTicks?: Array<number>;
  customTicks?: Array<number>;
  endValue?: number;
  label?: Record<string, any> | {
    customizeText?: ((scaleValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    hideFirstOrLast?: "first" | "last";
    indentFromTick?: number;
    overlappingBehavior?: "hide" | "none";
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
  minorTickInterval?: number;
  orientation?: "center" | "inside" | "outside";
  scaleDivisionFactor?: number;
  startValue?: number;
  tick?: Record<string, any> | {
    color?: string;
    length?: number;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  tickInterval?: number;
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
  height?: number;
  width?: number;
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
  textOverflow?: "ellipsis" | "hide" | "none";
  wordWrap?: "normal" | "breakWord" | "none";
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
  baseValue?: number;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: "left" | "right";
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: "bottom" | "top";
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
  customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
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
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  color?: string;
  container?: any | string;
  contentTemplate?: ((scaleValue: { value: number, valueText: string }, element: any) => string | any) | template;
  cornerRadius?: number;
  customizeTooltip?: ((scaleValue: { value: number, valueText: string }) => Record<string, any>);
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
  baseValue?: number;
  beginAdaptingAtRadius?: number;
  color?: ChartsColor | string;
  horizontalOrientation?: "left" | "right";
  indentFromCenter?: number;
  length?: number;
  offset?: number;
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  secondColor?: string;
  secondFraction?: number;
  size?: number;
  spindleGapSize?: number;
  spindleSize?: number;
  text?: Record<string, any> | {
    customizeText?: ((indicatedValue: { value: number, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    indent?: number;
  };
  type?: "circle" | "rangeBar" | "rectangle" | "rectangleNeedle" | "rhombus" | "textCloud" | "triangleMarker" | "triangleNeedle" | "twoColorNeedle";
  verticalOrientation?: "bottom" | "top";
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

