import {
    AnimationConfig
} from '../animation/fx';

import {
    DxElement
} from '../core/element';

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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    animation?: AnimationConfig;
    /**
     * @docid
     * @default null
     * @action
     * @public
     */
    onRendered?: ((e: { component?: dxDeferRendering, element?: DxElement, model?: any }) => void);
    /**
     * @docid
     * @default null
     * @action
     * @public
     */
    onShown?: ((e: { component?: dxDeferRendering, element?: DxElement, model?: any }) => void);
    /**
     * @docid
     * @type DxPromise|bool
     * @default undefined
     * @public
     */
    renderWhen?: PromiseLike<void> | boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showLoadIndicator?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    staggerItemSelector?: string;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/defer_rendering
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDeferRendering extends Widget<dxDeferRenderingOptions> { }

/** @public */
export type Properties = dxDeferRenderingOptions;

/** @deprecated use Properties instead */
export type Options = dxDeferRenderingOptions;

/** @deprecated use Properties instead */
export type IOptions = dxDeferRenderingOptions;
