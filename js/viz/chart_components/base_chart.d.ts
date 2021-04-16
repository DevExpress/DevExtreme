import {
    ElementIntake,
    TElement,
    THTMLElement
} from '../../core/element';

import {
    PaletteType,
    PaletteExtensionModeType
} from '../palette';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import {
    EventInfo,
    NativeEventInfo
} from '../../events/index';

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
    BaseLegendItem,
} from '../common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    BaseWidgetAnnotationConfig
} from '../core/base_widget';

export interface PointInteractionInfo {
    readonly target: basePointObject;
}

export interface TooltipInfo {
    target?: basePointObject | dxChartAnnotationConfig | any;
}

export interface BaseChartOptions<T = BaseChart> extends BaseWidgetOptions<T> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: BaseChartAdaptiveLayout;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1000
       */
      duration?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VizAnimationEasing
       * @default 'easeOutCubic'
       */
      easing?: 'easeOutCubic' | 'linear',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      enabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 300
       */
      maxPointCountSupported?: number
    } | boolean;
    /**
     * @docid
     * @type_function_param1 pointInfo:object
     * @type_function_return dxChartSeriesTypes.CommonSeries.label
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeLabel?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel);
    /**
     * @docid
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
     * @docid
     * @inherits BaseLegend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: BaseChartLegend;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onDone?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:basePointObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onPointClick?: ((e: NativeEventInfo<T> & PointInteractionInfo) => void) | string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:object
     * @type_function_param1_field2 element:object
     * @type_function_param1_field3 target:basePointObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onPointHoverChanged?: ((e: EventInfo<T> & PointInteractionInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:object
     * @type_function_param1_field2 element:object
     * @type_function_param1_field3 target:basePointObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onPointSelectionChanged?: ((e: EventInfo<T> & PointInteractionInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: EventInfo<T> & TooltipInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: EventInfo<T> & TooltipInfo) => void);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pointSelectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @hideDefaults true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: any | Array<any>;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseChartTooltip;
}
export interface BaseChartAdaptiveLayout {
    /**
     * @docid BaseChartOptions.adaptiveLayout.height
     * @default 80
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid BaseChartOptions.adaptiveLayout.keepLabels
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    keepLabels?: boolean;
    /**
     * @docid BaseChartOptions.adaptiveLayout.width
     * @default 80
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface BaseChartLegend extends BaseLegend {
    /**
     * @docid BaseChartOptions.legend.customizeItems
     * @type_function_param1 items:Array<BaseChartLegendItem>
     * @type_function_return Array<BaseChartLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<BaseChartLegendItem>) => Array<BaseChartLegendItem>);
    /**
     * @docid BaseChartOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:BaseChartLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: BaseChartLegendItem, element: SVGGElement) => string | ElementIntake<SVGElement>);
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
     * @type_function_param1 pointInfo:object
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((pointInfo: any, element: THTMLElement) => string | ElementIntake);
    /**
     * @docid BaseChartOptions.tooltip.customizeTooltip
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shared?: boolean;
    /**
     * @docid BaseChartOptions.tooltip.interactive
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidget, DataHelperMixin
 * @prevFileNamespace DevExpress.viz
 */
export class BaseChart extends BaseWidget {
    constructor(element: ElementIntake, options?: BaseChartOptions)
    /**
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName getAllSeries()
     * @return Array<baseSeriesObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getAllSeries(): Array<baseSeriesObject>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getSeriesByName(seriesName)
     * @param1 seriesName:any
     * @return chartSeriesObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getSeriesByName(seriesName: any): chartSeriesObject;
    /**
     * @docid
     * @publicName getSeriesByPos(seriesIndex)
     * @param1 seriesIndex:number
     * @return chartSeriesObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getSeriesByPos(seriesIndex: number): chartSeriesObject;
    /**
     * @docid
     * @publicName hideTooltip()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName refresh()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    refresh(): void;
    render(): void;
    /**
     * @docid
     * @publicName render(renderOptions)
     * @param1 renderOptions:object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    render(renderOptions: any): void;
}

/**
 * @docid
 * @type object
 * @inherits BaseLegendItem
 */
export interface BaseChartLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: baseSeriesObject;
}

/**
 * @docid
 * @type object
 * @inherits BaseWidgetAnnotationConfig
 */
export interface BaseChartAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: number | Date | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
