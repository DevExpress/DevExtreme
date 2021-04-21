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

export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
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
     * @default "OFF"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    switchedOffText?: string;
    /**
     * @docid
     * @default "ON"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    switchedOnText?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
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
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSwitch extends Editor {
    constructor(element: UserDefinedElement, options?: dxSwitchOptions)
}

/** @public */
export type Options = dxSwitchOptions;

/** @deprecated use Options instead */
export type IOptions = dxSwitchOptions;
