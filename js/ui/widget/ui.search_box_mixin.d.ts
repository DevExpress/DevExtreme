import {
    dxTextBoxOptions
} from '../text_box';

export interface SearchBoxMixinOptions<T = SearchBoxMixin> {
    /**
     * @docid
     * @type dxTextBoxOptions
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchEditorOptions?: dxTextBoxOptions;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @type Enums.CollectionSearchMode
     * @default 'contains'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchMode?: 'contains' | 'startswith' | 'equals';
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @type String
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchValue?: string;
}
/**
 * @docid
 * @module ui/widget/ui.search_box_mixin
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class SearchBoxMixin {
    constructor(options?: SearchBoxMixinOptions)
}
