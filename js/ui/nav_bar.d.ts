import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ComponentInitializedEvent,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import dxTabs, {
    dxTabsItem,
    dxTabsOptions
} from './tabs';

/** @public */
export type ContentReadyEvent = ComponentEvent<dxNavBar>;

/** @public */
export type DisposingEvent = ComponentEvent<dxNavBar>;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxNavBar>;

/** @public */
export type ItemClickEvent = ComponentNativeEvent<dxNavBar> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = ComponentNativeEvent<dxNavBar> & ItemInfo;

/** @public */
export type ItemHoldEvent = ComponentNativeEvent<dxNavBar> & ItemInfo;

/** @public */
export type ItemRenderedEvent = ComponentNativeEvent<dxNavBar> & ItemInfo;

/** @public */
export type OptionChangedEvent = ComponentEvent<dxNavBar> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = ComponentEvent<dxNavBar> & SelectionChangedInfo;

export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
}
/**
 * @docid
 * @inherits dxTabs
 * @module ui/nav_bar
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxNavBar extends dxTabs {
    constructor(element: TElement, options?: dxNavBarOptions)
}

/**
* @docid
* @inherits dxTabsItem
* @type object
*/
export interface dxNavBarItem extends dxTabsItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    badge?: string;
}

export type Options = dxNavBarOptions;

/** @deprecated use Options instead */
export type IOptions = dxNavBarOptions;
