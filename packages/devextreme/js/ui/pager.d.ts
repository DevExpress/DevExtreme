import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    BasePagerOptions,
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
 * @inherits BasePagerOptions
 */
export interface dxPagerOptions extends BasePagerOptions, WidgetOptions<dxPager> {
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
 * @options dxPagerOptions
 */
export default class dxPager extends Widget<Properties> {
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
export type Properties = dxPagerOptions;
