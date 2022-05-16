import { DataSourceLike } from '../data/data_source';
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

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

import {
    ToolbarItemWidget,
    ToolbarItemLocation,
    ToolbarItemLocateInMenuMode,
    ToolbarItemShowTextMode,
} from '../types/enums';

type ItemLike = string | Item | any;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxToolbar<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxToolbarOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxToolbar<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @type string | Array<string | dxToolbarItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
    /**
     * @docid
     * @type Array<string | dxToolbarItem | any>
     * @fires dxToolbarOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default "menuItem"
     * @type_function_param1 itemData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuItemTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @deprecated
     * @default undefined
     * @public
     */
    height?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxToolbar<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxToolbarOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxToolbar
 * */
export type Item = dxToolbarItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxToolbarItem extends CollectionWidgetItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default 'never'
     * @public
     */
    locateInMenu?: ToolbarItemLocateInMenuMode;
    /**
     * @docid
     * @default 'center'
     * @public
     */
    location?: ToolbarItemLocation;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    options?: any;
    /**
     * @docid
     * @default 'always'
     * @public
     */
    showText?: ToolbarItemShowTextMode;
    /**
     * @docid
     * @public
     */
    widget?: ToolbarItemWidget;
}

/** @public */
export type ExplicitTypes<
    TItem extends ItemLike,
    TKey,
> = {
    Properties: Properties<TItem, TKey>;
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
    TItem extends ItemLike = any,
    TKey = any,
> = dxToolbarOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;
