import {
    UserDefinedElement,
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import dxDropDownList, {
    dxDropDownListOptions,
    SelectionChangedInfo,
} from './drop_down_editor/ui.drop_down_list';

import {
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

/** @public */
export type ChangeEvent = NativeEventInfo<dxAutocomplete, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxAutocomplete>;

/** @public */
export type ContentReadyEvent = EventInfo<dxAutocomplete>;

/** @public */
export type CopyEvent = NativeEventInfo<dxAutocomplete, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxAutocomplete, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxAutocomplete>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxAutocomplete, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxAutocomplete, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxAutocomplete>;

/** @public */
export type InputEvent = NativeEventInfo<dxAutocomplete, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxAutocomplete>;

/** @public */
export type OptionChangedEvent = EventInfo<dxAutocomplete> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxAutocomplete, ClipboardEvent>;

/** @public */
export type SelectionChangedEvent = EventInfo<dxAutocomplete> & SelectionChangedInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
    /**
     * @docid
     * @default 10
     * @public
     */
    maxItemCount?: number;
    /**
     * @docid
     * @default 1
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default null
     * @public
     */
    value?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownList
 * @namespace DevExpress.ui
 * @public
 */
export default class dxAutocomplete extends dxDropDownList {
    constructor(element: UserDefinedElement, options?: dxAutocompleteOptions)
}

/** @public */
export type Properties = dxAutocompleteOptions;

/** @deprecated use Properties instead */
export type Options = dxAutocompleteOptions;

/** @deprecated use Properties instead */
export type IOptions = dxAutocompleteOptions;
