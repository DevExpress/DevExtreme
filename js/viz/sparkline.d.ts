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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxSparklineOptions extends BaseSparklineOptions<dxSparkline> {
    /**
     * @docid
     * @default 'arg'
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @default '#d7d7d7'
     * @public
     */
    barNegativeColor?: string;
    /**
     * @docid
     * @default '#a9a9a9'
     * @public
     */
    barPositiveColor?: string;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @default '#666666'
     * @public
     */
    firstLastColor?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid
     * @default '#666666'
     * @public
     */
    lineColor?: string;
    /**
     * @docid
     * @default 2
     * @public
     */
    lineWidth?: number;
    /**
     * @docid
     * @default '#d7d7d7'
     * @public
     */
    lossColor?: string;
    /**
     * @docid
     * @default '#e55253'
     * @public
     */
    maxColor?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxValue?: number;
    /**
     * @docid
     * @default '#e8c267'
     * @public
     */
    minColor?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    minValue?: number;
    /**
     * @docid
     * @default '#ffffff'
     * @public
     */
    pointColor?: string;
    /**
     * @docid
     * @default 4
     * @public
     */
    pointSize?: number;
    /**
     * @docid
     * @type Enums.VizPointSymbol
     * @default 'circle'
     * @public
     */
    pointSymbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
    /**
     * @docid
     * @default true
     * @public
     */
    showFirstLast?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showMinMax?: boolean;
    /**
     * @docid
     * @type Enums.SparklineType
     * @default 'line'
     * @public
     */
    type?: 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';
    /**
     * @docid
     * @default 'val'
     * @public
     */
    valueField?: string;
    /**
     * @docid
     * @default '#a9a9a9'
     * @public
     */
    winColor?: string;
    /**
     * @docid
     * @default 0
     * @public
     */
    winlossThreshold?: number;
}
/**
 * @docid
 * @inherits BaseSparkline, DataHelperMixin
 * @module viz/sparkline
 * @export default
 * @namespace DevExpress.viz
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
