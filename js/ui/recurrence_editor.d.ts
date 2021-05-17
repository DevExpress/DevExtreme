import {
    UserDefinedElement
} from '../core/element';

import Editor, {
    EditorOptions
} from './editor/editor';

/** @namespace DevExpress.ui */
export interface dxRecurrenceEditorOptions extends EditorOptions<dxRecurrenceEditor> {
    /**
     * @docid
     * @default null
     * @fires dxRecurrenceEditorOptions.onValueChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @module ui/recurrence_editor
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxRecurrenceEditor extends Editor {
    constructor(element: UserDefinedElement, options?: dxRecurrenceEditorOptions)
}

export type Options = dxRecurrenceEditorOptions;
export type IOptions = dxRecurrenceEditorOptions;
