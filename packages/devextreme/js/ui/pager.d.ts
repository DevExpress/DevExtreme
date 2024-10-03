import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    PagerBaseOptions,
} from '../common';

export {
    DisplayMode,
} from '../common';

/**
 * @public
 */
export type PageSize = number | 'all';

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @inherits PagerBaseOptions
 */
export interface dxPaginationOptions extends PagerBaseOptions, WidgetOptions<dxPagination> {
    /**
     * @docid
     * @fires Properties.onOptionChanged
     * @default 1
     */
    pageIndex?: number;

    /**
     * @docid
     * @fires Properties.onOptionChanged
     * @default 5
     */
    pageSize?: number;

    /**
     * @docid
     * @default 1
     */
    itemCount?: number;

    /**
     * @docid
     * @default [5, 10]
     * @type Array<number | string>
     */
    allowedPageSizes?: Array<PageSize>;
}

/**
 * @docid
 * @namespace DevExpress.ui
 * @public
 * @inherits Widget
 * @options dxPaginationOptions
 */
export default class dxPagination extends Widget<Properties> {
    /**
     * @docid
     * @publicName getPageCount()
     * @public
     */
     getPageCount(): number;
}

/**
 * @public
 */
export type Properties = dxPaginationOptions;
