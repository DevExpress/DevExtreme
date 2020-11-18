import {
    dxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import dxTextBox, {
    dxTextBoxOptions
} from '../text_box';

import {
    dxTextEditorButton
} from '../text_box/ui.text_editor.base';

import {
    dxPopupOptions
} from '../popup';

export interface dxDropDownEditorOptions<T = dxDropDownEditor> extends dxTextBoxOptions<T> {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @type boolean
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
     * @type dxPopupOptions
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
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @type template|function
     * @default "dropDownButton"
     * @type_function_param1 buttonData:object
     * @type_function_param1_field1 text:string
     * @type_function_param1_field2 icon:string
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownButtonTemplate?: template | ((buttonData: { text?: string, icon?: string }, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClosed?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onOpened?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @fires dxDropDownEditorOptions.onOpened
     * @fires dxDropDownEditorOptions.onClosed
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @type any
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
    constructor(element: Element, options?: dxDropDownEditorOptions)
    constructor(element: JQuery, options?: dxDropDownEditorOptions)
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
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): dxElement;
    /**
     * @docid
     * @publicName field()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    field(): dxElement;
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
