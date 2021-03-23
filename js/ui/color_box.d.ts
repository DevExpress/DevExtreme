import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    CutEvent,
    CopyEvent,
    PasteEvent,
    KeyUpEvent,
    InputEvent,
    ChangeEvent,
    ClosedEvent,
    OpenedEvent,
    EnterKeyEvent,
    KeyDownEvent,
    FocusInEvent,
    KeyPressEvent,
    FocusOutEvent,
    ContentReadyEvent,
    ValueChangedEvent
} from './drop_down_editor/ui.drop_down_editor';

/**
 * @public
*/
export {
    CutEvent,
    CopyEvent,
    PasteEvent,
    KeyUpEvent,
    InputEvent,
    ChangeEvent,
    ClosedEvent,
    OpenedEvent,
    EnterKeyEvent,
    KeyDownEvent,
    FocusInEvent,
    KeyPressEvent,
    FocusOutEvent,
    ContentReadyEvent,
    ValueChangedEvent
}
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
