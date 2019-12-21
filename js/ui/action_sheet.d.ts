import {
    JQueryEventObject,
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

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

export interface dxActionSheetOptions extends CollectionWidgetOptions<dxActionSheet> {
    /**
     * @docid dxActionSheetOptions.cancelText
     * @type string
     * @default "Cancel"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelText?: string;
    /**
     * @docid dxActionSheetOptions.dataSource
     * @type string|Array<string,dxActionSheetItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxActionSheetItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxActionSheetOptions.items
     * @type Array<string, dxActionSheetItem, object>
     * @fires dxActionSheetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxActionSheetItem | any>;
    /**
     * @docid dxActionSheetOptions.onCancelClick
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCancelClick?: ((e: { component?: dxActionSheet, element?: dxElement, model?: any, cancel?: boolean }) => any) | string;
    /**
     * @docid dxActionSheetOptions.showCancelButton
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCancelButton?: boolean;
    /**
     * @docid dxActionSheetOptions.showTitle
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid dxActionSheetOptions.target
     * @type string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    target?: string | Element | JQuery;
    /**
     * @docid dxActionSheetOptions.title
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
    /**
     * @docid dxActionSheetOptions.usePopover
     * @type boolean
     * @default false
     * @default true [for](iPad)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    usePopover?: boolean;
    /**
     * @docid dxActionSheetOptions.visible
     * @type boolean
     * @default false
     * @fires dxActionSheetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
/**
 * @docid dxActionSheet
 * @inherits CollectionWidget
 * @module ui/action_sheet
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxActionSheet extends CollectionWidget {
    constructor(element: Element, options?: dxActionSheetOptions)
    constructor(element: JQuery, options?: dxActionSheetOptions)
    /**
     * @docid dxActionSheetMethods.hide
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxActionSheetMethods.show
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxActionSheetMethods.toggle
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
}

export interface dxActionSheetItem extends CollectionWidgetItem {
    /**
     * @docid dxActionSheetItem.icon
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxActionSheetItem.onClick
     * @type function(e)|string
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxActionSheet
     * @type_function_param1_field2 element:dxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { component?: dxActionSheet, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
    /**
     * @docid dxActionSheetItem.type
     * @type Enums.ButtonType
     * @default 'normal'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
}

declare global {
interface JQuery {
    dxActionSheet(): JQuery;
    dxActionSheet(options: "instance"): dxActionSheet;
    dxActionSheet(options: string): any;
    dxActionSheet(options: string, ...params: any[]): any;
    dxActionSheet(options: dxActionSheetOptions): JQuery;
}
}
export type Options = dxActionSheetOptions;

/** @deprecated use Options instead */
export type IOptions = dxActionSheetOptions;