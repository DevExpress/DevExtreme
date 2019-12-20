import {
    dxElement
} from '../core/element';

import {
    dxSliderBaseOptions
} from './slider';

import dxTrackBar from './track_bar';
export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
    /**
     * @docid dxRangeSliderOptions.end
     * @type number
     * @default 60
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    end?: number;
    /**
     * @docid dxRangeSliderOptions.endName
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endName?: string;
    /**
     * @docid dxRangeSliderOptions.onValueChanged
     * @action
     * @extends Action
     * @type_function_param1_field4 start:number
     * @type_function_param1_field5 end:number
     * @type_function_param1_field6 value:array<number>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxRangeSlider, element?: dxElement, model?: any, start?: number, end?: number, value?: Array<number> }) => any);
    /**
     * @docid dxRangeSliderOptions.start
     * @type number
     * @default 40
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    start?: number;
    /**
     * @docid dxRangeSliderOptions.startName
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startName?: string;
    /**
     * @docid dxRangeSliderOptions.value
     * @type Array<number>
     * @default [40, 60]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Array<number>;
}
/**
 * @docid dxRangeSlider
 * @isEditor
 * @inherits dxSliderBase
 * @module ui/range_slider
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxRangeSlider extends dxTrackBar {
    constructor(element: Element, options?: dxRangeSliderOptions)
    constructor(element: JQuery, options?: dxRangeSliderOptions)
}

declare global {
interface JQuery {
    dxRangeSlider(): JQuery;
    dxRangeSlider(options: "instance"): dxRangeSlider;
    dxRangeSlider(options: string): any;
    dxRangeSlider(options: string, ...params: any[]): any;
    dxRangeSlider(options: dxRangeSliderOptions): JQuery;
}
}
export type Options = dxRangeSliderOptions;

/** @deprecated use Options instead */
export type IOptions = dxRangeSliderOptions;