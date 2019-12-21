import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    JQueryEventObject
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

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
    /**
     * @docid dxLookupOptions.animation
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: { hide?: animationConfig, show?: animationConfig };
    /**
     * @docid dxLookupOptions.applyButtonText
     * @type string
     * @default "OK"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid dxLookupOptions.applyValueMode
     * @type Enums.EditorApplyValueMode
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid dxLookupOptions.cancelButtonText
     * @type string
     * @default "Cancel"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid dxLookupOptions.cleanSearchOnOpening
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cleanSearchOnOpening?: boolean;
    /**
     * @docid dxLookupOptions.clearButtonText
     * @type string
     * @default "Clear"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearButtonText?: string;
    /**
     * @docid dxLookupOptions.closeOnOutsideClick
     * @type boolean|function
     * @default false
     * @type_function_return boolean
     * @publicName closeOnOutsideClick
     * @default true [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | (() => boolean);
    /**
     * @docid dxLookupOptions.fieldTemplate
     * @type template|function
     * @default null
     * @type_function_param1 selectedItem:object
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxLookupOptions.focusStateEnabled
     * @type boolean
     * @default false
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxLookupOptions.fullScreen
     * @type boolean
     * @default false
     * @default true [for](iPhone)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fullScreen?: boolean;
    /**
     * @docid dxLookupOptions.groupTemplate
     * @type template|function
     * @default "group"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxLookupOptions.grouped
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grouped?: boolean;
    /**
     * @docid dxLookupOptions.nextButtonText
     * @type string
     * @default "More"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    nextButtonText?: string;
    /**
     * @docid dxLookupOptions.onPageLoading
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPageLoading?: ((e: { component?: dxLookup, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxLookupOptions.onPullRefresh
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPullRefresh?: ((e: { component?: dxLookup, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxLookupOptions.onScroll
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 scrollOffset:object
     * @type_function_param1_field7 reachedLeft:boolean
     * @type_function_param1_field8 reachedRight:boolean
     * @type_function_param1_field9 reachedTop:boolean
     * @type_function_param1_field10 reachedBottom:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onScroll?: ((e: { component?: dxLookup, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
    /**
     * @docid dxLookupOptions.onTitleRendered
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 titleElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleRendered?: ((e: { component?: dxLookup, element?: dxElement, model?: any, titleElement?: dxElement }) => any);
    /**
     * @docid dxLookupOptions.onValueChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxLookup, element?: dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxLookupOptions.pageLoadMode
     * @type Enums.ListPageLoadMode
     * @default "scrollBottom"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * @docid dxLookupOptions.pageLoadingText
     * @type string
     * @default "Loading..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageLoadingText?: string;
    /**
     * @docid dxLookupOptions.placeholder
     * @type string
     * @default "Select"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid dxLookupOptions.popupHeight
     * @type number|string|function
     * @default function() { return $(window).height() * 0.8 }
     * @type_function_return number|string
     * @default 'auto' [for](desktop|iPad)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    popupHeight?: number | string | (() => number | string);
    /**
     * @docid dxLookupOptions.popupWidth
     * @type number|string|function
     * @default function() {return $(window).width() * 0.8 }
     * @type_function_return number|string
     * @default function() { return Math.min($(window).width(), $(window).height()) * 0.4; } [for](iPad)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    popupWidth?: number | string | (() => number | string);
    /**
     * @docid dxLookupOptions.position
     * @type positionConfig
     * @default undefined
     * @publicName position
     * @default { my: 'left top', at: 'left top', of: lookupContainer } [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: positionConfig;
    /**
     * @docid dxLookupOptions.pullRefreshEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullRefreshEnabled?: boolean;
    /**
     * @docid dxLookupOptions.pulledDownText
     * @type string
     * @default "Release to refresh..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid dxLookupOptions.pullingDownText
     * @type string
     * @default "Pull down to refresh..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid dxLookupOptions.refreshingText
     * @type string
     * @default "Refreshing..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refreshingText?: string;
    /**
     * @docid dxLookupOptions.searchEnabled
     * @type boolean
     * @default true
     * @publicName searchEnabled
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid dxLookupOptions.searchPlaceholder
     * @type string
     * @default "Search"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchPlaceholder?: string;
    /**
     * @docid dxLookupOptions.shading
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid dxLookupOptions.showCancelButton
     * @type boolean
     * @default true
     * @publicName showCancelButton
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCancelButton?: boolean;
    /**
     * @docid dxLookupOptions.showClearButton
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showClearButton?: boolean;
    /**
     * @docid dxLookupOptions.showPopupTitle
     * @type boolean
     * @default true
     * @publicName showPopupTitle
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showPopupTitle?: boolean;
    /**
     * @docid dxLookupOptions.title
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
    /**
     * @docid dxLookupOptions.titleTemplate
     * @type template|function
     * @default "title"
     * @type_function_param1 titleElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    titleTemplate?: template | ((titleElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxLookupOptions.useNativeScrolling
     * @type boolean
     * @default true
     * @default false [for](desktop)
     * @default true [for](Mac)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useNativeScrolling?: boolean;
    /**
     * @docid dxLookupOptions.usePopover
     * @type boolean
     * @default false
     * @default true [for](desktop|iOS)
     * @publicName usePopover
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    usePopover?: boolean;
}
/**
 * @docid dxLookup
 * @isEditor
 * @inherits dxDropDownList
 * @module ui/lookup
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxLookup extends dxDropDownList {
    constructor(element: Element, options?: dxLookupOptions)
    constructor(element: JQuery, options?: dxLookupOptions)
}

declare global {
interface JQuery {
    dxLookup(): JQuery;
    dxLookup(options: "instance"): dxLookup;
    dxLookup(options: string): any;
    dxLookup(options: string, ...params: any[]): any;
    dxLookup(options: dxLookupOptions): JQuery;
}
}
export type Options = dxLookupOptions;

/** @deprecated use Options instead */
export type IOptions = dxLookupOptions;