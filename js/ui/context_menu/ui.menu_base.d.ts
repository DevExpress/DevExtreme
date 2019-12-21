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
     * @docid dxMenuBaseOptions.activeStateEnabled
     * @type Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxMenuBaseOptions.animation
     * @type object
     * @default { show: { type: "fade", from: 0, to: 1, duration: 100 }, hide: { type: "fade", from: 1, to: 0, duration: 100 } }
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: { hide?: animationConfig, show?: animationConfig };
    /**
     * @docid dxMenuBaseOptions.cssClass
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxMenuBaseOptions.dataSource
     * @type string|Array<dxMenuBaseItem>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxMenuBaseItem> | DataSource | DataSourceOptions;
    /**
     * @docid dxMenuBaseOptions.items
     * @type Array<dxMenuBaseItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * @docid dxMenuBaseOptions.selectByClick
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectByClick?: boolean;
    /**
     * @docid dxMenuBaseOptions.selectionMode
     * @type Enums.MenuSelectionMode
     * @default none
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'none' | 'single';
    /**
     * @docid dxMenuBaseOptions.showSubmenuMode
     * @type Object|Enums.ShowSubmenuMode
     * @default { name: "onHover", delay: { show: 0, hide: 0 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
}
/**
 * @docid dxMenuBase
 * @type object
 * @inherits HierarchicalCollectionWidget
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxMenuBase extends HierarchicalCollectionWidget {
    constructor(element: Element, options?: dxMenuBaseOptions)
    constructor(element: JQuery, options?: dxMenuBaseOptions)
    /**
     * @docid dxMenuBaseMethods.selectItem
     * @publicName selectItem(itemElement)
     * @param1 itemElement:Node
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(itemElement: Element): void;
    /**
     * @docid dxMenuBaseMethods.unselectItem
     * @publicName unselectItem(itemElement)
     * @param1 itemElement:Node
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(itemElement: Element): void;
}
