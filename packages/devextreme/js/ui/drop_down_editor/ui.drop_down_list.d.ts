import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
    SimplifiedSearchMode,
} from '../../common';

import { DataSource } from '../../common/data';

import {
    EventInfo,
    NativeEventInfo,
    ItemInfo,
} from '../../common/core/events';

import {
    ValueChangedInfo,
} from '../editor/editor';

import {
    DataExpressionMixinOptions,
} from '../editor/ui.data_expression';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
} from './ui.drop_down_editor';

/**
 * @docid _ui_drop_down_editor_ui_drop_down_list_SelectionChangedInfo
 * @hidden
 */
export interface SelectionChangedInfo<T = any> {
    /**
     * @docid _ui_drop_down_editor_ui_drop_down_list_SelectionChangedInfo.selectedItem
     * @type object
     */
    readonly selectedItem: T;
}

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
export interface dxDropDownListOptions<TComponent> extends DataExpressionMixinOptions<TComponent>, dxDropDownEditorOptions<TComponent> {
    /**
     * @docid
     * @readonly
     * @default undefined
     * @ref
     * @public
     */
    displayValue?: string | undefined;
    /**
     * @docid
     * @default "group"
     * @type_function_param1 itemData:object
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
     * @type_function_param1_field itemData:object
     * @type_function_param1_field itemElement:object
     * @type_function_param1_field itemIndex:number | object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onItemClick?: ((e: NativeEventInfo<TComponent, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field selectedItem:object
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangedInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field value:object
     * @type_function_param1_field previousValue:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onValueChanged?: ((e: NativeEventInfo<TComponent, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo) => void);
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
     * @default "contains"
     * @public
     */
    searchMode?: SimplifiedSearchMode;
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
 * @hidden
 * @namespace DevExpress.ui
 * @options dxDropDownListOptions
 */
export default class dxDropDownList<TProperties> extends dxDropDownEditor<TProperties> {
    getDataSource(): DataSource;
}
