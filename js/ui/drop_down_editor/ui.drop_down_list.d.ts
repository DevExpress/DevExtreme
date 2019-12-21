import {
    JQueryEventObject
} from '../../common';

import {
    dxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource from '../../data/data_source';

import {
    event
} from '../../events';

import {
    DataExpressionMixinOptions
} from '../editor/ui.data_expression';

import dxDropDownEditor, {
    dxDropDownEditorOptions
} from './ui.drop_down_editor';

export interface dxDropDownListOptions<T = dxDropDownList> extends DataExpressionMixinOptions<T>, dxDropDownEditorOptions<T> {
    /**
     * @docid dxDropDownListOptions.displayValue
     * @type string
     * @readonly
     * @default undefined
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayValue?: string;
    /**
     * @docid dxDropDownListOptions.groupTemplate
     * @type template|function
     * @default "group"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxDropDownListOptions.grouped
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grouped?: boolean;
    /**
     * @docid dxDropDownListOptions.minSearchLength
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid dxDropDownListOptions.noDataText
     * @type string
     * @default "No data to display"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid dxDropDownListOptions.onItemClick
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:object
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: { component?: T, element?: dxElement, model?: any, itemData?: any, itemElement?: any, itemIndex?: number | any, event?: event }) => any);
    /**
     * @docid dxDropDownListOptions.onSelectionChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 selectedItem:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: T, element?: dxElement, model?: any, selectedItem?: any }) => any);
    /**
     * @docid dxDropDownListOptions.onValueChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: T, element?: dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxDropDownListOptions.searchEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid dxDropDownListOptions.searchExpr
     * @type getter|Array<getter>
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid dxDropDownListOptions.searchMode
     * @type Enums.DropDownSearchMode
     * @default "contains"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchMode?: 'contains' | 'startswith';
    /**
     * @docid dxDropDownListOptions.searchTimeout
     * @type number
     * @default 500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid dxDropDownListOptions.selectedItem
     * @type any
     * @readonly
     * @default null
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItem?: any;
    /**
     * @docid dxDropDownListOptions.showDataBeforeSearch
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDataBeforeSearch?: boolean;
    /**
     * @docid dxDropDownListOptions.value
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
    /**
     * @docid dxDropDownListOptions.valueChangeEvent
     * @type string
     * @default "input change keyup"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
    /**
     * @docid dxDropDownListOptions.wrapItemText
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wrapItemText?: boolean;
}
/**
 * @docid dxDropDownList
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @module ui/drop_down_editor/ui.drop_down_list
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxDropDownList extends dxDropDownEditor {
    constructor(element: Element, options?: dxDropDownListOptions)
    constructor(element: JQuery, options?: dxDropDownListOptions)
    getDataSource(): DataSource;
}
