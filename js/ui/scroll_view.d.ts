import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    ComponentEvent
} from '../events/';

import dxScrollable, {
    dxScrollableOptions,
    ComponentScrollEvent
} from './scroll_view/ui.scrollable';

/**
 * @public
 */
export type ScrollEvent = ComponentScrollEvent<dxScrollView>;
/**
 * @public
 */
export type UpdatedEvent = ComponentScrollEvent<dxScrollView>;
/**
 * @public
 */
export type PullDownEvent = ComponentEvent<dxScrollView>;
/**
 * @public
 */
export type ReachBottomEvent = ComponentEvent<dxScrollView>;

export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScrollView
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPullDown?: ((e: PullDownEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxScrollView
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onReachBottom?: ((e: ReachBottomEvent) => void);
    /**
     * @docid
     * @default "Release to refresh..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Loading..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reachBottomText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
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
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxScrollView extends dxScrollable {
    constructor(element: TElement, options?: dxScrollViewOptions)
    /**
     * @docid
     * @publicName refresh()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(): void;
    /**
     * @docid
     * @publicName release(preventScrollBottom)
     * @param1 preventScrollBottom:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    release(preventScrollBottom: boolean): TPromise<void>;
}

export type Options = dxScrollViewOptions;

/** @deprecated use Options instead */
export type IOptions = dxScrollViewOptions;
