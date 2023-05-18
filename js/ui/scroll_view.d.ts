import {
    DxPromise,
} from '../core/utils/deferred';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxScrollable, {
    dxScrollableOptions,
    ScrollEventInfo,
} from './scroll_view/ui.scrollable';

/** @public */
export type DisposingEvent = EventInfo<dxScrollView>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxScrollView>;

/** @public */
export type OptionChangedEvent = EventInfo<dxScrollView> & ChangedOptionInfo;

/** @public */
export type PullDownEvent = EventInfo<dxScrollView>;

/** @public */
export type ReachBottomEvent = EventInfo<dxScrollView>;

/** @public */
export type ScrollEvent = ScrollEventInfo<dxScrollView>;

/** @public */
export type UpdatedEvent = ScrollEventInfo<dxScrollView>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScrollView
     * @action
     * @public
     */
    onPullDown?: ((e: PullDownEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxScrollView
     * @action
     * @public
     */
    onReachBottom?: ((e: ReachBottomEvent) => void);
    /**
     * @docid
     * @default "Release to refresh..."
     * @default "" &for(Material)
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @default "" &for(Material)
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Loading..."
     * @default "" &for(Material)
     * @public
     */
    reachBottomText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @default "" &for(Material)
     * @public
     */
    refreshingText?: string;
}
/**
 * @docid
 * @inherits dxScrollable
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxScrollView extends dxScrollable<dxScrollViewOptions> {
    /**
     * @docid
     * @publicName refresh()
     * @public
     */
    refresh(): void;
    /**
     * @docid
     * @publicName release(preventScrollBottom)
     * @return Promise<void>
     * @public
     */
    release(preventScrollBottom: boolean): DxPromise<void>;
}

/** @public */
export type Properties = dxScrollViewOptions;

/** @deprecated use Properties instead */
export type Options = dxScrollViewOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxScrollViewOptions.onDisposing
 * @type_function_param1 e:{ui/scroll_view:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxScrollViewOptions.onInitialized
 * @type_function_param1 e:{ui/scroll_view:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxScrollViewOptions.onOptionChanged
 * @type_function_param1 e:{ui/scroll_view:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxScrollViewOptions.onPullDown
 * @type_function_param1 e:{ui/scroll_view:PullDownEvent}
 */
onPullDown?: ((e: PullDownEvent) => void);
/**
 * @skip
 * @docid dxScrollViewOptions.onReachBottom
 * @type_function_param1 e:{ui/scroll_view:ReachBottomEvent}
 */
onReachBottom?: ((e: ReachBottomEvent) => void);
/**
 * @skip
 * @docid dxScrollViewOptions.onScroll
 * @type_function_param1 e:{ui/scroll_view:ScrollEvent}
 */
onScroll?: ((e: ScrollEvent) => void);
/**
 * @skip
 * @docid dxScrollViewOptions.onUpdated
 * @type_function_param1 e:{ui/scroll_view:UpdatedEvent}
 */
onUpdated?: ((e: UpdatedEvent) => void);
};
