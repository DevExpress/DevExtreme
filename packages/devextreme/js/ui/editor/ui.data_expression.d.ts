import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../common';

import DataSource, { DataSourceLike } from '../../data/data_source';

import {
    CollectionWidgetItem,
} from '../collection/ui.collection_widget.base';

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
    /**
     * @docid
     * @default null
     * @type Store|DataSource|DataSourceOptions|string|Array<CollectionWidgetItem | any>|null
     * @public
     */
    dataSource?: DataSourceLike<CollectionWidgetItem | any> | null;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 item:object
     * @public
     */
    displayExpr?: string | ((item: any) => string) | undefined;
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
 * @options DataExpressionMixinOptions
 */
export default class DataExpressionMixin {
    constructor(options?: DataExpressionMixinOptions);
    getDataSource(): DataSource;
}
