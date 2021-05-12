import {
    UserDefinedElement
} from '../core/element';

import DataSource from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Editor, {
    ValueChangedInfo,
    EditorOptions
} from './editor/editor';

import {
    DataExpressionMixinOptions
} from './editor/ui.data_expression';

/** @public */
export type ContentReadyEvent = EventInfo<dxRadioGroup>;

/** @public */
export type DisposingEvent = EventInfo<dxRadioGroup>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxRadioGroup>;

/** @public */
export type OptionChangedEvent = EventInfo<dxRadioGroup> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxRadioGroup> & ValueChangedInfo;

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
    constructor(element: UserDefinedElement, options?: dxRadioGroupOptions)
    getDataSource(): DataSource;
}

/** @public */
export type Properties = dxRadioGroupOptions;

/** @deprecated use Properties instead */
export type Options = dxRadioGroupOptions;

/** @deprecated use Properties instead */
export type IOptions = dxRadioGroupOptions;
