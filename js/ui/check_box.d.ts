import {
    TElement
} from '../core/element';

import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: boolean | undefined;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @module ui/check_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxCheckBox extends Editor {
    constructor(element: TElement, options?: dxCheckBoxOptions)
}

declare global {
interface JQuery {
    dxCheckBox(): JQuery;
    dxCheckBox(options: "instance"): dxCheckBox;
    dxCheckBox(options: string): any;
    dxCheckBox(options: string, ...params: any[]): any;
    dxCheckBox(options: dxCheckBoxOptions): JQuery;
}
}
export type Options = dxCheckBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxCheckBoxOptions;
