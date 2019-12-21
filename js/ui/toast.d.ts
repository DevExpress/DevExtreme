import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    event
} from '../events';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions
} from './overlay';

export interface dxToastOptions extends dxOverlayOptions<dxToast> {
    /**
     * @docid dxToastOptions.animation
     * @type object
     * @default { show: { type: "fade", duration: 400, from: 0, to: 1 }, hide: { type: "fade", duration: 400, to: 0 } }
     * @default {show: {type: 'slide', duration: 200, from: { position: {my: 'top', at: 'bottom', of: window}}}, hide: { type: 'slide', duration: 200, to: { position: {my: 'top', at: 'bottom', of: window}}}} [for](Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: dxToastAnimation;
    /**
     * @docid dxToastOptions.closeOnClick
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnClick?: boolean;
    /**
     * @docid dxToastOptions.closeOnOutsideClick
     * @default true [for](Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid dxToastOptions.closeOnSwipe
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnSwipe?: boolean;
    /**
     * @docid dxToastOptions.displayTime
     * @type number
     * @default 2000
     * @default 4000 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayTime?: number;
    /**
     * @docid dxToastOptions.height
     * @default 'auto'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxToastOptions.maxWidth
     * @default 568 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid dxToastOptions.message
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid dxToastOptions.minWidth
     * @default 344 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid dxToastOptions.position
     * @type positionConfig|string
     * @default "bottom center"
     * @default { at: 'bottom left', my: 'bottom left', offset: '20 -20'} [for](Android)
     * @default { at: 'bottom center', my: 'bottom center', offset: '0 0' } [for](phones_on_Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: positionConfig | string;
    /**
     * @docid dxToastOptions.shading
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid dxToastOptions.type
     * @type Enums.ToastType
     * @default 'info'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
    /**
     * @docid dxToastOptions.width
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
     * @type animationConfig
     * @default { type: "fade", duration: 400, to: 0 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxToastOptions.animation.show
     * @type animationConfig
     * @default { type: "fade", duration: 400, from: 0, to: 1 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid dxToast
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