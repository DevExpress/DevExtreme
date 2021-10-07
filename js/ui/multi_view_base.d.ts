import DataSource, {
    Options as DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import CollectionWidget, {
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

import { Item } from './multi_view';

export interface dxMultiViewBaseOptions<
    TComponent extends dxMultiViewBase<any, TItem, TKey>,
    TItem extends string | Item<any> | any = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * @docid dxMultiViewOptions.animationEnabled
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid dxMultiViewOptions.dataSource
     * @type string | Array<string | dxMultiViewItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
    /**
     * @docid dxMultiViewOptions.deferRendering
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid dxMultiViewOptions.focusStateEnabled
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxMultiViewOptions.items
     * @type Array<string | dxMultiViewItem | any>
     * @fires dxMultiViewOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid dxMultiViewOptions.loop
     * @default false
     * @public
     */
    loop?: boolean;
    /**
     * @docid dxMultiViewOptions.selectedIndex
     * @default 0
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid dxMultiViewOptions.swipeEnabled
     * @default true
     * @public
     */
    swipeEnabled?: boolean;
}

export default class dxMultiViewBase<
    TProperties extends dxMultiViewBaseOptions<any, TItem, TKey>,
    TItem extends string | Item<any> | any = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }
