import {
    ElementIntake
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Editor, {
    EditorOptions,
    ValueChangedInfo
} from './editor/editor';

/** @public */
export type ContentReadyEvent = EventInfo<dxCheckBox>;

/** @public */
export type DisposingEvent = EventInfo<dxCheckBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxCheckBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxCheckBox> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxCheckBox> & ValueChangedInfo;

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
    constructor(element: ElementIntake, options?: dxCheckBoxOptions)
}

/** @public */
export type Options = dxCheckBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxCheckBoxOptions;
