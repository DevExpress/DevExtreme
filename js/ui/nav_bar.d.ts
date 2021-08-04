import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import dxTabs, {
    Item as TabsItem,
    dxTabsOptions
} from './tabs';

/** @public */
export type ContentReadyEvent = EventInfo<dxNavBar>;

/** @public */
export type DisposingEvent = EventInfo<dxNavBar>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxNavBar>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxNavBar> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxNavBar> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxNavBar> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxNavBar> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxNavBar> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxNavBar> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
    /**
     * @docid
     * @public
     */
    scrollByContent?: boolean;
}
/**
 * @docid
 * @inherits dxTabs
 * @module ui/nav_bar
 * @export default
 * @namespace DevExpress.ui
 * @deprecated dxTabs
 * @public
 */
export default class dxNavBar extends dxTabs {
    constructor(element: UserDefinedElement, options?: dxNavBarOptions)
}

/**
 * @public
 * @namespace DevExpress.ui.dxNavBar
 */
export type Item = dxNavBarItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxNavBarItem extends TabsItem {
    /**
     * @docid
     * @public
     */
    badge?: string;
}

/** @public */
export type Properties = dxNavBarOptions;

/** @deprecated use Properties instead */
export type Options = dxNavBarOptions;

/** @deprecated use Properties instead */
export type IOptions = dxNavBarOptions;
