import {
    UserDefinedElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxScrollable, {
    dxScrollableOptions,
    ScrollEventInfo
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
     * @type_function_param1_field1 component:dxScrollView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onPullDown?: ((e: PullDownEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScrollView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onReachBottom?: ((e: ReachBottomEvent) => void);
    /**
     * @docid
     * @default "Release to refresh..."
     * @default "" [for](Material)
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @default "" [for](Material)
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Loading..."
     * @default "" [for](Material)
     * @public
     */
    reachBottomText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @default "" [for](Material)
     * @public
     */
    refreshingText?: string;
}
/**
 * @docid
 * @inherits dxScrollable
 * @hasTranscludedContent
 * @module ui/scroll_view
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxScrollView extends dxScrollable {
    constructor(element: UserDefinedElement, options?: dxScrollViewOptions)
    /**
     * @docid
     * @publicName refresh()
     * @public
     */
    refresh(): void;
    /**
     * @docid
     * @publicName release(preventScrollBottom)
     * @param1 preventScrollBottom:boolean
     * @return Promise<void>
     * @public
     */
    release(preventScrollBottom: boolean): DxPromise<void>;
}

/** @public */
export type Properties = dxScrollViewOptions;

/** @deprecated use Properties instead */
export type Options = dxScrollViewOptions;

/** @deprecated use Properties instead */
export type IOptions = dxScrollViewOptions;
