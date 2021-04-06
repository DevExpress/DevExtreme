import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ComponentInitializedEvent,
    ChangedOptionInfo
} from '../events/index';

import {
    ValueChangedInfo
} from './editor/editor';

import dxTextBox, {
    dxTextBoxOptions
} from './text_box';

/** @public */
export type ChangeEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type ContentReadyEvent = ComponentEvent<dxTextArea>;

/** @public */
export type CopyEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type CutEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type DisposingEvent = ComponentEvent<dxTextArea>;

/** @public */
export type EnterKeyEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type FocusInEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type FocusOutEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxTextArea>;

/** @public */
export type InputEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type KeyDownEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type KeyPressEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type KeyUpEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type OptionChangedEvent = ComponentEvent<dxTextArea> & ChangedOptionInfo;

/** @public */
export type PasteEvent = ComponentNativeEvent<dxTextArea>;

/** @public */
export type ValueChangedEvent = ComponentNativeEvent<dxTextArea> & ValueChangedInfo;

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
    constructor(element: TElement, options?: dxTextAreaOptions)
}

export type Options = dxTextAreaOptions;

/** @deprecated use Options instead */
export type IOptions = dxTextAreaOptions;
