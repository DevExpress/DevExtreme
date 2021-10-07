import {
    DxElement,
} from '../core/element';

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

import {
    CollectionWidgetItem,
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import dxMenuBase, {
    dxMenuBaseOptions,
} from './context_menu/ui.menu_base';

/** @public */
export type ContentReadyEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxMenu<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxMenu<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends Item<any> = Item<any>, TKey = any> = InitializedEventInfo<dxMenu<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxMenu<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxMenu<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxMenu<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxMenu<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxMenu<TItem, TKey>> & SelectionChangedInfo<TItem>;

/** @public */
export type SubmenuHiddenEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxMenu<TItem, TKey>> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuHidingEvent<TItem extends Item<any> = Item<any>, TKey = any> = Cancelable & EventInfo<dxMenu<TItem, TKey>> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuShowingEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxMenu<TItem, TKey>> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuShownEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxMenu<TItem, TKey>> & {
    readonly rootItem?: DxElement;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxMenuOptions<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> extends dxMenuBaseOptions<dxMenu<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default false
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @type string | Array<dxMenuItem> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
    /**
     * @docid
     * @default false
     * @public
     */
    hideSubmenuOnMouseLeave?: boolean;
    /**
     * @docid
     * @type Array<dxMenuItem>
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSubmenuHidden?: ((e: SubmenuHiddenEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSubmenuHiding?: ((e: SubmenuHidingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSubmenuShowing?: ((e: SubmenuShowingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSubmenuShown?: ((e: SubmenuShownEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @type Enums.Orientation
     * @default "horizontal"
     * @public
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @type Object|Enums.ShowSubmenuMode
     * @default { name: "onClick", delay: { show: 50, hide: 300 } }
     * @public
     */
    showFirstSubmenuMode?: {
      /**
       * @docid
       * @default { show: 50, hide: 300 }
       */
      delay?: {
        /**
         * @docid
         * @default 300
         */
        hide?: number;
        /**
         * @docid
         * @default 50
         */
        show?: number;
      } | number;
      /**
       * @docid
       * @type Enums.ShowSubmenuMode
       * @default "onClick"
       */
      name?: 'onClick' | 'onHover';
    } | 'onClick' | 'onHover';
    /**
     * @docid
     * @type Enums.SubmenuDirection
     * @default "auto"
     * @public
     */
    submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
}
/**
 * @docid
 * @inherits dxMenuBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMenu<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> extends dxMenuBase<dxMenuOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxMenuBaseItem<TItem extends dxMenuBaseItem<any> = dxMenuBaseItem<any>> extends CollectionWidgetItem<TItem> {
    /**
     * @docid
     * @public
     */
    beginGroup?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    closeMenuOnClick?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @type Array<dxMenuBaseItem>
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default false
     * @public
     */
    selectable?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    selected?: boolean;
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
}

/**
 * @public
 * @namespace DevExpress.ui.dxMenu
 */
export type Item<TItem extends Item<any> = Item<any>> = dxMenuItem<TItem>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxMenuItem<TItem extends dxMenuItem<any> = dxMenuItem<any>> extends dxMenuBaseItem<TItem> {
    /**
     * @docid
     * @public
     * @type Array<dxMenuItem>
     */
    items?: Array<TItem>;
}

/** @public */
export type ExplicitTypes<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
    SubmenuHiddenEvent: SubmenuHiddenEvent<TItem, TKey>;
    SubmenuHidingEvent: SubmenuHidingEvent<TItem, TKey>;
    SubmenuShowingEvent: SubmenuShowingEvent<TItem, TKey>;
    SubmenuShownEvent: SubmenuShownEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = dxMenuOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = Properties<TItem, TKey>;

/** @deprecated use Properties instead */
export type IOptions<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = Properties<TItem, TKey>;
