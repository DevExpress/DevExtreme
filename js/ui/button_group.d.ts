import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events';

import {
    CollectionWidgetItem
} from './collection/ui.collection_widget.base';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
    /**
     * @docid dxButtonGroupOptions.buttonTemplate
     * @type template|function
     * @default "content"
     * @type_function_param1 buttonData:object
     * @type_function_param2 buttonContent:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttonTemplate?: template | ((buttonData: any, buttonContent: dxElement) => string | Element | JQuery);
    /**
     * @docid dxButtonGroupOptions.focusStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxButtonGroupOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxButtonGroupOptions.itemTemplate
     * @type template|function
     * @deprecated dxButtonGroupOptions.buttonTemplate
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTemplate?: template | Function;
    /**
     * @docid dxButtonGroupOptions.items
     * @type Array<dxButtonGroupItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxButtonGroupItem>;
    /**
     * @docid dxButtonGroupOptions.keyExpr
     * @type string|function
     * @default 'text'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid dxButtonGroupOptions.onItemClick
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: { component?: dxButtonGroup, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event }) => any);
    /**
     * @docid dxButtonGroupOptions.onSelectionChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:array<any>
     * @type_function_param1_field5 removedItems:array<any>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxButtonGroup, element?: dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
    /**
     * @docid dxButtonGroupOptions.selectedItemKeys
     * @type Array<any>
     * @fires dxButtonGroupOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItemKeys?: Array<any>;
    /**
     * @docid dxButtonGroupOptions.selectedItems
     * @type Array<any>
     * @fires dxButtonGroupOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItems?: Array<any>;
    /**
     * @docid dxButtonGroupOptions.selectionMode
     * @type Enums.ButtonGroupSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid dxButtonGroupOptions.stylingMode
     * @type Enums.ButtonStylingMode
     * @default 'contained'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
}
/**
 * @docid dxButtonGroup
 * @inherits Widget
 * @module ui/button_group
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxButtonGroup extends Widget {
    constructor(element: Element, options?: dxButtonGroupOptions)
    constructor(element: JQuery, options?: dxButtonGroupOptions)
}

export interface dxButtonGroupItem extends CollectionWidgetItem {
    /**
     * @docid dxButtonGroupItem.hint
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hint?: string;
    /**
     * @docid dxButtonGroupItem.icon
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxButtonGroupItem.type
     * @type Enums.ButtonType
     * @default 'normal'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
}

declare global {
interface JQuery {
    dxButtonGroup(): JQuery;
    dxButtonGroup(options: "instance"): dxButtonGroup;
    dxButtonGroup(options: string): any;
    dxButtonGroup(options: string, ...params: any[]): any;
    dxButtonGroup(options: dxButtonGroupOptions): JQuery;
}
}
export type Options = dxButtonGroupOptions;

/** @deprecated use Options instead */
export type IOptions = dxButtonGroupOptions;