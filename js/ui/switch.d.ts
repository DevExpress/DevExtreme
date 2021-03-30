import {
    TElement
} from '../core/element';

import {
    ComponentEvent
} from '../events';

import Editor, {
    ComponentValueChangedEvent,
    EditorOptions
} from './editor/editor';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxSwitch>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxSwitch>;

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
    constructor(element: TElement, options?: dxSwitchOptions)
}

export type Options = dxSwitchOptions;

/** @deprecated use Options instead */
export type IOptions = dxSwitchOptions;
