import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent
} from '../events';

import {
    ValueChangedInfo
} from './editor/editor';

import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxProgressBar>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentNativeEvent<dxProgressBar> & ValueChangedInfo;
/**
 * @public
 */
export type CompleteEvent = ComponentNativeEvent<dxProgressBar>;

export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:dxProgressBar
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onComplete?: ((e: CompleteEvent) => void);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showStatus?: boolean;
    /**
     * @docid
     * @default function(ratio, value) { return "Progress: " + Math.round(ratio * 100) + "%" }
     * @type_function_param1 ratio:number
     * @type_function_param2 value:number
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    statusFormat?: string | ((ratio: number, value: number) => string);
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @inherits dxTrackBar
 * @module ui/progress_bar
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxProgressBar extends dxTrackBar {
    constructor(element: TElement, options?: dxProgressBarOptions)
}

export type Options = dxProgressBarOptions;

/** @deprecated use Options instead */
export type IOptions = dxProgressBarOptions;
