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
 * @docid _ui_button_group_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxButtonGroup>;

/**
 * @docid _ui_button_group_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxButtonGroup>;

/**
 * @docid _ui_button_group_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxButtonGroup>;

/**
 * @docid _ui_button_group_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent = NativeEventInfo<dxButtonGroup, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/**
 * @docid _ui_button_group_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxButtonGroup> & ChangedOptionInfo;

/**
 * @docid _ui_button_group_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent = EventInfo<dxButtonGroup> & SelectionChangeInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
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
     * @type_function_param1 e:{ui/button_group:ItemClickEvent}
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/button_group:SelectionChangedEvent}
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
