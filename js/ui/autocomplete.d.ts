import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import dxDropDownList, {
    dxDropDownListOptions,
    SelectionChangedInfo
} from './drop_down_editor/ui.drop_down_list';

import {
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    Properties as PopupProperties
} from './popup';

/** @public */
export type ChangeEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type ClosedEvent = EventInfo<dxAutocomplete>;

/** @public */
export type ContentReadyEvent = EventInfo<dxAutocomplete>;

/** @public */
export type CopyEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type CutEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type DisposingEvent = EventInfo<dxAutocomplete>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxAutocomplete>;

/** @public */
export type InputEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxAutocomplete> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type OpenedEvent = EventInfo<dxAutocomplete>;

/** @public */
export type OptionChangedEvent = EventInfo<dxAutocomplete> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxAutocomplete>;

/** @public */
export type SelectionChangedEvent = EventInfo<dxAutocomplete> & SelectionChangedInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxAutocomplete> & ValueChangedInfo;

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

    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownList
 * @module ui/autocomplete
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxAutocomplete extends dxDropDownList<dxAutocompleteOptions> { }

/** @public */
export type Properties = dxAutocompleteOptions;

/** @deprecated use Properties instead */
export type Options = dxAutocompleteOptions;

/** @deprecated use Properties instead */
export type IOptions = dxAutocompleteOptions;
