import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxTrackBarOptions<TComponent> extends EditorOptions<TComponent> {
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
 */
export default class dxTrackBar<TProperties> extends Editor<TProperties> { }
