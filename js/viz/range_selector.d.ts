import {
    dxElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events';

import {
    format
} from '../ui/widget/ui.widget';

import {
    dxChartCommonSeriesSettings
} from './chart';

import {
    ChartSeries,
    ScaleBreak,
    VizRange
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    Font
} from './core/base_widget';

export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
    /**
     * @docid dxRangeSelectorOptions.background
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    background?: { color?: string, image?: { location?: 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop', url?: string }, visible?: boolean };
    /**
     * @docid dxRangeSelectorOptions.behavior
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    behavior?: { allowSlidersSwap?: boolean, animationEnabled?: boolean, callValueChanged?: 'onMoving' | 'onMovingComplete', manualRangeSelectionEnabled?: boolean, moveSelectedRangeByClick?: boolean, snapToTicks?: boolean };
    /**
     * @docid dxRangeSelectorOptions.chart
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    chart?: { barGroupPadding?: number, barGroupWidth?: number, barWidth?: number, bottomIndent?: number, commonSeriesSettings?: dxChartCommonSeriesSettings, dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) }, equalBarWidth?: boolean, maxBubbleSize?: number, minBubbleSize?: number, negativesAsZeroes?: boolean, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', series?: ChartSeries | Array<ChartSeries>, seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string }, topIndent?: number, useAggregation?: boolean, valueAxis?: { inverted?: boolean, logarithmBase?: number, max?: number, min?: number, type?: 'continuous' | 'logarithmic', valueType?: 'datetime' | 'numeric' | 'string' } };
    /**
     * @docid dxRangeSelectorOptions.containerBackgroundColor
     * @type string
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid dxRangeSelectorOptions.dataSource
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid dxRangeSelectorOptions.dataSourceField
     * @type string
     * @default 'arg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSourceField?: string;
    /**
     * @docid dxRangeSelectorOptions.indent
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indent?: { left?: number, right?: number };
    /**
     * @docid dxRangeSelectorOptions.onValueChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:Array<number,string,Date>
     * @type_function_param1_field5 previousValue:Array<number,string,Date>
     * @type_function_param1_field6 event:event
     * @default null
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onValueChanged?: ((e: { component?: dxRangeSelector, element?: dxElement, model?: any, value?: Array<number | string | Date>, previousValue?: Array<number | string | Date>, event?: event }) => any);
    /**
     * @docid dxRangeSelectorOptions.scale
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: { aggregateByCategory?: boolean, aggregationGroupWidth?: number, aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', allowDecimals?: boolean, breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number }, breaks?: Array<ScaleBreak>, categories?: Array<number | string | Date>, endOnTick?: boolean, endValue?: number | Date | string, holidays?: Array<Date | string> | Array<number>, label?: { customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: format, overlappingBehavior?: 'hide' | 'none', topIndent?: number, visible?: boolean }, linearThreshold?: number, logarithmBase?: number, marker?: { label?: { customizeText?: ((markerValue: { value?: Date | number, valueText?: string }) => string), format?: format }, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean }, maxRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minorTick?: { color?: string, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number, minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', placeholderHeight?: number, showCustomBoundaryTicks?: boolean, singleWorkdays?: Array<Date | string> | Array<number>, startValue?: number | Date | string, tick?: { color?: string, opacity?: number, width?: number }, tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete', valueType?: 'datetime' | 'numeric' | 'string', workWeek?: Array<number>, workdaysOnly?: boolean };
    /**
     * @docid dxRangeSelectorOptions.selectedRangeColor
     * @type string
     * @default "#606060"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectedRangeColor?: string;
    /**
     * @docid dxRangeSelectorOptions.selectedRangeUpdateMode
     * @type Enums.VisualRangeUpdateMode
     * @default "reset"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectedRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid dxRangeSelectorOptions.shutter
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shutter?: { color?: string, opacity?: number };
    /**
     * @docid dxRangeSelectorOptions.sliderHandle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sliderHandle?: { color?: string, opacity?: number, width?: number };
    /**
     * @docid dxRangeSelectorOptions.sliderMarker
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sliderMarker?: { color?: string, customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: format, invalidRangeColor?: string, paddingLeftRight?: number, paddingTopBottom?: number, placeholderHeight?: number, visible?: boolean };
    /**
     * @docid dxRangeSelectorOptions.value
     * @type Array<number,string,Date> | VizRange
     * @fires dxRangeSelectorOptions.onValueChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: Array<number | string | Date> | VizRange;
}
/**
 * @docid dxRangeSelector
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/range_selector
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxRangeSelector extends BaseWidget {
    constructor(element: Element, options?: dxRangeSelectorOptions)
    constructor(element: JQuery, options?: dxRangeSelectorOptions)
    getDataSource(): DataSource;
    /**
     * @docid dxRangeSelectorMethods.getValue
     * @publicName getValue()
     * @return Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValue(): Array<number | string | Date>;
    render(): void;
    /**
     * @docid dxRangeSelectorMethods.render
     * @publicName render(skipChartAnimation)
     * @param1 skipChartAnimation:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    render(skipChartAnimation: boolean): void;
    /**
     * @docid dxRangeSelectorMethods.setValue
     * @publicName setValue(value)
     * @param1 value:Array<number,string,Date> | VizRange
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    setValue(value: Array<number | string | Date> | VizRange): void;
}

declare global {
interface JQuery {
    dxRangeSelector(): JQuery;
    dxRangeSelector(options: "instance"): dxRangeSelector;
    dxRangeSelector(options: string): any;
    dxRangeSelector(options: string, ...params: any[]): any;
    dxRangeSelector(options: dxRangeSelectorOptions): JQuery;
}
}
export type Options = dxRangeSelectorOptions;

/** @deprecated use Options instead */
export type IOptions = dxRangeSelectorOptions;