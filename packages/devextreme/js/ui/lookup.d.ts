import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    ApplyValueMode,
    PageLoadMode,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

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

export {
    ApplyValueMode,
    PageLoadMode,
};

/**
 * The type of the closed event handler&apos;s argument.
 */
export type ClosedEvent = EventInfo<dxLookup>;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxLookup>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxLookup>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxLookup>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent = NativeEventInfo<dxLookup, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/**
 * The type of the opened event handler&apos;s argument.
 */
export type OpenedEvent = EventInfo<dxLookup>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxLookup> & ChangedOptionInfo;

/**
 * The type of the pageLoading event handler&apos;s argument.
 */
export type PageLoadingEvent = EventInfo<dxLookup>;

/**
 * The type of the pullRefresh event handler&apos;s argument.
 */
export type PullRefreshEvent = EventInfo<dxLookup>;

/**
 * The type of the scroll event handler&apos;s argument.
 */
export type ScrollEvent = NativeEventInfo<dxLookup, MouseEvent | Event> & ScrollInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxLookup> & SelectionChangedInfo;

export type TitleRenderedEvent = EventInfo<dxLookup> & TitleRenderedInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxLookup, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
    /**
     * The text displayed on the Apply button.
     */
    applyButtonText?: string;
    /**
     * Specifies the way an end user applies the selected value.
     */
    applyValueMode?: ApplyValueMode;
    /**
     * The text displayed on the Cancel button.
     */
    cancelButtonText?: string;
    /**
     * Specifies whether or not the UI component cleans the search box when the popup window is displayed.
     */
    cleanSearchOnOpening?: boolean;
    /**
     * The text displayed on the Clear button.
     */
    clearButtonText?: string;
    /**
     * Specifies a custom template for the input field.
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * A Boolean value specifying whether or not to display the lookup in full-screen mode.
     * @deprecated Use the dropDownOptions option instead.
     */
    fullScreen?: boolean;
    /**
     * Specifies a custom template for group captions.
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether data items should be grouped.
     */
    grouped?: boolean;
    /**
     * The text displayed on the button used to load the next page from the data source.
     */
    nextButtonText?: string;
    /**
     * A function that is executed before the next page is loaded.
     */
    onPageLoading?: ((e: PageLoadingEvent) => void);
    /**
     * A function that is executed when the &apos;pull to refresh&apos; gesture is performed on the drop-down item list. Supported on mobile devices only.
     */
    onPullRefresh?: ((e: PullRefreshEvent) => void);
    /**
     * A function that is executed on each scroll gesture performed on the drop-down item list.
     */
    onScroll?: ((e: ScrollEvent) => void);
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * Specifies whether the next page is loaded when a user scrolls the UI component to the bottom or when the &apos;next&apos; button is clicked.
     */
    pageLoadMode?: PageLoadMode;
    /**
     * Specifies the text shown in the pullDown panel, which is displayed when the UI component is scrolled to the bottom.
     */
    pageLoadingText?: string;
    /**
     * The text displayed by the UI component when nothing is selected.
     */
    placeholder?: string;
    /**
     * A Boolean value specifying whether or not the UI component supports the &apos;pull down to refresh&apos; gesture.
     */
    pullRefreshEnabled?: boolean;
    /**
     * Specifies the text displayed in the pullDown panel when the UI component is pulled below the refresh threshold.
     */
    pulledDownText?: string;
    /**
     * Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold.
     */
    pullingDownText?: string;
    /**
     * Specifies the text displayed in the pullDown panel while the UI component is being refreshed.
     */
    refreshingText?: string;
    /**
     * Specifies whether the search box is visible.
     */
    searchEnabled?: boolean;
    /**
     * The text that is provided as a hint in the lookup&apos;s search bar.
     */
    searchPlaceholder?: string;
    /**
     * Specifies whether to display the Cancel button in the lookup window.
     */
    showCancelButton?: boolean;
    /**
     * Specifies whether to display the Clear button in the lookup window.
     */
    showClearButton?: boolean;
    /**
     * Specifies the DOM events after which the UI component&apos;s search results should be updated.
     */
    searchStartEvent?: string;
    /**
     * Specifies whether or not the UI component uses native scrolling.
     */
    useNativeScrolling?: boolean;
    /**
     * Specifies whether to show lookup contents in the Popover UI component.
     */
    usePopover?: boolean;
    /**
     * Specifies the DOM events after which the UI component&apos;s value should be updated.
     * @deprecated 
     */
    valueChangeEvent?: string;
    /**
     * Specifies whether to vertically align the drop-down menu so that the selected item is in its center. Applies only in Material Design themes.
     */
    dropDownCentered?: boolean;
    /**
     * Configures the drop-down field.
     */
    dropDownOptions?: PopoverProperties;

}
/**
 * The Lookup is a UI component that allows an end user to search for an item in a collection shown in a drop-down menu.
 */
export default class dxLookup extends dxDropDownList<dxLookupOptions> { }

export type Properties = dxLookupOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxLookupOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onPageLoading' | 'onPullRefresh' | 'onScroll' | 'onValueChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxLookupOptions.onClosed
 * @type_function_param1 e:{ui/lookup:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @docid dxLookupOptions.onContentReady
 * @type_function_param1 e:{ui/lookup:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxLookupOptions.onDisposing
 * @type_function_param1 e:{ui/lookup:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxLookupOptions.onInitialized
 * @type_function_param1 e:{ui/lookup:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxLookupOptions.onItemClick
 * @type_function_param1 e:{ui/lookup:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxLookupOptions.onOpened
 * @type_function_param1 e:{ui/lookup:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @docid dxLookupOptions.onOptionChanged
 * @type_function_param1 e:{ui/lookup:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxLookupOptions.onSelectionChanged
 * @type_function_param1 e:{ui/lookup:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
