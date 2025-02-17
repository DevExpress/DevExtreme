import {
    ButtonType,
    ButtonStyle,
    template,
} from '../common';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    Item as dxListItem,
} from './list';

import {
    Properties as PopupProperties,
} from './popup';

import {
    TemplateData,
} from './button';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export {
    ButtonType,
    ButtonStyle,
};

/**
 * The type of the buttonClick event handler&apos;s argument.
 */
export type ButtonClickEvent = NativeEventInfo<dxDropDownButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly selectedItem?: any;
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxDropDownButton>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxDropDownButton>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxDropDownButton>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent = NativeEventInfo<dxDropDownButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxDropDownButton> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxDropDownButton> & {
    /**
     * 
     */
    readonly item: any;
    /**
     * 
     */
    readonly previousItem: any;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
    /**
     * Provides data for the drop-down menu.
     */
    dataSource?: DataSourceLike<Item | any> | null;
    /**
     * Specifies whether to wait until the drop-down menu is opened the first time to render its content. Specifies whether to render the view&apos;s content when it is displayed. If false, the content is rendered immediately.
     */
    deferRendering?: boolean;
    /**
     * Specifies the data field whose values should be displayed in the drop-down menu.
     */
    displayExpr?: string | ((itemData: any) => string) | undefined;
    /**
     * Specifies custom content for the drop-down field.
     */
    dropDownContentTemplate?: template | ((data: Array<string | number | any> | DataSource, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * Configures the drop-down field.
     */
    dropDownOptions?: PopupProperties;
    /**
     * Specifies whether users can use keyboard to focus the UI component.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user hovers the mouse pointer over it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies the button&apos;s icon.
     */
    icon?: string | undefined;
    /**
     * Specifies a custom template for drop-down menu items.
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Provides drop-down menu items.
     */
    items?: Array<Item | any>;
    /**
     * Specifies which data field provides keys used to distinguish between the selected drop-down menu items.
     */
    keyExpr?: string;
    /**
     * Specifies the text or HTML markup displayed in the drop-down menu when it does not contain any items.
     */
    noDataText?: string;
    /**
     * A function that is executed when the button is clicked or tapped. If splitButton is true, this function is executed for the action button only.
     */
    onButtonClick?: ((e: ButtonClickEvent) => void) | string;
    /**
     * A function that is executed when a drop-down menu item is clicked.
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * A function that is executed when an item is selected or selection is canceled. In effect when useSelectMode is true.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void) | string;
    /**
     * Specifies whether the drop-down menu is opened.
     */
    opened?: boolean;
    /**
     * Contains the selected item&apos;s data. Available when useSelectMode is true.
     */
    selectedItem?: string | number | any;
    /**
     * Contains the selected item&apos;s key and allows you to specify the initially selected item. Applies when useSelectMode is true.
     */
    selectedItemKey?: string | number;
    /**
     * Specifies whether the arrow icon should be displayed.
     */
    showArrowIcon?: boolean;
    /**
     * Specifies whether to split the button in two: one executes an action, the other opens and closes the drop-down menu.
     */
    splitButton?: boolean;
    /**
     * Specifies how the button is styled.
     */
    stylingMode?: ButtonStyle;
    /**
     * Specifies a custom template for the base button in DropDownButton.
     */
    template?: template | ((data: TemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the button&apos;s text. Applies only if useSelectMode is false.
     */
    text?: string;
    /**
     * Specifies the drop-down button type.
     */
    type?: ButtonType;
    /**
     * Specifies whether the UI component stores the selected drop-down menu item.
     */
    useSelectMode?: boolean;
    /**
     * Specifies whether text that exceeds the drop-down list width should be wrapped.
     */
    wrapItemText?: boolean;
    /**
     * Specifies whether the widget uses item&apos;s text a title attribute.
     */
    useItemTextAsTitle?: boolean;
}
/**
 * The DropDownButton is a button that opens a drop-down menu.
 */
export default class dxDropDownButton extends Widget<dxDropDownButtonOptions> {
    /**
     * Closes the drop-down menu.
     */
    close(): DxPromise<void>;
    getDataSource(): DataSource;
    /**
     * Opens the drop-down menu.
     */
    open(): DxPromise<void>;
    /**
     * Opens or closes the drop-down menu, reversing the current state.
     */
    toggle(): DxPromise<void>;
    /**
     * Opens or closes the drop-down menu, depending on the argument.
     */
    toggle(visibility: boolean): DxPromise<void>;
}

export type Item = dxDropDownButtonItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDropDownButtonItem extends dxListItem {
    /**
      * A handler for the click event raised for a certain item in the drop-down field.
      */
     onClick?: ((e: ItemClickEvent) => void) | string;
}

export type Properties = dxDropDownButtonOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxDropDownButtonOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onButtonClick' | 'onItemClick' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxDropDownButtonOptions.onContentReady
 * @type_function_param1 e:{ui/drop_down_button:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxDropDownButtonOptions.onDisposing
 * @type_function_param1 e:{ui/drop_down_button:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxDropDownButtonOptions.onInitialized
 * @type_function_param1 e:{ui/drop_down_button:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxDropDownButtonOptions.onOptionChanged
 * @type_function_param1 e:{ui/drop_down_button:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
