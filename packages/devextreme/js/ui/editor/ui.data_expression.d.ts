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
                                                               * 
                                                               * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
                                                               */
                                                              export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<CollectionWidgetItem | any> | null;
    /**
     * Specifies the data field whose values should be displayed.
     */
    displayExpr?: string | ((item: any) => string) | undefined;
    /**
     * Specifies a custom template for items.
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<CollectionWidgetItem | any>;
    /**
     * Specifies the currently selected value. May be an object if dataSource contains objects, the store key is specified, and valueExpr is not set.
     */
    value?: any;
    /**
     * Specifies which data field provides unique values to the UI component&apos;s value.
     */
    valueExpr?: string | ((item: any) => string | number | boolean);
}
/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class DataExpressionMixin {
    constructor(options?: DataExpressionMixinOptions);
    getDataSource(): DataSource;
}
