import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import DataSource, {
    Options as DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

type ItemLike<TKey> = string | Item<any, TKey> | any;

/** @public */
export type CancelClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = Cancelable & EventInfo<dxActionSheet<TItem, TKey>>;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxActionSheet<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxActionSheet<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxActionSheet<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxActionSheet<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxActionSheet<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxActionSheet<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxActionSheet<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxActionSheet<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxActionSheetOptions<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidgetOptions<dxActionSheet<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default "Cancel"
     * @public
     */
    cancelText?: string;
    /**
     * @docid
     * @type string | Array<string | dxActionSheetItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
    /**
     * @docid
     * @type Array<string | dxActionSheetItem | any>
     * @fires dxActionSheetOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
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
    onCancelClick?: ((e: CancelClickEvent<TItem, TKey>) => void) | string;
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
     * @default true &for(iPad)
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxActionSheet<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidget<dxActionSheetOptions<TItem, TKey>, TItem, TKey> {
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
     * @return Promise<void>
     * @public
     */
    toggle(showing: boolean): DxPromise<void>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxActionSheet
 */
export type Item<
    TItem extends Item<any, TKey> | any = any,
    TKey = any,
> = dxActionSheetItem<TItem, TKey>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxActionSheetItem<
    TItem extends dxActionSheetItem<any, TKey> | any = any,
    TKey = any,
> extends CollectionWidgetItem<TItem> {
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1_field1 component:dxActionSheet
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 event:event
     * @public
     */
    onClick?: ((e: NativeEventInfo<dxActionSheet<TItem, TKey>>) => void) | string;
    /**
     * @docid
     * @type Enums.ButtonType
     * @default 'normal'
     * @public
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    /**
     * @docid
     * @type Enums.ButtonStylingMode
     * @default 'outlined'
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained' ;
}

/** @public */
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

/** @public */
export type Properties<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = dxActionSheetOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = Properties<TItem, TKey>;
