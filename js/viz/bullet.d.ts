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

/** @public */
export type DisposingEvent = EventInfo<dxBullet>;

/** @public */
export type DrawnEvent = EventInfo<dxBullet>;

/** @public */
export type ExportedEvent = EventInfo<dxBullet>;

/** @public */
export type ExportingEvent = EventInfo<dxBullet> & ExportInfo;

/** @public */
export type FileSavingEvent = FileSavingEventInfo<dxBullet>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxBullet> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxBullet>;

/** @public */
export type OptionChangedEvent = EventInfo<dxBullet> & ChangedOptionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxBullet>;

/** @public */
export type TooltipShownEvent = EventInfo<dxBullet>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
    /**
     * @docid
     * @default '#e8c267'
     * @public
     */
    color?: string;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    endScaleValue?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    showTarget?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showZeroLevel?: boolean;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @public
     */
    startScaleValue?: number;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @public
     */
    target?: number;
    /**
     * @docid
     * @default '#666666'
     * @public
     */
    targetColor?: string;
    /**
     * @docid
     * @default 4
     * @public
     */
    targetWidth?: number;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @inherits BaseSparkline
 * @namespace DevExpress.viz
 * @public
 */
export default class dxBullet extends BaseSparkline<dxBulletOptions> { }

/** @public */
export type Properties = dxBulletOptions;

/** @deprecated use Properties instead */
export type Options = dxBulletOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxBulletOptions.onDisposing
 * @type_function_param1 e:{viz/bullet:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onDrawn
 * @type_function_param1 e:{viz/bullet:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onExported
 * @type_function_param1 e:{viz/bullet:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onExporting
 * @type_function_param1 e:{viz/bullet:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onFileSaving
 * @type_function_param1 e:{viz/bullet:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/bullet:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onInitialized
 * @type_function_param1 e:{viz/bullet:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onOptionChanged
 * @type_function_param1 e:{viz/bullet:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onTooltipHidden
 * @type_function_param1 e:{viz/bullet:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @skip
 * @docid dxBulletOptions.onTooltipShown
 * @type_function_param1 e:{viz/bullet:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
