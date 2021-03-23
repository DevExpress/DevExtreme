import {
    TElement
} from '../../core/element';

import {
    TEvent
} from '../../events/index';

import dxButton, {
    dxButtonOptions
} from '../button';

import Editor, {
    EditorOptions
} from '../editor/editor';

export interface dxTextEditorOptions<T = dxTextEditor> extends EditorOptions<T> {
    /**
     * @docid
     * @type Array<string, Enums.TextBoxButtonName, dxTextEditorButton>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<string | 'clear' | dxTextEditorButton>;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    inputAttr?: any;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mask?: string;
    /**
     * @docid
     * @default "_"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maskChar?: string;
    /**
     * @docid
     * @default "Value is invalid"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maskInvalidMessage?: string;
    /**
     * @docid
     * @default "{}"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maskRules?: any;
    /**
     * @docid
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onChange?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCopy?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCut?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEnterKey?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusIn?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusOut?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onInput?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyDown?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @deprecated
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyPress?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyUp?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPaste?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showClearButton?: boolean;
    /**
     * @docid
     * @type Enums.ShowMaskMode
     * @default "always"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMaskMode?: 'always' | 'onFocus';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    spellcheck?: boolean;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default 'outlined'
     * @default 'underlined' [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * @docid
     * @readonly
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useMaskedValue?: boolean;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
    /**
     * @docid
     * @default "change"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
}
/**
 * @docid
 * @inherits Editor
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxTextEditor extends Editor {
    constructor(element: TElement, options?: dxTextEditorOptions)
    /**
     * @docid
     * @publicName blur()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    blur(): void;
    /**
     * @docid
     * @publicName focus()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focus(): void;
    /**
     * @docid
     * @publicName getButton(name)
     * @param1 name:string
     * @return dxButton | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getButton(name: string): dxButton | undefined;
}

/**
* @docid
* @type object
*/
export interface dxTextEditorButton {
    /**
     * @docid
     * @type Enums.TextEditorButtonLocation
     * @default "after"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    options?: dxButtonOptions;
}
