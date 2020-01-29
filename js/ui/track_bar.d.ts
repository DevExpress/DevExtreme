import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
    /**
     * @docid dxTrackBarOptions.max
     * @type number
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: number;
    /**
     * @docid dxTrackBarOptions.min
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: number;
}
/**
 * @docid dxTrackBar
 * @inherits Editor
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxTrackBar extends Editor {
    constructor(element: Element, options?: dxTrackBarOptions)
    constructor(element: JQuery, options?: dxTrackBarOptions)
}
