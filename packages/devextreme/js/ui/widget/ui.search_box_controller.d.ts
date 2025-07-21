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
export interface SearchBoxControllerOptions {
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
    searchTimeout?: number | undefined;
    /**
     * @docid
     * @default ""
     * @public
     */
    searchValue?: string;
}
