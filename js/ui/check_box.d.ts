import {
    UserDefinedElement
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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @hidden false
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default ""
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCheckBox extends Editor {
    constructor(element: UserDefinedElement, options?: dxCheckBoxOptions)
}

/** @public */
export type Properties = dxCheckBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxCheckBoxOptions;

/** @deprecated use Properties instead */
export type IOptions = dxCheckBoxOptions;
