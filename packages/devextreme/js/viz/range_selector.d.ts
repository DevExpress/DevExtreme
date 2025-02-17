import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
  Format,
} from '../localization';

import {
    dxChartCommonSeriesSettings,
} from './chart';

import {
    ChartSeries,
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    ChartsDataType,
    DiscreteAxisDivisionMode,
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ScaleBreak,
    ScaleBreakLineStyle,
    TimeIntervalConfig,
    VisualRange,
    VisualRangeUpdateMode,
    Font,
} from '../common/charts';

import { SliderValueChangeMode } from '../common';

export {
    ChartsDataType,
    DiscreteAxisDivisionMode,
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ScaleBreakLineStyle,
    VisualRangeUpdateMode,
};

export type BackgroundImageLocation = 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop';
export type ValueChangedCallMode = 'onMoving' | 'onMovingComplete';
export type AxisScale = 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete';
export type ChartAxisScale = 'continuous' | 'logarithmic';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxRangeSelector>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxRangeSelector>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxRangeSelector>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxRangeSelector> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxRangeSelector>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxRangeSelector> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxRangeSelector>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxRangeSelector> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxRangeSelector, MouseEvent | TouchEvent> & {
  /**
   * 
   */
  readonly value: Array<number | string | Date>;
  /**
   * 
   */
  readonly previousValue: Array<number | string | Date>;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
    /**
     * Specifies the properties for the range selector&apos;s background.
     */
    background?: {
      /**
       * Specifies the background color for the RangeSelector.
       */
      color?: string;
      /**
       * Specifies image properties.
       */
      image?: {
        /**
         * Specifies a location for the image in the background of a range selector.
         */
        location?: BackgroundImageLocation;
        /**
         * Specifies the image&apos;s URL.
         */
        url?: string | undefined;
      };
      /**
       * Indicates whether or not the background (background color and/or image) is visible.
       */
      visible?: boolean;
    };
    /**
     * Specifies the RangeSelector&apos;s behavior properties.
     */
    behavior?: {
      /**
       * Indicates whether or not you can swap sliders.
       */
      allowSlidersSwap?: boolean;
      /**
       * Indicates whether or not animation is enabled.
       */
      animationEnabled?: boolean;
      /**
       * Specifies when to call the onValueChanged function.
       * @deprecated Use the valueChangeMode property instead.
       */
      callValueChanged?: ValueChangedCallMode;
      /**
       * Indicates whether or not an end user can specify the range using a mouse, without the use of sliders.
       */
      manualRangeSelectionEnabled?: boolean;
      /**
       * Indicates whether or not an end user can shift the selected range to the required location on a scale by clicking.
       */
      moveSelectedRangeByClick?: boolean;
      /**
       * Indicates whether to snap a slider to ticks.
       */
      snapToTicks?: boolean;
      /**
       * Specifies when to change the component&apos;s value.
       */
      valueChangeMode?: SliderValueChangeMode;
    };
    /**
     * Specifies the properties required to display a chart as the range selector&apos;s background.
     */
    chart?: {
      /**
       * Controls the padding and consequently the width of a group of bars with the same argument using relative units. Ignored if the barGroupWidth property is set.
       */
      barGroupPadding?: number;
      /**
       * Specifies a fixed width for groups of bars with the same argument, measured in pixels. Takes precedence over the barGroupPadding property.
       */
      barGroupWidth?: number | undefined;
      /**
       * Specifies an indent from the background&apos;s bottom to the lowest chart point. Accepts values from 0 to 1.
       */
      bottomIndent?: number;
      /**
       * An object defining the common configuration properties for the chart&apos;s series.
       */
      commonSeriesSettings?: dxChartCommonSeriesSettings;
      /**
       * An object providing properties for managing data from a data source.
       */
      dataPrepareSettings?: {
        /**
         * Specifies whether or not to validate values from a data source.
         */
        checkTypeForAllData?: boolean;
        /**
         * Specifies whether or not to convert the values from a data source into the data type of an axis.
         */
        convertToAxisDataType?: boolean;
        /**
         * Specifies how to sort series points.
         */
        sortingMethod?: boolean | ((a: { arg?: Date | number | string; val?: Date | number | string }, b: { arg?: Date | number | string; val?: Date | number | string }) => number);
      };
      /**
       * Specifies a coefficient that determines the diameter of the largest bubble.
       */
      maxBubbleSize?: number;
      /**
       * Specifies the diameter of the smallest bubble measured in pixels.
       */
      minBubbleSize?: number;
      /**
       * Forces the UI component to treat negative values as zeroes. Applies to stacked-like series only.
       */
      negativesAsZeroes?: boolean;
      /**
       * Sets the palette to be used to colorize series in the chart.
       */
      palette?: Array<string> | Palette;
      /**
       * Specifies what to do with colors in the palette when their number is less than the number of series in the chart.
       */
      paletteExtensionMode?: PaletteExtensionMode;
      /**
       * An object defining the chart&apos;s series.
       */
      series?: ChartSeries | Array<ChartSeries> | undefined;
      /**
       * Defines properties for the series template.
       */
      seriesTemplate?: {
        /**
         * Specifies a callback function that returns a series object with individual series settings.
         */
        customizeSeries?: ((seriesName: any) => ChartSeries);
        /**
         * Specifies a data source field that represents the series name.
         */
        nameField?: string;
      };
      /**
       * Specifies an indent from the background&apos;s top to the topmost chart point. Accepts values from 0 to 1.
       */
      topIndent?: number;
      /**
       * Configures the chart value axis.
       */
      valueAxis?: {
        /**
         * Indicates whether or not the chart&apos;s value axis must be inverted.
         */
        inverted?: boolean;
        /**
         * Specifies the value to be raised to a power when generating ticks for a logarithmic value axis.
         */
        logarithmBase?: number;
        /**
         * Specifies the maximum value of the chart&apos;s value axis.
         */
        max?: number | undefined;
        /**
         * Specifies the minimum value of the chart&apos;s value axis.
         */
        min?: number | undefined;
        /**
         * Specifies the type of the value axis.
         */
        type?: ChartAxisScale | undefined;
        /**
         * Specifies the desired type of axis values.
         */
        valueType?: ChartsDataType | undefined;
      };
    };
    /**
     * Specifies the color of the parent page element.
     */
    containerBackgroundColor?: string;
    /**
     * Specifies a data source for the scale values and for the chart at the background.
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * Specifies the data source field that provides data for the scale.
     */
    dataSourceField?: string;
    /**
     * Range selector&apos;s indent properties.
     */
    indent?: {
      /**
       * Specifies range selector&apos;s left indent.
       */
      left?: number | undefined;
      /**
       * Specifies range selector&apos;s right indent.
       */
      right?: number | undefined;
    };
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * Specifies properties of the range selector&apos;s scale.
     */
    scale?: {
      /**
       * Aggregates series points that fall into the same category.
       * @deprecated Use CommonSeries.aggregation.enabled instead.
       */
      aggregateByCategory?: boolean;
      /**
       * Specifies the length of aggregation intervals in pixels. Does not apply if aggregateByCategory is true. May be ignored in favor of the aggregationInterval property.
       */
      aggregationGroupWidth?: number | undefined;
      /**
       * Specifies the length of aggregation intervals in scale units. Applies only to the scale of the continuous or logarithmic type.
       */
      aggregationInterval?: TimeIntervalConfig;
      /**
       * Specifies whether ticks/grid lines of a discrete axis are located between labels or cross the labels.
       */
      discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
      /**
       * Specifies whether to allow decimal values on the scale. When false, the scale contains integer values only.
       */
      allowDecimals?: boolean | undefined;
      /**
       * Configures the scale breaks&apos; appearance.
       */
      breakStyle?: {
        /**
         * Specifies the scale breaks&apos; color.
         */
        color?: string;
        /**
         * Specifies the scale breaks&apos; line style.
         */
        line?: ScaleBreakLineStyle;
        /**
         * Specifies the scale breaks&apos; width in pixels.
         */
        width?: number;
      };
      /**
       * Declares a scale break collection. Applies only if the scale&apos;s type is &apos;continuous&apos; or &apos;logarithmic&apos;.
       */
      breaks?: Array<ScaleBreak>;
      /**
       * Specifies the order of arguments on a discrete scale.
       */
      categories?: Array<number | string | Date>;
      /**
       * Specifies whether to force the scale to start and end on ticks.
       */
      endOnTick?: boolean;
      /**
       * Specifies the scale&apos;s end value.
       */
      endValue?: number | Date | string | undefined;
      /**
       * Days to be excluded from the scale when workdaysOnly is true.
       */
      holidays?: Array<Date | string> | Array<number>;
      /**
       * Specifies common properties for scale labels.
       */
      label?: {
        /**
         * Specifies a callback function that returns the text to be displayed in scale labels.
         */
        customizeText?: ((scaleValue: { value?: Date | number | string; valueText?: string }) => string);
        /**
         * Specifies font properties for the text displayed in the range selector&apos;s scale labels.
         */
        font?: Font;
        /**
         * Formats a value before it is displayed in a scale label.
         */
        format?: Format | undefined;
        /**
         * Decides how to arrange scale labels when there is not enough space to keep all of them.
         */
        overlappingBehavior?: LabelOverlap;
        /**
         * Specifies a spacing between scale labels and the background bottom edge.
         */
        topIndent?: number;
        /**
         * Specifies whether or not the scale&apos;s labels are visible.
         */
        visible?: boolean;
      };
      /**
       * Specifies a value used to calculate the range on a logarithmic scale within which the scale should be linear. Applies only if the data source contains negative values or zeroes.
       */
      linearThreshold?: number;
      /**
       * Specifies the value to be raised to a power when generating ticks for a logarithmic scale.
       */
      logarithmBase?: number;
      /**
       * Specifies properties for the date-time scale&apos;s markers.
       */
      marker?: {
        /**
         * Defines the properties that can be set for the text that is displayed by the scale markers.
         */
        label?: {
          /**
           * Specifies a callback function that returns the text to be displayed in scale markers.
           */
          customizeText?: ((markerValue: { value?: Date | number; valueText?: string }) => string);
          /**
           * Formats a value before it is displayed in a scale marker.
           */
          format?: Format | undefined;
        };
        /**
         * Specifies the height of the marker&apos;s separator.
         */
        separatorHeight?: number;
        /**
         * Specifies the space between the marker label and the marker separator.
         */
        textLeftIndent?: number;
        /**
         * Specifies the space between the marker&apos;s label and the top edge of the marker&apos;s separator.
         */
        textTopIndent?: number;
        /**
         * Specified the indent between the marker and the scale labels.
         */
        topIndent?: number;
        /**
         * Indicates whether scale markers are visible.
         */
        visible?: boolean;
      };
      /**
       * Specifies the maximum range that can be selected.
       */
      maxRange?: TimeIntervalConfig;
      /**
       * Specifies the minimum range that can be selected.
       */
      minRange?: TimeIntervalConfig;
      /**
       * Specifies properties of the range selector&apos;s minor ticks.
       */
      minorTick?: {
        /**
         * Specifies the color of the scale&apos;s minor ticks.
         */
        color?: string;
        /**
         * Specifies the opacity of the scale&apos;s minor ticks.
         */
        opacity?: number;
        /**
         * Indicates whether scale minor ticks are visible or not.
         */
        visible?: boolean;
        /**
         * Specifies the width of the scale&apos;s minor ticks.
         */
        width?: number;
      };
      /**
       * Specifies the number of minor ticks between neighboring major ticks.
       */
      minorTickCount?: number | undefined;
      /**
       * Specifies an interval between minor ticks.
       */
      minorTickInterval?: TimeIntervalConfig;
      /**
       * Specifies the height of the space reserved for the scale in pixels.
       */
      placeholderHeight?: number | undefined;
      /**
       * Specifies whether or not to show ticks for the boundary scale values, when neither major ticks nor minor ticks are created for these values.
       */
      showCustomBoundaryTicks?: boolean;
      /**
       * Days to be included in the scale when workdaysOnly is true.
       */
      singleWorkdays?: Array<Date | string> | Array<number>;
      /**
       * Specifies the scale&apos;s start value.
       */
      startValue?: number | Date | string | undefined;
      /**
       * Specifies properties defining the appearance of scale ticks.
       */
      tick?: {
        /**
         * Specifies the color of scale ticks (major ticks only).
         */
        color?: string;
        /**
         * Specifies the opacity of scale ticks (major ticks only).
         */
        opacity?: number;
        /**
         * Specifies the width of the scale&apos;s ticks (major ticks only).
         */
        width?: number;
      };
      /**
       * Specifies an interval between axis ticks.
       */
      tickInterval?: TimeIntervalConfig;
      /**
       * Specifies the type of the scale.
       */
      type?: AxisScale | undefined;
      /**
       * Specifies the type of values on the scale.
       */
      valueType?: ChartsDataType | undefined;
      /**
       * Specifies which days are workdays. The array can contain values from 0 (Sunday) to 6 (Saturday). Applies only if workdaysOnly is true.
       */
      workWeek?: Array<number>;
      /**
       * Leaves only workdays on the scale: the work week days plus single workdays minus holidays. Applies only if the scale&apos;s valueType is &apos;datetime&apos;.
       */
      workdaysOnly?: boolean;
    };
    /**
     * Specifies the color of the selected range.
     */
    selectedRangeColor?: string;
    /**
     * Specifies how the selected range should behave when data is updated. Applies only when the RangeSelector is bound to a data source.
     */
    selectedRangeUpdateMode?: VisualRangeUpdateMode;
    /**
     * Specifies range selector shutter properties.
     */
    shutter?: {
      /**
       * Specifies shutter color.
       */
      color?: string | undefined;
      /**
       * Specifies the opacity of the color of shutters.
       */
      opacity?: number;
    };
    /**
     * Specifies the appearance of the range selector&apos;s slider handles.
     */
    sliderHandle?: {
      /**
       * Specifies the color of the slider handles.
       */
      color?: string;
      /**
       * Specifies the opacity of the slider handles.
       */
      opacity?: number;
      /**
       * Specifies the width of the slider handles.
       */
      width?: number;
    };
    /**
     * Defines the properties of the range selector slider markers.
     */
    sliderMarker?: {
      /**
       * Specifies the color of the slider markers.
       */
      color?: string;
      /**
       * Specifies a callback function that returns the text to be displayed by slider markers.
       */
      customizeText?: ((scaleValue: { value?: Date | number | string; valueText?: string }) => string);
      /**
       * Specifies font properties for the text displayed by the range selector slider markers.
       */
      font?: Font;
      /**
       * Formats a value before it is displayed in a slider marker.
       */
      format?: Format | undefined;
      /**
       * Specifies the color used for the slider marker text when the currently selected range does not match the minRange and maxRange values.
       */
      invalidRangeColor?: string;
      /**
       * Specifies the empty space between the marker&apos;s left and right borders and the marker&apos;s text.
       */
      paddingLeftRight?: number;
      /**
       * Specifies the empty space between the marker&apos;s top and bottom borders and the marker&apos;s text.
       */
      paddingTopBottom?: number;
      /**
       * Specifies the placeholder height of the slider marker.
       */
      placeholderHeight?: number | undefined;
      /**
       * Indicates whether or not the slider markers are visible.
       */
      visible?: boolean;
    };
    /**
     * Configures tooltips - small pop-up rectangles that display information about a data-visualizing UI component element being pressed or hovered over with the mouse pointer.
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * The selected range (initial or current). Equals the entire scale when not set.
     */
    value?: Array<number | string | Date> | VisualRange;
}
/**
 * The RangeSelector is a UI component that allows a user to select a range of values on a scale.
 */
export default class dxRangeSelector extends BaseWidget<dxRangeSelectorOptions> {
    getDataSource(): DataSource;
    /**
     * Gets the currently selected range.
     */
    getValue(): Array<number | string | Date>;
    render(): void;
    /**
     * Redraws the UI component.
     */
    render(skipChartAnimation: boolean): void;
    /**
     * Sets the selected range.
     */
    setValue(value: Array<number | string | Date> | VisualRange): void;
}

export type Properties = dxRangeSelectorOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxRangeSelectorOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onValueChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxRangeSelectorOptions.onDisposing
 * @type_function_param1 e:{viz/range_selector:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onDrawn
 * @type_function_param1 e:{viz/range_selector:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onExported
 * @type_function_param1 e:{viz/range_selector:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onExporting
 * @type_function_param1 e:{viz/range_selector:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onFileSaving
 * @type_function_param1 e:{viz/range_selector:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/range_selector:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onInitialized
 * @type_function_param1 e:{viz/range_selector:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onOptionChanged
 * @type_function_param1 e:{viz/range_selector:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
