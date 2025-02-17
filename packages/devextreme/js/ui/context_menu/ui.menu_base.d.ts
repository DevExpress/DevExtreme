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
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxMenuBaseOptions<
  TComponent extends dxMenuBase<any, TItem, TKey>,
  TItem extends dxMenuBaseItem = dxMenuBaseItem,
  TKey = any,
> extends Omit<HierarchicalCollectionWidgetOptions<TComponent, TItem, TKey>, 'dataSource'> {
    /**
     * Specifies whether the UI component changes its visual state as a result of user interaction.
     */
    activeStateEnabled?: boolean;
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: {
      /**
       * An object that defines the animation properties used when the UI component is being hidden.
       */
      hide?: AnimationConfig;
      /**
       * An object that defines the animation properties used when the UI component is being shown.
       */
      show?: AnimationConfig;
    };
    /**
     * Specifies the name of the CSS class to be applied to the root menu level and all submenus.
     */
    cssClass?: string;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Holds an array of menu items.
     */
    items?: Array<TItem>;
    /**
     * Specifies whether an item is selected if a user clicks it.
     */
    selectByClick?: boolean;
    /**
     * Specifies the selection mode supported by the menu.
     */
    selectionMode?: SingleOrNone;
    /**
     * Specifies properties of submenu showing and hiding.
     */
    showSubmenuMode?: {
      /**
       * Specifies the delay of submenu show and hiding.
       */
      delay?: {
        /**
         * The time span after which the submenu is hidden.
         */
        hide?: number;
        /**
         * The time span after which the submenu is shown.
         */
        show?: number;
      } | number;
      /**
       * Specifies the mode name.
       */
      name?: SubmenuShowMode;
    } | SubmenuShowMode;
}
/**
 * The base class for UI components containing an item collection.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxMenuBase<
  TProperties extends dxMenuBaseOptions<any, TItem, TKey>,
  TItem extends dxMenuBaseItem = dxMenuBaseItem,
  TKey = any,
> extends HierarchicalCollectionWidget<TProperties, TItem, TKey> {
    /**
     * Selects an item found using its DOM node.
     */
    selectItem(itemElement: Element): void;
    /**
     * Cancels the selection of an item found using its DOM node.
     */
    unselectItem(itemElement: Element): void;
}
