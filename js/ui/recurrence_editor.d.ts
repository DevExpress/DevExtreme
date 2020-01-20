import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxRecurrenceEditorOptions extends EditorOptions<dxRecurrenceEditor> {
    /**
     * @docid dxRecurrenceEditorOptions.value
     * @type string
     * @default null
     * @fires dxRecurrenceEditorOptions.onValueChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string;
}
/**
 * @docid dxRecurrenceEditor
 * @isEditor
 * @inherits Editor
 * @module ui/recurrence_editor
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxRecurrenceEditor extends Editor {
    constructor(element: Element, options?: dxRecurrenceEditorOptions)
    constructor(element: JQuery, options?: dxRecurrenceEditorOptions)
}

declare global {
interface JQuery {
    dxRecurrenceEditor(): JQuery;
    dxRecurrenceEditor(options: "instance"): dxRecurrenceEditor;
    dxRecurrenceEditor(options: string): any;
    dxRecurrenceEditor(options: string, ...params: any[]): any;
    dxRecurrenceEditor(options: dxRecurrenceEditorOptions): JQuery;
}
}
export type Options = dxRecurrenceEditorOptions;

/** @deprecated use Options instead */
export type IOptions = dxRecurrenceEditorOptions;