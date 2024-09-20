import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    BasePagerOptions,
    PagerAllPagesMode,
} from '../common';

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
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
     */
    allowedPageSizes?: Array<(number | PagerAllPagesMode)>;
}

/**
 * @docid
 * @namespace DevExpress.ui
 * @public
 * @inherits Widget
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
