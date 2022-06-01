import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    template,
} from '../core/templates/template';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    Properties as PopupProperties,
} from './popup';

import {
    EditorApplyValueMode,
} from '../types/enums';

/** @public */
export type ChangeEvent = NativeEventInfo<dxColorBox, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxColorBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxColorBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxColorBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxColorBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxColorBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxColorBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxColorBox, KeyboardEvent | MouseEvent | PointerEvent | UIEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
    /**
     * @docid
     * @default "OK"
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid
     * @default "useButtons"
     * @public
     */
    applyValueMode?: EditorApplyValueMode;
    /**
     * @docid
     * @default "Cancel"
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    editAlphaChannel?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((value: string, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default 1
     * @public
     */
    keyStep?: number;
    /**
     * @docid
     * @public
     */
    value?: string;

    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownEditor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxColorBox extends dxDropDownEditor<dxColorBoxOptions> { }

/** @public */
export type Properties = dxColorBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxColorBoxOptions;
