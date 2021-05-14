import {
    UserDefinedElement
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';


import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

import BaseSparkline, {
    BaseSparklineOptions
} from './sparklines/base_sparkline';

/** @public */
export type DisposingEvent = EventInfo<dxSparkline>;

/** @public */
export type DrawnEvent = EventInfo<dxSparkline>;

/** @public */
export type ExportedEvent = EventInfo<dxSparkline>;

/** @public */
export type ExportingEvent = EventInfo<dxSparkline> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxSparkline>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxSparkline> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSparkline>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSparkline> & ChangedOptionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxSparkline>;

/** @public */
export type TooltipShownEvent = EventInfo<dxSparkline>;


/** @deprecated use Properties instead */
export interface dxSparklineOptions extends BaseSparklineOptions<dxSparkline> {
    /**
     * @docid
     * @default 'arg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @default '#d7d7d7'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barNegativeColor?: string;
    /**
     * @docid
     * @default '#a9a9a9'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barPositiveColor?: string;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @default '#666666'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    firstLastColor?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid
     * @default '#666666'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    lineColor?: string;
    /**
     * @docid
     * @default 2
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    lineWidth?: number;
    /**
     * @docid
     * @default '#d7d7d7'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    lossColor?: string;
    /**
     * @docid
     * @default '#e55253'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxColor?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxValue?: number;
    /**
     * @docid
     * @default '#e8c267'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minColor?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minValue?: number;
    /**
     * @docid
     * @default '#ffffff'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pointColor?: string;
    /**
     * @docid
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pointSize?: number;
    /**
     * @docid
     * @type Enums.VizPointSymbol
     * @default 'circle'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    pointSymbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showFirstLast?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showMinMax?: boolean;
    /**
     * @docid
     * @type Enums.SparklineType
     * @default 'line'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';
    /**
     * @docid
     * @default 'val'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
    /**
     * @docid
     * @default '#a9a9a9'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    winColor?: string;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    winlossThreshold?: number;
}
/**
 * @docid
 * @inherits BaseSparkline, DataHelperMixin
 * @module viz/sparkline
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxSparkline extends BaseSparkline {
    constructor(element: UserDefinedElement, options?: dxSparklineOptions)
    getDataSource(): DataSource;
}

/** @public */
export type Properties = dxSparklineOptions;

/** @deprecated use Properties instead */
export type Options = dxSparklineOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSparklineOptions;
