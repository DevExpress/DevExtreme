import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource from '../../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    ItemInfo
} from '../../events/index';

import {
    ValueChangedInfo
} from '../editor/editor';

import {
    DataExpressionMixinOptions
} from '../editor/ui.data_expression';

import dxDropDownEditor, {
    dxDropDownEditorOptions
} from './ui.drop_down_editor';

export interface SelectionChangedInfo<T = any> {
    readonly selectedItem: T;
}

/** @namespace DevExpress.ui */
export interface dxDropDownListOptions<T = dxDropDownList> extends DataExpressionMixinOptions<T>, dxDropDownEditorOptions<T> {
    /**
     * @docid
     * @readonly
     * @default undefined
     * @ref
     * @public
     */
    displayValue?: string;
    /**
     * @docid
     * @default "group"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @public
     */
    grouped?: boolean;
    /**
     * @docid
     * @default 0
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid
     * @default "No data to display"
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:object
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemClick?: ((e: NativeEventInfo<T> & ItemInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 selectedItem:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSelectionChanged?: ((e: EventInfo<T> & SelectionChangedInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @type_function_param1_field6 event:event
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onValueChanged?: ((e:  NativeEventInfo<T> & ValueChangedInfo) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @default null
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @type Enums.DropDownSearchMode
     * @default "contains"
     * @public
     */
    searchMode?: 'contains' | 'startswith';
    /**
     * @docid
     * @default 500
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @readonly
     * @default null
     * @ref
     * @public
     */
    selectedItem?: any;
    /**
     * @docid
     * @default false
     * @public
     */
    showDataBeforeSearch?: boolean;
    /**
     * @docid
     * @ref
     * @public
     */
    value?: any;
    /**
     * @docid
     * @default "input change keyup"
     * @public
     */
    valueChangeEvent?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    wrapItemText?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    useItemTextAsTitle?: boolean;
}
/**
 * @docid
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @module ui/drop_down_editor/ui.drop_down_list
 * @export default
 * @hidden
 * @namespace DevExpress.ui
 */
export default class dxDropDownList extends dxDropDownEditor {
    constructor(element: UserDefinedElement, options?: dxDropDownListOptions)
    getDataSource(): DataSource;
}
