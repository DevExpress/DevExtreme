import {
    JQueryEventObject
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events';

import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
    /**
     * @docid dxProgressBarOptions.onComplete
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onComplete?: ((e: { component?: dxProgressBar, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
    /**
     * @docid dxProgressBarOptions.showStatus
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showStatus?: boolean;
    /**
     * @docid dxProgressBarOptions.statusFormat
     * @type string|function
     * @default function(ratio, value) { return "Progress: " + Math.round(ratio * 100) + "%" }
     * @type_function_param1 ratio:number
     * @type_function_param2 value:number
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    statusFormat?: string | ((ratio: number, value: number) => string);
    /**
     * @docid dxProgressBarOptions.value
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: number;
}
/**
 * @docid dxProgressBar
 * @inherits dxTrackBar
 * @module ui/progress_bar
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxProgressBar extends dxTrackBar {
    constructor(element: Element, options?: dxProgressBarOptions)
    constructor(element: JQuery, options?: dxProgressBarOptions)
}

declare global {
interface JQuery {
    dxProgressBar(): JQuery;
    dxProgressBar(options: "instance"): dxProgressBar;
    dxProgressBar(options: string): any;
    dxProgressBar(options: string, ...params: any[]): any;
    dxProgressBar(options: dxProgressBarOptions): JQuery;
}
}
export type Options = dxProgressBarOptions;

/** @deprecated use Options instead */
export type IOptions = dxProgressBarOptions;