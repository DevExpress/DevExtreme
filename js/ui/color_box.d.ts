import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    template
} from '../core/templates/template';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    Properties as PopupProperties
} from './popup';

/** @public */
export type ChangeEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type ClosedEvent = EventInfo<dxColorBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type CutEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type DisposingEvent = EventInfo<dxColorBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxColorBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type OpenedEvent = EventInfo<dxColorBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxColorBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxColorBox>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxColorBox> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

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
     * @type_function_param2 fieldElement:DxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((value: string, fieldElement: DxElement) => string | UserDefinedElement);
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

    dropDownOptions?: PopupProperties;
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
export default class dxColorBox extends dxDropDownEditor<dxColorBoxOptions> { }

/** @public */
export type Properties = dxColorBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxColorBoxOptions;

/** @deprecated use Properties instead */
export type IOptions = dxColorBoxOptions;
