import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxMultiViewItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @fires dxMultiViewOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxMultiViewItem | any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loop?: boolean;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/multi_view
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxMultiView extends CollectionWidget {
    constructor(element: Element, options?: dxMultiViewOptions)
    constructor(element: JQuery, options?: dxMultiViewOptions)
}

/**
* @docid
* @inherits CollectionWidgetItem
* @type object
*/
export interface dxMultiViewItem extends CollectionWidgetItem {
}

declare global {
interface JQuery {
    dxMultiView(): JQuery;
    dxMultiView(options: "instance"): dxMultiView;
    dxMultiView(options: string): any;
    dxMultiView(options: string, ...params: any[]): any;
    dxMultiView(options: dxMultiViewOptions): JQuery;
}
}
export type Options = dxMultiViewOptions;

/** @deprecated use Options instead */
export type IOptions = dxMultiViewOptions;
