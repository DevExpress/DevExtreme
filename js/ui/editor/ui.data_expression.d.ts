import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../core/templates/template';

import DataSource, {
    Options as DataSourceOptions,
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
    dataSource?: string | Array<CollectionWidgetItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 item:object
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
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
     * @public
     */
    valueExpr?: string | ((item: any) => string | number | boolean);
}
/**
 * @docid
 * @inherits DataHelperMixin
 * @hidden
 * @namespace DevExpress.ui
 */
export default class DataExpressionMixin {
    constructor(options?: DataExpressionMixinOptions)
    getDataSource(): DataSource;
}
