import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
    BaseWidgetSize,
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

/** @public */
export interface BulletSize extends Omit<BaseWidgetSize, 'width' | 'height'> {
    /**
     * @docid
     * @default 300
    */
    width?: number;
    /**
     * @docid
     * @default 30
    */
    height?: number;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
    /**
     * @docid
     * @public
     */
    size?: BulletSize;
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
