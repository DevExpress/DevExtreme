import { DataErrorOccurredInfo, Pager } from '../common/grids';
import { DataSourceLike } from '../data/data_source';
import Widget, { WidgetOptions } from './widget/ui.widget';
import { EventInfo } from '../events';
import { dxToolbarItem, ToolbarItemLocation } from './toolbar';

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

// #region Pager

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type PagerOptions = {
    /**
     * @docid
     * @public
     */
    pager?: Pager;
};

// #endregion

// #region Toolbar

export type PredefinedToolbarItem = 'columnChooserButton' | 'searchPanel' | 'addCardButton';

/**
 * @docid
 * @inherits dxToolbarItem
 * @public
 */
export type ToolbarItem = dxToolbarItem & {
    /**
     * @docid
     * @public
     */
    name?: PredefinedToolbarItem | string;
    /**
     * @docid
     * @default 'after'
     * @public
     */
    location?: ToolbarItemLocation;
  };

export type ToolbarOptions = {
    /**
     * @docid
     * @public
     */
    toolbar?: {
        /**
         * @docid
         * @public
         */
        items?: Array<PredefinedToolbarItem | ToolbarItem>;
        /**
         * @default undefined
         * @public
         */
        visible?: boolean | undefined;
        /**
         * @default false
         * @public
         */
        disabled?: boolean;
    };
};

// #endregion

// #region ColumnsController

// #endregion

/**
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @deprecated use Properties instead
 * @inherits DataControllerOptions,PagerOptions,ToolbarOptions
 */
export interface dxCardViewOptions extends WidgetOptions<dxCardView>,
DataControllerOptions,
PagerOptions,
ToolbarOptions {

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
