import {
    TElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource from '../../data/data_source';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ItemEvent
} from '../../events';

import {
    DataExpressionMixinOptions
} from '../editor/ui.data_expression';

import dxDropDownEditor, {
    dxDropDownEditorOptions
} from './ui.drop_down_editor';

import {
    SelectionChangedInfo
} from '../collection/ui.collection_widget.base';

export interface dxDropDownListOptions<T = dxDropDownList> extends DataExpressionMixinOptions<T>, dxDropDownEditorOptions<T> {
    /**
     * @docid
     * @readonly
     * @default undefined
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayValue?: string;
    /**
     * @docid
     * @default "group"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grouped?: boolean;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid
     * @default "No data to display"
     * @prevFileNamespace DevExpress.ui
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
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: ComponentNativeEvent<T> & ItemEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 selectedItem:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: ComponentEvent<T> & SelectionChangedInfo) => void);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @type Enums.DropDownSearchMode
     * @default "contains"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchMode?: 'contains' | 'startswith';
    /**
     * @docid
     * @default 500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @readonly
     * @default null
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItem?: any;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDataBeforeSearch?: boolean;
    /**
     * @docid
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
    /**
     * @docid
     * @default "input change keyup"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wrapItemText?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
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
 * @prevFileNamespace DevExpress.ui
 */
export default class dxDropDownList extends dxDropDownEditor {
    constructor(element: TElement, options?: dxDropDownListOptions)
    getDataSource(): DataSource;
}
