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
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent = EventInfo<dxDeferRendering>;

/** @public */
export type DisposingEvent = EventInfo<dxDeferRendering>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDeferRendering>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDeferRendering> & ChangedOptionInfo;

/** @public */
export type RenderedEvent = EventInfo<dxDeferRendering>;

/** @public */
export type ShownEvent = EventInfo<dxDeferRendering>;

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

/** @public */
export type Options = dxDeferRenderingOptions;

/** @deprecated use Options instead */
export type IOptions = dxDeferRenderingOptions;
