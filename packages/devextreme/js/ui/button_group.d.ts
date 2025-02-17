import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    ButtonType,
    ButtonStyle,
    SingleMultipleOrNone,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

import {
    CollectionWidgetItem,
    SelectionChangeInfo,
} from './collection/ui.collection_widget.base';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export {
    ButtonType,
    ButtonStyle,
    SingleMultipleOrNone,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxButtonGroup>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxButtonGroup>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxButtonGroup>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent = NativeEventInfo<dxButtonGroup, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxButtonGroup> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxButtonGroup> & SelectionChangeInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
    /**
     * Specifies a template for all the buttons in the group.
     */
    buttonTemplate?: template | ((buttonData: any, buttonContent: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Configures buttons in the group.
     */
    items?: Array<Item>;
    /**
     * Specifies which data field provides keys used to distinguish between the selected buttons.
     */
    keyExpr?: string | Function;
    /**
     * A function that is executed when a button is clicked or tapped.
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * A function that is executed when a button is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * Contains keys of selected buttons and allows you to specify initial button selection state.
     */
    selectedItemKeys?: Array<any>;
    /**
     * Contains the data objects that correspond to the selected buttons. The data objects are taken from the items array.
     */
    selectedItems?: Array<any>;
    /**
     * Specifies the button selection mode.
     */
    selectionMode?: SingleMultipleOrNone;
    /**
     * Specifies how buttons in the group are styled.
     */
    stylingMode?: ButtonStyle;
}
/**
 * The ButtonGroup is a UI component that contains a set of toggle buttons and can be used as a mode switcher.
 */
export default class dxButtonGroup extends Widget<dxButtonGroupOptions> { }

export type Item = dxButtonGroupItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxButtonGroupItem extends CollectionWidgetItem {
    /**
     * Specifies a text for the hint that appears when the button is hovered over or long-pressed.
     */
    hint?: string;
    /**
     * Specifies the icon to be displayed on the button.
     */
    icon?: string;
    /**
     * Specifies the button type.
     */
    type?: ButtonType;

    /**
     * Specifies the global attributes to be attached to the button group item&apos;s container element.
     */
    elementAttr?: { [key: string]: any };
}

export type Properties = dxButtonGroupOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxButtonGroupOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onItemClick' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxButtonGroupOptions.onContentReady
 * @type_function_param1 e:{ui/button_group:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxButtonGroupOptions.onDisposing
 * @type_function_param1 e:{ui/button_group:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxButtonGroupOptions.onInitialized
 * @type_function_param1 e:{ui/button_group:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxButtonGroupOptions.onOptionChanged
 * @type_function_param1 e:{ui/button_group:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
