import {
    JQueryEventObject
} from '../../common';

import {
    dxElement
} from '../../core/element';

import {
    event
} from '../../events';

import dxButton, {
    dxButtonOptions
} from '../button';

import Editor, {
    EditorOptions
} from '../editor/editor';

export interface dxTextEditorOptions<T = dxTextEditor> extends EditorOptions<T> {
    /**
     * @docid dxTextEditorOptions.buttons
     * @type Array<string, Enums.TextBoxButtonName, dxTextEditorButton>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<string | 'clear' | dxTextEditorButton>;
    /**
     * @docid dxTextEditorOptions.focusStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxTextEditorOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxTextEditorOptions.inputAttr
     * @type object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    inputAttr?: any;
    /**
     * @docid dxTextEditorOptions.mask
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mask?: string;
    /**
     * @docid dxTextEditorOptions.maskChar
     * @type string
     * @default "_"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maskChar?: string;
    /**
     * @docid dxTextEditorOptions.maskInvalidMessage
     * @type string
     * @default "Value is invalid"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maskInvalidMessage?: string;
    /**
     * @docid dxTextEditorOptions.maskRules
     * @type Object
     * @default "{}"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maskRules?: any;
    /**
     * @docid dxTextEditorOptions.name
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxTextEditorOptions.onChange
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onChange?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onCopy
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCopy?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onCut
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCut?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onEnterKey
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEnterKey?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onFocusIn
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusIn?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onFocusOut
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusOut?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onInput
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onInput?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onKeyDown
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyDown?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onKeyPress
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyPress?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onKeyUp
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyUp?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.onPaste
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPaste?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxTextEditorOptions.placeholder
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid dxTextEditorOptions.showClearButton
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showClearButton?: boolean;
    /**
     * @docid dxTextEditorOptions.showMaskMode
     * @type Enums.ShowMaskMode
     * @default "always"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMaskMode?: 'always' | 'onFocus';
    /**
     * @docid dxTextEditorOptions.spellcheck
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    spellcheck?: boolean;
    /**
     * @docid dxTextEditorOptions.stylingMode
     * @type Enums.EditorStylingMode
     * @default 'outlined'
     * @default 'underlined' [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * @docid dxTextEditorOptions.text
     * @type string
     * @readonly
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxTextEditorOptions.useMaskedValue
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useMaskedValue?: boolean;
    /**
     * @docid dxTextEditorOptions.value
     * @type any
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
    /**
     * @docid dxTextEditorOptions.valueChangeEvent
     * @type string
     * @default "change"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
}
/**
 * @docid dxTextEditor
 * @inherits Editor
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxTextEditor extends Editor {
    constructor(element: Element, options?: dxTextEditorOptions)
    constructor(element: JQuery, options?: dxTextEditorOptions)
    /**
     * @docid dxTextEditorMethods.blur
     * @publicName blur()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    blur(): void;
    /**
     * @docid dxTextEditorMethods.focus
     * @publicName focus()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focus(): void;
    /**
     * @docid dxTextEditorMethods.getButton
     * @publicName getButton(name)
     * @param1 name:string
     * @return dxButton | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getButton(name: string): dxButton | undefined;
}

export interface dxTextEditorButton {
    /**
     /**
     * @docid dxTextEditorButton.location
     * @type Enums.TextEditorButtonLocation
     * @default "after"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before';
    /**
     * @docid dxTextEditorButton.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxTextEditorButton.options
     * @type dxButtonOptions
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    options?: dxButtonOptions;
}
