import { Skip } from '../../core';
import { DataSourceLike } from '../../data/data_source';
import {
    AnimationConfig,
} from '../../animation/fx';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions,
} from '../hierarchical_collection/ui.hierarchical_collection_widget';

import {
    dxMenuBaseItem,
} from '../menu';

/** @namespace DevExpress.ui */
export interface dxMenuBaseOptions<
  TComponent extends dxMenuBase<any, TItem, TKey>,
  TItem extends dxMenuBaseItem = dxMenuBaseItem,
  TKey = any,
> extends Skip<HierarchicalCollectionWidgetOptions<TComponent, TItem, TKey>, 'dataSource'> {
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
     * @type string | Array<dxMenuBaseItem> | Store | DataSource | DataSourceOptions
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<dxMenuBaseItem>
     */
    dataSource?: DataSourceLike<TItem, TKey>;
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
     * @type Enums.MenuSelectionMode
     * @default none
     * @public
     */
    selectionMode?: 'none' | 'single';
    /**
     * @docid
     * @type Object|Enums.ShowSubmenuMode
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
       * @type Enums.ShowSubmenuMode
       * @default "onHover"
       */
      name?: 'onClick' | 'onHover';
    } | 'onClick' | 'onHover';
}
/**
 * @docid
 * @inherits HierarchicalCollectionWidget
 * @hidden
 * @namespace DevExpress.ui
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
