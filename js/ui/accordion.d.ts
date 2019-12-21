import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
    /**
     * @docid dxAccordionOptions.animationDuration
     * @type number
     * @default 300
     * @default 200 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationDuration?: number;
    /**
     * @docid dxAccordionOptions.collapsible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapsible?: boolean;
    /**
     * @docid dxAccordionOptions.dataSource
     * @type string|Array<string,dxAccordionItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxAccordionItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxAccordionOptions.deferRendering
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid dxAccordionOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxAccordionOptions.height
     * @type number|string|function
     * @default undefined
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxAccordionOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxAccordionOptions.itemTemplate
     * @type template|function
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxAccordionOptions.itemTitleTemplate
     * @type template|function
     * @default "title"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxAccordionOptions.items
     * @type Array<string, dxAccordionItem, object>
     * @fires dxAccordionOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxAccordionItem | any>;
    /**
     * @docid dxAccordionOptions.multiple
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    multiple?: boolean;
    /**
     * @docid dxAccordionOptions.onItemTitleClick
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemTitleClick?: ((e: { component?: dxAccordion, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event }) => any) | string;
    /**
     * @docid dxAccordionOptions.repaintChangesOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid dxAccordionOptions.selectedIndex
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
}
/**
 * @docid dxAccordion
 * @inherits CollectionWidget
 * @module ui/accordion
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxAccordion extends CollectionWidget {
    constructor(element: Element, options?: dxAccordionOptions)
    constructor(element: JQuery, options?: dxAccordionOptions)
    /**
     * @docid dxAccordionMethods.collapseItem
     * @publicName collapseItem(index)
     * @param1 index:numeric
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseItem(index: number): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxAccordionMethods.expandItem
     * @publicName expandItem(index)
     * @param1 index:numeric
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandItem(index: number): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxAccordionMethods.updateDimensions
     * @publicName updateDimensions()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): Promise<void> & JQueryPromise<void>;
}

export interface dxAccordionItem extends CollectionWidgetItem {
    /**
     * @docid dxAccordionItem.icon
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxAccordionItem.title
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
}

declare global {
interface JQuery {
    dxAccordion(): JQuery;
    dxAccordion(options: "instance"): dxAccordion;
    dxAccordion(options: string): any;
    dxAccordion(options: string, ...params: any[]): any;
    dxAccordion(options: dxAccordionOptions): JQuery;
}
}
export type Options = dxAccordionOptions;

/** @deprecated use Options instead */
export type IOptions = dxAccordionOptions;