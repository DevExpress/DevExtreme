import {
    animationConfig
} from '../animation/fx';

import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxOverlayOptions<T = dxOverlay> extends WidgetOptions<T> {
    /**
     * @docid dxOverlayOptions.animation
     * @type object
     * @default { show: { type: "pop", duration: 300, from: { scale: 0.55 } }, hide: { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
     * @ref
     * @default { show: { type: 'fade', duration: 400 }, hide: { type: 'fade', duration: 400, to: { opacity: 0 }, from: { opacity: 1 } }} [for](Android_below_version_4.2)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: dxOverlayAnimation;
    /**
     * @docid dxOverlayOptions.closeOnOutsideClick
     * @type boolean|function
     * @default false
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid dxOverlayOptions.contentTemplate
     * @type template|function
     * @default "content"
     * @type_function_param1 contentElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxOverlayOptions.deferRendering
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid dxOverlayOptions.dragEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragEnabled?: boolean;
    /**
     * @docid dxOverlayOptions.height
     * @type number|string|function
     * @default function() { return $(window).height() * 0.8 }
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxOverlayOptions.maxHeight
     * @type number|string|function
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * @docid dxOverlayOptions.maxWidth
     * @type number|string|function
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid dxOverlayOptions.minHeight
     * @type number|string|function
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number | string | (() => number | string);
    /**
     * @docid dxOverlayOptions.minWidth
     * @type number|string|function
     * @default null
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid dxOverlayOptions.onHidden
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHidden?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxOverlayOptions.onHiding
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHiding?: ((e: { component?: T, element?: dxElement, model?: any, cancel?: boolean }) => any);
    /**
     * @docid dxOverlayOptions.onShowing
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShowing?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxOverlayOptions.onShown
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxOverlayOptions.position
     * @default { my: 'center', at: 'center', of: window }
     * @fires dxOverlayOptions.onPositioning
     * @fires dxOverlayOptions.onPositioned
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: any;
    /**
     * @docid dxOverlayOptions.shading
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid dxOverlayOptions.shadingColor
     * @type string
     * @default ''
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shadingColor?: string;
    /**
     * @docid dxOverlayOptions.visible
     * @type Boolean
     * @default false
     * @fires dxOverlayOptions.onShowing
     * @fires dxOverlayOptions.onHiding
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxOverlayOptions.width
     * @type number|string|function
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
     * @type animationConfig
     * @default { type: "pop", duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 } } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxOverlayOptions.animation.show
     * @type animationConfig
     * @default { type: "pop", duration: 400, from: { scale: 0.55 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid dxOverlay
 * @type object
 * @inherits Widget
 * @module ui/overlay
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxOverlay extends Widget {
    constructor(element: Element, options?: dxOverlayOptions)
    constructor(element: JQuery, options?: dxOverlayOptions)
    /**
     * @docid dxOverlaymethods.content
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): dxElement;
    /**
     * @docid dxOverlaymethods.hide
     * @publicName hide()
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): Promise<boolean> & JQueryPromise<boolean>;
    /**
     * @docid dxOverlaymethods.repaint
     * @publicName repaint()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaint(): void;
    /**
     * @docid dxOverlaymethods.show
     * @publicName show()
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): Promise<boolean> & JQueryPromise<boolean>;
    /**
     * @docid dxOverlaymethods.toggle
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(showing: boolean): Promise<boolean> & JQueryPromise<boolean>;
}

/**
 * @docid ui.dxOverlayMethods.baseZIndex
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