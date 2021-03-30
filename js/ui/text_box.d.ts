import {
    TElement
} from '../core/element';

import {
    ComponentValueChangedEvent
} from './editor/editor';

import dxTextEditor, {
    dxTextEditorOptions,
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
export type ContentReadyEvent = ComponentContentReadyEvent<dxTextBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxTextBox>;
/**
 * @public
 */
export type ChangeEvent = ComponentChangeEvent<dxTextBox>;
/**
 * @public
 */
export type CopyEvent = ComponentCopyEvent<dxTextBox>;
/**
 * @public
 */
export type CutEvent = ComponentCutEvent<dxTextBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentEnterKeyEvent<dxTextBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentFocusInEvent<dxTextBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentFocusOutEvent<dxTextBox>;
/**
 * @public
 */
export type InputEvent = ComponentInputEvent<dxTextBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentKeyDownEvent<dxTextBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentKeyPressEvent<dxTextBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentKeyUpEvent<dxTextBox>;
/**
 * @public
 */
export type PasteEvent = ComponentPasteEvent<dxTextBox>;

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
 * @public
 */
export default class dxTextBox extends dxTextEditor {
    constructor(element: TElement, options?: dxTextBoxOptions)
}

export type Options = dxTextBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxTextBoxOptions;
