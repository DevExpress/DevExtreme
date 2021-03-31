import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent
} from '../events';

import {
    ValueChangedInfo
} from './editor/editor';

import dxTextEditor, {
    dxTextEditorOptions
} from './text_box/ui.text_editor.base';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxTextBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentNativeEvent<dxTextBox> & ValueChangedInfo;
/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxTextBox>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxTextBox>;

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
