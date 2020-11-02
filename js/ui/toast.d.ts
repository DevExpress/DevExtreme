import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    event
} from '../events/index';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions
} from './overlay';

export interface dxToastOptions extends dxOverlayOptions<dxToast> {
    /**
     * @docid
     * @default { show: { type: "fade", duration: 400, from: 0, to: 1 }, hide: { type: "fade", duration: 400, to: 0 } }
     * @default {show: {type: 'slide', duration: 200, from: { position: {my: 'top', at: 'bottom', of: window}}}, hide: { type: 'slide', duration: 200, to: { position: {my: 'top', at: 'bottom', of: window}}}} [for](Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: dxToastAnimation;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnClick?: boolean;
    /**
     * @docid
     * @default true [for](Android)
     * @type boolean|function
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnSwipe?: boolean;
    /**
     * @docid
     * @type number
     * @default 2000
     * @default 4000 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayTime?: number;
    /**
     * @docid
     * @default 'auto'
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default 568 [for](Material)
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @default 344 [for](Material)
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @type positionConfig|string
     * @default "bottom center"
     * @default { at: 'bottom left', my: 'bottom left', offset: '20 -20'} [for](Android)
     * @default { at: 'bottom center', my: 'bottom center', offset: '0 0' } [for](phones_on_Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: positionConfig | string;
    /**
     * @docid
     * @type boolean
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
     * @default function() {return $(window).width() * 0.8 }
     * @default 'auto' [for](Android)
     * @default function() { return $(window).width(); } [for](phones_on_Android)
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @hidden
 * @inherits dxOverlayAnimation
 * @type object
 */
export interface dxToastAnimation extends dxOverlayAnimation {
    /**
     * @docid
     * @type animationConfig
     * @default { type: "fade", duration: 400, to: 0 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid
     * @type animationConfig
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
    constructor(element: Element, options?: dxToastOptions)
    constructor(element: JQuery, options?: dxToastOptions)
}

declare global {
interface JQuery {
    dxToast(): JQuery;
    dxToast(options: "instance"): dxToast;
    dxToast(options: string): any;
    dxToast(options: string, ...params: any[]): any;
    dxToast(options: dxToastOptions): JQuery;
}
}
export type Options = dxToastOptions;

/** @deprecated use Options instead */
export type IOptions = dxToastOptions;
