import {
    TElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
    /**
     * @docid
     * @type Enums.BoxAlign
     * @default 'start'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
    /**
     * @docid
     * @type Enums.BoxCrossAlign
     * @default 'start'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    crossAlign?: 'center' | 'end' | 'start' | 'stretch';
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxBoxItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Enums.BoxDirection
     * @default 'row'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'col' | 'row';
    /**
     * @docid
     * @fires dxBoxOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxBoxItem | any>;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxBox extends CollectionWidget {
    constructor(element: TElement, options?: dxBoxOptions)
}

/**
* @docid
* @inherits CollectionWidgetItem
* @type object
*/
export interface dxBoxItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type number | Enums.Mode
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseSize?: number | 'auto';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    box?: dxBoxOptions;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ratio?: number;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shrink?: number;
}

export type Options = dxBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxBoxOptions;
