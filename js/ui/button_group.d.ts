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
    CollectionWidgetItem,
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    ButtonType,
    ButtonStyle,
    SingleMultipleOrNone,
} from '../common';

export {
    ButtonType,
    ButtonStyle,
    SingleMultipleOrNone,
};

/** @public */
export type ContentReadyEvent = EventInfo<dxButtonGroup>;

/** @public */
export type DisposingEvent = EventInfo<dxButtonGroup>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxButtonGroup>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxButtonGroup, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxButtonGroup> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxButtonGroup> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
    /**
     * @docid
     * @default "content"
     * @type_function_param1 buttonData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    buttonTemplate?: template | ((buttonData: any, buttonContent: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default true
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @type Array<dxButtonGroupItem>
     * @public
     */
    items?: Array<Item>;
    /**
     * @docid
     * @default 'text'
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxButtonGroup
     * @type_function_param1_field itemData:object
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxButtonGroup
     * @type_function_param1_field addedItems:array<any>
     * @type_function_param1_field removedItems:array<any>
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @fires dxButtonGroupOptions.onSelectionChanged
     * @public
     */
    selectedItemKeys?: Array<any>;
    /**
     * @docid
     * @fires dxButtonGroupOptions.onSelectionChanged
     * @public
     */
    selectedItems?: Array<any>;
    /**
     * @docid
     * @default 'single'
     * @public
     */
    selectionMode?: SingleMultipleOrNone;
    /**
     * @docid
     * @default 'contained'
     * @public
     */
    stylingMode?: ButtonStyle;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxButtonGroup extends Widget<dxButtonGroupOptions> { }

/**
 * @public
 * @namespace DevExpress.ui.dxButtonGroup
 */
export type Item = dxButtonGroupItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxButtonGroupItem extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    hint?: string;
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default 'normal'
     * @public
     */
    type?: ButtonType;

    /**
     * @docid
     * @public
     */
    elementAttr?: { [key: string]: any };
}

/** @public */
export type Properties = dxButtonGroupOptions;

/** @deprecated use Properties instead */
export type Options = dxButtonGroupOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxButtonGroupOptions.onContentReady
 * @type_function_param1 e:{ui/button_group:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxButtonGroupOptions.onDisposing
 * @type_function_param1 e:{ui/button_group:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxButtonGroupOptions.onInitialized
 * @type_function_param1 e:{ui/button_group:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxButtonGroupOptions.onItemClick
 * @type_function_param1 e:{ui/button_group:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxButtonGroupOptions.onOptionChanged
 * @type_function_param1 e:{ui/button_group:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxButtonGroupOptions.onSelectionChanged
 * @type_function_param1 e:{ui/button_group:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
