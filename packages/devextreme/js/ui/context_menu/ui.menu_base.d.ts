import { DataSourceLike } from '../../data/data_source';
import {
    AnimationConfig,
} from '../../common/core/animation';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions,
} from '../hierarchical_collection/ui.hierarchical_collection_widget';

import {
    dxMenuBaseItem,
} from '../menu';

import {
    SingleOrNone,
    SubmenuShowMode,
} from '../../common';

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
export interface dxMenuBaseOptions<
  TComponent extends dxMenuBase<any, TItem, TKey>,
  TItem extends dxMenuBaseItem = dxMenuBaseItem,
  TKey = any,
> extends Omit<HierarchicalCollectionWidgetOptions<TComponent, TItem, TKey>, 'dataSource'> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default { show: { type: "fade", from: 0, to: 1, duration: 100 }, hide: { type: "fade", from: 1, to: 0, duration: 100 } }
     * @ref
     * @public
     */
    animation?: {
      /**
       * @docid
       * @default { type: "fade", from: 1, to: 0, duration: 100 }
       */
      hide?: AnimationConfig;
      /**
       * @docid
       * @default { type: "fade", from: 0, to: 1, duration: 100 }
       */
      show?: AnimationConfig;
    };
    /**
     * @docid
     * @default ""
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default null
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<dxMenuBaseItem>|null
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid
     * @public
     * @type Array<dxMenuBaseItem>
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default false
     * @public
     */
    selectByClick?: boolean;
    /**
     * @docid
     * @default none
     * @public
     */
    selectionMode?: SingleOrNone;
    /**
     * @docid
     * @default { name: "onHover", delay: { show: 50, hide: 300 } }
     * @public
     */
    showSubmenuMode?: {
      /**
       * @docid
       * @default { show: 50, hide: 300 }
       */
      delay?: {
        /**
         * @docid
         * @default 300
         */
        hide?: number;
        /**
         * @docid
         * @default 50
         */
        show?: number;
      } | number;
      /**
       * @docid
       * @default "onHover"
       */
      name?: SubmenuShowMode;
    } | SubmenuShowMode;
}
/**
 * @docid
 * @inherits HierarchicalCollectionWidget
 * @hidden
 * @namespace DevExpress.ui
 * @options dxMenuBaseOptions
 */
export default class dxMenuBase<
  TProperties extends dxMenuBaseOptions<any, TItem, TKey>,
  TItem extends dxMenuBaseItem = dxMenuBaseItem,
  TKey = any,
> extends HierarchicalCollectionWidget<TProperties, TItem, TKey> {
    /**
     * @docid
     * @publicName selectItem(itemElement)
     * @public
     */
    selectItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName unselectItem(itemElement)
     * @public
     */
    unselectItem(itemElement: Element): void;
}
