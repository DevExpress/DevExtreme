import {
    AnimationConfig
} from '../animation/fx';

import {
    PositionConfig
} from '../animation/position';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxEvent,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import {
    ValueChangedInfo
} from './editor/editor';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

import {
    ScrollInfo
} from './list';

import {
    Properties as PopoverProperties,
} from './popover';

import {
    TitleRenderedInfo
} from './popup';

/** @public */
export type ClosedEvent = EventInfo<dxLookup>;

/** @public */
export type ContentReadyEvent = EventInfo<dxLookup>;

/** @public */
export type DisposingEvent = EventInfo<dxLookup>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxLookup>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxLookup> & ItemInfo;

/** @public */
export type OpenedEvent = EventInfo<dxLookup>;

/** @public */
export type OptionChangedEvent = EventInfo<dxLookup> & ChangedOptionInfo;

/** @public */
export type PageLoadingEvent = EventInfo<dxLookup>;

/** @public */
export type PullRefreshEvent = EventInfo<dxLookup>;

/** @public */
export type ScrollEvent = NativeEventInfo<dxLookup> & ScrollInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxLookup> & SelectionChangedInfo;

/** @public */
export type TitleRenderedEvent = EventInfo<dxLookup> & TitleRenderedInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxLookup> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
    /**
     * @docid
     * @default undefined
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    animation?: {
      /**
       * @docid
       * @default undefined
       */
      hide?: AnimationConfig,
      /**
       * @docid
       * @default undefined
       */
      show?: AnimationConfig
    };
    /**
     * @docid
     * @default "OK"
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid
     * @type Enums.EditorApplyValueMode
     * @hidden false
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid
     * @default "Cancel"
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    cleanSearchOnOpening?: boolean;
    /**
     * @docid
     * @default "Clear"
     * @public
     */
    clearButtonText?: string;
    /**
     * @docid
     * @default false
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @publicName closeOnOutsideClick
     * @default true [for](Material)
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * @docid
     * @default null
     * @type_function_param1 selectedItem:object
     * @type_function_param2 fieldElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @default true [for](iPhone)
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    fullScreen?: boolean;
    /**
     * @docid
     * @default "group"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @public
     */
    grouped?: boolean;
    /**
     * @docid
     * @default "More"
     * @public
     */
    nextButtonText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxLookup
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onPageLoading?: ((e: PageLoadingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxLookup
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onPullRefresh?: ((e: PullRefreshEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 scrollOffset:object
     * @type_function_param1_field6 reachedLeft:boolean
     * @type_function_param1_field7 reachedRight:boolean
     * @type_function_param1_field8 reachedTop:boolean
     * @type_function_param1_field9 reachedBottom:boolean
     * @type_function_param1_field1 component:dxLookup
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onScroll?: ((e: ScrollEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 titleElement:DxElement
     * @type_function_param1_field1 component:dxLookup
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    onTitleRendered?: ((e: TitleRenderedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field6 event:event
     * @type_function_param1_field1 component:dxLookup
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @type Enums.ListPageLoadMode
     * @default "scrollBottom"
     * @public
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * @docid
     * @default "Loading..."
     * @public
     */
    pageLoadingText?: string;
    /**
     * @docid
     * @default "Select"
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @default function() { return $(window).height() * 0.8 }
     * @type_function_return number|string
     * @default 'auto' [for](desktop|iPad)
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    popupHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @default function() {return $(window).width() * 0.8 }
     * @type_function_return number|string
     * @default function() { return Math.min($(window).width(), $(window).height()) * 0.4; } [for](iPad)
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    popupWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default undefined
     * @publicName position
     * @default { my: 'left top', at: 'left top', of: lookupContainer } [for](Material)
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    position?: PositionConfig;
    /**
     * @docid
     * @default false
     * @public
     */
    pullRefreshEnabled?: boolean;
    /**
     * @docid
     * @default "Release to refresh..."
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @public
     */
    refreshingText?: string;
    /**
     * @docid
     * @default true
     * @publicName searchEnabled
     * @default false [for](Material)
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid
     * @default "Search"
     * @public
     */
    searchPlaceholder?: string;
    /**
     * @docid
     * @default true
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    shading?: boolean;
    /**
     * @docid
     * @default true
     * @publicName showCancelButton
     * @default false [for](Material)
     * @public
     */
    showCancelButton?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showClearButton?: boolean;
    /**
     * @docid
     * @default true
     * @publicName showPopupTitle
     * @default false [for](Material)
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    showPopupTitle?: boolean;
    /**
     * @docid
     * @default ""
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    title?: string;
    /**
     * @docid
     * @default "title"
     * @type_function_param1 titleElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    titleTemplate?: template | ((titleElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default true
     * @default false [for](desktop except Mac)
     * @public
     */
    useNativeScrolling?: boolean;
    /**
     * @docid
     * @default false
     * @default true [for](desktop|iOS)
     * @publicName usePopover
     * @default false [for](Material)
     * @public
     */
    usePopover?: boolean;
    /**
     * @docid
     * @default false
     * @default true [for](Material)
     * @public
     */
    dropDownCentered?: boolean;
    /**
     * @docid
     * @type dxPopoverOptions
     */
    dropDownOptions?: PopoverProperties;

}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownList
 * @module ui/lookup
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxLookup extends dxDropDownList<dxLookupOptions> { }

/** @public */
export type Properties = dxLookupOptions;

/** @deprecated use Properties instead */
export type Options = dxLookupOptions;

/** @deprecated use Properties instead */
export type IOptions = dxLookupOptions;
