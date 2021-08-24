import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

import {
    ToolbarItemWidget,
    ToolbarItemLocation,
    ToolbarItemLocateInMenuMode,
    ToolbarItemShowTextMode,
} from '../docEnums';

/** @public */
export type ContentReadyEvent = EventInfo<dxToolbar>;

/** @public */
export type DisposingEvent = EventInfo<dxToolbar>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxToolbar>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxToolbar> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxToolbar> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxToolbar> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxToolbar> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxToolbar> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
    /**
     * @docid
     * @type string | Array<string | dxToolbarItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Array<string | dxToolbarItem | any>
     * @fires dxToolbarOptions.onOptionChanged
     * @public
     */
    items?: Array<string | Item | any>;
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
     * @deprecated
     * @default undefined
     * @type_function_return number|string
     * @public
     */
    height?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/toolbar
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxToolbar extends CollectionWidget<dxToolbarOptions> { }

/**
 * @public
 * @namespace DevExpress.ui.dxToolbar
 * */
export type Item = dxToolbarItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxToolbarItem extends CollectionWidgetItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default 'never'
     * @public
     */
    locateInMenu?: ToolbarItemLocateInMenuMode;
    /**
     * @docid
     * @default 'center'
     * @public
     */
    location?: ToolbarItemLocation;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    options?: any;
    /**
     * @docid
     * @default 'always'
     * @public
     */
    showText?: ToolbarItemShowTextMode;
    /**
     * @docid
     * @public
     */
    widget?: ToolbarItemWidget;
}

/** @public */
export type Properties = dxToolbarOptions;

/** @deprecated use Properties instead */
export type Options = dxToolbarOptions;

/** @deprecated use Properties instead */
export type IOptions = dxToolbarOptions;
