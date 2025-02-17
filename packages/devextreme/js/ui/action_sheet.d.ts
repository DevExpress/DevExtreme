import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

import {
    ButtonType,
    ButtonStyle,
} from '../common';

type ItemLike<TKey> = string | Item<TKey> | any;

export {
    ButtonType,
    ButtonStyle,
};

/**
 * The type of the cancelClick event handler&apos;s argument.
 */
export type CancelClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = Cancelable & EventInfo<dxActionSheet<TItem, TKey>>;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxActionSheet<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxActionSheet<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxActionSheet<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxActionSheet<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxActionSheet<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxActionSheet<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxActionSheet<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxActionSheet<TItem, TKey>> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 */
export interface dxActionSheetOptions<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidgetOptions<dxActionSheet<TItem, TKey>, TItem, TKey> {
    /**
     * The text displayed in the button that closes the action sheet.
     */
    cancelText?: string;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * A function that is executed when the Cancel button is clicked or tapped.
     */
    onCancelClick?: ((e: CancelClickEvent<TItem, TKey>) => void) | string;
    /**
     * Specifies whether or not to display the Cancel button in action sheet.
     */
    showCancelButton?: boolean;
    /**
     * A Boolean value specifying whether or not the title of the action sheet is visible.
     */
    showTitle?: boolean;
    /**
     * Specifies the element the action sheet popover points at. Applies only if usePopover is true.
     */
    target?: string | UserDefinedElement;
    /**
     * The title of the action sheet.
     */
    title?: string;
    /**
     * Specifies whether or not to show the action sheet within a Popover UI component.
     */
    usePopover?: boolean;
    /**
     * A Boolean value specifying whether or not the ActionSheet UI component is visible.
     */
    visible?: boolean;
}
/**
 * The ActionSheet UI component is a sheet containing a set of buttons located one under the other. These buttons usually represent several choices relating to a single task.
 */
export default class dxActionSheet<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidget<dxActionSheetOptions<TItem, TKey>, TItem, TKey> {
    /**
     * Hides the UI component.
     */
    hide(): DxPromise<void>;
    /**
     * Shows the UI component.
     */
    show(): DxPromise<void>;
    /**
     * Shows or hides the UI component depending on the argument.
     */
    toggle(showing: boolean): DxPromise<void>;
}

export type Item<TKey = any> = dxActionSheetItem<TKey>;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxActionSheetItem<TKey = any> extends CollectionWidgetItem {
    /**
     * Specifies the icon to be displayed on the action sheet button.
     */
    icon?: string;
    /**
     * A handler for the click event raised for the button representing the given action sheet button.
     */
    onClick?: ((e: NativeEventInfo<dxActionSheet<this, TKey>, MouseEvent | PointerEvent>) => void) | string;
    /**
     * Specifies the type of the button that is an action sheet item.
     */
    type?: ButtonType;
    /**
     * Specifies which style to apply to the button that is an action sheet item.
     */
    stylingMode?: ButtonStyle;
}

export type ExplicitTypes<
    TItem extends ItemLike<TKey>,
    TKey,
> = {
    Properties: Properties<TItem, TKey>;
    CancelClickEvent: CancelClickEvent<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemHoldEvent: ItemHoldEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
};

export type Properties<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = dxActionSheetOptions<TItem, TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = Properties<TItem, TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanging' | 'onSelectionChanged'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onCancelClick'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxActionSheetOptions.onContentReady
 * @type_function_param1 e:{ui/action_sheet:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxActionSheetOptions.onDisposing
 * @type_function_param1 e:{ui/action_sheet:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxActionSheetOptions.onInitialized
 * @type_function_param1 e:{ui/action_sheet:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxActionSheetOptions.onItemClick
 * @type_function_param1 e:{ui/action_sheet:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxActionSheetOptions.onItemContextMenu
 * @type_function_param1 e:{ui/action_sheet:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxActionSheetOptions.onItemHold
 * @type_function_param1 e:{ui/action_sheet:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @docid dxActionSheetOptions.onItemRendered
 * @type_function_param1 e:{ui/action_sheet:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxActionSheetOptions.onOptionChanged
 * @type_function_param1 e:{ui/action_sheet:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
