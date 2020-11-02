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

export interface dxMenuBaseOptions<T = dxMenuBase> extends HierarchicalCollectionWidgetOptions<T> {
    /**
     * @docid
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @type object
     * @default { show: { type: "fade", from: 0, to: 1, duration: 100 }, hide: { type: "fade", from: 1, to: 0, duration: 100 } }
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: {
      /**
      * @docid
      * @type animationConfig
      * @default { type: "fade", from: 1, to: 0, duration: 100 }
      */
      hide?: animationConfig,
      /**
      * @docid
      * @type animationConfig
      * @default { type: "fade", from: 0, to: 1, duration: 100 }
      */
      show?: animationConfig
    };
    /**
     * @docid
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type string|Array<dxMenuBaseItem>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxMenuBaseItem> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Array<dxMenuBaseItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * @docid
     * @type boolean
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
     * @default { name: "onHover", delay: { show: 0, hide: 0 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSubmenuMode?: {
      /**
      * @docid
      * @type Object|number
      * @default { show: 50, hide: 300 }
      */
      delay?: {
        /**
        * @docid
        * @type number
        * @default 300
        */
        hide?: number,
        /**
        * @docid
        * @type number
        * @default 50
        */
        show?: number
      } | number,
      /**
      * @docid
      * @type Enums.ShowSubmenuMode
      * @default "onHover"
      */
      name?: 'onClick' | 'onHover'
    } | 'onClick' | 'onHover';
}
/**
 * @docid
 * @type object
 * @inherits HierarchicalCollectionWidget
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxMenuBase extends HierarchicalCollectionWidget {
    constructor(element: Element, options?: dxMenuBaseOptions)
    constructor(element: JQuery, options?: dxMenuBaseOptions)
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
