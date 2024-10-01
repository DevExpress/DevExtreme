"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxRangeSelector, {
    Properties
} from "devextreme/viz/range_selector";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DrawnEvent, ExportedEvent, ExportingEvent, FileSavingEvent, IncidentOccurredEvent, InitializedEvent, ValueChangedEvent, BackgroundImageLocation, ValueChangedCallMode, ChartAxisScale, AxisScale } from "devextreme/viz/range_selector";
import type { chartPointAggregationInfoObject, chartSeriesObject, ChartSeriesAggregationMethod, dxChartCommonSeriesSettings, FinancialChartReductionLevel } from "devextreme/viz/chart";
import type { SliderValueChangeMode, HorizontalAlignment, ExportFormat, VerticalEdge } from "devextreme/common";
import type { DashStyle, ScaleBreakLineStyle, Palette, PaletteExtensionMode, ChartsDataType, ChartsColor, SeriesHoverMode, HatchDirection, Font as ChartsFont, RelativePosition, PointInteractionMode, PointSymbol, SeriesSelectionMode, SeriesType, ValueErrorBarDisplayMode, ValueErrorBarType, LabelOverlap, TimeInterval, ScaleBreak, DiscreteAxisDivisionMode, TextOverflow, WordWrap } from "devextreme/common/charts";
import type { ChartSeries } from "devextreme/viz/common";

import type * as CommonChartTypes from "devextreme/common/charts";
import type * as LocalizationTypes from "devextreme/common";
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
  method?: ChartSeriesAggregationMethod;
}>
const _componentAggregation = memo(
  (props: IAggregationProps) => {
    return React.createElement(NestedOption<IAggregationProps>, { ...props });
  }
);

const Aggregation: typeof _componentAggregation & IElementDescriptor = Object.assign(_componentAggregation, {
  OptionName: "aggregation",
})

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
const _componentAggregationInterval = memo(
  (props: IAggregationIntervalProps) => {
    return React.createElement(NestedOption<IAggregationIntervalProps>, { ...props });
  }
);

const AggregationInterval: typeof _componentAggregationInterval & IElementDescriptor = Object.assign(_componentAggregationInterval, {
  OptionName: "aggregationInterval",
})

// owners:
// CommonSeriesSettingsLabel
type IArgumentFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: LocalizationTypes.Format | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentArgumentFormat = memo(
  (props: IArgumentFormatProps) => {
    return React.createElement(NestedOption<IArgumentFormatProps>, { ...props });
  }
);

const ArgumentFormat: typeof _componentArgumentFormat & IElementDescriptor = Object.assign(_componentArgumentFormat, {
  OptionName: "argumentFormat",
})

// owners:
// RangeSelector
type IBackgroundProps = React.PropsWithChildren<{
  color?: string;
  image?: Record<string, any> | {
    location?: BackgroundImageLocation;
    url?: string;
  };
  visible?: boolean;
}>
const _componentBackground = memo(
  (props: IBackgroundProps) => {
    return React.createElement(NestedOption<IBackgroundProps>, { ...props });
  }
);

const Background: typeof _componentBackground & IElementDescriptor = Object.assign(_componentBackground, {
  OptionName: "background",
  ExpectedChildren: {
    backgroundImage: { optionName: "image", isCollectionItem: false },
    image: { optionName: "image", isCollectionItem: false }
  },
})

// owners:
// Background
type IBackgroundImageProps = React.PropsWithChildren<{
  location?: BackgroundImageLocation;
  url?: string;
}>
const _componentBackgroundImage = memo(
  (props: IBackgroundImageProps) => {
    return React.createElement(NestedOption<IBackgroundImageProps>, { ...props });
  }
);

const BackgroundImage: typeof _componentBackgroundImage & IElementDescriptor = Object.assign(_componentBackgroundImage, {
  OptionName: "image",
})

// owners:
// RangeSelector
type IBehaviorProps = React.PropsWithChildren<{
  allowSlidersSwap?: boolean;
  animationEnabled?: boolean;
  callValueChanged?: ValueChangedCallMode;
  manualRangeSelectionEnabled?: boolean;
  moveSelectedRangeByClick?: boolean;
  snapToTicks?: boolean;
  valueChangeMode?: SliderValueChangeMode;
}>
const _componentBehavior = memo(
  (props: IBehaviorProps) => {
    return React.createElement(NestedOption<IBehaviorProps>, { ...props });
  }
);

const Behavior: typeof _componentBehavior & IElementDescriptor = Object.assign(_componentBehavior, {
  OptionName: "behavior",
})

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
  dashStyle?: DashStyle;
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
// Scale
type IBreakProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  startValue?: Date | number | string;
}>
const _componentBreak = memo(
  (props: IBreakProps) => {
    return React.createElement(NestedOption<IBreakProps>, { ...props });
  }
);

const Break: typeof _componentBreak & IElementDescriptor = Object.assign(_componentBreak, {
  OptionName: "breaks",
  IsCollectionItem: true,
})

// owners:
// Scale
type IBreakStyleProps = React.PropsWithChildren<{
  color?: string;
  line?: ScaleBreakLineStyle;
  width?: number;
}>
const _componentBreakStyle = memo(
  (props: IBreakStyleProps) => {
    return React.createElement(NestedOption<IBreakStyleProps>, { ...props });
  }
);

const BreakStyle: typeof _componentBreakStyle & IElementDescriptor = Object.assign(_componentBreakStyle, {
  OptionName: "breakStyle",
})

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
  palette?: Array<string> | Palette;
  paletteExtensionMode?: PaletteExtensionMode;
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
    type?: ChartAxisScale;
    valueType?: ChartsDataType;
  };
}>
const _componentChart = memo(
  (props: IChartProps) => {
    return React.createElement(NestedOption<IChartProps>, { ...props });
  }
);

const Chart: typeof _componentChart & IElementDescriptor = Object.assign(_componentChart, {
  OptionName: "chart",
  ExpectedChildren: {
    commonSeriesSettings: { optionName: "commonSeriesSettings", isCollectionItem: false },
    dataPrepareSettings: { optionName: "dataPrepareSettings", isCollectionItem: false },
    series: { optionName: "series", isCollectionItem: true },
    seriesTemplate: { optionName: "seriesTemplate", isCollectionItem: false },
    valueAxis: { optionName: "valueAxis", isCollectionItem: false }
  },
})

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
const _componentColor = memo(
  (props: IColorProps) => {
    return React.createElement(NestedOption<IColorProps>, { ...props });
  }
);

const Color: typeof _componentColor & IElementDescriptor = Object.assign(_componentColor, {
  OptionName: "color",
})

// owners:
// Chart
type ICommonSeriesSettingsProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: ChartSeriesAggregationMethod;
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
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  bubble?: any;
  candlestick?: any;
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
  fullstackedarea?: any;
  fullstackedbar?: any;
  fullstackedline?: any;
  fullstackedspline?: any;
  fullstackedsplinearea?: any;
  highValueField?: string;
  hoverMode?: SeriesHoverMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
    alignment?: HorizontalAlignment;
    argumentFormat?: LocalizationTypes.Format;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
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
    position?: RelativePosition;
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
    hoverMode?: PointInteractionMode;
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
    selectionMode?: PointInteractionMode;
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
    symbol?: PointSymbol;
    visible?: boolean;
  };
  rangearea?: any;
  rangebar?: any;
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: FinancialChartReductionLevel;
  };
  scatter?: any;
  selectionMode?: SeriesSelectionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
  type?: SeriesType;
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: ValueErrorBarDisplayMode;
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: ValueErrorBarType;
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettings = memo(
  (props: ICommonSeriesSettingsProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsProps>, { ...props });
  }
);

const CommonSeriesSettings: typeof _componentCommonSeriesSettings & IElementDescriptor = Object.assign(_componentCommonSeriesSettings, {
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
})

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettingsHoverStyle = memo(
  (props: ICommonSeriesSettingsHoverStyleProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsHoverStyleProps>, { ...props });
  }
);

const CommonSeriesSettingsHoverStyle: typeof _componentCommonSeriesSettingsHoverStyle & IElementDescriptor = Object.assign(_componentCommonSeriesSettingsHoverStyle, {
  OptionName: "hoverStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsLabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  argumentFormat?: LocalizationTypes.Format;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
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
  position?: RelativePosition;
  rotationAngle?: number;
  showForZeroValues?: boolean;
  verticalOffset?: number;
  visible?: boolean;
}>
const _componentCommonSeriesSettingsLabel = memo(
  (props: ICommonSeriesSettingsLabelProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsLabelProps>, { ...props });
  }
);

const CommonSeriesSettingsLabel: typeof _componentCommonSeriesSettingsLabel & IElementDescriptor = Object.assign(_componentCommonSeriesSettingsLabel, {
  OptionName: "label",
  ExpectedChildren: {
    argumentFormat: { optionName: "argumentFormat", isCollectionItem: false },
    border: { optionName: "border", isCollectionItem: false },
    connector: { optionName: "connector", isCollectionItem: false },
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettings
type ICommonSeriesSettingsSelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
}>
const _componentCommonSeriesSettingsSelectionStyle = memo(
  (props: ICommonSeriesSettingsSelectionStyleProps) => {
    return React.createElement(NestedOption<ICommonSeriesSettingsSelectionStyleProps>, { ...props });
  }
);

const CommonSeriesSettingsSelectionStyle: typeof _componentCommonSeriesSettingsSelectionStyle & IElementDescriptor = Object.assign(_componentCommonSeriesSettingsSelectionStyle, {
  OptionName: "selectionStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    hatching: { optionName: "hatching", isCollectionItem: false },
    seriesBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettingsLabel
type IConnectorProps = React.PropsWithChildren<{
  color?: string;
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
// Chart
type IDataPrepareSettingsProps = React.PropsWithChildren<{
  checkTypeForAllData?: boolean;
  convertToAxisDataType?: boolean;
  sortingMethod?: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number);
}>
const _componentDataPrepareSettings = memo(
  (props: IDataPrepareSettingsProps) => {
    return React.createElement(NestedOption<IDataPrepareSettingsProps>, { ...props });
  }
);

const DataPrepareSettings: typeof _componentDataPrepareSettings & IElementDescriptor = Object.assign(_componentDataPrepareSettings, {
  OptionName: "dataPrepareSettings",
})

// owners:
// RangeSelector
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
const _componentFont = memo(
  (props: IFontProps) => {
    return React.createElement(NestedOption<IFontProps>, { ...props });
  }
);

const Font: typeof _componentFont & IElementDescriptor = Object.assign(_componentFont, {
  OptionName: "font",
})

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
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsSelectionStyle
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
// PointImage
type IHeightProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentHeight = memo(
  (props: IHeightProps) => {
    return React.createElement(NestedOption<IHeightProps>, { ...props });
  }
);

const Height: typeof _componentHeight & IElementDescriptor = Object.assign(_componentHeight, {
  OptionName: "height",
})

// owners:
// CommonSeriesSettings
// Point
type IHoverStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
  size?: number;
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
// Background
// Point
type IImageProps = React.PropsWithChildren<{
  location?: BackgroundImageLocation;
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
const _componentImage = memo(
  (props: IImageProps) => {
    return React.createElement(NestedOption<IImageProps>, { ...props });
  }
);

const Image: typeof _componentImage & IElementDescriptor = Object.assign(_componentImage, {
  OptionName: "image",
})

// owners:
// RangeSelector
type IIndentProps = React.PropsWithChildren<{
  left?: number;
  right?: number;
}>
const _componentIndent = memo(
  (props: IIndentProps) => {
    return React.createElement(NestedOption<IIndentProps>, { ...props });
  }
);

const Indent: typeof _componentIndent & IElementDescriptor = Object.assign(_componentIndent, {
  OptionName: "indent",
})

// owners:
// CommonSeriesSettings
// Scale
// Marker
type ILabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  argumentFormat?: LocalizationTypes.Format;
  backgroundColor?: string;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
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
  position?: RelativePosition;
  rotationAngle?: number;
  showForZeroValues?: boolean;
  verticalOffset?: number;
  visible?: boolean;
  overlappingBehavior?: LabelOverlap;
  topIndent?: number;
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
const _componentLength = memo(
  (props: ILengthProps) => {
    return React.createElement(NestedOption<ILengthProps>, { ...props });
  }
);

const Length: typeof _componentLength & IElementDescriptor = Object.assign(_componentLength, {
  OptionName: "length",
})

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
// RangeSelector
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
const _componentMarker = memo(
  (props: IMarkerProps) => {
    return React.createElement(NestedOption<IMarkerProps>, { ...props });
  }
);

const Marker: typeof _componentMarker & IElementDescriptor = Object.assign(_componentMarker, {
  OptionName: "marker",
  ExpectedChildren: {
    label: { optionName: "label", isCollectionItem: false },
    markerLabel: { optionName: "label", isCollectionItem: false }
  },
})

// owners:
// Marker
type IMarkerLabelProps = React.PropsWithChildren<{
  customizeText?: ((markerValue: { value: Date | number, valueText: string }) => string);
  format?: LocalizationTypes.Format;
}>
const _componentMarkerLabel = memo(
  (props: IMarkerLabelProps) => {
    return React.createElement(NestedOption<IMarkerLabelProps>, { ...props });
  }
);

const MarkerLabel: typeof _componentMarkerLabel & IElementDescriptor = Object.assign(_componentMarkerLabel, {
  OptionName: "label",
  ExpectedChildren: {
    format: { optionName: "format", isCollectionItem: false }
  },
})

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
const _componentMaxRange = memo(
  (props: IMaxRangeProps) => {
    return React.createElement(NestedOption<IMaxRangeProps>, { ...props });
  }
);

const MaxRange: typeof _componentMaxRange & IElementDescriptor = Object.assign(_componentMaxRange, {
  OptionName: "maxRange",
})

// owners:
// Scale
type IMinorTickProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  visible?: boolean;
  width?: number;
}>
const _componentMinorTick = memo(
  (props: IMinorTickProps) => {
    return React.createElement(NestedOption<IMinorTickProps>, { ...props });
  }
);

const MinorTick: typeof _componentMinorTick & IElementDescriptor = Object.assign(_componentMinorTick, {
  OptionName: "minorTick",
})

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
const _componentMinorTickInterval = memo(
  (props: IMinorTickIntervalProps) => {
    return React.createElement(NestedOption<IMinorTickIntervalProps>, { ...props });
  }
);

const MinorTickInterval: typeof _componentMinorTickInterval & IElementDescriptor = Object.assign(_componentMinorTickInterval, {
  OptionName: "minorTickInterval",
})

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
const _componentMinRange = memo(
  (props: IMinRangeProps) => {
    return React.createElement(NestedOption<IMinRangeProps>, { ...props });
  }
);

const MinRange: typeof _componentMinRange & IElementDescriptor = Object.assign(_componentMinRange, {
  OptionName: "minRange",
})

// owners:
// CommonSeriesSettings
type IPointProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
  };
  color?: ChartsColor | string;
  hoverMode?: PointInteractionMode;
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
  selectionMode?: PointInteractionMode;
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
  symbol?: PointSymbol;
  visible?: boolean;
}>
const _componentPoint = memo(
  (props: IPointProps) => {
    return React.createElement(NestedOption<IPointProps>, { ...props });
  }
);

const Point: typeof _componentPoint & IElementDescriptor = Object.assign(_componentPoint, {
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
})

// owners:
// Point
// PointHoverStyle
// PointSelectionStyle
type IPointBorderProps = React.PropsWithChildren<{
  color?: string;
  visible?: boolean;
  width?: number;
}>
const _componentPointBorder = memo(
  (props: IPointBorderProps) => {
    return React.createElement(NestedOption<IPointBorderProps>, { ...props });
  }
);

const PointBorder: typeof _componentPointBorder & IElementDescriptor = Object.assign(_componentPointBorder, {
  OptionName: "border",
})

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
const _componentPointHoverStyle = memo(
  (props: IPointHoverStyleProps) => {
    return React.createElement(NestedOption<IPointHoverStyleProps>, { ...props });
  }
);

const PointHoverStyle: typeof _componentPointHoverStyle & IElementDescriptor = Object.assign(_componentPointHoverStyle, {
  OptionName: "hoverStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false }
  },
})

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
const _componentPointImage = memo(
  (props: IPointImageProps) => {
    return React.createElement(NestedOption<IPointImageProps>, { ...props });
  }
);

const PointImage: typeof _componentPointImage & IElementDescriptor = Object.assign(_componentPointImage, {
  OptionName: "image",
  ExpectedChildren: {
    height: { optionName: "height", isCollectionItem: false },
    url: { optionName: "url", isCollectionItem: false },
    width: { optionName: "width", isCollectionItem: false }
  },
})

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
const _componentPointSelectionStyle = memo(
  (props: IPointSelectionStyleProps) => {
    return React.createElement(NestedOption<IPointSelectionStyleProps>, { ...props });
  }
);

const PointSelectionStyle: typeof _componentPointSelectionStyle & IElementDescriptor = Object.assign(_componentPointSelectionStyle, {
  OptionName: "selectionStyle",
  ExpectedChildren: {
    border: { optionName: "border", isCollectionItem: false },
    color: { optionName: "color", isCollectionItem: false },
    pointBorder: { optionName: "border", isCollectionItem: false }
  },
})

// owners:
// CommonSeriesSettings
type IReductionProps = React.PropsWithChildren<{
  color?: string;
  level?: FinancialChartReductionLevel;
}>
const _componentReduction = memo(
  (props: IReductionProps) => {
    return React.createElement(NestedOption<IReductionProps>, { ...props });
  }
);

const Reduction: typeof _componentReduction & IElementDescriptor = Object.assign(_componentReduction, {
  OptionName: "reduction",
})

// owners:
// RangeSelector
type IScaleProps = React.PropsWithChildren<{
  aggregateByCategory?: boolean;
  aggregationGroupWidth?: number;
  aggregationInterval?: number | Record<string, any> | TimeInterval | {
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
    line?: ScaleBreakLineStyle;
    width?: number;
  };
  categories?: Array<Date | number | string>;
  discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
  endOnTick?: boolean;
  endValue?: Date | number | string;
  holidays?: Array<Date | string> | Array<number>;
  label?: Record<string, any> | {
    customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
    font?: ChartsFont;
    format?: LocalizationTypes.Format;
    overlappingBehavior?: LabelOverlap;
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
  maxRange?: number | Record<string, any> | TimeInterval | {
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
  minorTickInterval?: number | Record<string, any> | TimeInterval | {
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
  minRange?: number | Record<string, any> | TimeInterval | {
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
  tickInterval?: number | Record<string, any> | TimeInterval | {
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
  type?: AxisScale;
  valueType?: ChartsDataType;
  workdaysOnly?: boolean;
  workWeek?: Array<number>;
}>
const _componentScale = memo(
  (props: IScaleProps) => {
    return React.createElement(NestedOption<IScaleProps>, { ...props });
  }
);

const Scale: typeof _componentScale & IElementDescriptor = Object.assign(_componentScale, {
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
})

// owners:
// Scale
type IScaleLabelProps = React.PropsWithChildren<{
  customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string);
  font?: ChartsFont;
  format?: LocalizationTypes.Format;
  overlappingBehavior?: LabelOverlap;
  topIndent?: number;
  visible?: boolean;
}>
const _componentScaleLabel = memo(
  (props: IScaleLabelProps) => {
    return React.createElement(NestedOption<IScaleLabelProps>, { ...props });
  }
);

const ScaleLabel: typeof _componentScaleLabel & IElementDescriptor = Object.assign(_componentScaleLabel, {
  OptionName: "label",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
  },
})

// owners:
// Point
// CommonSeriesSettings
type ISelectionStyleProps = React.PropsWithChildren<{
  border?: Record<string, any> | {
    color?: string;
    visible?: boolean;
    width?: number;
    dashStyle?: DashStyle;
  };
  color?: ChartsColor | string;
  size?: number;
  dashStyle?: DashStyle;
  hatching?: Record<string, any> | {
    direction?: HatchDirection;
    opacity?: number;
    step?: number;
    width?: number;
  };
  highlight?: boolean;
  width?: number;
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
// Chart
type ISeriesProps = React.PropsWithChildren<{
  aggregation?: Record<string, any> | {
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>);
    enabled?: boolean;
    method?: ChartSeriesAggregationMethod;
  };
  argumentField?: string;
  axis?: string;
  barOverlapGroup?: string;
  barPadding?: number;
  barWidth?: number;
  border?: Record<string, any> | {
    color?: string;
    dashStyle?: DashStyle;
    visible?: boolean;
    width?: number;
  };
  closeValueField?: string;
  color?: ChartsColor | string;
  cornerRadius?: number;
  dashStyle?: DashStyle;
  highValueField?: string;
  hoverMode?: SeriesHoverMode;
  hoverStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
    alignment?: HorizontalAlignment;
    argumentFormat?: LocalizationTypes.Format;
    backgroundColor?: string;
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
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
    position?: RelativePosition;
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
    hoverMode?: PointInteractionMode;
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
    selectionMode?: PointInteractionMode;
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
    symbol?: PointSymbol;
    visible?: boolean;
  };
  rangeValue1Field?: string;
  rangeValue2Field?: string;
  reduction?: Record<string, any> | {
    color?: string;
    level?: FinancialChartReductionLevel;
  };
  selectionMode?: SeriesSelectionMode;
  selectionStyle?: Record<string, any> | {
    border?: Record<string, any> | {
      color?: string;
      dashStyle?: DashStyle;
      visible?: boolean;
      width?: number;
    };
    color?: ChartsColor | string;
    dashStyle?: DashStyle;
    hatching?: Record<string, any> | {
      direction?: HatchDirection;
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
  type?: SeriesType;
  valueErrorBar?: Record<string, any> | {
    color?: string;
    displayMode?: ValueErrorBarDisplayMode;
    edgeLength?: number;
    highValueField?: string;
    lineWidth?: number;
    lowValueField?: string;
    opacity?: number;
    type?: ValueErrorBarType;
    value?: number;
  };
  valueField?: string;
  visible?: boolean;
  width?: number;
}>
const _componentSeries = memo(
  (props: ISeriesProps) => {
    return React.createElement(NestedOption<ISeriesProps>, { ...props });
  }
);

const Series: typeof _componentSeries & IElementDescriptor = Object.assign(_componentSeries, {
  OptionName: "series",
  IsCollectionItem: true,
})

// owners:
// CommonSeriesSettings
// CommonSeriesSettingsHoverStyle
// CommonSeriesSettingsLabel
// CommonSeriesSettingsSelectionStyle
type ISeriesBorderProps = React.PropsWithChildren<{
  color?: string;
  dashStyle?: DashStyle;
  visible?: boolean;
  width?: number;
}>
const _componentSeriesBorder = memo(
  (props: ISeriesBorderProps) => {
    return React.createElement(NestedOption<ISeriesBorderProps>, { ...props });
  }
);

const SeriesBorder: typeof _componentSeriesBorder & IElementDescriptor = Object.assign(_componentSeriesBorder, {
  OptionName: "border",
})

// owners:
// Chart
type ISeriesTemplateProps = React.PropsWithChildren<{
  customizeSeries?: ((seriesName: any) => ChartSeries);
  nameField?: string;
}>
const _componentSeriesTemplate = memo(
  (props: ISeriesTemplateProps) => {
    return React.createElement(NestedOption<ISeriesTemplateProps>, { ...props });
  }
);

const SeriesTemplate: typeof _componentSeriesTemplate & IElementDescriptor = Object.assign(_componentSeriesTemplate, {
  OptionName: "seriesTemplate",
})

// owners:
// RangeSelector
type IShutterProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
}>
const _componentShutter = memo(
  (props: IShutterProps) => {
    return React.createElement(NestedOption<IShutterProps>, { ...props });
  }
);

const Shutter: typeof _componentShutter & IElementDescriptor = Object.assign(_componentShutter, {
  OptionName: "shutter",
})

// owners:
// RangeSelector
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
// RangeSelector
type ISliderHandleProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  width?: number;
}>
const _componentSliderHandle = memo(
  (props: ISliderHandleProps) => {
    return React.createElement(NestedOption<ISliderHandleProps>, { ...props });
  }
);

const SliderHandle: typeof _componentSliderHandle & IElementDescriptor = Object.assign(_componentSliderHandle, {
  OptionName: "sliderHandle",
})

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
const _componentSliderMarker = memo(
  (props: ISliderMarkerProps) => {
    return React.createElement(NestedOption<ISliderMarkerProps>, { ...props });
  }
);

const SliderMarker: typeof _componentSliderMarker & IElementDescriptor = Object.assign(_componentSliderMarker, {
  OptionName: "sliderMarker",
  ExpectedChildren: {
    font: { optionName: "font", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false }
  },
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
// Scale
type ITickProps = React.PropsWithChildren<{
  color?: string;
  opacity?: number;
  width?: number;
}>
const _componentTick = memo(
  (props: ITickProps) => {
    return React.createElement(NestedOption<ITickProps>, { ...props });
  }
);

const Tick: typeof _componentTick & IElementDescriptor = Object.assign(_componentTick, {
  OptionName: "tick",
})

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
const _componentTickInterval = memo(
  (props: ITickIntervalProps) => {
    return React.createElement(NestedOption<ITickIntervalProps>, { ...props });
  }
);

const TickInterval: typeof _componentTickInterval & IElementDescriptor = Object.assign(_componentTickInterval, {
  OptionName: "tickInterval",
})

// owners:
// RangeSelector
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
// PointImage
type IUrlProps = React.PropsWithChildren<{
  rangeMaxPoint?: string;
  rangeMinPoint?: string;
}>
const _componentUrl = memo(
  (props: IUrlProps) => {
    return React.createElement(NestedOption<IUrlProps>, { ...props });
  }
);

const Url: typeof _componentUrl & IElementDescriptor = Object.assign(_componentUrl, {
  OptionName: "url",
})

// owners:
// RangeSelector
type IValueProps = React.PropsWithChildren<{
  endValue?: Date | number | string;
  length?: number | Record<string, any> | TimeInterval | {
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
const _componentValue = memo(
  (props: IValueProps) => {
    return React.createElement(NestedOption<IValueProps>, { ...props });
  }
);

const Value: typeof _componentValue & IElementDescriptor = Object.assign(_componentValue, {
  OptionName: "value",
  DefaultsProps: {
    defaultEndValue: "endValue",
    defaultStartValue: "startValue"
  },
  ExpectedChildren: {
    length: { optionName: "length", isCollectionItem: false }
  },
})

// owners:
// Chart
type IValueAxisProps = React.PropsWithChildren<{
  inverted?: boolean;
  logarithmBase?: number;
  max?: number;
  min?: number;
  type?: ChartAxisScale;
  valueType?: ChartsDataType;
}>
const _componentValueAxis = memo(
  (props: IValueAxisProps) => {
    return React.createElement(NestedOption<IValueAxisProps>, { ...props });
  }
);

const ValueAxis: typeof _componentValueAxis & IElementDescriptor = Object.assign(_componentValueAxis, {
  OptionName: "valueAxis",
})

// owners:
// CommonSeriesSettings
type IValueErrorBarProps = React.PropsWithChildren<{
  color?: string;
  displayMode?: ValueErrorBarDisplayMode;
  edgeLength?: number;
  highValueField?: string;
  lineWidth?: number;
  lowValueField?: string;
  opacity?: number;
  type?: ValueErrorBarType;
  value?: number;
}>
const _componentValueErrorBar = memo(
  (props: IValueErrorBarProps) => {
    return React.createElement(NestedOption<IValueErrorBarProps>, { ...props });
  }
);

const ValueErrorBar: typeof _componentValueErrorBar & IElementDescriptor = Object.assign(_componentValueErrorBar, {
  OptionName: "valueErrorBar",
})

// owners:
// PointImage
type IWidthProps = React.PropsWithChildren<{
  rangeMaxPoint?: number;
  rangeMinPoint?: number;
}>
const _componentWidth = memo(
  (props: IWidthProps) => {
    return React.createElement(NestedOption<IWidthProps>, { ...props });
  }
);

const Width: typeof _componentWidth & IElementDescriptor = Object.assign(_componentWidth, {
  OptionName: "width",
})

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

