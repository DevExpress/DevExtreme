import {
    NativeEventInfo,
} from '../../common/core/events';

import dxButton from '../button';

import Editor, {
    EditorOptions,
} from '../editor/editor';

import {
    LabelMode,
    EditorStyle,
    MaskMode,
    TextBoxPredefinedButton,
    TextEditorButton,
} from '../../common';

/**
 * @namespace DevExpress.ui
 * @docid
 * @type object
 */
export interface dxTextEditorOptions<TComponent> extends EditorOptions<TComponent> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    buttons?: Array<string | TextBoxPredefinedButton | TextEditorButton>;
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
     * @default 'static'
     * @default 'floating' &for(Material)
     * @default 'outside' &for(Fluent)
     * @public
     */
    labelMode?: LabelMode;
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
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onChange?: ((e: NativeEventInfo<TComponent, Event>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onCopy?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onCut?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onEnterKey?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onFocusIn?: ((e: NativeEventInfo<TComponent, FocusEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onFocusOut?: ((e: NativeEventInfo<TComponent, FocusEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onInput?: ((e: NativeEventInfo<TComponent, UIEvent>) => void);
    /**
     * @docid
     * @type_function_param1 e:NativeEventInfo
     * @default null
     * @action
     * @public
     */
    onKeyDown?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
     * @action
     * @public
     */
    onKeyUp?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:NativeEventInfo
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
     * @default "always"
     * @public
     */
    showMaskMode?: MaskMode;
    /**
     * @docid
     * @default false
     * @public
     */
    spellcheck?: boolean;
    /**
     * @docid
     * @default 'outlined'
     * @default 'filled' &for(Material)
     * @public
     */
    stylingMode?: EditorStyle;
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
 * @namespace DevExpress.ui
 * @deprecated Use TextEditorButton from 'devextreme/common' instead
 */
export type dxTextEditorButton = TextEditorButton;

interface TextEditorInstance extends dxTextEditor<Properties> {}

type Properties = dxTextEditorOptions<TextEditorInstance>;
