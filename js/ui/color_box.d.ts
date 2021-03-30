import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    ComponentClosedEvent,
    ComponentOpenedEvent
} from './drop_down_editor/ui.drop_down_editor';

import {
    ComponentValueChangedEvent
} from './editor/editor';

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
} from './widget/ui.widget';

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxColorBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxColorBox>;
/**
 * @public
 */
export type ClosedEvent = ComponentClosedEvent<dxColorBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentOpenedEvent<dxColorBox>;
/**
 * @public
 */
export type ChangeEvent = ComponentChangeEvent<dxColorBox>;
/**
 * @public
 */
export type CopyEvent = ComponentCopyEvent<dxColorBox>;
/**
 * @public
 */
export type CutEvent = ComponentCutEvent<dxColorBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentEnterKeyEvent<dxColorBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentFocusInEvent<dxColorBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentFocusOutEvent<dxColorBox>;
/**
 * @public
 */
export type InputEvent = ComponentInputEvent<dxColorBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentKeyDownEvent<dxColorBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentKeyPressEvent<dxColorBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentKeyUpEvent<dxColorBox>;
/**
 * @public
 */
export type PasteEvent = ComponentPasteEvent<dxColorBox>;

export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
    /**
     * @docid
     * @default "OK"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid
     * @type Enums.EditorApplyValueMode
     * @default "useButtons"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid
     * @default "Cancel"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editAlphaChannel?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 value:string
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((value: string, fieldElement: TElement) => string | TElement);
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyStep?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownEditor
 * @module ui/color_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxColorBox extends dxDropDownEditor {
    constructor(element: TElement, options?: dxColorBoxOptions)
}

export type Options = dxColorBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxColorBoxOptions;
