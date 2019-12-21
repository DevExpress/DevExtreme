import {
    JQueryEventObject
} from '../../common';

import {
    dxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import {
    event
} from '../../events';

import {
    format
} from '../../ui/widget/ui.widget';

import {
    basePointObject,
    baseSeriesObject,
    chartSeriesObject,
    dxChartAnnotationConfig,
    dxChartSeriesTypesCommonSeriesLabel,
    dxChartSeriesTypesCommonSeriesPoint
} from '../chart';

import {
    BaseLegend,
    BaseLegendItem
} from '../common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip
} from '../core/base_widget';

export interface BaseChartOptions<T = BaseChart> extends BaseWidgetOptions<T> {
    /**
     * @docid BaseChartOptions.adaptiveLayout
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: BaseChartAdaptiveLayout;
    /**
     * @docid BaseChartOptions.animation
     * @type object|boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: { duration?: number, easing?: 'easeOutCubic' | 'linear', enabled?: boolean, maxPointCountSupported?: number } | boolean;
    /**
     * @docid BaseChartOptions.customizeLabel
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return dxChartSeriesTypes.CommonSeries.label
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeLabel?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel);
    /**
     * @docid BaseChartOptions.customizePoint
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return dxChartSeriesTypes.CommonSeries.point
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizePoint?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesPoint);
    /**
     * @docid BaseChartOptions.dataSource
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid BaseChartOptions.legend
     * @inherits BaseLegend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: BaseChartLegend;
    /**
     * @docid BaseChartOptions.onDone
     * @extends Action
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onDone?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid BaseChartOptions.onPointClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 target:basePointObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onPointClick?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: basePointObject }) => any) | string;
    /**
     * @docid BaseChartOptions.onPointHoverChanged
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:object
     * @type_function_param1_field2 element:object
     * @type_function_param1_field3 target:basePointObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onPointHoverChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
    /**
     * @docid BaseChartOptions.onPointSelectionChanged
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:object
     * @type_function_param1_field2 element:object
     * @type_function_param1_field3 target:basePointObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onPointSelectionChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
    /**
     * @docid BaseChartOptions.onTooltipHidden
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: { component?: T, element?: dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
    /**
     * @docid BaseChartOptions.onTooltipShown
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: { component?: T, element?: dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
    /**
     * @docid BaseChartOptions.palette
     * @extends CommonVizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
    /**
     * @docid BaseChartOptions.paletteExtensionMode
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
    /**
     * @docid BaseChartOptions.pointSelectionMode
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pointSelectionMode?: 'multiple' | 'single';
    /**
     * @docid BaseChartOptions.series
     * @type Object|Array<Object>
     * @default undefined
     * @notUsedInTheme
     * @hideDefaults true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: any | Array<any>;
    /**
     * @docid BaseChartOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseChartTooltip;
}
export interface BaseChartAdaptiveLayout {
    /**
     * @docid BaseChartOptions.adaptiveLayout.height
     * @type number
     * @default 80
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid BaseChartOptions.adaptiveLayout.keepLabels
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    keepLabels?: boolean;
    /**
     * @docid BaseChartOptions.adaptiveLayout.width
     * @type number
     * @default 80
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface BaseChartLegend extends BaseLegend {
    /**
     * @docid BaseChartOptions.legend.customizeItems
     * @type function(items)
     * @type_function_param1 items:Array<BaseChartLegendItem>
     * @type_function_return Array<BaseChartLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<BaseChartLegendItem>) => Array<BaseChartLegendItem>);
    /**
     * @docid BaseChartOptions.legend.markerTemplate
     * @type template|function
     * @default undefined
     * @type_function_param1 legendItem:BaseChartLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: BaseChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
}
export interface BaseChartTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseChartOptions.tooltip.argumentFormat
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid BaseChartOptions.tooltip.contentTemplate
     * @type template|function(pointInfo, element)
     * @type_function_param1 pointInfo:object
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((pointInfo: any, element: dxElement) => string | Element | JQuery);
    /**
     * @docid BaseChartOptions.tooltip.customizeTooltip
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((pointInfo: any) => any);
    /**
     * @docid BaseChartOptions.tooltip.shared
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shared?: boolean;
}
/**
 * @docid BaseChart
 * @type object
 * @hidden
 * @inherits BaseWidget, DataHelperMixin
 * @prevFileNamespace DevExpress.viz
 */
export class BaseChart extends BaseWidget {
    constructor(element: Element, options?: BaseChartOptions)
    constructor(element: JQuery, options?: BaseChartOptions)
    /**
     * @docid BaseChartMethods.clearSelection
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid BaseChartMethods.getAllSeries
     * @publicName getAllSeries()
     * @return Array<baseSeriesObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllSeries(): Array<baseSeriesObject>;
    getDataSource(): DataSource;
    /**
     * @docid BaseChartMethods.getSeriesByName
     * @publicName getSeriesByName(seriesName)
     * @param1 seriesName:any
     * @return chartSeriesObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getSeriesByName(seriesName: any): chartSeriesObject;
    /**
     * @docid BaseChartMethods.getSeriesByPos
     * @publicName getSeriesByPos(seriesIndex)
     * @param1 seriesIndex:number
     * @return chartSeriesObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getSeriesByPos(seriesIndex: number): chartSeriesObject;
    /**
     * @docid BaseChartMethods.hideTooltip
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid BaseChartMethods.refresh
     * @publicName refresh()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    refresh(): void;
    render(): void;
    /**
     * @docid BaseChartMethods.render
     * @publicName render(renderOptions)
     * @param1 renderOptions:object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    render(renderOptions: any): void;
}

export interface BaseChartLegendItem extends BaseLegendItem {
    /**
     * @docid BaseChartLegendItem.series
     * @type baseSeriesObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: baseSeriesObject;
}
