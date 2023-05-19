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

import {
    ApplyValueMode,
    PageLoadMode,
} from '../common';

export {
    ApplyValueMode,
    PageLoadMode,
};

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
 * @docid
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
     * @hidden false
     * @public
     */
    applyValueMode?: ApplyValueMode;
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
     * @type_function_param1_field component:dxLookup
     * @action
     * @public
     */
    onPageLoading?: ((e: PageLoadingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxLookup
     * @action
     * @public
     */
    onPullRefresh?: ((e: PullRefreshEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field scrollOffset:object
     * @type_function_param1_field component:dxLookup
     * @action
     * @public
     */
    onScroll?: ((e: ScrollEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field value:object
     * @type_function_param1_field previousValue:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxLookup
     * @action
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @default "scrollBottom"
     * @public
     */
    pageLoadMode?: PageLoadMode;
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

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxLookupOptions.onClosed
 * @type_function_param1 e:{ui/lookup:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onContentReady
 * @type_function_param1 e:{ui/lookup:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onDisposing
 * @type_function_param1 e:{ui/lookup:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onInitialized
 * @type_function_param1 e:{ui/lookup:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onItemClick
 * @type_function_param1 e:{ui/lookup:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onOpened
 * @type_function_param1 e:{ui/lookup:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onOptionChanged
 * @type_function_param1 e:{ui/lookup:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onPageLoading
 * @type_function_param1 e:{ui/lookup:PageLoadingEvent}
 */
onPageLoading?: ((e: PageLoadingEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onPullRefresh
 * @type_function_param1 e:{ui/lookup:PullRefreshEvent}
 */
onPullRefresh?: ((e: PullRefreshEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onScroll
 * @type_function_param1 e:{ui/lookup:ScrollEvent}
 */
onScroll?: ((e: ScrollEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onSelectionChanged
 * @type_function_param1 e:{ui/lookup:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxLookupOptions.onValueChanged
 * @type_function_param1 e:{ui/lookup:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
