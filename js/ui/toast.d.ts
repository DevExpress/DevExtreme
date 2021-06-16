import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions
} from './overlay';

/** @public */
export type ContentReadyEvent = EventInfo<dxToast>;

/** @public */
export type DisposingEvent = EventInfo<dxToast>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxToast>;

/** @public */
export type HiddenEvent = EventInfo<dxToast>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxToast>;

/** @public */
export type OptionChangedEvent = EventInfo<dxToast> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = EventInfo<dxToast>;

/** @public */
export type ShownEvent = EventInfo<dxToast>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxToastOptions extends dxOverlayOptions<dxToast> {
    /**
     * @docid
     * @default { show: { type: "fade", duration: 400, from: 0, to: 1 }, hide: { type: "fade", duration: 400, to: 0 } }
     * @default {show: {type: 'slide', duration: 200, from: { position: {my: 'top', at: 'bottom', of: window}}}, hide: { type: 'slide', duration: 200, to: { position: {my: 'top', at: 'bottom', of: window}}}} [for](Android)
     * @public
     * @type object
     */
    animation?: dxToastAnimation;
    /**
     * @docid
     * @default false
     * @public
     */
    closeOnClick?: boolean;
    /**
     * @docid
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @default true [for](Android)
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * @docid
     * @default true
     * @public
     */
    closeOnSwipe?: boolean;
    /**
     * @docid
     * @default 2000
     * @default 4000 [for](Material)
     * @public
     */
    displayTime?: number;
    /**
     * @docid
     * @type_function_return number|string
     * @default 'auto'
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type_function_return number|string
     * @default 568 [for](Material)
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default ""
     * @public
     */
    message?: string;
    /**
     * @docid
     * @type_function_return number|string
     * @default 344 [for](Material)
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default "bottom center"
     * @default { at: 'bottom left', my: 'bottom left', offset: '20 -20'} [for](Android)
     * @default { at: 'bottom center', my: 'bottom center', offset: '0 0' } [for](phones_on_Android)
     * @public
     */
    position?: positionConfig | string;
    /**
     * @docid
     * @default false
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @type Enums.ToastType
     * @default 'info'
     * @public
     */
    type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
    /**
     * @docid
     * @type_function_return number|string
     * @default function() {return $(window).width() * 0.8 }
     * @default 'auto' [for](Android)
     * @default function() { return $(window).width(); } [for](phones_on_Android)
     * @public
     */
    width?: number | string | (() => number | string);
}
/** @namespace DevExpress.ui */
export interface dxToastAnimation extends dxOverlayAnimation {
    /**
     * @docid dxToastOptions.animation.hide
     * @default { type: "fade", duration: 400, to: 0 }
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxToastOptions.animation.show
     * @default { type: "fade", duration: 400, from: 0, to: 1 }
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid
 * @inherits dxOverlay
 * @module ui/toast
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxToast extends dxOverlay<dxToastOptions> { }

/** @public */
export type Properties = dxToastOptions;

/** @deprecated use Properties instead */
export type Options = dxToastOptions;

/** @deprecated use Properties instead */
export type IOptions = dxToastOptions;
