"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxRangeSelector, {
    Properties
} from "devextreme/viz/range_selector";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, ValueChangedEvent } from "devextreme/viz/range_selector";
import type { chartPointAggregationInfoObject, chartSeriesObject, dxChartCommonSeriesSettings } from "devextreme/viz/chart";
import type { ChartSeries } from "devextreme/viz/common";
import type { ChartsColor, Font as ChartsFont, ScaleBreak } from "devextreme/common/charts";

import type * as CommonChartTypes from "devextreme/common/charts";
import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IRangeSelectorOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onDrawn?: ((e: DrawnEvent) => void);
  onExported?: ((e: ExportedEvent) => void);
  onExporting?: ((e: ExportingEvent) => void);
  onFileSaving?: ((e: FileSavingEvent) => void);
  onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IRangeSelectorOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IRangeSelectorOptionsNarrowedEvents> & IHtmlOptions & {
  defaultLoadingIndicator?: Record<string, any>;
  defaultValue?: Array<Date | number | string> | CommonChartTypes.VisualRange;
  onLoadingIndicatorChange?: (value: Record<string, any>) => void;
  onValueChange?: (value: Array<Date | number | string> | CommonChartTypes.VisualRange) => void;
}>

interface RangeSelectorRef {
  instance: () => dxRangeSelector;
}

const RangeSelector = memo(
  forwardRef(
    (props: React.PropsWithChildren<IRangeSelectorOptions>, ref: ForwardedRef<RangeSelectorRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["loadingIndicator","loadingIndicator.show","value"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onDrawn","onExported","onExporting","onFileSaving","onIncidentOccurred","onInitialized","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultLoadingIndicator: "loadingIndicator",
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        background: { optionName: "background", isCollectionItem: false },
        behavior: { optionName: "behavior", isCollectionItem: false },
        chart: { optionName: "chart", isCollectionItem: false },
        export: { optionName: "export", isCollectionItem: false },
        indent: { optionName: "indent", isCollectionItem: false },
        loadingIndicator: { optionName: "loadingIndicator", isCollectionItem: false },
        margin: { optionName: "margin", isCollectionItem: false },
        scale: { optionName: "scale", isCollectionItem: false },
        shutter: { optionName: "shutter", isCollectionItem: false },
        size: { optionName: "size", isCollectionItem: false },
        sliderHandle: { optionName: "sliderHandle", isCollectionItem: false },
        sliderMarker: { optionName: "sliderMarker", isCollectionItem: false },
        title: { optionName: "title", isCollectionItem: false },
        value: { optionName: "value", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IRangeSelectorOptions>>, {
          WidgetClass: dxRangeSelector,
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
) as (props: React.PropsWithChildren<IRangeSelectorOptions> & { ref?: Ref<RangeSelectorRef> }) => ReactElement | null;


// owners:
// CommonSeriesSettings
type IAggregationProps = React.PropsWithChildren<{
  calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
  enabled?: boolean;
  method?: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom";
}>
const _componentAggregation = (props: IAggregationProps) => {
  return React.createElement(NestedOption<IAggregationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aggregation",
    },
  });
};

const Aggregation = Object.assign<typeof _componentAggregation, NestedComponentMeta>(_componentAggregation, {
  componentType: "option",
});

// owners:
// Scale
type IAggregationIntervalProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
const _componentAggregationInterval = (props: IAggregationIntervalProps) => {
  return React.createElement(NestedOption<IAggregationIntervalProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "aggregationInterval",
    },
  });
};

const AggregationInterval = Object.assign<typeof _componentAggregationInterval, NestedComponentMeta>(_componentAggregationInterval, {
  componentType: "option",
});

// owners:
// CommonSeriesSettingsLabel
type IArgumentFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
const _componentArgumentFormat = (props: IArgumentFormatProps) => {
  return React.createElement(NestedOption<IArgumentFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "argumentFormat",
    },
  });
};

const ArgumentFormat = Object.assign<typeof _componentArgumentFormat, NestedComponentMeta>(_componentArgumentFormat, {
  componentType: "option",
});

// owners:
// RangeSelector
type IBackgroundProps = React.PropsWithChildren<{
  color?: string;
  image?: Record<string, any> | {
    location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop";
    url?: string;
  };
  visible?: boolean;
}>
const _componentBackground = (props: IBackgroundProps) => {
  return React.createElement(NestedOption<IBackgroundProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "background",
      ExpectedChildren: {
        backgroundImage: { optionName: "image", isCollectionItem: false },
        image: { optionName: "image", isCollectionItem: false }
      },
    },
  });
};

const Background = Object.assign<typeof _componentBackground, NestedComponentMeta>(_componentBackground, {
  componentType: "option",
});

// owners:
// Background
type IBackgroundImageProps = React.PropsWithChildren<{
  location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop";
  url?: string;
}>
const _componentBackgroundImage = (props: IBackgroundImageProps) => {
  return React.createElement(NestedOption<IBackgroundImageProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "image",
    },
  });
};

const BackgroundImage = Object.assign<typeof _componentBackgroundImage, NestedComponentMeta>(_componentBackgroundImage, {
  componentType: "option",
});

// owners:
// RangeSelector
type IBehaviorProps = React.PropsWithChildren<{
  allowSlidersSwap?: boolean;
  animationEnabled?: boolean;
  callValueChanged?: "onMoving" | "onMovingComplete";
  manualRangeSelectionEnabled?: boolean;
  moveSelectedRangeByClick?: boolean;
  snapToTicks?: boolean;
  valueChangeMode?: "onHandleMove" | "onHandleRelease";
}>
const _componentBehavior = (props: IBehaviorProps) => {
  return React.createElement(NestedOption<IBehaviorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "behavior",
    },
  });
};

const Behavior = Object.assign<typeof _componentBehavior, NestedComponentMeta>(_componentBehavior, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsLabel
// CommonSeriesSettingsSelectionStyle
// Point
// PointHoverStyle
// PointSelectionStyle
type IBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
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
// Scale
type IBreakProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  startValue?: Date | number | string;
}>
const _componentBreak = (props: IBreakProps) => {
  return React.createElement(NestedOption<IBreakProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "breaks",
      IsCollectionItem: true,
    },
  });
};

const Break = Object.assign<typeof _componentBreak, NestedComponentMeta>(_componentBreak, {
  componentType: "option",
});

// owners:
// Scale
type IBreakStyleProps = React.PropsWithChildren<{
  color?: string;
  line?: "straight" | "waved";
  width?: number;
}>
const _componentBreakStyle = (props: IBreakStyleProps) => {
  return React.createElement(NestedOption<IBreakStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "breakStyle",
    },
  });
};

const BreakStyle = Object.assign<typeof _componentBreakStyle, NestedComponentMeta>(_componentBreakStyle, {
  componentType: "option",
});

// owners:
// RangeSelector
type IChartProps = React.PropsWithChildren<{
  barGroupPadding?: number;
  barGroupWidth?: number;
  bottomIndent?: number;
  commonSeriesSettings?: dxChartCommonSeriesSettings;
  dataPrepareSettings?: Record<string, any> | {
    checkTypeForAllData?: boolean;
    convertToAxisDataType?: boolean;
    sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
  };
  maxBubbleSize?: number;
  minBubbleSize?: number;
  negativesAsZeroes?: boolean;
  palette?: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office";
  paletteExtensionMode?: "alternate" | "blend" | "extrapolate";
  series?: Array<ChartSeries> | ChartSeries;
  seriesTemplate?: Record<string, any> | {
    customizeSeries?: ((seriesName: any) => ChartSeries);
    nameField?: string;
  };
  topIndent?: number;
  valueAxis?: Record<string, any> | {
    inverted?: boolean;
    logarithmBase?: number;
    max?: number;
    min?: number;
    type?: "continuous" | "logarithmic";
    valueType?: "datetime" | "numeric" | "string";
  };
}>
const _componentChart = (props: IChartProps) => {
  return React.createElement(NestedOption<IChartProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "chart",
      ExpectedChildren: {
        commonSeriesSettings: { optionName: "commonSeriesSettings", isCollectionItem: false },
        dataPrepareSettings: { optionName: "dataPrepareSettings", isCollectionItem: false },
        series: { optionName: "series", isCollectionItem: true },
        seriesTemplate: { optionName: "seriesTemplate", isCollectionItem: false },
        valueAxis: { optionName: "valueAxis", isCollectionItem: false }
      },
    },
  });
};

const Chart = Object.assign<typeof _componentChart, NestedComponentMeta>(_componentChart, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// Point
// PointHoverStyle
// PointSelectionStyle
// CommonSeriesSettingsSelectionStyle
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
// Chart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom";
  };
  area?: any;
  argumentField?: string;
  axis?: string;
  bar?: any;
  barOverlapGroup?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  bubble?: any;
  candlestick?: any;
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  fullstackedarea?: any;
  fullstackedbar?: any;
  fullstackedline?: any;
  fullstackedspline?: any;
  fullstackedsplinearea?: any;
  highValueField?: string;
  hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  ignoreEmptyPoints?: boolean;
  innerColor?: string;
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    argumentFormat?: LocalizationTypes.Format;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    connector?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    customizeText?: ((pointInfo: any) => string);
    displayFormat?: string;
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    horizontalOffset?: number;
    position?: "inside" | "outside";
    rotationAngle?: number;
    showForZeroValues?: boolean;
    verticalOffset?: number;
    visible?: boolean;
  };
  line?: any;
  lowValueField?: string;
  maxLabelCount?: number;
  minBarSize?: number;
  opacity?: number;
  openValueField?: string;
  pane?: string;
  point?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    hoverStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    image?: Record<string, any> | string | {
      height?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
      url?: Record<string, any> | string | {
        rangeMaxPoint?: string;
        rangeMinPoint?: string;
      };
      width?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
    };
    selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    selectionStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    size?: number;
    symbol?: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp";
    visible?: boolean;
  };
  rangearea?: any;
  rangebar?: any;
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: "close" | "high" | "low" | "open";
  };
  scatter?: any;
  selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  showInLegend?: boolean;
  sizeField?: string;
  spline?: any;
  splinearea?: any;
  stack?: string;
  stackedarea?: any;
  stackedbar?: any;
  stackedline?: any;
  stackedspline?: any;
  stackedsplinearea?: any;
  steparea?: any;
  stepline?: any;
  stock?: any;
  tagField?: string;
  type?: "area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock";
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: "auto" | "high" | "low" | "none";
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance";
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettings = (props: ICommonSeriesSettingsProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "commonSeriesSettings",
      ExpectedChildren: {
        aggregation: { optionName: "aggregation", isCollectionItem: false },
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        commonSeriesSettingsHoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        commonSeriesSettingsLabel: { optionName: "label", isCollectionItem: false },
        commonSeriesSettingsSelectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
        hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false },
        point: { optionName: "point", isCollectionItem: false },
        reduction: { optionName: "reduction", isCollectionItem: false },
        selectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false },
        valueErrorBar: { optionName: "valueErrorBar", isCollectionItem: false }
      },
    },
  });
};

const CommonSeriesSettings = Object.assign<typeof _componentCommonSeriesSettings, NestedComponentMeta>(_componentCommonSeriesSettings, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettingsHoverStyle = (props: ICommonSeriesSettingsHoverStyleProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const CommonSeriesSettingsHoverStyle = Object.assign<typeof _componentCommonSeriesSettingsHoverStyle, NestedComponentMeta>(_componentCommonSeriesSettingsHoverStyle, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsLabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  argumentFormat?: LocalizationTypes.Format;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  connector?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  customizeText?: ((pointInfo: any) => string);
  displayFormat?: string;
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  horizontalOffset?: number;
  position?: "inside" | "outside";
  rotationAngle?: number;
  showForZeroValues?: boolean;
  verticalOffset?: number;
  visible?: boolean;
}>
const _componentCommonSeriesSettingsLabel = (props: ICommonSeriesSettingsLabelProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        argumentFormat: { optionName: "argumentFormat", isCollectionItem: false },
        border: { optionName: "border", isCollectionItem: false },
        connector: { optionName: "connector", isCollectionItem: false },
        font: { optionName: "font", isCollectionItem: false },
        format: { optionName: "format", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const CommonSeriesSettingsLabel = Object.assign<typeof _componentCommonSeriesSettingsLabel, NestedComponentMeta>(_componentCommonSeriesSettingsLabel, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsSelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettingsSelectionStyle = (props: ICommonSeriesSettingsSelectionStyleProps) => {
  return React.createElement(NestedOption<ICommonSeriesSettingsSelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        hatching: { optionName: "hatching", isCollectionItem: false },
        seriesBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const CommonSeriesSettingsSelectionStyle = Object.assign<typeof _componentCommonSeriesSettingsSelectionStyle, NestedComponentMeta>(_componentCommonSeriesSettingsSelectionStyle, {
  componentType: "option",
});

// owners:
// CommonSeriesSettingsLabel
type IConnectorProps = React.PropsWithChildren<{
  color?: string;
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
// Chart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
}>
const _componentDataPrepareSettings = (props: IDataPrepareSettingsProps) => {
  return React.createElement(NestedOption<IDataPrepareSettingsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dataPrepareSettings",
    },
  });
};

const DataPrepareSettings = Object.assign<typeof _componentDataPrepareSettings, NestedComponentMeta>(_componentDataPrepareSettings, {
  componentType: "option",
});

// owners:
// RangeSelector
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
// CommonSeriesSettingsLabel
// ScaleLabel
// SliderMarker
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
// CommonSeriesSettingsLabel
// ScaleLabel
// MarkerLabel
// SliderMarker
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
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsSelectionStyle
type IHatchingProps = React.PropsWithChildren<{
  direction?: "left" | "none" | "right";
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
// PointImage
type IHeightProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentHeight = (props: IHeightProps) => {
  return React.createElement(NestedOption<IHeightProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "height",
    },
  });
};

const Height = Object.assign<typeof _componentHeight, NestedComponentMeta>(_componentHeight, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
// Point
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
  size?: number;
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
// Background
// Point
type IImageProps = React.PropsWithChildren<{
  location?: "center" | "centerBottom" | "centerTop" | "full" | "leftBottom" | "leftCenter" | "leftTop" | "rightBottom" | "rightCenter" | "rightTop";
  url?: string | Record<string, any> | {
    rangeMaxPoint?: string;
    rangeMinPoint?: string;
  };
  height?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
  width?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
}>
const _componentImage = (props: IImageProps) => {
  return React.createElement(NestedOption<IImageProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "image",
    },
  });
};

const Image = Object.assign<typeof _componentImage, NestedComponentMeta>(_componentImage, {
  componentType: "option",
});

// owners:
// RangeSelector
type IIndentProps = React.PropsWithChildren<{
  left?: number;
  right?: number;
}>
const _componentIndent = (props: IIndentProps) => {
  return React.createElement(NestedOption<IIndentProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "indent",
    },
  });
};

const Indent = Object.assign<typeof _componentIndent, NestedComponentMeta>(_componentIndent, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
// Scale
// Marker
type ILabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  argumentFormat?: LocalizationTypes.Format;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  connector?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  customizeText?: ((pointInfo: any) => string);
  displayFormat?: string;
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  horizontalOffset?: number;
  position?: "inside" | "outside";
  rotationAngle?: number;
  showForZeroValues?: boolean;
  verticalOffset?: number;
  visible?: boolean;
  overlappingBehavior?: "hide" | "none";
  topIndent?: number;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// Value
type ILengthProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
const _componentLength = (props: ILengthProps) => {
  return React.createElement(NestedOption<ILengthProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "length",
    },
  });
};

const Length = Object.assign<typeof _componentLength, NestedComponentMeta>(_componentLength, {
  componentType: "option",
});

// owners:
// RangeSelector
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
// RangeSelector
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
type IMarkerProps = React.PropsWithChildren<{
  label?: Record<string, any> | {
    customizeText?: ((markerValue: { value: Date | number, valueText: string }) => string);
    format?: LocalizationTypes.Format;
  };
  separatorHeight?: number;
  textLeftIndent?: number;
  textTopIndent?: number;
  topIndent?: number;
  visible?: boolean;
}>
const _componentMarker = (props: IMarkerProps) => {
  return React.createElement(NestedOption<IMarkerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "marker",
      ExpectedChildren: {
        label: { optionName: "label", isCollectionItem: false },
        markerLabel: { optionName: "label", isCollectionItem: false }
      },
    },
  });
};

const Marker = Object.assign<typeof _componentMarker, NestedComponentMeta>(_componentMarker, {
  componentType: "option",
});

// owners:
// Marker
type IMarkerLabelProps = React.PropsWithChildren<{
  customizeText?: ((markerValue: { value: Date | number, valueText: string }) => string);
  format?: LocalizationTypes.Format;
}>
const _componentMarkerLabel = (props: IMarkerLabelProps) => {
  return React.createElement(NestedOption<IMarkerLabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        format: { optionName: "format", isCollectionItem: false }
      },
    },
  });
};

const MarkerLabel = Object.assign<typeof _componentMarkerLabel, NestedComponentMeta>(_componentMarkerLabel, {
  componentType: "option",
});

// owners:
// Scale
type IMaxRangeProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
const _componentMaxRange = (props: IMaxRangeProps) => {
  return React.createElement(NestedOption<IMaxRangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "maxRange",
    },
  });
};

const MaxRange = Object.assign<typeof _componentMaxRange, NestedComponentMeta>(_componentMaxRange, {
  componentType: "option",
});

// owners:
// Scale
type IMinorTickProps = React.PropsWithChildren<{
  color?: string;
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
// Scale
type IMinorTickIntervalProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
const _componentMinorTickInterval = (props: IMinorTickIntervalProps) => {
  return React.createElement(NestedOption<IMinorTickIntervalProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minorTickInterval",
    },
  });
};

const MinorTickInterval = Object.assign<typeof _componentMinorTickInterval, NestedComponentMeta>(_componentMinorTickInterval, {
  componentType: "option",
});

// owners:
// Scale
type IMinRangeProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
const _componentMinRange = (props: IMinRangeProps) => {
  return React.createElement(NestedOption<IMinRangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "minRange",
    },
  });
};

const MinRange = Object.assign<typeof _componentMinRange, NestedComponentMeta>(_componentMinRange, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type IPointProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    size?: number;
  };
  image?: Record<string, any> | string | {
    height?: number | Record<string, any> | {
      rangeMaxPoint?: number;
      rangeMinPoint?: number;
    };
    url?: Record<string, any> | string | {
      rangeMaxPoint?: string;
      rangeMinPoint?: string;
    };
    width?: number | Record<string, any> | {
      rangeMaxPoint?: number;
      rangeMinPoint?: number;
    };
  };
  selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    size?: number;
  };
  size?: number;
  symbol?: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp";
  visible?: boolean;
}>
const _componentPoint = (props: IPointProps) => {
  return React.createElement(NestedOption<IPointProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "point",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        hoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        image: { optionName: "image", isCollectionItem: false },
        pointBorder: { optionName: "border", isCollectionItem: false },
        pointHoverStyle: { optionName: "hoverStyle", isCollectionItem: false },
        pointImage: { optionName: "image", isCollectionItem: false },
        pointSelectionStyle: { optionName: "selectionStyle", isCollectionItem: false },
        selectionStyle: { optionName: "selectionStyle", isCollectionItem: false }
      },
    },
  });
};

const Point = Object.assign<typeof _componentPoint, NestedComponentMeta>(_componentPoint, {
  componentType: "option",
});

// owners:
// Point
// PointHoverStyle
// PointSelectionStyle
type IPointBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
const _componentPointBorder = (props: IPointBorderProps) => {
  return React.createElement(NestedOption<IPointBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const PointBorder = Object.assign<typeof _componentPointBorder, NestedComponentMeta>(_componentPointBorder, {
  componentType: "option",
});

// owners:
// Point
type IPointHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  size?: number;
}>
const _componentPointHoverStyle = (props: IPointHoverStyleProps) => {
  return React.createElement(NestedOption<IPointHoverStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hoverStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        pointBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const PointHoverStyle = Object.assign<typeof _componentPointHoverStyle, NestedComponentMeta>(_componentPointHoverStyle, {
  componentType: "option",
});

// owners:
// Point
type IPointImageProps = React.PropsWithChildren<{
  height?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
  url?: Record<string, any> | string | {
    rangeMaxPoint?: string;
    rangeMinPoint?: string;
  };
  width?: number | Record<string, any> | {
    rangeMaxPoint?: number;
    rangeMinPoint?: number;
  };
}>
const _componentPointImage = (props: IPointImageProps) => {
  return React.createElement(NestedOption<IPointImageProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "image",
      ExpectedChildren: {
        height: { optionName: "height", isCollectionItem: false },
        url: { optionName: "url", isCollectionItem: false },
        width: { optionName: "width", isCollectionItem: false }
      },
    },
  });
};

const PointImage = Object.assign<typeof _componentPointImage, NestedComponentMeta>(_componentPointImage, {
  componentType: "option",
});

// owners:
// Point
type IPointSelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  size?: number;
}>
const _componentPointSelectionStyle = (props: IPointSelectionStyleProps) => {
  return React.createElement(NestedOption<IPointSelectionStyleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selectionStyle",
      ExpectedChildren: {
        border: { optionName: "border", isCollectionItem: false },
        color: { optionName: "color", isCollectionItem: false },
        pointBorder: { optionName: "border", isCollectionItem: false }
      },
    },
  });
};

const PointSelectionStyle = Object.assign<typeof _componentPointSelectionStyle, NestedComponentMeta>(_componentPointSelectionStyle, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type IReductionProps = React.PropsWithChildren<{
  color?: string;
  level?: "close" | "high" | "low" | "open";
}>
const _componentReduction = (props: IReductionProps) => {
  return React.createElement(NestedOption<IReductionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "reduction",
    },
  });
};

const Reduction = Object.assign<typeof _componentReduction, NestedComponentMeta>(_componentReduction, {
  componentType: "option",
});

// owners:
// RangeSelector
type IScaleProps = React.PropsWithChildren<{
  aggregateByCategory?: boolean;
  aggregationGroupWidth?: number;
  aggregationInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  allowDecimals?: boolean;
  breaks?: Array<ScaleBreak> | {
    endValue?: Date | number | string;
    startValue?: Date | number | string;
  }[];
  breakStyle?: Record<string, any> | {
    color?: string;
    line?: "straight" | "waved";
    width?: number;
  };
  categories?: Array<Date | number | string>;
  discreteAxisDivisionMode?: "betweenLabels" | "crossLabels";
  endOnTick?: boolean;
  endValue?: Date | number | string;
  holidays?: Array<Date | string> | Array<number>;
  label?: Record<string, any> | {
    customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    overlappingBehavior?: "hide" | "none";
    topIndent?: number;
    visible?: boolean;
  };
  linearThreshold?: number;
  logarithmBase?: number;
  marker?: Record<string, any> | {
    label?: Record<string, any> | {
      customizeText?: ((markerValue: { value: Date | number, valueText: string }) => string);
      format?: LocalizationTypes.Format;
    };
    separatorHeight?: number;
    textLeftIndent?: number;
    textTopIndent?: number;
    topIndent?: number;
    visible?: boolean;
  };
  maxRange?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  minorTick?: Record<string, any> | {
    color?: string;
    opacity?: number;
    visible?: boolean;
    width?: number;
  };
  minorTickCount?: number;
  minorTickInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  minRange?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  placeholderHeight?: number;
  showCustomBoundaryTicks?: boolean;
  singleWorkdays?: Array<Date | string> | Array<number>;
  startValue?: Date | number | string;
  tick?: Record<string, any> | {
    color?: string;
    opacity?: number;
    width?: number;
  };
  tickInterval?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  type?: "continuous" | "discrete" | "logarithmic" | "semidiscrete";
  valueType?: "datetime" | "numeric" | "string";
  workdaysOnly?: boolean;
  workWeek?: Array<number>;
}>
const _componentScale = (props: IScaleProps) => {
  return React.createElement(NestedOption<IScaleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "scale",
      ExpectedChildren: {
        aggregationInterval: { optionName: "aggregationInterval", isCollectionItem: false },
        break: { optionName: "breaks", isCollectionItem: true },
        breakStyle: { optionName: "breakStyle", isCollectionItem: false },
        label: { optionName: "label", isCollectionItem: false },
        marker: { optionName: "marker", isCollectionItem: false },
        maxRange: { optionName: "maxRange", isCollectionItem: false },
        minorTick: { optionName: "minorTick", isCollectionItem: false },
        minorTickInterval: { optionName: "minorTickInterval", isCollectionItem: false },
        minRange: { optionName: "minRange", isCollectionItem: false },
        scaleLabel: { optionName: "label", isCollectionItem: false },
        tick: { optionName: "tick", isCollectionItem: false },
        tickInterval: { optionName: "tickInterval", isCollectionItem: false }
      },
    },
  });
};

const Scale = Object.assign<typeof _componentScale, NestedComponentMeta>(_componentScale, {
  componentType: "option",
});

// owners:
// Scale
type IScaleLabelProps = React.PropsWithChildren<{
  customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  overlappingBehavior?: "hide" | "none";
  topIndent?: number;
  visible?: boolean;
}>
const _componentScaleLabel = (props: IScaleLabelProps) => {
  return React.createElement(NestedOption<IScaleLabelProps>, {
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

const ScaleLabel = Object.assign<typeof _componentScaleLabel, NestedComponentMeta>(_componentScaleLabel, {
  componentType: "option",
});

// owners:
// Point
// CommonSeriesSettings
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
  };
  color?: ChartsColor | string;
  size?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  hatching?: Record<string, any> | {
    direction?: "left" | "none" | "right";
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
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
// Chart
type ISeriesProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom";
  };
  argumentField?: string;
  axis?: string;
  barOverlapGroup?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    visible?: boolean;
    width?: number;
  };
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  highValueField?: string;
  hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint";
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  ignoreEmptyPoints?: boolean;
  innerColor?: string;
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    argumentFormat?: LocalizationTypes.Format;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    connector?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    customizeText?: ((pointInfo: any) => string);
    displayFormat?: string;
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    horizontalOffset?: number;
    position?: "inside" | "outside";
    rotationAngle?: number;
    showForZeroValues?: boolean;
    verticalOffset?: number;
    visible?: boolean;
  };
  lowValueField?: string;
  maxLabelCount?: number;
  minBarSize?: number;
  name?: string;
  opacity?: number;
  openValueField?: string;
  pane?: string;
  point?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    hoverMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    hoverStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    image?: Record<string, any> | string | {
      height?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
      url?: Record<string, any> | string | {
        rangeMaxPoint?: string;
        rangeMinPoint?: string;
      };
      width?: number | Record<string, any> | {
        rangeMaxPoint?: number;
        rangeMinPoint?: number;
      };
    };
    selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint";
    selectionStyle?: Record<string, any> | {
      border?: Record<string, any> | {
        color?: string;
        visible?: boolean;
        width?: number;
      };
      color?: ChartsColor | string;
      size?: number;
    };
    size?: number;
    symbol?: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp";
    visible?: boolean;
  };
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: "close" | "high" | "low" | "open";
  };
  selectionMode?: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint";
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: "dash" | "dot" | "longDash" | "solid";
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: "dash" | "dot" | "longDash" | "solid";
    hatching?: Record<string, any> | {
      direction?: "left" | "none" | "right";
      opacity?: number;
      step?: number;
      width?: number;
    };
    highlight?: boolean;
    width?: number;
  };
  showInLegend?: boolean;
  sizeField?: string;
  stack?: string;
  tag?: any;
  tagField?: string;
  type?: "area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock";
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: "auto" | "high" | "low" | "none";
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance";
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
const _componentSeries = (props: ISeriesProps) => {
  return React.createElement(NestedOption<ISeriesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "series",
      IsCollectionItem: true,
    },
  });
};

const Series = Object.assign<typeof _componentSeries, NestedComponentMeta>(_componentSeries, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsLabel
// CommonSeriesSettingsSelectionStyle
type ISeriesBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: "dash" | "dot" | "longDash" | "solid";
  visible?: boolean;
  width?: number;
}>
const _componentSeriesBorder = (props: ISeriesBorderProps) => {
  return React.createElement(NestedOption<ISeriesBorderProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "border",
    },
  });
};

const SeriesBorder = Object.assign<typeof _componentSeriesBorder, NestedComponentMeta>(_componentSeriesBorder, {
  componentType: "option",
});

// owners:
// Chart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => ChartSeries);
  nameField?: string;
}>
const _componentSeriesTemplate = (props: ISeriesTemplateProps) => {
  return React.createElement(NestedOption<ISeriesTemplateProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "seriesTemplate",
    },
  });
};

const SeriesTemplate = Object.assign<typeof _componentSeriesTemplate, NestedComponentMeta>(_componentSeriesTemplate, {
  componentType: "option",
});

// owners:
// RangeSelector
type IShutterProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
}>
const _componentShutter = (props: IShutterProps) => {
  return React.createElement(NestedOption<IShutterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "shutter",
    },
  });
};

const Shutter = Object.assign<typeof _componentShutter, NestedComponentMeta>(_componentShutter, {
  componentType: "option",
});

// owners:
// RangeSelector
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
// RangeSelector
type ISliderHandleProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  width?: number;
}>
const _componentSliderHandle = (props: ISliderHandleProps) => {
  return React.createElement(NestedOption<ISliderHandleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "sliderHandle",
    },
  });
};

const SliderHandle = Object.assign<typeof _componentSliderHandle, NestedComponentMeta>(_componentSliderHandle, {
  componentType: "option",
});

// owners:
// RangeSelector
type ISliderMarkerProps = React.PropsWithChildren<{
  color?: string;
  customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  invalidRangeColor?: string;
  paddingLeftRight?: number;
  paddingTopBottom?: number;
  placeholderHeight?: number;
  visible?: boolean;
}>
const _componentSliderMarker = (props: ISliderMarkerProps) => {
  return React.createElement(NestedOption<ISliderMarkerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "sliderMarker",
      ExpectedChildren: {
        font: { optionName: "font", isCollectionItem: false },
        format: { optionName: "format", isCollectionItem: false }
      },
    },
  });
};

const SliderMarker = Object.assign<typeof _componentSliderMarker, NestedComponentMeta>(_componentSliderMarker, {
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
// Scale
type ITickProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
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
// Scale
type ITickIntervalProps = React.PropsWithChildren<{
  days?: number;
  hours?: number;
  milliseconds?: number;
  minutes?: number;
  months?: number;
  quarters?: number;
  seconds?: number;
  weeks?: number;
  years?: number;
}>
const _componentTickInterval = (props: ITickIntervalProps) => {
  return React.createElement(NestedOption<ITickIntervalProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tickInterval",
    },
  });
};

const TickInterval = Object.assign<typeof _componentTickInterval, NestedComponentMeta>(_componentTickInterval, {
  componentType: "option",
});

// owners:
// RangeSelector
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
// PointImage
type IUrlProps = React.PropsWithChildren<{
  rangeMaxPoint?: string;
  rangeMinPoint?: string;
}>
const _componentUrl = (props: IUrlProps) => {
  return React.createElement(NestedOption<IUrlProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "url",
    },
  });
};

const Url = Object.assign<typeof _componentUrl, NestedComponentMeta>(_componentUrl, {
  componentType: "option",
});

// owners:
// RangeSelector
type IValueProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  length?: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    quarters?: number;
    seconds?: number;
    weeks?: number;
    years?: number;
  };
  startValue?: Date | number | string;
  defaultEndValue?: Date | number | string;
  onEndValueChange?: (value: Date | number | string) => void;
  defaultStartValue?: Date | number | string;
  onStartValueChange?: (value: Date | number | string) => void;
}>
const _componentValue = (props: IValueProps) => {
  return React.createElement(NestedOption<IValueProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "value",
      DefaultsProps: {
        defaultEndValue: "endValue",
        defaultStartValue: "startValue"
      },
      ExpectedChildren: {
        length: { optionName: "length", isCollectionItem: false }
      },
    },
  });
};

const Value = Object.assign<typeof _componentValue, NestedComponentMeta>(_componentValue, {
  componentType: "option",
});

// owners:
// Chart
type IValueAxisProps = React.PropsWithChildren<{
  inverted?: boolean;
  logarithmBase?: number;
  max?: number;
  min?: number;
  type?: "continuous" | "logarithmic";
  valueType?: "datetime" | "numeric" | "string";
}>
const _componentValueAxis = (props: IValueAxisProps) => {
  return React.createElement(NestedOption<IValueAxisProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "valueAxis",
    },
  });
};

const ValueAxis = Object.assign<typeof _componentValueAxis, NestedComponentMeta>(_componentValueAxis, {
  componentType: "option",
});

// owners:
// CommonSeriesSettings
type IValueErrorBarProps = React.PropsWithChildren<{
  color?: string;
  displayMode?: "auto" | "high" | "low" | "none";
  edgeLength?: number;
  highValueField?: string;
  lineWidth?: number;
  lowValueField?: string;
  opacity?: number;
  type?: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance";
  value?: number;
}>
const _componentValueErrorBar = (props: IValueErrorBarProps) => {
  return React.createElement(NestedOption<IValueErrorBarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "valueErrorBar",
    },
  });
};

const ValueErrorBar = Object.assign<typeof _componentValueErrorBar, NestedComponentMeta>(_componentValueErrorBar, {
  componentType: "option",
});

// owners:
// PointImage
type IWidthProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentWidth = (props: IWidthProps) => {
  return React.createElement(NestedOption<IWidthProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "width",
    },
  });
};

const Width = Object.assign<typeof _componentWidth, NestedComponentMeta>(_componentWidth, {
  componentType: "option",
});

export default RangeSelector;
export {
  RangeSelector,
  IRangeSelectorOptions,
  RangeSelectorRef,
  Aggregation,
  IAggregationProps,
  AggregationInterval,
  IAggregationIntervalProps,
  ArgumentFormat,
  IArgumentFormatProps,
  Background,
  IBackgroundProps,
  BackgroundImage,
  IBackgroundImageProps,
  Behavior,
  IBehaviorProps,
  Border,
  IBorderProps,
  Break,
  IBreakProps,
  BreakStyle,
  IBreakStyleProps,
  Chart,
  IChartProps,
  Color,
  IColorProps,
  CommonSeriesSettings,
  ICommonSeriesSettingsProps,
  CommonSeriesSettingsHoverStyle,
  ICommonSeriesSettingsHoverStyleProps,
  CommonSeriesSettingsLabel,
  ICommonSeriesSettingsLabelProps,
  CommonSeriesSettingsSelectionStyle,
  ICommonSeriesSettingsSelectionStyleProps,
  Connector,
  IConnectorProps,
  DataPrepareSettings,
  IDataPrepareSettingsProps,
  Export,
  IExportProps,
  Font,
  IFontProps,
  Format,
  IFormatProps,
  Hatching,
  IHatchingProps,
  Height,
  IHeightProps,
  HoverStyle,
  IHoverStyleProps,
  Image,
  IImageProps,
  Indent,
  IIndentProps,
  Label,
  ILabelProps,
  Length,
  ILengthProps,
  LoadingIndicator,
  ILoadingIndicatorProps,
  Margin,
  IMarginProps,
  Marker,
  IMarkerProps,
  MarkerLabel,
  IMarkerLabelProps,
  MaxRange,
  IMaxRangeProps,
  MinorTick,
  IMinorTickProps,
  MinorTickInterval,
  IMinorTickIntervalProps,
  MinRange,
  IMinRangeProps,
  Point,
  IPointProps,
  PointBorder,
  IPointBorderProps,
  PointHoverStyle,
  IPointHoverStyleProps,
  PointImage,
  IPointImageProps,
  PointSelectionStyle,
  IPointSelectionStyleProps,
  Reduction,
  IReductionProps,
  Scale,
  IScaleProps,
  ScaleLabel,
  IScaleLabelProps,
  SelectionStyle,
  ISelectionStyleProps,
  Series,
  ISeriesProps,
  SeriesBorder,
  ISeriesBorderProps,
  SeriesTemplate,
  ISeriesTemplateProps,
  Shutter,
  IShutterProps,
  Size,
  ISizeProps,
  SliderHandle,
  ISliderHandleProps,
  SliderMarker,
  ISliderMarkerProps,
  Subtitle,
  ISubtitleProps,
  Tick,
  ITickProps,
  TickInterval,
  ITickIntervalProps,
  Title,
  ITitleProps,
  Url,
  IUrlProps,
  Value,
  IValueProps,
  ValueAxis,
  IValueAxisProps,
  ValueErrorBar,
  IValueErrorBarProps,
  Width,
  IWidthProps
};
import type * as RangeSelectorTypes from 'devextreme/viz/range_selector_types';
export { RangeSelectorTypes };

