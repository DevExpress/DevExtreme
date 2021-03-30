import {
    TElement
} from '../core/element';

import {
    ComponentValueChangedEvent
} from './editor/editor';

import dxTextBox, {
    dxTextBoxOptions
} from './text_box';

import {
    ComponentChangeEvent,
    ComponentCopyEvent,
    ComponentCutEvent,
    ComponentEnterKeyEvent,
    ComponentFocusInEvent,
    ComponentFocusOutEvent,
    ComponentInputEvent,
    ComponentKeyDownEvent,
    ComponentKeyPressEvent,
    ComponentKeyUpEvent,
    ComponentPasteEvent,
} from './text_box/ui.text_editor.base';

import {
    ComponentContentReadyEvent
} from './widget/ui.widget'

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxTextArea>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxTextArea>;
/**
 * @public
 */
export type ChangeEvent = ComponentChangeEvent<dxTextArea>;
/**
 * @public
 */
export type CopyEvent = ComponentCopyEvent<dxTextArea>;
/**
 * @public
 */
export type CutEvent = ComponentCutEvent<dxTextArea>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentEnterKeyEvent<dxTextArea>;
/**
 * @public
 */
export type FocusInEvent = ComponentFocusInEvent<dxTextArea>;
/**
 * @public
 */
export type FocusOutEvent = ComponentFocusOutEvent<dxTextArea>;
/**
 * @public
 */
export type InputEvent = ComponentInputEvent<dxTextArea>;
/**
 * @public
 */
export type KeyDownEvent = ComponentKeyDownEvent<dxTextArea>;
/**
 * @public
 */
export type KeyPressEvent = ComponentKeyPressEvent<dxTextArea>;
/**
 * @public
 */
export type KeyUpEvent = ComponentKeyUpEvent<dxTextArea>;
/**
 * @public
 */
export type PasteEvent = ComponentPasteEvent<dxTextArea>;

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
