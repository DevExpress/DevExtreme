import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    DxPromise,
} from '../core/utils/deferred';

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
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

type ItemLike = string | Item | any;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxSlideOut<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxSlideOut<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = Item, TKey = any> = InitializedEventInfo<dxSlideOut<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxSlideOut<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxSlideOut<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxSlideOut<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxSlideOut<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type MenuGroupRenderedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxSlideOut<TItem, TKey>>;

/** @public */
export type MenuItemRenderedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxSlideOut<TItem, TKey>>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxSlideOut<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxSlideOut<TItem, TKey>> & SelectionChangedInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxSlideOutOptions<
    TItem extends ItemLike = Item,
    TKey = any,
> extends CollectionWidgetOptions<dxSlideOut<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default false
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default "content"
     * @type_function_return string|Element|jQuery
     * @public
     */
    contentTemplate?: template | ((container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @type string | Array<string | dxSlideOutItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
    /**
     * @docid
     * @type Array<string | dxSlideOutItem | any>
     * @fires dxSlideOutOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default "menuGroup"
     * @type_function_param1 groupData:object
     * @type_function_param3 groupElement:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @public
     */
    menuGrouped?: boolean;
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
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid
     * @default false
     * @public
     */
    menuVisible?: boolean;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSlideOut
     * @default null
     * @action
     * @public
     */
    onMenuGroupRendered?: ((e: MenuGroupRenderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSlideOut
     * @default null
     * @action
     * @public
     */
    onMenuItemRendered?: ((e: MenuItemRenderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default 0
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @deprecated dxDrawer
 * @public
 */
export default class dxSlideOut<
    TItem extends ItemLike = Item,
    TKey = any,
> extends CollectionWidget<dxSlideOutOptions<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @public
     */
    hideMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @public
     */
    showMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:Boolean|undefined
     * @return Promise<void>
     * @public
     */
    toggleMenuVisibility(showing?: boolean): DxPromise<void>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxSlideOut
 */
export type Item = dxSlideOutItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxSlideOutItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuTemplate?: template | (() => string | UserDefinedElement);
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
    MenuGroupRenderedEvent: MenuGroupRenderedEvent<TItem, TKey>;
    MenuItemRenderedEvent: MenuItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends ItemLike = Item,
    TKey = any,
> = dxSlideOutOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = Item,
    TKey = any,
> = Properties<TItem, TKey>;
