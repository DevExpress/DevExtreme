import {
    animationConfig
} from '../animation/fx';

import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    ComponentEvent,
    ComponentDisposingEvent,
    ComponentInitializedEvent,
    ComponentOptionChangedEvent
} from '../events/';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent = ComponentEvent<dxDeferRendering>;

/** @public */
export type DisposingEvent = ComponentDisposingEvent<dxDeferRendering>;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxDeferRendering>;

/** @public */
export type OptionChangedEvent = ComponentOptionChangedEvent<dxDeferRendering>;

/** @public */
export type RenderedEvent = ComponentEvent<dxDeferRendering>;

/** @public */
export type ShownEvent = ComponentEvent<dxDeferRendering>;

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
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRendered?: ((e: { component?: dxDeferRendering, element?: TElement, model?: any }) => void);
    /**
     * @docid
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: { component?: dxDeferRendering, element?: TElement, model?: any }) => void);
    /**
     * @docid
     * @type TPromise|bool
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
