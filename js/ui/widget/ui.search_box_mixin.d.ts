import {
    Properties as TextBoxProperties
} from '../text_box';

export interface SearchBoxMixinOptions {
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type dxTextBoxOptions
     */
    searchEditorOptions?: TextBoxProperties;
    /**
     * @docid
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
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
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
