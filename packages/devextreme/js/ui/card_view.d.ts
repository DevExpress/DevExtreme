import { DataErrorOccurredInfo } from '../common/grids';
import { DataSourceLike } from '../data/data_source';
import Widget, { WidgetOptions } from './widget/ui.widget';
import { EventInfo } from '../events';

// #region DataController

/**
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
interface Paging {
    /**
     * @docid
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @default 0
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    pageIndex?: number;
    /**
     * @docid
     * @default 6
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    pageSize?: number;
}

/**
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
interface RemoteOperations {
    /**
     * @docid
     * @default false
     */
    filtering?: boolean;
    /**
     * @docid
     * @default false
     */
    paging?: boolean;
    /**
     * @docid
     * @default false
     */
    sorting?: boolean;
    /**
     * @docid
     * @default false
     */
    summary?: boolean;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type DataControllerOptions = {
    /**
     * @docid
     * @default undefined
     * @type string | Array<any> | Store | DataSource | DataSourceOptions
     * @public
     */
    dataSource?: DataSourceLike<any, any>;
    /**
     * @docid
     * @public
     */
    paging?: Paging;
    /**
     * @docid
     * @default undefined
     * @public
     */
    keyExpr?: string | string[];
    /**
     * @docid
     * @default undefined
     * @action
     * @public
     */
    onDataErrorOccurred?: (args: DataErrorOccurredInfo & EventInfo<dxCardView>) => void;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    remoteOperations?: RemoteOperations | boolean | 'auto';
};

// #endregion

// #region ColumnsController

// #endregion

/**
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @deprecated use Properties instead
 * @inherits DataControllerOptions
 */
export interface dxCardViewOptions extends WidgetOptions<dxCardView>,
DataControllerOptions {

}

/** @public */
export type Properties = dxCardViewOptions;

/**
* @docid
* @inherits Widget
* @namespace DevExpress.ui
* @public
*/
export default class dxCardView extends Widget<Properties> {

}
