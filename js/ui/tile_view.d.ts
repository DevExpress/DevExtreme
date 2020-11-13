import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
    /**
     * @docid dxTileViewOptions.activeStateEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxTileViewOptions.baseItemHeight
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseItemHeight?: number;
    /**
     * @docid dxTileViewOptions.baseItemWidth
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseItemWidth?: number;
    /**
     * @docid dxTileViewOptions.dataSource
     * @type string|Array<string,dxTileViewItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxTileViewItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxTileViewOptions.direction
     * @type Enums.Orientation
     * @default 'horizontal'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * @docid dxTileViewOptions.focusStateEnabled
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxTileViewOptions.height
     * @type number|string|function
     * @default 500
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxTileViewOptions.hoverStateEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxTileViewOptions.itemMargin
     * @default 20
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemMargin?: number;
    /**
     * @docid dxTileViewOptions.items
     * @type Array<string, dxTileViewItem, object>
     * @fires dxTileViewOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTileViewItem | any>;
    /**
     * @docid dxTileViewOptions.showScrollbar
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showScrollbar?: boolean;
}
/**
 * @docid dxTileView
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
     * @docid dxtileviewmethods.scrollPosition
     * @publicName scrollPosition()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollPosition(): number;
}

export interface dxTileViewItem extends CollectionWidgetItem {
    /**
     * @docid dxTileViewItem.heightRatio
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    heightRatio?: number;
    /**
     * @docid dxTileViewItem.widthRatio
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