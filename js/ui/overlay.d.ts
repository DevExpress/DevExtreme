import {
    animationConfig
} from '../animation/fx';

import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxOverlayOptions<T = dxOverlay> extends WidgetOptions<T> {
    /**
     * @docid
     * @default { show: { type: "pop", duration: 300, from: { scale: 0.55 } }, hide: { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
     * @ref
     * @default { show: { type: 'fade', duration: 400 }, hide: { type: 'fade', duration: 400, to: { opacity: 0 }, from: { opacity: 1 } }} [for](Android_below_version_4.2)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    animation?: dxOverlayAnimation;
    /**
     * @docid
     * @default false
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid
     * @default "content"
     * @type_function_param1 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragEnabled?: boolean;
    /**
     * @docid
     * @default function() { return $(window).height() * 0.8 }
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHidden?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHiding?: ((e: { component?: T, element?: dxElement, model?: any, cancel?: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShowing?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @default { my: 'center', at: 'center', of: window }
     * @fires dxOverlayOptions.onPositioned
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: any;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @default ''
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shadingColor?: string;
    /**
     * @docid
     * @default false
     * @fires dxOverlayOptions.onShowing
     * @fires dxOverlayOptions.onHiding
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default function() {return $(window).width() * 0.8 }
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
export interface dxOverlayAnimation {
    /**
     * @docid dxOverlayOptions.animation.hide
     * @default { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxOverlayOptions.animation.show
     * @default { type: "pop", duration: 400, from: { scale: 0.55 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/overlay
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxOverlay extends Widget {
    constructor(element: Element, options?: dxOverlayOptions)
    constructor(element: JQuery, options?: dxOverlayOptions)
    /**
     * @docid
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): dxElement;
    /**
     * @docid
     * @publicName hide()
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): Promise<boolean> & JQueryPromise<boolean>;
    /**
     * @docid
     * @publicName repaint()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaint(): void;
    /**
     * @docid
     * @publicName show()
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): Promise<boolean> & JQueryPromise<boolean>;
    /**
     * @docid
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(showing: boolean): Promise<boolean> & JQueryPromise<boolean>;
}

/**
 * @docid ui.dxOverlay.baseZIndex
 * @publicName baseZIndex(zIndex)
 * @param1 zIndex:number
 * @namespace DevExpress.ui.dxOverlay
 * @module ui/overlay
 * @export dxOverlay.baseZIndex
 * @static
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export function baseZIndex(zIndex: number): void;

export type Options = dxOverlayOptions;

/** @deprecated use Options instead */
export type IOptions = dxOverlayOptions;
