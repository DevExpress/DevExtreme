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
export interface dxTextBoxOptions<TComponent> extends dxTextEditorOptions<TComponent> {
    /**
     * @docid
     * @default null
     * @public
     */
    maxLength?: string | number;
    /**
     * @docid
     * @type Enums.TextBoxMode
     * @default "text"
     * @public
     */
    mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
    /**
     * @docid
     * @default ""
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTextBox<TProperties = Properties> extends dxTextEditor<TProperties> { }

interface TextBoxInstance extends dxTextBox<Properties> { }

/** @public */
export type Properties = dxTextBoxOptions<TextBoxInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;

/** @deprecated use Properties instead */
export type IOptions = Properties;
