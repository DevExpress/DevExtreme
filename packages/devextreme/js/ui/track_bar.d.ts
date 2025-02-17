import Editor, {
    EditorOptions,
} from './editor/editor';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTrackBarOptions<TComponent> extends EditorOptions<TComponent> {
    /**
     * The maximum value the UI component can accept.
     */
    max?: number;
    /**
     * The minimum value the UI component can accept.
     */
    min?: number;
}
/**
 * A base class for track bar UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxTrackBar<TProperties> extends Editor<TProperties> { }
