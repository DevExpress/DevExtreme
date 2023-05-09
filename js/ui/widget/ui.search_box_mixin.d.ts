import {
    Properties as TextBoxProperties,
} from '../text_box';

import {
    SearchMode,
} from '../../common';

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
export interface SearchBoxMixinOptions {
    /**
     * @docid
     * @default {}
     * @public
     * @type dxTextBoxOptions
     */
    searchEditorOptions?: TextBoxProperties;
    /**
     * @docid
     * @default false
     * @public
     */
    searchEnabled?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @default null
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @default 'contains'
     * @public
     */
    searchMode?: SearchMode;
    /**
     * @docid
     * @default undefined
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @default ""
     * @public
     */
    searchValue?: string;
}
/**
 * @docid
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class SearchBoxMixin {
    constructor(options?: SearchBoxMixinOptions);
}
