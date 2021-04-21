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

export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default "content"
     * @type_function_param1 container:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxSlideOutItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @fires dxSlideOutOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuGrouped?: boolean;
    /**
     * @docid
     * @default "menuItem"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMenuItemRendered?: ((e: MenuItemRenderedEvent) => void);
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/slide_out
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSlideOut extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxSlideOutOptions)
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMenu(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggleMenuVisibility(showing: boolean): DxPromise<void>;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxSlideOutItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuTemplate?: template | (() => string | UserDefinedElement);
}

/** @public */
export type Options = dxSlideOutOptions;

/** @deprecated use Options instead */
export type IOptions = dxSlideOutOptions;
