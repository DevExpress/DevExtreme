import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import BaseSparkline, {
    BaseSparklineOptions,
} from './sparklines/base_sparkline';

import {
    PointSymbol,
} from '../common/charts';

export {
    PointSymbol,
};

/** @public */
export type SparklineType = 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';

/** @public */
export type DisposingEvent = EventInfo<dxSparkline>;

/** @public */
export type DrawnEvent = EventInfo<dxSparkline>;

/** @public */
export type ExportedEvent = EventInfo<dxSparkline>;

/** @public */
export type ExportingEvent = EventInfo<dxSparkline> & ExportInfo;

/** @public */
export type FileSavingEvent = FileSavingEventInfo<dxSparkline>;

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
     * @notUsedInTheme
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
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
     * @default 'circle'
     * @public
     */
    pointSymbol?: PointSymbol;
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
     * @default 'line'
     * @public
     */
    type?: SparklineType;
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
 * @namespace DevExpress.viz
 * @public
 */
export default class dxSparkline extends BaseSparkline<dxSparklineOptions> {
    getDataSource(): DataSource;
}

/** @public */
export type Properties = dxSparklineOptions;

/** @deprecated use Properties instead */
export type Options = dxSparklineOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxSparklineOptions.onDisposing
 * @type_function_param1 e:{viz/sparkline:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onDrawn
 * @type_function_param1 e:{viz/sparkline:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onExported
 * @type_function_param1 e:{viz/sparkline:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onExporting
 * @type_function_param1 e:{viz/sparkline:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onFileSaving
 * @type_function_param1 e:{viz/sparkline:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/sparkline:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onInitialized
 * @type_function_param1 e:{viz/sparkline:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onOptionChanged
 * @type_function_param1 e:{viz/sparkline:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onTooltipHidden
 * @type_function_param1 e:{viz/sparkline:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @skip
 * @docid dxSparklineOptions.onTooltipShown
 * @type_function_param1 e:{viz/sparkline:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
