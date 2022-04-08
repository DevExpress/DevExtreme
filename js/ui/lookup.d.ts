import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxDropDownList, {
    dxDropDownListOptions,
    SelectionChangedInfo,
} from './drop_down_editor/ui.drop_down_list';

import {
    ScrollInfo,
} from './list';

import {
    Properties as PopoverProperties,
} from './popover';

import {
    TitleRenderedInfo,
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
export type ItemClickEvent = NativeEventInfo<dxLookup, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/** @public */
export type OpenedEvent = EventInfo<dxLookup>;

/** @public */
export type OptionChangedEvent = EventInfo<dxLookup> & ChangedOptionInfo;

/** @public */
export type PageLoadingEvent = EventInfo<dxLookup>;

/** @public */
export type PullRefreshEvent = EventInfo<dxLookup>;

/** @public */
export type ScrollEvent = NativeEventInfo<dxLookup, MouseEvent | Event> & ScrollInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxLookup> & SelectionChangedInfo;

/** @public */
export type TitleRenderedEvent = EventInfo<dxLookup> & TitleRenderedInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxLookup, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
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
     * @default null
     * @type_function_param1 selectedItem:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @default true &for(iPhone)
     * @public
     * @deprecated dxLookupOptions.dropDownOptions
     */
    fullScreen?: boolean;
    /**
     * @docid
     * @default "group"
     * @type_function_param1 itemData:object
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
     * @default false &for(Material)
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
     * @publicName showCancelButton
     * @default false &for(Material)
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
     * @default "input change keyup"
     * @public
     */
    searchStartEvent?: string;
    /**
     * @docid
     * @default true
     * @default false &for(desktop except Mac)
     * @public
     */
    useNativeScrolling?: boolean;
    /**
     * @docid
     * @default false
     * @default true &for(desktop|iOS)
     * @publicName usePopover
     * @default false &for(Material)
     * @public
     */
    usePopover?: boolean;
    /**
     * @docid
     * @deprecated
     * @default "input change keyup"
     * @public
     */
    valueChangeEvent?: string;
    /**
     * @docid
     * @default false
     * @default true &for(Material)
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxLookup extends dxDropDownList<dxLookupOptions> { }

/** @public */
export type Properties = dxLookupOptions;

/** @deprecated use Properties instead */
export type Options = dxLookupOptions;
