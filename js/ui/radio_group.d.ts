import {
    TElement
} from '../core/element';

import DataSource from '../data/data_source';

import {
    ComponentEvent
} from '../events';

import Editor, {
    ComponentValueChangedEvent,
    EditorOptions
} from './editor/editor';

import {
    DataExpressionMixinOptions
} from './editor/ui.data_expression';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxRadioGroup>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxRadioGroup>;

export interface dxRadioGroupOptions extends EditorOptions<dxRadioGroup>, DataExpressionMixinOptions<dxRadioGroup> {
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
     * @default 'horizontal' [for](tablets)
     * @type Enums.Orientation
     * @default "vertical"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    layout?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor, DataExpressionMixin
 * @module ui/radio_group
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxRadioGroup extends Editor {
    constructor(element: TElement, options?: dxRadioGroupOptions)
    getDataSource(): DataSource;
}

export type Options = dxRadioGroupOptions;

/** @deprecated use Options instead */
export type IOptions = dxRadioGroupOptions;
