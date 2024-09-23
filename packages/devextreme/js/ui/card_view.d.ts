import Widget, { WidgetOptions } from './widget/ui.widget';
import { DataSourceLike } from '../data/data_source';

/**
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface Properties extends WidgetOptions<dxCardView> {
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
    paging?: {
        /**
         * @docid
         * @public
         */
        pageSize?: number;
        /**
         * @docid
         * @public
         */
        pageIndex?: number;
    };
}

/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCardView extends Widget<Properties> {

}
