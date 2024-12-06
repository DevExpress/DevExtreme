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
 * @docid _ui_drop_down_button_ButtonClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ButtonClickEvent = NativeEventInfo<dxDropDownButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    /**
     * @docid _ui_drop_down_button_ButtonClickEvent.selectedItem
     * @type object
     */
    readonly selectedItem?: any;
};

/**
 * @docid _ui_drop_down_button_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxDropDownButton>;

/**
 * @docid _ui_drop_down_button_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxDropDownButton>;

/**
 * @docid _ui_drop_down_button_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxDropDownButton>;

/**
 * @docid _ui_drop_down_button_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ItemClickEvent = NativeEventInfo<dxDropDownButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    /**
     * @docid _ui_drop_down_button_ItemClickEvent.itemData
     * @type object
     */
    readonly itemData?: any;
    /** @docid _ui_drop_down_button_ItemClickEvent.itemElement */
    readonly itemElement: DxElement;
};

/**
 * @docid _ui_drop_down_button_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxDropDownButton> & ChangedOptionInfo;

/**
 * @docid _ui_drop_down_button_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectionChangedEvent = EventInfo<dxDropDownButton> & {
    /**
     * @docid _ui_drop_down_button_SelectionChangedEvent.item
     * @type object
     */
    readonly item: any;
    /**
     * @docid _ui_drop_down_button_SelectionChangedEvent.previousItem
     * @type object
     */
    readonly previousItem: any;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
    /**
     * @docid
     * @type string | Array<dxDropDownButtonItem | any> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<Item | any> | null;
    /**
     * @docid
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 itemData:object
     * @public
     */
    displayExpr?: string | ((itemData: any) => string) | undefined;
    /**
     * @docid
     * @default "content"
     * @type_function_param1 data:Array<string,number,Object>|DataSource
     * @type_function_return string|Element|jQuery
     * @public
     */
    dropDownContentTemplate?: template | ((data: Array<string | number | any> | DataSource, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default {}
     * @public
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
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
     * @default undefined
     * @public
     */
    icon?: string | undefined;
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @type Array<dxDropDownButtonItem | any>
     * @default null
     * @public
     */
    items?: Array<Item | any>;
    /**
     * @docid
     * @default 'this'
     * @public
     */
    keyExpr?: string;
    /**
     * @docid
     * @default 'No data to display'
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{ui/drop_down_button:ButtonClickEvent}
     * @action
     * @public
     */
    onButtonClick?: ((e: ButtonClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{ui/drop_down_button:ItemClickEvent}
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{ui/drop_down_button:SelectionChangedEvent}
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void) | string;
    /**
     * @docid
     * @default false
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @default null
     * @readonly
     * @public
     */
    selectedItem?: string | number | any;
    /**
     * @docid
     * @default null
     * @public
     */
    selectedItemKey?: string | number;
    /**
     * @docid
     * @default true
     * @public
     */
    showArrowIcon?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    splitButton?: boolean;
    /**
     * @docid
     * @default 'outlined'
     * @public
     */
    stylingMode?: ButtonStyle;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((data: TemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default ""
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default 'normal'
     * @public
     */
    type?: ButtonType;
    /**
     * @docid
     * @default false
     * @public
     */
    useSelectMode?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    wrapItemText?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    useItemTextAsTitle?: boolean;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDropDownButton extends Widget<dxDropDownButtonOptions> {
    /**
     * @docid
     * @publicName close()
     * @return Promise<void>
     * @public
     */
    close(): DxPromise<void>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName open()
     * @return Promise<void>
     * @public
     */
    open(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle()
     * @return Promise<void>
     * @public
     */
    toggle(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle(visibility)
     * @return Promise<void>
     * @public
     */
    toggle(visibility: boolean): DxPromise<void>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxDropDownButton
 */
export type Item = dxDropDownButtonItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxDropDownButtonItem extends dxListItem {
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{ui/drop_down_button:ItemClickEvent}
     * @public
     */
     onClick?: ((e: ItemClickEvent) => void) | string;
}

/** @public */
export type Properties = dxDropDownButtonOptions;

/** @deprecated use Properties instead */
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
