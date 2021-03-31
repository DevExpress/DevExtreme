import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ItemEvent
} from '../events';

import {
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

import {
    ComponentValueChangedEvent
} from './editor/editor';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxAutocomplete>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxAutocomplete>;
/**
 * @public
 */
export type ItemClickEvent = ComponentNativeEvent<dxAutocomplete> & ItemEvent;
/**
 * @public
 */
export type SelectionChangedEvent = ComponentEvent<dxAutocomplete> & SelectionChangedInfo;
/**
 * @public
 */
export type ClosedEvent = ComponentEvent<dxAutocomplete>;
/**
 * @public
 */
export type OpenedEvent = ComponentEvent<dxAutocomplete>;
/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxAutocomplete>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxAutocomplete>;

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
    constructor(element: TElement, options?: dxAutocompleteOptions)
}

export type Options = dxAutocompleteOptions;

/** @deprecated use Options instead */
export type IOptions = dxAutocompleteOptions;
