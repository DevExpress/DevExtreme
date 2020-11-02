import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

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

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

import {
    dxPopoverOptions
} from './popover';

export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
    /**
     * @docid
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    animation?: {
      /**
      * @docid
      * @type animationConfig
      * @default undefined
      */
      hide?: animationConfig,
      /**
      * @docid
      * @type animationConfig
      * @default undefined
      */
      show?: animationConfig
    };
    /**
     * @docid
     * @type string
     * @default "OK"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid
     * @type Enums.EditorApplyValueMode
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid
     * @type string
     * @default "Cancel"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cleanSearchOnOpening?: boolean;
    /**
     * @docid
     * @type string
     * @default "Clear"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearButtonText?: string;
    /**
     * @docid
     * @type boolean|function
     * @default false
     * @type_function_return boolean
     * @publicName closeOnOutsideClick
     * @default true [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    closeOnOutsideClick?: boolean | (() => boolean);
    /**
     * @docid
     * @type template|function
     * @default null
     * @type_function_param1 selectedItem:object
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type boolean
     * @default false
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @default true [for](iPhone)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    fullScreen?: boolean;
    /**
     * @docid
     * @type template|function
     * @default "group"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grouped?: boolean;
    /**
     * @docid
     * @type string
     * @default "More"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    nextButtonText?: string;
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPageLoading?: ((e: { component?: dxLookup, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPullRefresh?: ((e: { component?: dxLookup, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 scrollOffset:object
     * @type_function_param1_field6 reachedLeft:boolean
     * @type_function_param1_field7 reachedRight:boolean
     * @type_function_param1_field8 reachedTop:boolean
     * @type_function_param1_field9 reachedBottom:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onScroll?: ((e: { component?: dxLookup, element?: dxElement, model?: any, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 titleElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    onTitleRendered?: ((e: { component?: dxLookup, element?: dxElement, model?: any, titleElement?: dxElement }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxLookup, element?: dxElement, model?: any, value?: any, previousValue?: any, event?: event }) => any);
    /**
     * @docid
     * @type Enums.ListPageLoadMode
     * @default "scrollBottom"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * @docid
     * @type string
     * @default "Loading..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageLoadingText?: string;
    /**
     * @docid
     * @type string
     * @default "Select"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @type number|string|function
     * @default function() { return $(window).height() * 0.8 }
     * @type_function_return number|string
     * @default 'auto' [for](desktop|iPad)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    popupHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @type number|string|function
     * @default function() {return $(window).width() * 0.8 }
     * @type_function_return number|string
     * @default function() { return Math.min($(window).width(), $(window).height()) * 0.4; } [for](iPad)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions

     */
    popupWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @type positionConfig
     * @default undefined
     * @publicName position
     * @default { my: 'left top', at: 'left top', of: lookupContainer } [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    position?: positionConfig;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullRefreshEnabled?: boolean;
    /**
     * @docid
     * @type string
     * @default "Release to refresh..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @type string
     * @default "Pull down to refresh..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @type string
     * @default "Refreshing..."
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refreshingText?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @publicName searchEnabled
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid
     * @type string
     * @default "Search"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchPlaceholder?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    shading?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @publicName showCancelButton
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCancelButton?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showClearButton?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @publicName showPopupTitle
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    showPopupTitle?: boolean;
    /**
     * @docid
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    title?: string;
    /**
     * @docid
     * @type template|function
     * @default "title"
     * @type_function_param1 titleElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    titleTemplate?: template | ((titleElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type boolean
     * @default true
     * @default false [for](desktop)
     * @default true [for](Mac)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useNativeScrolling?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @default true [for](desktop|iOS)
     * @publicName usePopover
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    usePopover?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @default true [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownCentered?: boolean;
    /**
     * @docid
     * @type dxPopoverOptions
     */
    dropDownOptions?: dxPopoverOptions;

}
/**
 * @docid
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
