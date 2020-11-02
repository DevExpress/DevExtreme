import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @type string|Array<string,dxMultiViewItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxMultiViewItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @type Array<string, dxMultiViewItem, object>
     * @fires dxMultiViewOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxMultiViewItem | any>;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loop?: boolean;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @type boolean
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
