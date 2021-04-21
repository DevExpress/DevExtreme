import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    UserDefinedElement
} from '../core/element';

import {
    TEvent,
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

export interface dxToastOptions extends dxOverlayOptions<dxToast> {
    /**
     * @docid
     * @default { show: { type: "fade", duration: 400, from: 0, to: 1 }, hide: { type: "fade", duration: 400, to: 0 } }
     * @default {show: {type: 'slide', duration: 200, from: { position: {my: 'top', at: 'bottom', of: window}}}, hide: { type: 'slide', duration: 200, to: { position: {my: 'top', at: 'bottom', of: window}}}} [for](Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    animation?: dxToastAnimation;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnClick?: boolean;
    /**
     * @docid
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @default true [for](Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: TEvent) => boolean);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnSwipe?: boolean;
    /**
     * @docid
     * @default 2000
     * @default 4000 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayTime?: number;
    /**
     * @docid
     * @type_function_return number|string
     * @default 'auto'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type_function_return number|string
     * @default 568 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @type_function_return number|string
     * @default 344 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default "bottom center"
     * @default { at: 'bottom left', my: 'bottom left', offset: '20 -20'} [for](Android)
     * @default { at: 'bottom center', my: 'bottom center', offset: '0 0' } [for](phones_on_Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: positionConfig | string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @type Enums.ToastType
     * @default 'info'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
    /**
     * @docid
     * @type_function_return number|string
     * @default function() {return $(window).width() * 0.8 }
     * @default 'auto' [for](Android)
     * @default function() { return $(window).width(); } [for](phones_on_Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
export interface dxToastAnimation extends dxOverlayAnimation {
    /**
     * @docid dxToastOptions.animation.hide
     * @default { type: "fade", duration: 400, to: 0 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxToastOptions.animation.show
     * @default { type: "fade", duration: 400, from: 0, to: 1 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid
 * @inherits dxOverlay
 * @module ui/toast
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxToast extends dxOverlay {
    constructor(element: UserDefinedElement, options?: dxToastOptions)
}

/** @public */
export type Options = dxToastOptions;

/** @deprecated use Options instead */
export type IOptions = dxToastOptions;
