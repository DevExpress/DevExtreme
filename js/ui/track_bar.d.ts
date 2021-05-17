import {
    UserDefinedElement
} from '../core/element';

import Editor, {
    EditorOptions
} from './editor/editor';

/** @namespace DevExpress.ui */
export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
    /**
     * @docid
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: number;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: number;
}
/**
 * @docid
 * @inherits Editor
 * @hidden
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 */
export default class dxTrackBar extends Editor {
    constructor(element: UserDefinedElement, options?: dxTrackBarOptions)
}
