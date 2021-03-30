import {
    TElement
} from '../core/element';

import {
    ComponentItemClickEvent,
    ComponentSelectionChangedEvent,
    
} from './collection/ui.collection_widget.base';

import {
    ComponentClosedEvent,
    ComponentOpenedEvent
} from './drop_down_editor/ui.drop_down_editor';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

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

import {
    ComponentValueChangedEvent
} from './editor/editor';

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxAutocomplete>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxAutocomplete>;
/**
 * @public
 */
export type ItemClickEvent = ComponentItemClickEvent<dxAutocomplete>;
/**
 * @public
 */
export type SelectionChangedEvent = ComponentSelectionChangedEvent<dxAutocomplete>;
/**
 * @public
 */
export type ClosedEvent = ComponentClosedEvent<dxAutocomplete>;
/**
 * @public
 */
export type OpenedEvent = ComponentOpenedEvent<dxAutocomplete>;
/**
 * @public
 */
export type ChangeEvent = ComponentChangeEvent<dxAutocomplete>;
/**
 * @public
 */
export type CopyEvent = ComponentCopyEvent<dxAutocomplete>;
/**
 * @public
 */
export type CutEvent = ComponentCutEvent<dxAutocomplete>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentEnterKeyEvent<dxAutocomplete>;
/**
 * @public
 */
export type FocusInEvent = ComponentFocusInEvent<dxAutocomplete>;
/**
 * @public
 */
export type FocusOutEvent = ComponentFocusOutEvent<dxAutocomplete>;
/**
 * @public
 */
export type InputEvent = ComponentInputEvent<dxAutocomplete>;
/**
 * @public
 */
export type KeyDownEvent = ComponentKeyDownEvent<dxAutocomplete>;
/**
 * @public
 */
export type KeyPressEvent = ComponentKeyPressEvent<dxAutocomplete>;
/**
 * @public
 */
export type KeyUpEvent = ComponentKeyUpEvent<dxAutocomplete>;
/**
 * @public
 */
export type PasteEvent = ComponentPasteEvent<dxAutocomplete>;

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
