import {
    TElement
} from '../core/element';

import Editor, {
    EditorOptions,
    ContentReadyEvent,
    ValueChangedEvent
} from './editor/editor';

export {
    ContentReadyEvent,
    ValueChangedEvent
}
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
 */
export default class dxTrackBar extends Editor {
    constructor(element: TElement, options?: dxTrackBarOptions)
}
