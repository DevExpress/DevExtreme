import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ComponentDisposingEvent,
    ComponentInitializedEvent,
    ComponentOptionChangedEvent,
    ItemInfo
} from '../events';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxSlideOut>;
/**
 * @public
 */
export type DisposingEvent = ComponentDisposingEvent<dxSlideOut>;
/**
 * @public
 */
export type InitializedEvent = ComponentInitializedEvent<dxSlideOut>;
/**
 * @public
 */
export type ItemClickEvent = ComponentNativeEvent<dxSlideOut> & ItemInfo;
/**
 * @public
 */
export type ItemContextMenuEvent = ComponentNativeEvent<dxSlideOut> & ItemInfo;
/**
 * @public
 */
export type ItemHoldEvent = ComponentNativeEvent<dxSlideOut> & ItemInfo;
/**
 * @public
 */
export type ItemRenderedEvent = ComponentNativeEvent<dxSlideOut> & ItemInfo;
/**
 * @public
 */
export type MenuGroupRenderedEvent = ComponentEvent<dxSlideOut>;
/**
 * @public
 */
export type MenuItemRenderedEvent = ComponentEvent<dxSlideOut>;
/**
 * @public
 */
export type OptionChangedEvent = ComponentOptionChangedEvent<dxSlideOut>;
/**
 * @public
 */
export type SelectionChangedEvent = ComponentEvent<dxSlideOut> & SelectionChangedInfo;

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
    contentTemplate?: template | ((container: TElement) => string | TElement);
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
    menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | TElement);
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
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
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
     * @type_function_param1_field2 element:TElement
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
     * @type_function_param1_field2 element:TElement
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
    constructor(element: TElement, options?: dxSlideOutOptions)
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideMenu(): TPromise<void>;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMenu(): TPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggleMenuVisibility(showing: boolean): TPromise<void>;
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
    menuTemplate?: template | (() => string | TElement);
}

export type Options = dxSlideOutOptions;

/** @deprecated use Options instead */
export type IOptions = dxSlideOutOptions;
