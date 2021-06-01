import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

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

import dxMultiView, {
    dxMultiViewItem,
    dxMultiViewOptions
} from './multi_view';

/** @public */
export type ContentReadyEvent = EventInfo<dxTabPanel>;

/** @public */
export type DisposingEvent = EventInfo<dxTabPanel>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTabPanel>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxTabPanel> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxTabPanel> & SelectionChangedInfo;

/** @public */
export type TitleClickEvent = NativeEventInfo<dxTabPanel> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
}

/** @public */
export type TitleHoldEvent = NativeEventInfo<dxTabPanel> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
}

/** @public */
export type TitleRenderedEvent = EventInfo<dxTabPanel> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
    /**
     * @docid
     * @default false
     * @default true [for](Android|iOS)
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxTabPanelItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default "title"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @fires dxTabPanelOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxTabPanelItem | any>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 event:event
     * @type_function_param1_field1 component:dxTabPanel
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onTitleClick?: ((e: TitleClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 event:event
     * @type_function_param1_field1 component:dxTabPanel
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onTitleHold?: ((e: TitleHoldEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field1 component:dxTabPanel
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onTitleRendered?: ((e: TitleRenderedEvent) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showNavButtons?: boolean;
    /**
     * @docid
     * @default false [for](non-touch_devices)
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits dxMultiView
 * @module ui/tab_panel
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTabPanel extends dxMultiView<dxTabPanelOptions> { }

/**
 * @docid
 * @inherits dxMultiViewItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTabPanelItem extends dxMultiViewItem {
    /**
     * @docid
     * @public
     */
    badge?: string;
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    tabTemplate?: template | (() => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    title?: string;
}

/** @public */
export type Properties = dxTabPanelOptions;

/** @deprecated use Properties instead */
export type Options = dxTabPanelOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTabPanelOptions;
