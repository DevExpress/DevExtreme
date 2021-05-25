import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import {
    CollectionWidgetItem
} from '../collection/ui.collection_widget.base';

/** @namespace DevExpress.ui */
export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<CollectionWidgetItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 item:object
     * @type_function_return string
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    items?: Array<CollectionWidgetItem | any>;
    /**
     * @docid
     * @default null
     * @public
     */
    value?: any;
    /**
     * @docid
     * @default "this"
     * @type_function_param1 item:object
     * @type_function_return string|number|boolean
     * @public
     */
    valueExpr?: string | ((item: any) => string | number | boolean);
}
/**
 * @docid
 * @module ui/editor/ui.data_expression
 * @inherits DataHelperMixin
 * @export default
 * @hidden
 * @namespace DevExpress.ui
 */
export default class DataExpressionMixin {
    constructor(options?: DataExpressionMixinOptions)
    getDataSource(): DataSource;
}
