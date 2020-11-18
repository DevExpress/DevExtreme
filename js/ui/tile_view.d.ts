import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @type number
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseItemHeight?: number;
    /**
     * @docid
     * @type number
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseItemWidth?: number;
    /**
     * @docid
     * @type string|Array<string,dxTileViewItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxTileViewItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Enums.Orientation
     * @default 'horizontal'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'horizontal' | 'vertical';
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
     * @type number|string|function
     * @default 500
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @type number
     * @default 20
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemMargin?: number;
    /**
     * @docid
     * @type Array<string, dxTileViewItem, object>
     * @fires dxTileViewOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTileViewItem | any>;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showScrollbar?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/tile_view
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTileView extends CollectionWidget {
    constructor(element: Element, options?: dxTileViewOptions)
    constructor(element: JQuery, options?: dxTileViewOptions)
    /**
     * @docid
     * @publicName scrollPosition()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollPosition(): number;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxTileViewItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    heightRatio?: number;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    widthRatio?: number;
}

declare global {
interface JQuery {
    dxTileView(): JQuery;
    dxTileView(options: "instance"): dxTileView;
    dxTileView(options: string): any;
    dxTileView(options: string, ...params: any[]): any;
    dxTileView(options: dxTileViewOptions): JQuery;
}
}
export type Options = dxTileViewOptions;

/** @deprecated use Options instead */
export type IOptions = dxTileViewOptions;
