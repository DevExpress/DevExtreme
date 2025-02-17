import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    DisplayMode,
} from '../common';

export {
    DisplayMode,
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type PagerBase = {
    /**
     * Specifies the pager&apos;s display mode.
     */
    displayMode?: DisplayMode;
    /**
     * Specifies the page information text.
     */
    infoText?: string;
    /**
     * Specifies whether to show the page information.
     */
    showInfo?: boolean;
    /**
     * Specifies whether to show navigation buttons.
     */
    showNavigationButtons?: boolean;
    /**
     * Specifies whether to show the page size selector.
     */
    showPageSizeSelector?: boolean;
    /**
     * Specifies an aria-label attribute for the pager.
     */
    label?: string;
  };

export type PageSize = number | 'all';

/**
 * 
 * @deprecated 
 */
export interface dxPaginationOptions extends PagerBase, WidgetOptions<dxPagination> {
    /**
     * Specifies the page index.
     */
    pageIndex?: number;

    /**
     * Specifies the page size.
     */
    pageSize?: number;

    /**
     * Specifies the total number of items.
     */
    itemCount?: number;

    /**
     * Specifies page sizes available in the page size selector.
     */
    allowedPageSizes?: Array<PageSize>;
}

/**
 * Pagination is a UI component that allows users to navigate through pages and change page size at runtime. Pagination UI includes a page navigator and several optional elements: a page size selector, navigation buttons, and page information.
 */
export default class dxPagination extends Widget<Properties> {
    /**
      * Gets the number of pages.
      */
     getPageCount(): number;
}

export type Properties = dxPaginationOptions;
