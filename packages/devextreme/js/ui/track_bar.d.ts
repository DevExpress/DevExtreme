import Editor, {
    EditorOptions,
    EditorValuableObject,
} from './editor/editor';

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
export interface dxTrackBarOptions<TComponent> extends EditorOptions<TComponent> {
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
 * @options dxTrackBarOptions
 */
export default class dxTrackBar<
    TProperties extends EditorValuableObject,
> extends Editor<TProperties> { }
