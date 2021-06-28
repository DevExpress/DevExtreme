import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

/** @public */
export type CancelClickEvent = Cancelable & EventInfo<dxActionSheet>;

/** @public */
export type ContentReadyEvent = EventInfo<dxActionSheet>;

/** @public */
export type DisposingEvent = EventInfo<dxActionSheet>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxActionSheet>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxActionSheet> & ChangedOptionInfo;

/** 
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxActionSheetOptions extends CollectionWidgetOptions<dxActionSheet> {
    /**
     * @docid
     * @default "Cancel"
     * @public
     */
    cancelText?: string;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxActionSheetItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @fires dxActionSheetOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxActionSheetItem | any>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field1 component:dxActionSheet
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onCancelClick?: ((e: CancelClickEvent) => void) | string;
    /**
     * @docid
     * @default true
     * @public
     */
    showCancelButton?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid
     * @public
     */
    target?: string | UserDefinedElement;
    /**
     * @docid
     * @default ""
     * @public
     */
    title?: string;
    /**
     * @docid
     * @default false
     * @default true [for](iPad)
     * @public
     */
    usePopover?: boolean;
    /**
     * @docid
     * @default false
     * @fires dxActionSheetOptions.onOptionChanged
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/action_sheet
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxActionSheet extends CollectionWidget<dxActionSheetOptions> {
    /**
     * @docid
     * @publicName hide()
     * @return Promise<void>
     * @public
     */
    hide(): DxPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @public
     */
    show(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @public
     */
    toggle(showing: boolean): DxPromise<void>;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @namespace DevExpress.ui
 * @type object
 */
export interface dxActionSheetItem extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxActionSheet
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 event:event
     * @public
     */
    onClick?: ((e: { component?: dxActionSheet, element?: DxElement, model?: any, event?: DxEvent }) => void) | string;
    /**
     * @docid
     * @type Enums.ButtonType
     * @default 'normal'
     * @public
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
}

/** @public */
export type Properties = dxActionSheetOptions;

/** @deprecated use Properties instead */
export type Options = dxActionSheetOptions;

/** @deprecated use Properties instead */
export type IOptions = dxActionSheetOptions;
