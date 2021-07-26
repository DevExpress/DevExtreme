import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions,
} from '../../data/data_source';

import Store from '../../data/abstract_store';

import {
    CollectionWidgetItem,
} from '../collection/ui.collection_widget.base';

/** @namespace DevExpress.ui */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
    /**
     * @docid
     * @default null
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSource?: string | Array<CollectionWidgetItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 item:object
     * @type_function_return string
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items?: Array<CollectionWidgetItem | any>;
    /**
     * @docid
     * @default null
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
    /**
     * @docid
     * @default "this"
     * @type_function_param1 item:object
     * @type_function_return string|number|boolean
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
