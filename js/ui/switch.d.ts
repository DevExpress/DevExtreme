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
    ValueChangedInfo,
    EditorOptions
} from './editor/editor';

/** @public */
export type ContentReadyEvent = EventInfo<dxSwitch>;

/** @public */
export type DisposingEvent = EventInfo<dxSwitch>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSwitch>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSwitch> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxSwitch> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
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
     * @default "OFF"
     * @public
     */
    switchedOffText?: string;
    /**
     * @docid
     * @default "ON"
     * @public
     */
    switchedOnText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    value?: boolean;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @module ui/switch
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSwitch extends Editor {
    constructor(element: UserDefinedElement, options?: dxSwitchOptions)
}

/** @public */
export type Properties = dxSwitchOptions;

/** @deprecated use Properties instead */
export type Options = dxSwitchOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSwitchOptions;
