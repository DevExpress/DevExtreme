import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    ValueChangedInfo
} from './editor/editor';

import dxTextEditor, {
    dxTextEditorOptions
} from './text_box/ui.text_editor.base';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTextBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type CutEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type DisposingEvent = EventInfo<dxTextBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTextBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTextBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxTextBox>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxTextBox> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTextBoxOptions<T = dxTextBox> extends dxTextEditorOptions<T> {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxLength?: string | number;
    /**
     * @docid
     * @type Enums.TextBoxMode
     * @default "text"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextEditor
 * @module ui/text_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTextBox extends dxTextEditor {
    constructor(element: UserDefinedElement, options?: dxTextBoxOptions)
}

/** @public */
export type Properties = dxTextBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxTextBoxOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTextBoxOptions;
