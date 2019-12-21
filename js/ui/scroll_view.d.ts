import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import dxScrollable, {
    dxScrollableOptions
} from './scroll_view/ui.scrollable';

export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
    /**
     * @docid dxScrollViewOptions.onPullDown
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPullDown?: ((e: { component?: dxScrollView, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxScrollViewOptions.onReachBottom
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onReachBottom?: ((e: { component?: dxScrollView, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxScrollViewOptions.pulledDownText
     * @type string
     * @default "Release to refresh..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid dxScrollViewOptions.pullingDownText
     * @type string
     * @default "Pull down to refresh..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid dxScrollViewOptions.reachBottomText
     * @type string
     * @default "Loading..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reachBottomText?: string;
    /**
     * @docid dxScrollViewOptions.refreshingText
     * @type string
     * @default "Refreshing..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refreshingText?: string;
}
/**
 * @docid dxScrollView
 * @inherits dxScrollable
 * @hasTranscludedContent
 * @module ui/scroll_view
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxScrollView extends dxScrollable {
    constructor(element: Element, options?: dxScrollViewOptions)
    constructor(element: JQuery, options?: dxScrollViewOptions)
    /**
     * @docid dxScrollViewMethods.refresh
     * @publicName refresh()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(): void;
    /**
     * @docid dxScrollViewMethods.release
     * @publicName release(preventScrollBottom)
     * @param1 preventScrollBottom:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    release(preventScrollBottom: boolean): Promise<void> & JQueryPromise<void>;
}

declare global {
interface JQuery {
    dxScrollView(): JQuery;
    dxScrollView(options: "instance"): dxScrollView;
    dxScrollView(options: string): any;
    dxScrollView(options: string, ...params: any[]): any;
    dxScrollView(options: dxScrollViewOptions): JQuery;
}
}
export type Options = dxScrollViewOptions;

/** @deprecated use Options instead */
export type IOptions = dxScrollViewOptions;