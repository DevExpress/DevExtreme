import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxPromise
} from '../core/utils/deferred';

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

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxSlideOut>;

/** @public */
export type DisposingEvent = EventInfo<dxSlideOut>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSlideOut>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

/** @public */
export type MenuGroupRenderedEvent = EventInfo<dxSlideOut>;

/** @public */
export type MenuItemRenderedEvent = EventInfo<dxSlideOut>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSlideOut> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxSlideOut> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
    /**
     * @docid
     * @default false
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default "content"
     * @type_function_param1 container:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    contentTemplate?: template | ((container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxSlideOutItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @fires dxSlideOutOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxSlideOutItem | any>;
    /**
     * @docid
     * @default "menuGroup"
     * @type_function_param1 groupData:object
     * @type_function_param2 groupIndex:number
     * @type_function_param3 groupElement:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @public
     */
    menuGrouped?: boolean;
    /**
     * @docid
     * @default "menuItem"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid
     * @default false
     * @public
     */
    menuVisible?: boolean;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSlideOut
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @default null
     * @action
     * @public
     */
    onMenuGroupRendered?: ((e: MenuGroupRenderedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSlideOut
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @default null
     * @action
     * @public
     */
    onMenuItemRendered?: ((e: MenuItemRenderedEvent) => void);
    /**
     * @docid
     * @default 0
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/slide_out
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSlideOut extends CollectionWidget<dxSlideOutOptions> {
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @public
     */
    hideMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @public
     */
    showMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:Boolean|undefined
     * @return Promise<void>
     * @public
     */
    toggleMenuVisibility(showing?: boolean): DxPromise<void>;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxSlideOutItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuTemplate?: template | (() => string | UserDefinedElement);
}

/** @public */
export type Properties = dxSlideOutOptions;

/** @deprecated use Properties instead */
export type Options = dxSlideOutOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSlideOutOptions;
