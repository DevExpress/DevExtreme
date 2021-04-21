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

export interface dxDropDownEditorOptions<T = dxDropDownEditor> extends dxTextBoxOptions<T> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
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
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownOptions?: dxPopupOptions;
    /**
     * @docid
     * @type Array<Enums.DropDownEditorButtonName,dxTextEditorButton>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<'clear' | 'dropDown' | dxTextEditorButton>;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onOpened?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default false
     * @fires dxDropDownEditorOptions.onOpened
     * @fires dxDropDownEditorOptions.onClosed
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
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
 * @prevFileNamespace DevExpress.ui
 */
export default class dxDropDownEditor extends dxTextBox {
    constructor(element: UserDefinedElement, options?: dxDropDownEditorOptions)
    /**
     * @docid
     * @publicName close()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    close(): void;
    /**
     * @docid
     * @publicName content()
     * @return DxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): DxElement;
    /**
     * @docid
     * @publicName field()
     * @return DxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    field(): DxElement;
    /**
     * @docid
     * @publicName open()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    open(): void;
}

export type Options = dxDropDownEditorOptions;

/** @deprecated use Options instead */
export type IOptions = dxDropDownEditorOptions;
