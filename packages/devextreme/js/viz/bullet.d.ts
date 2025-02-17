import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import BaseSparkline, {
    BaseSparklineOptions,
} from './sparklines/base_sparkline';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxBullet>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxBullet>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxBullet>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxBullet> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxBullet>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxBullet> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxBullet>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxBullet> & ChangedOptionInfo;

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxBullet>;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxBullet>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
    /**
     * Specifies a color for the bullet bar.
     */
    color?: string;
    /**
     * Specifies an end value for the invisible scale.
     */
    endScaleValue?: number | undefined;
    /**
     * Specifies whether or not to show the target line.
     */
    showTarget?: boolean;
    /**
     * Specifies whether or not to show the line indicating zero on the invisible scale.
     */
    showZeroLevel?: boolean;
    /**
     * Specifies a start value for the invisible scale.
     */
    startScaleValue?: number;
    /**
     * Specifies the value indicated by the target line.
     */
    target?: number;
    /**
     * Specifies a color for both the target and zero level lines.
     */
    targetColor?: string;
    /**
     * Specifies the width of the target line.
     */
    targetWidth?: number;
    /**
     * Specifies the primary value indicated by the bullet bar.
     */
    value?: number;
}
/**
 * The Bullet UI component is useful when you need to compare a single measure to a target value. The UI component comprises a horizontal bar indicating the measure and a vertical line indicating the target value.
 */
export default class dxBullet extends BaseSparkline<dxBulletOptions> { }

export type Properties = dxBulletOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxBulletOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function that is executed when the UI component&apos;s rendering has finished.
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * A function that is executed after the UI component is exported.
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * A function that is executed before the UI component is exported.
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * A function that is executed before a file with exported UI component is saved to the user&apos;s local storage.
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * A function that is executed when an error or warning occurs.
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed when a tooltip becomes hidden.
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * A function that is executed when a tooltip appears.
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
