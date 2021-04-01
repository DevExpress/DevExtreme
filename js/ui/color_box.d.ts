import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ComponentDisposingEvent,
    ComponentInitializedEvent,
    ComponentOptionChangedEvent
} from '../events';

import {
    template
} from '../core/templates/template';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type ClosedEvent = ComponentEvent<dxColorBox>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type DisposingEvent = ComponentDisposingEvent<dxColorBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type InitializedEvent = ComponentInitializedEvent<dxColorBox>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentEvent<dxColorBox>;
/**
 * @public
 */
export type OptionChangedEvent = ComponentOptionChangedEvent<dxColorBox>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxColorBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentNativeEvent<dxColorBox> & ValueChangedInfo;

/**
 * @public
 */
export type DropDownButtonData = DropDownButtonDataModel;

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
