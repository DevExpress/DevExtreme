import {
    UserDefinedElement,
    DxElement
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

import Store from '../../data/abstract_store';

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

/** @namespace DevExpress.viz */
export interface BaseChartOptions<T = BaseChart> extends BaseWidgetOptions<T> {
    /**
     * @docid
     * @type object
     * @public
     */
    adaptiveLayout?: BaseChartAdaptiveLayout;
    /**
     * @docid
     * @public
     */
    animation?: {
      /**
       * @docid
       * @default 1000
       */
      duration?: number,
      /**
       * @docid
       * @type Enums.VizAnimationEasing
       * @default 'easeOutCubic'
       */
      easing?: 'easeOutCubic' | 'linear',
      /**
       * @docid
       * @default true
       */
      enabled?: boolean,
      /**
       * @docid
       * @default 300
       */
      maxPointCountSupported?: number
    } | boolean;
    /**
     * @docid
     * @type_function_param1 pointInfo:object
     * @type_function_return dxChartSeriesTypes.CommonSeries.label
     * @public
     */
    customizeLabel?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel);
    /**
     * @docid
     * @type_function_param1 pointInfo:object
     * @type_function_return dxChartSeriesTypes.CommonSeries.point
     * @public
     */
    customizePoint?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesPoint);
    /**
     * @docid BaseChartOptions.dataSource
     * @extends CommonVizDataSource
     * @public
     */
    dataSource?: Array<any> | Store | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @inherits BaseLegend
     * @type object
     * @public
     */
    legend?: BaseChartLegend;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @notUsedInTheme
     * @action
     * @public
     */
    onDone?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:basePointObject
     * @notUsedInTheme
     * @action
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
     * @public
     */
    onPointSelectionChanged?: ((e: EventInfo<T> & PointInteractionInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipHidden?: ((e: EventInfo<T> & TooltipInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:basePointObject|dxChartAnnotationConfig|any
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipShown?: ((e: EventInfo<T> & TooltipInfo) => void);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @public
     */
    pointSelectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @hideDefaults true
     * @public
     */
    series?: any | Array<any>;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: BaseChartTooltip;
}
/** @namespace DevExpress.viz */
export interface BaseChartAdaptiveLayout {
    /**
     * @docid BaseChartOptions.adaptiveLayout.height
     * @default 80
     * @public
     */
    height?: number;
    /**
     * @docid BaseChartOptions.adaptiveLayout.keepLabels
     * @default true
     * @public
     */
    keepLabels?: boolean;
    /**
     * @docid BaseChartOptions.adaptiveLayout.width
     * @default 80
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface BaseChartLegend extends BaseLegend {
    /**
     * @docid BaseChartOptions.legend.customizeItems
     * @type_function_param1 items:Array<BaseChartLegendItem>
     * @type_function_return Array<BaseChartLegendItem>
     * @public
     */
    customizeItems?: ((items: Array<BaseChartLegendItem>) => Array<BaseChartLegendItem>);
    /**
     * @docid BaseChartOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:BaseChartLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: BaseChartLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
}
/** @namespace DevExpress.viz */
export interface BaseChartTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseChartOptions.tooltip.argumentFormat
     * @extends CommonVizFormat
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid BaseChartOptions.tooltip.contentTemplate
     * @type_function_param1 pointInfo:object
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((pointInfo: any, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid BaseChartOptions.tooltip.customizeTooltip
     * @type_function_param1 pointInfo:object
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((pointInfo: any) => any);
    /**
     * @docid BaseChartOptions.tooltip.shared
     * @default false
     * @public
     */
    shared?: boolean;
    /**
     * @docid BaseChartOptions.tooltip.interactive
     * @default false
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidget, DataHelperMixin
 * @namespace DevExpress.viz
 */
export class BaseChart extends BaseWidget {
    constructor(element: UserDefinedElement, options?: BaseChartOptions)
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName getAllSeries()
     * @return Array<baseSeriesObject>
     * @public
     */
    getAllSeries(): Array<baseSeriesObject>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getSeriesByName(seriesName)
     * @param1 seriesName:any
     * @return chartSeriesObject
     * @public
     */
    getSeriesByName(seriesName: any): chartSeriesObject;
    /**
     * @docid
     * @publicName getSeriesByPos(seriesIndex)
     * @param1 seriesIndex:number
     * @return chartSeriesObject
     * @public
     */
    getSeriesByPos(seriesIndex: number): chartSeriesObject;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName refresh()
     * @public
     */
    refresh(): void;
    render(): void;
    /**
     * @docid
     * @publicName render(renderOptions)
     * @param1 renderOptions:object
     * @public
     */
    render(renderOptions: any): void;
}

/**
 * @docid
 * @type object
 * @inherits BaseLegendItem
 * @namespace DevExpress.viz
 */
export interface BaseChartLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @public
     */
    series?: baseSeriesObject;
}

/**
 * @docid
 * @type object
 * @inherits BaseWidgetAnnotationConfig
 * @namespace DevExpress.viz
 */
export interface BaseChartAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @public
     */
    argument?: number | Date | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    series?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    value?: number | Date | string;
}
