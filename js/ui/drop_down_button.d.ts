import {
    ButtonStyle,
} from '../common';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    template,
} from '../core/templates/template';

import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    Item as dxListItem,
} from './list';

import {
    Properties as PopupProperties,
} from './popup';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export {
    ButtonStyle,
};

/** @public */
export type ButtonClickEvent = NativeEventInfo<dxDropDownButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    readonly selectedItem?: any;
};

/** @public */
export type ContentReadyEvent = EventInfo<dxDropDownButton>;

/** @public */
export type DisposingEvent = EventInfo<dxDropDownButton>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDropDownButton>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxDropDownButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
};

/** @public */
export type OptionChangedEvent = EventInfo<dxDropDownButton> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxDropDownButton> & {
    readonly item: any;
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
    displayExpr?: string | ((itemData: any) => string);
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
    icon?: string;
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
     * @default ""
     * @public
     */
    text?: string;
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
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDropDownButton
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:object
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
 * @skip
 * @docid dxDropDownButtonOptions.onContentReady
 * @type_function_param1 e:{ui/drop_down_button:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxDropDownButtonOptions.onDisposing
 * @type_function_param1 e:{ui/drop_down_button:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxDropDownButtonOptions.onInitialized
 * @type_function_param1 e:{ui/drop_down_button:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxDropDownButtonOptions.onOptionChanged
 * @type_function_param1 e:{ui/drop_down_button:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
