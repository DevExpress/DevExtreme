import {
    NativeEventInfo,
} from '../../events/index';

import dxButton, {
    dxButtonOptions,
} from '../button';

import Editor, {
    EditorOptions,
} from '../editor/editor';

/** @namespace DevExpress.ui */
export interface dxTextEditorOptions<TComponent> extends EditorOptions<TComponent> {
    /**
     * @docid
     * @type Array<string, Enums.TextBoxButtonName, dxTextEditorButton>
     * @default undefined
     * @public
     */
    buttons?: Array<string | 'clear' | dxTextEditorButton>;
    /**
     * @docid
     * @default true
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default {}
     * @public
     */
    inputAttr?: any;
    /**
     * @docid
     * @default ''
     * @public
     */
    label?: string;
    /**
     * @docid
     * @type Enums.EditorLabelMode
     * @default 'static'
     * @default 'floating' &for(Material)
     * @public
     */
    labelMode?: 'static' | 'floating' | 'hidden';
    /**
     * @docid
     * @default ""
     * @public
     */
    mask?: string;
    /**
     * @docid
     * @default "_"
     * @public
     */
    maskChar?: string;
    /**
     * @docid
     * @default "Value is invalid"
     * @public
     */
    maskInvalidMessage?: string;
    /**
     * @docid
     * @default "{}"
     * @public
     */
    maskRules?: any;
    /**
     * @docid
     * @hidden false
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onChange?: ((e: NativeEventInfo<TComponent, Event>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onCopy?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onCut?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onEnterKey?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onFocusIn?: ((e: NativeEventInfo<TComponent, FocusEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onFocusOut?: ((e: NativeEventInfo<TComponent, FocusEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onInput?: ((e: NativeEventInfo<TComponent, UIEvent>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @default null
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onKeyDown?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onKeyUp?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:this
     * @action
     * @public
     */
    onPaste?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * @docid
     * @default ""
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    showClearButton?: boolean;
    /**
     * @docid
     * @type Enums.ShowMaskMode
     * @default "always"
     * @public
     */
    showMaskMode?: 'always' | 'onFocus';
    /**
     * @docid
     * @default false
     * @public
     */
    spellcheck?: boolean;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default 'outlined'
     * @default 'filled' &for(Material)
     * @public
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * @docid
     * @readonly
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    useMaskedValue?: boolean;
    /**
     * @docid
     * @default ""
     * @public
     */
    value?: any;
    /**
     * @docid
     * @default "change"
     * @public
     */
    valueChangeEvent?: string;
}
/**
 * @docid
 * @inherits Editor
 * @hidden
 * @namespace DevExpress.ui
 */
export default class dxTextEditor<TProperties = Properties> extends Editor<TProperties> {
    /**
     * @docid
     * @publicName blur()
     * @public
     */
    blur(): void;
    /**
     * @docid
     * @publicName focus()
     * @public
     */
    focus(): void;
    /**
     * @docid
     * @publicName getButton(name)
     * @public
     */
    getButton(name: string): dxButton | undefined;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTextEditorButton {
    /**
     * @docid
     * @type Enums.TextEditorButtonLocation
     * @default "after"
     * @public
     */
    location?: 'after' | 'before';
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    options?: dxButtonOptions;
}

interface TextEditorInstance extends dxTextEditor<Properties> {}

type Properties = dxTextEditorOptions<TextEditorInstance>;
