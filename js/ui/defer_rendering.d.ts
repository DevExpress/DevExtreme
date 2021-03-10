import {
    animationConfig
} from '../animation/fx';

import {
    TPromise
} from '../core';

import {
    TElement
} from '../core/element';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: animationConfig;
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRendered?: ((e: { component?: dxDeferRendering, element?: TElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: { component?: dxDeferRendering, element?: TElement, model?: any }) => any);
    /**
     * @docid
     * @type Promise<void> | bool
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    renderWhen?: TPromise<void> | boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showLoadIndicator?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    staggerItemSelector?: string;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/defer_rendering
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDeferRendering extends Widget {
    constructor(element: TElement, options?: dxDeferRenderingOptions)
}

export type Options = dxDeferRenderingOptions;

/** @deprecated use Options instead */
export type IOptions = dxDeferRenderingOptions;
