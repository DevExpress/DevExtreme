import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    CancelableEvent,
    ComponentEvent,
    ComponentNativeEvent,
    ItemInfo
} from '../events';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import {
    ValueChangedInfo
} from './editor/editor';

import dxSelectBox, {
    dxSelectBoxOptions,
    CustomItemCreatingInfo
} from './select_box';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxTagBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentNativeEvent<dxTagBox> & ValueChangedInfo;
/**
 * @public
 */
export type ClosedEvent = ComponentEvent<dxTagBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentEvent<dxTagBox>;
/**
 * @public
 */
export type ItemClickEvent = ComponentNativeEvent<dxTagBox> & ItemInfo;
/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxTagBox>;
/**
 * @public
 */
export type CustomItemCreatingEvent = ComponentEvent<dxTagBox> & CustomItemCreatingInfo;
/**
 * @public
 */
export type SelectionChangedEvent = ComponentEvent<dxTagBox> & SelectionChangedInfo<string | number | any>;
/**
 * @public
 */
export type SelectAllValueChangedEvent = ComponentEvent<dxTagBox> & {
    readonly value: boolean;
}
/**
 * @public
 */
export type MultiTagPreparingEvent = ComponentEvent<dxTagBox> & CancelableEvent & {
    multiTagElement: TElement;
    readonly selectedItems?: Array<string | number | any>;
    readonly text?: string;
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
     * @type_function_param1_field1 component:dxTagBox
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMultiTagPreparing?: ((e: MultiTagPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:boolean
     * @type_function_param1_field1 component:dxTagBox
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:Array<string,number,Object>
     * @type_function_param1_field5 removedItems:Array<string,number,Object>
     * @type_function_param1_field1 component:dxTagBox
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
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
