import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import dxTextBox, {
    dxTextBoxOptions,

} from '../text_box';

import {
    dxTextEditorButton
} from '../text_box/ui.text_editor.base';

import {
    dxPopupOptions
} from '../popup';

import {
    EventInfo
} from '../../events/index';

export interface DropDownButtonTemplateDataModel {
    readonly text?: string;
    readonly icon?: string;
}

/** @namespace DevExpress.ui */
export interface dxDropDownEditorOptions<T = dxDropDownEditor> extends dxTextBoxOptions<T> {
    /**
     * @docid
     * @default true
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @type Enums.EditorApplyValueMode
     * @default "instantly"
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid
     * @default {}
     * @public
     */
    dropDownOptions?: dxPopupOptions;
    /**
     * @docid
     * @type Array<Enums.DropDownEditorButtonName,dxTextEditorButton>
     * @default undefined
     * @public
     */
    buttons?: Array<'clear' | 'dropDown' | dxTextEditorButton>;
    /**
     * @docid
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default "dropDownButton"
     * @type_function_param1 buttonData:object
     * @type_function_param1_field1 text:string
     * @type_function_param1_field2 icon:string
     * @type_function_param2 contentElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    dropDownButtonTemplate?: template | ((buttonData: DropDownButtonTemplateDataModel, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onClosed?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onOpened?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default false
     * @fires dxDropDownEditorOptions.onOpened
     * @fires dxDropDownEditorOptions.onClosed
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default null
     * @public
     */
    value?: any;
}
/**
 * @docid
 * @inherits dxTextBox
 * @module ui/drop_down_editor/ui.drop_down_editor
 * @export default
 * @hidden
 * @namespace DevExpress.ui
 */
export default class dxDropDownEditor extends dxTextBox {
    constructor(element: UserDefinedElement, options?: dxDropDownEditorOptions)
    /**
     * @docid
     * @publicName close()
     * @public
     */
    close(): void;
    /**
     * @docid
     * @publicName content()
     * @return DxElement
     * @public
     */
    content(): DxElement;
    /**
     * @docid
     * @publicName field()
     * @return DxElement
     * @public
     */
    field(): DxElement;
    /**
     * @docid
     * @publicName open()
     * @public
     */
    open(): void;
}

export type Options = dxDropDownEditorOptions;
export type IOptions = dxDropDownEditorOptions;
