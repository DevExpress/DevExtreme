import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import {
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import dxSelectBox, {
    dxSelectBoxOptions,
    CustomItemCreatingInfo
} from './select_box';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type ClosedEvent = EventInfo<dxTagBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTagBox>;

/** @public */
export type CustomItemCreatingEvent = EventInfo<dxTagBox> & CustomItemCreatingInfo;

/** @public */
export type DisposingEvent = EventInfo<dxTagBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTagBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxTagBox> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTagBox>;

/** @public */
export type MultiTagPreparingEvent = Cancelable & EventInfo<dxTagBox> & {
    readonly multiTagElement: TElement;
    readonly selectedItems?: Array<string | number | any>;
    text?: string;
}

/** @public */
export type OpenedEvent = EventInfo<dxTagBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTagBox> & ChangedOptionInfo;

/** @public */
export type SelectAllValueChangedEvent = EventInfo<dxTagBox> & {
    readonly value: boolean;
}

/** @public */
export type SelectionChangedEvent = EventInfo<dxTagBox> & SelectionChangedInfo<string | number | any>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxTagBox> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

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

/** @public */
export type Options = dxTagBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxTagBoxOptions;
