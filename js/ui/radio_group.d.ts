import DataSource from '../data/data_source';

import Editor, {
    EditorOptions
} from './editor/editor';

import {
    DataExpressionMixinOptions
} from './editor/ui.data_expression';

export interface dxRadioGroupOptions extends EditorOptions<dxRadioGroup>, DataExpressionMixinOptions<dxRadioGroup> {
    /**
     * @docid dxRadioGroupOptions.activeStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxRadioGroupOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxRadioGroupOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxRadioGroupOptions.layout
     * @default 'horizontal' [for](tablets)
     * @type Enums.Orientation
     * @default "vertical"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    layout?: 'horizontal' | 'vertical';
    /**
     * @docid dxRadioGroupOptions.name
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxRadioGroupOptions.value
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}
/**
 * @docid dxRadioGroup
 * @isEditor
 * @inherits Editor, DataExpressionMixin
 * @module ui/radio_group
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxRadioGroup extends Editor {
    constructor(element: Element, options?: dxRadioGroupOptions)
    constructor(element: JQuery, options?: dxRadioGroupOptions)
    getDataSource(): DataSource;
}

declare global {
interface JQuery {
    dxRadioGroup(): JQuery;
    dxRadioGroup(options: "instance"): dxRadioGroup;
    dxRadioGroup(options: string): any;
    dxRadioGroup(options: string, ...params: any[]): any;
    dxRadioGroup(options: dxRadioGroupOptions): JQuery;
}
}
export type Options = dxRadioGroupOptions;

/** @deprecated use Options instead */
export type IOptions = dxRadioGroupOptions;