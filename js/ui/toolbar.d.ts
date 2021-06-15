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

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

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
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxToolbarItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @fires dxToolbarOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxToolbarItem | any>;
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
export default class dxToolbar extends CollectionWidget<dxToolbarOptions> {
    /**
     * @docid
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:boolean
     * @public
     */
    toggleMenuVisibility(showing: boolean): void;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
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
     * @type Enums.ToolbarItemLocateInMenuMode
     * @default 'never'
     * @public
     */
    locateInMenu?: 'always' | 'auto' | 'never';
    /**
     * @docid
     * @type Enums.ToolbarItemLocation
     * @default 'center'
     * @public
     */
    location?: 'after' | 'before' | 'center';
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
     * @type Enums.ToolbarItemShowTextMode
     * @default 'always'
     * @public
     */
    showText?: 'always' | 'inMenu';
    /**
     * @docid
     * @type Enums.ToolbarItemWidget
     * @public
     */
    widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
}

/** @public */
export type Properties = dxToolbarOptions;

/** @deprecated use Properties instead */
export type Options = dxToolbarOptions;

/** @deprecated use Properties instead */
export type IOptions = dxToolbarOptions;
