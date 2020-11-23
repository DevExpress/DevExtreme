import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
    /**
     * @docid dxResponsiveBoxOptions.cols
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cols?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
    /**
     * @docid dxResponsiveBoxOptions.dataSource
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxResponsiveBoxItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxResponsiveBoxOptions.height
     * @default '100%'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxResponsiveBoxOptions.items
     * @fires dxResponsiveBoxOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxResponsiveBoxItem | any>;
    /**
     * @docid dxResponsiveBoxOptions.rows
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rows?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
    /**
     * @docid dxResponsiveBoxOptions.screenByWidth
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    screenByWidth?: Function;
    /**
     * @docid dxResponsiveBoxOptions.singleColumnScreen
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    singleColumnScreen?: string;
    /**
     * @docid dxResponsiveBoxOptions.width
     * @default '100%'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid dxResponsiveBox
 * @inherits CollectionWidget
 * @module ui/responsive_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxResponsiveBox extends CollectionWidget {
    constructor(element: Element, options?: dxResponsiveBoxOptions)
    constructor(element: JQuery, options?: dxResponsiveBoxOptions)
}

export interface dxResponsiveBoxItem extends CollectionWidgetItem {
    /**
     * @docid dxResponsiveBoxItem.location
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: { col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
}

declare global {
interface JQuery {
    dxResponsiveBox(): JQuery;
    dxResponsiveBox(options: "instance"): dxResponsiveBox;
    dxResponsiveBox(options: string): any;
    dxResponsiveBox(options: string, ...params: any[]): any;
    dxResponsiveBox(options: dxResponsiveBoxOptions): JQuery;
}
}
export type Options = dxResponsiveBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxResponsiveBoxOptions;
