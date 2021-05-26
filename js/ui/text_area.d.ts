import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    ValueChangedInfo
} from './editor/editor';

import dxTextBox, {
    dxTextBoxOptions
} from './text_box';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTextArea>;

/** @public */
export type CopyEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type CutEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type DisposingEvent = EventInfo<dxTextArea>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTextArea>;

/** @public */
export type InputEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTextArea> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxTextArea>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxTextArea> & ValueChangedInfo;

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
 * @module ui/text_area
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTextArea extends dxTextBox<dxTextAreaOptions> { }

/** @public */
export type Properties = dxTextAreaOptions;

/** @deprecated use Properties instead */
export type Options = dxTextAreaOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTextAreaOptions;
