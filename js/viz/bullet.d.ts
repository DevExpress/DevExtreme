import {
    UserDefinedElement
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

import BaseSparkline, {
    BaseSparklineOptions
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
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxBullet>;

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
 * @module viz/bullet
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxBullet extends BaseSparkline {
    constructor(element: UserDefinedElement, options?: dxBulletOptions)
}

/** @public */
export type Properties = dxBulletOptions;

/** @deprecated use Properties instead */
export type Options = dxBulletOptions;

/** @deprecated use Properties instead */
export type IOptions = dxBulletOptions;
