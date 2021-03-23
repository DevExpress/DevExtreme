import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';
import { BaseEvent } from '../events/index';
import {
    SelectAllValueChangedEvent,
} from './list';

import dxSelectBox, {
    dxSelectBoxOptions,
    CutEvent,
    CopyEvent,
    PasteEvent,
    KeyUpEvent,
    InputEvent,
    ChangeEvent,
    ClosedEvent,
    OpenedEvent,
    EnterKeyEvent,
    KeyDownEvent,
    FocusInEvent,
    KeyPressEvent,
    FocusOutEvent,
    ItemClickEvent,
    ContentReadyEvent,
    ValueChangedEvent,
    SelectionChangedEvent as SelectBoxSelectionChangedEvent,
    CustomItemCreatingEvent
} from './select_box';

/**
 * @public
*/
export {
    CutEvent,
    CopyEvent,
    PasteEvent,
    KeyUpEvent,
    InputEvent,
    ChangeEvent,
    ClosedEvent,
    OpenedEvent,
    EnterKeyEvent,
    KeyDownEvent,
    FocusInEvent,
    KeyPressEvent,
    FocusOutEvent,
    ItemClickEvent,
    ContentReadyEvent,
    ValueChangedEvent,
    CustomItemCreatingEvent,
    SelectAllValueChangedEvent
}
/**
 * @public
*/
export interface SelectionChangedEvent<T> extends SelectBoxSelectionChangedEvent<T> {
    readonly addedItems: Array<string | number | any>,
    readonly removedItems: Array<string | number | any>
}
/**
 * @public
*/
export interface MultiTagPreparingEvent<T> extends BaseEvent<T> {
    multiTagElement: TElement,
    readonly selectedItems?: Array<string | number | any>,
    readonly text?: string,
    cancel?: boolean
}
export interface dxTagBoxOptions extends dxSelectBoxOptions<dxTagBox> {
    /**
     * @docid
     * @type Enums.EditorApplyValueMode
     * @default "instantly"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideSelectedItems?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxDisplayedTags?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    multiline?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 multiTagElement:dxElement
     * @type_function_param1_field5 selectedItems:Array<string,number,Object>
     * @type_function_param1_field6 text:string
     * @type_function_param1_field7 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMultiTagPreparing?: ((e: MultiTagPreparingEvent<dxTagBox>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<dxTagBox>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:Array<string,number,Object>
     * @type_function_param1_field5 removedItems:Array<string,number,Object>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent<dxTagBox>) => void);
    /**
     * @docid
     * @type Enums.SelectAllMode
     * @default 'page'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * @docid
     * @readonly
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItems?: Array<string | number | any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default 1500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxFilterQueryLength?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMultiTagOnly?: boolean;
    /**
     * @docid
     * @default "tag"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tagTemplate?: template | ((itemData: any, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Array<string | number | any>;
}
/**
 * @docid
 * @isEditor
 * @inherits dxSelectBox
 * @module ui/tag_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTagBox extends dxSelectBox {
    constructor(element: TElement, options?: dxTagBoxOptions)
}

export type Options = dxTagBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxTagBoxOptions;
