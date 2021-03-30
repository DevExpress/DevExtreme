import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';
import { ComponentEvent } from '../events/index';

import {
    ComponentItemClickEvent,
    ComponentSelectionChangedEvent,
} from './collection/ui.collection_widget.base';

import {
    ComponentClosedEvent,
    ComponentOpenedEvent
} from './drop_down_editor/ui.drop_down_editor';

import {
    ComponentValueChangedEvent
} from './editor/editor';

import {
    SelectAllValueChangedEvent,
} from './list';

import dxSelectBox, {
    dxSelectBoxOptions,
    ComponentCustomItemCreatingEvent
} from './select_box';

import {
    ComponentChangeEvent,
    ComponentCopyEvent,
    ComponentCutEvent,
    ComponentEnterKeyEvent,
    ComponentFocusInEvent,
    ComponentFocusOutEvent,
    ComponentInputEvent,
    ComponentKeyDownEvent,
    ComponentKeyPressEvent,
    ComponentKeyUpEvent,
    ComponentPasteEvent,
} from './text_box/ui.text_editor.base';

import {
    ComponentContentReadyEvent
} from './widget/ui.widget'

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxTagBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxTagBox>;
/**
 * @public
 */
export type ClosedEvent = ComponentClosedEvent<dxTagBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentOpenedEvent<dxTagBox>;
/**
 * @public
 */
export type ItemClickEvent = ComponentItemClickEvent<dxTagBox>;
/**
 * @public
 */
export type ChangeEvent = ComponentChangeEvent<dxTagBox>;
/**
 * @public
 */
export type CopyEvent = ComponentCopyEvent<dxTagBox>;
/**
 * @public
 */
export type CutEvent = ComponentCutEvent<dxTagBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentEnterKeyEvent<dxTagBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentFocusInEvent<dxTagBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentFocusOutEvent<dxTagBox>;
/**
 * @public
 */
export type InputEvent = ComponentInputEvent<dxTagBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentKeyDownEvent<dxTagBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentKeyPressEvent<dxTagBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentKeyUpEvent<dxTagBox>;
/**
 * @public
 */
export type PasteEvent = ComponentPasteEvent<dxTagBox>;
/**
 * @public
 */
export type CustomItemCreatingEvent = ComponentCustomItemCreatingEvent<dxTagBox>;
/**
 * @public
 */
export type SelectionChangedEvent = ComponentSelectionChangedEvent<dxTagBox, string | number | any>;
/**
 * @public
 */
export type MultiTagPreparingEvent = ComponentEvent<dxTagBox> & {
    multiTagElement: TElement;
    readonly selectedItems?: Array<string | number | any>;
    readonly text?: string;
    cancel?: boolean;
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
