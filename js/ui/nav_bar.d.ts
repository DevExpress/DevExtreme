import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import dxTabs, {
    Item as dxTabsItem,
    dxTabsOptions,
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
 * @deprecated {ui/nav_bar.Properties}
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
 * @namespace DevExpress.ui
 * @deprecated dxTabs
 * @public
 */
export default class dxNavBar extends dxTabs<dxNavBarOptions> { }

/**
 * @public
 * @namespace DevExpress.ui.dxNavBar
 */
export type Item = dxNavBarItem;

/**
 * @deprecated {ui/nav_bar.Item}
 * @namespace DevExpress.ui
 */
export interface dxNavBarItem extends dxTabsItem {
    /**
     * @docid
     * @public
     */
    badge?: string;
}

/** @public */
export type Properties = dxNavBarOptions;

/** @deprecated {ui/nav_bar.Properties} */
export type Options = dxNavBarOptions;
