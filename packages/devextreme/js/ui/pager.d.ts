import {
    Mode,
  } from '../common';
import Widget, { WidgetOptions } from './widget/ui.widget';

/**
 * @public
 * @namespace DevExpress.ui.dxPager
 */
export type PagerDisplayMode = 'adaptive' | 'compact' | 'full';

/**
 * @public
 * @namespace DevExpress.ui.dxPager
 */
export type PagerPageSize = 'all' | 'auto';

/**
 * @docid
 * @public
 * @namespace DevExpress.ui
 */
export type BasePagerOptions = {
    /**
     * @docid
     * @default "auto"
     */
    allowedPageSizes?: Array<(number | PagerPageSize)> | Mode;
    /**
     * @docid
     * @default "adaptive"
     */
    displayMode?: PagerDisplayMode;
    /**
     * @docid
     * @default "Page {0} of {1} ({2} items)"
     */
    infoText?: string;
    /**
     * @docid
     * @default false
     */
    showInfo?: boolean;
    /**
     * @docid
     * @default false
     */
    showNavigationButtons?: boolean;
    /**
     * @docid
     * @default false
     */
    showPageSizeSelector?: boolean;
    /**
     * @docid
     * @default "Page Navigation"
     */
    label?: string;
  };

/**
 * @docid
 * @namespace DevExpress.ui
 * @public
 */
export default class dxPager extends Widget<Properties> {
    /**
     * @docid
     * @publicName getPageCount()
     * @public
     */
     getPageCount(): number;
}

export interface Properties extends BasePagerOptions, WidgetOptions<dxPager> {
     /**
     * @docid
     * @fires Properties.onOptionChanged
     * @default 1
     */
    pageIndex?: number;

    /**
     * @docid
     * @fires Properties.onOptionChanged
     * @default 10
     */
    pageSize?: number;

    /**
     * @docid
     * @default 0
     */
    itemCount?: number;
}
