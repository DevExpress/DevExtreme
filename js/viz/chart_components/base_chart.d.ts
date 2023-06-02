import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../core/templates/template';

import DataSource, { DataSourceLike } from '../../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
} from '../../events/index';

import {
    Format,
  } from '../../localization';

import {
    basePointObject,
    baseSeriesObject,
    chartSeriesObject,
    dxChartAnnotationConfig,
    dxChartSeriesTypesCommonSeriesLabel,
    dxChartSeriesTypesCommonSeriesPoint,
} from '../chart';

import {
    BaseLegend,
    BaseLegendItem,
} from '../common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    BaseWidgetAnnotationConfig,
} from '../core/base_widget';

import {
    AnimationEaseMode,
    Palette,
    PaletteExtensionMode,
} from '../../common/charts';

import {
    SingleOrMultiple,
} from '../../common';

/**
 * @docid
 * @hidden
 */
export interface PointInteractionInfo {
    readonly target: basePointObject;
}

export interface TooltipInfo {
    target?: basePointObject | dxChartAnnotationConfig | any;
}

/**
 * @namespace DevExpress.viz
 * @docid
 * @type object
 */
export interface BaseChartOptions<TComponent> extends BaseWidgetOptions<TComponent> {
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
      duration?: number;
      /**
       * @docid
       * @default 'easeOutCubic'
       */
      easing?: AnimationEaseMode;
      /**
       * @docid
       * @default true
       */
      enabled?: boolean;
      /**
       * @docid
       * @default 300
       */
      maxPointCountSupported?: number;
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
     * @notUsedInTheme
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
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
     * @type_function_param1 e:EventInfo
     * @notUsedInTheme
     * @action
     * @public
     */
    onDone?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @notUsedInTheme
     * @action
     * @public
     */
    onPointClick?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent> & PointInteractionInfo) => void) | string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:object
     * @type_function_param1_field element:object
     * @notUsedInTheme
     * @action
     * @public
     */
    onPointHoverChanged?: ((e: EventInfo<TComponent> & PointInteractionInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:object
     * @type_function_param1_field element:object
     * @notUsedInTheme
     * @action
     * @public
     */
    onPointSelectionChanged?: ((e: EventInfo<TComponent> & PointInteractionInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipHidden?: ((e: EventInfo<TComponent> & TooltipInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipShown?: ((e: EventInfo<TComponent> & TooltipInfo) => void);
    /**
     * @docid
     * @default "Material"
     * @public
     */
    palette?: Array<string> | Palette;
    /**
     * @docid
     * @default 'blend'
     * @public
     */
    paletteExtensionMode?: PaletteExtensionMode;
    /**
     * @docid
     * @default 'single'
     * @public
     */
    pointSelectionMode?: SingleOrMultiple;
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
/**
 * @docid
 * @namespace DevExpress.viz
 */
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
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseChartLegend extends BaseLegend {
    /**
     * @docid BaseChartOptions.legend.customizeItems
     * @public
     */
    customizeItems?: ((items: Array<BaseChartLegendItem>) => Array<BaseChartLegendItem>);
    /**
     * @docid BaseChartOptions.legend.markerTemplate
     * @default undefined
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: BaseChartLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseChartTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseChartOptions.tooltip.argumentFormat
     * @default undefined
     * @public
     */
    argumentFormat?: Format;
    /**
     * @docid BaseChartOptions.tooltip.contentTemplate
     * @type_function_param1 pointInfo:object
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
 * @options BaseChartOptions
 */
export class BaseChart<TProperties> extends BaseWidget<TProperties> {
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName getAllSeries()
     * @public
     */
    getAllSeries(): Array<baseSeriesObject>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getSeriesByName(seriesName)
     * @public
     */
    getSeriesByName(seriesName: any): chartSeriesObject;
    /**
     * @docid
     * @publicName getSeriesByPos(seriesIndex)
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
