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
     * @public
     */
    max?: number;
    /**
     * @docid
     * @default 0
     * @public
     */
    min?: number;
}
/**
 * @docid
 * @inherits Editor
 * @hidden
 * @namespace DevExpress.ui
 */
export default class dxTrackBar extends Editor {
    constructor(element: UserDefinedElement, options?: dxTrackBarOptions)
}
