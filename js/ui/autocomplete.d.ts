import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

import {
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

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

export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
    /**
     * @docid
     * @default 10
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxItemCount?: number;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownList
 * @module ui/autocomplete
 * @export default
 * @prevFileNamespace DevExpress.ui
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
