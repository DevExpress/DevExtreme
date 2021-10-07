import DataSource, {
    DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import CollectionWidget, {
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

import { Item } from './tabs';

export interface dxTabsBaseOptions<
    TComponent extends dxTabsBase<any, TItem, TKey>,
    TItem extends string | Item<any> | any = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * @docid dxTabsOptions.dataSource
     * @type string | Array<string | dxTabsItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
    /**
     * @docid dxTabsOptions.focusStateEnabled
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.hoverStateEnabled
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.items
     * @type Array<string | dxTabsItem | any>
     * @fires dxTabsOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid dxTabsOptions.repaintChangesOnly
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid dxTabsOptions.scrollByContent
     * @default true
     * @default false &for(desktop)
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid dxTabsOptions.scrollingEnabled
     * @default true
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid dxTabsOptions.selectedItems
     * @public
     * @type Array<string | number | any>
     */
    selectedItems?: Array<TItem>;
    /**
     * @docid dxTabsOptions.selectionMode
     * @type Enums.NavSelectionMode
     * @default 'single'
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid dxTabsOptions.showNavButtons
     * @default true
     * @default false &for(mobile_devices)
     * @public
     */
    showNavButtons?: boolean;
}
export default class dxTabsBase<
    TProperties extends dxTabsBaseOptions<any, TItem, TKey>,
    TItem extends string | Item<any> | any = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }
