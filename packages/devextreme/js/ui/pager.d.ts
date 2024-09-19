import Widget, { WidgetOptions } from './widget/ui.widget';

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
   * @default 10
   */
  pageSize?: number;

  /**
   * @docid
   * @default 0
   */
  itemCount?: number;
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
