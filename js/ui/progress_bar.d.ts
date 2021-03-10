import {
    TElement
} from '../core/element';

import {
    TEvent
} from '../events/index';

import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onComplete?: ((e: { component?: dxProgressBar, element?: TElement, model?: any, event?: TEvent }) => any);
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
