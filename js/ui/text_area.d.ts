import {
  EventInfo,
  NativeEventInfo,
  InitializedEventInfo,
  ChangedOptionInfo, NativeInputEventInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTextBox, {
    dxTextBoxOptions,
} from './text_box';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTextArea, Event>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTextArea>;

/** @public */
export type CopyEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxTextArea>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTextArea>;

/** @public */
export type InputEvent = NativeInputEventInfo<dxTextArea, UIEvent>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTextArea> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxTextArea, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * @docid
     * @default false
     * @public
     */
    autoResizeEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxHeight?: number | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    minHeight?: number | string;
    /**
     * @docid
     * @default true
     * @public
     */
    spellcheck?: boolean;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextBox
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTextArea extends dxTextBox<dxTextAreaOptions> { }

/** @public */
export type Properties = dxTextAreaOptions;

/** @deprecated use Properties instead */
export type Options = dxTextAreaOptions;
