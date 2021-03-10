import {
    TElement
} from '../core/element';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

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
