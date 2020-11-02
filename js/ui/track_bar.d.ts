import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
    /**
     * @docid
     * @type number
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: number;
    /**
     * @docid
     * @type number
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
 */
export default class dxTrackBar extends Editor {
    constructor(element: Element, options?: dxTrackBarOptions)
    constructor(element: JQuery, options?: dxTrackBarOptions)
}
