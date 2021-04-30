import {
    animationConfig
} from '../../animation/fx';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions
} from '../hierarchical_collection/ui.hierarchical_collection_widget';

import {
    dxMenuBaseItem
} from '../menu';

export interface dxMenuBaseOptions<TComponent> extends HierarchicalCollectionWidgetOptions<TComponent> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default { show: { type: "fade", from: 0, to: 1, duration: 100 }, hide: { type: "fade", from: 1, to: 0, duration: 100 } }
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default { type: "fade", from: 1, to: 0, duration: 100 }
       */
      hide?: animationConfig,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default { type: "fade", from: 0, to: 1, duration: 100 }
       */
      show?: animationConfig
    };
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxMenuBaseItem> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectByClick?: boolean;
    /**
     * @docid
     * @type Enums.MenuSelectionMode
     * @default none
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'none' | 'single';
    /**
     * @docid
     * @type Object|Enums.ShowSubmenuMode
     * @default { name: "onHover", delay: { show: 50, hide: 300 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSubmenuMode?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default { show: 50, hide: 300 }
       */
      delay?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default 300
         */
        hide?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default 50
         */
        show?: number
      } | number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.ShowSubmenuMode
       * @default "onHover"
       */
      name?: 'onClick' | 'onHover'
    } | 'onClick' | 'onHover';
}
/**
 * @docid
 * @inherits HierarchicalCollectionWidget
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxMenuBase<TProperties> extends HierarchicalCollectionWidget<TProperties> {
    /**
     * @docid
     * @publicName selectItem(itemElement)
     * @param1 itemElement:Element
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName unselectItem(itemElement)
     * @param1 itemElement:Element
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(itemElement: Element): void;
}
