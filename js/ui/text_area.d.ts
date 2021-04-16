import {
    ElementIntake
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

export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoResizeEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number | string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
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
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTextArea extends dxTextBox {
    constructor(element: ElementIntake, options?: dxTextAreaOptions)
}

/** @public */
export type Options = dxTextAreaOptions;

/** @deprecated use Options instead */
export type IOptions = dxTextAreaOptions;
