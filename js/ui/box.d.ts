import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
    /**
     * @docid dxBoxOptions.align
     * @type Enums.BoxAlign
     * @default 'start'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
    /**
     * @docid dxBoxOptions.crossAlign
     * @type Enums.BoxCrossAlign
     * @default 'start'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    crossAlign?: 'center' | 'end' | 'start' | 'stretch';
    /**
     * @docid dxBoxOptions.dataSource
     * @type string|Array<string,dxBoxItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxBoxItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxBoxOptions.direction
     * @type Enums.BoxDirection
     * @default 'row'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'col' | 'row';
    /**
     * @docid dxBoxOptions.items
     * @type Array<string, dxBoxItem, object>
     * @fires dxBoxOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxBoxItem | any>;
}
/**
 * @docid dxBox
 * @inherits CollectionWidget
 * @module ui/box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxBox extends CollectionWidget {
    constructor(element: Element, options?: dxBoxOptions)
    constructor(element: JQuery, options?: dxBoxOptions)
}

export interface dxBoxItem extends CollectionWidgetItem {
    /**
     * @docid dxBoxItem.baseSize
     * @type number | Enums.Mode
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseSize?: number | 'auto';
    /**
     * @docid dxBoxItem.box
     * @type dxBoxOptions
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    box?: dxBoxOptions;
    /**
     * @docid dxBoxItem.ratio
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ratio?: number;
    /**
     * @docid dxBoxItem.shrink
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shrink?: number;
}

declare global {
interface JQuery {
    dxBox(): JQuery;
    dxBox(options: "instance"): dxBox;
    dxBox(options: string): any;
    dxBox(options: string, ...params: any[]): any;
    dxBox(options: dxBoxOptions): JQuery;
}
}
export type Options = dxBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxBoxOptions;