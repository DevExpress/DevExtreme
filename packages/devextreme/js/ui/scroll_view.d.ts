import {
    DxPromise,
} from '../core/utils/deferred';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import dxScrollable, {
    dxScrollableOptions,
    ScrollEventInfo,
} from './scroll_view/ui.scrollable';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxScrollView>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxScrollView>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxScrollView> & ChangedOptionInfo;

/**
 * The type of the pullDown event handler&apos;s argument.
 */
export type PullDownEvent = EventInfo<dxScrollView>;

/**
 * The type of the reachBottom event handler&apos;s argument.
 */
export type ReachBottomEvent = EventInfo<dxScrollView>;

/**
 * The type of the scroll event handler&apos;s argument.
 */
export type ScrollEvent = ScrollEventInfo<dxScrollView>;

/**
 * The type of the updated event handler&apos;s argument.
 */
export type UpdatedEvent = ScrollEventInfo<dxScrollView>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
    /**
     * A function that is executed when the &apos;pull to refresh&apos; gesture is performed. Supported on mobile devices only.
     */
    onPullDown?: ((e: PullDownEvent) => void);
    /**
     * A function that is executed when the content is scrolled down to the bottom.
     */
    onReachBottom?: ((e: ReachBottomEvent) => void);
    /**
     * Specifies the text shown in the pullDown panel when pulling the content down lowers the refresh threshold.
     */
    pulledDownText?: string;
    /**
     * Specifies the text shown in the pullDown panel while pulling the content down to the refresh threshold.
     */
    pullingDownText?: string;
    /**
     * Specifies the text shown in the pullDown panel displayed when content is scrolled to the bottom.
     */
    reachBottomText?: string;
    /**
     * Specifies the text shown in the pullDown panel displayed when the content is being refreshed.
     */
    refreshingText?: string;
}
/**
 * The ScrollView is a UI component that enables a user to scroll its content.
 */
export default class dxScrollView extends dxScrollable<dxScrollViewOptions> {
    /**
     * Locks the UI component until the release(preventScrollBottom) method is called and executes the function passed to the onPullDown property and the handler assigned to the pullDown event.
     */
    refresh(): void;
    /**
     * Notifies the ScrollView that data loading is finished.
     */
    release(preventScrollBottom: boolean): DxPromise<void>;
}

export type Properties = dxScrollViewOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxScrollViewOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onPullDown' | 'onReachBottom'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed on each scroll gesture.
 */
onScroll?: ((e: ScrollEvent) => void);
/**
 * A function that is executed each time the UI component is updated.
 */
onUpdated?: ((e: UpdatedEvent) => void);
};
///#ENDDEBUG
