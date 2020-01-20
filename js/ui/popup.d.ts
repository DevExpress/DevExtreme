import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions
} from './overlay';

export interface dxPopupOptions<T = dxPopup> extends dxOverlayOptions<T> {
    /**
     * @docid dxPopupOptions.animation
     * @default { show: { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } } }, hide: { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } } }} [for](iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: dxPopupAnimation;
    /**
     * @docid dxPopupOptions.container
     * @type string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    container?: string | Element | JQuery;
    /**
     * @docid dxPopupOptions.dragEnabled
     * @type boolean
     * @default false
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragEnabled?: boolean;
    /**
     * @docid dxPopupOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxPopupOptions.fullScreen
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fullScreen?: boolean;
    /**
     * @docid dxPopupOptions.height
     * @fires dxPopupOptions.onResize
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxPopupOptions.onResize
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResize?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxPopupOptions.onResizeEnd
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeEnd?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxPopupOptions.onResizeStart
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeStart?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxPopupOptions.onTitleRendered
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 titleElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleRendered?: ((e: { component?: T, element?: dxElement, model?: any, titleElement?: dxElement }) => any);
    /**
     * @docid dxPopupOptions.position
     * @type Enums.PositionAlignment|positionConfig|function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
    /**
     * @docid dxPopupOptions.resizeEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resizeEnabled?: boolean;
    /**
     * @docid dxPopupOptions.showCloseButton
     * @type boolean
     * @default false
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCloseButton?: boolean;
    /**
     * @docid dxPopupOptions.showTitle
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid dxPopupOptions.title
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
    /**
     * @docid dxPopupOptions.titleTemplate
     * @type template|function
     * @default "title"
     * @type_function_param1 titleElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    titleTemplate?: template | ((titleElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxPopupOptions.toolbarItems
     * @type Array<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbarItems?: Array<dxPopupToolbarItem>;
    /**
     * @docid dxPopupOptions.width
     * @fires dxPopupOptions.onResize
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
export interface dxPopupAnimation extends dxOverlayAnimation {
    /**
     * @docid dxPopupOptions.animation.hide
     * @default { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } }} [for](iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxPopupOptions.animation.show
     * @default { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } }} [for](iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
export interface dxPopupToolbarItem {
    /**
     * @docid dxPopupOptions.toolbarItems.disabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid dxPopupOptions.toolbarItems.html
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    html?: string;
    /**
     * @docid dxPopupOptions.toolbarItems.location
     * @type Enums.ToolbarItemLocation
     * @default 'center'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
    /**
     * @docid dxPopupOptions.toolbarItems.options
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    options?: any;
    /**
     * @docid dxPopupOptions.toolbarItems.template
     * @type template
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template;
    /**
     * @docid dxPopupOptions.toolbarItems.text
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxPopupOptions.toolbarItems.toolbar
     * @type Enums.Toolbar
     * @default 'top'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: 'bottom' | 'top';
    /**
     * @docid dxPopupOptions.toolbarItems.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPopupOptions.toolbarItems.widget
     * @type Enums.ToolbarItemWidget
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
}
/**
 * @docid dxPopup
 * @inherits dxOverlay
 * @hasTranscludedContent
 * @module ui/popup
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxPopup extends dxOverlay {
    constructor(element: Element, options?: dxPopupOptions)
    constructor(element: JQuery, options?: dxPopupOptions)
}

declare global {
interface JQuery {
    dxPopup(): JQuery;
    dxPopup(options: "instance"): dxPopup;
    dxPopup(options: string): any;
    dxPopup(options: string, ...params: any[]): any;
    dxPopup(options: dxPopupOptions): JQuery;
}
}
export type Options = dxPopupOptions;

/** @deprecated use Options instead */
export type IOptions = dxPopupOptions;
export type ToolbarItem = dxPopupToolbarItem;