import {
    TElement
} from '../core/element';

import {
    dxSliderBaseOptions
} from './slider';

import dxTrackBar from './track_bar';
export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
    /**
     * @docid
     * @default 60
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    end?: number;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endName?: string;
    /**
     * @docid
     * @action
     * @extends Action
     * @type_function_param1_field4 start:number
     * @type_function_param1_field5 end:number
     * @type_function_param1_field6 value:array<number>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxRangeSlider, element?: TElement, model?: any, start?: number, end?: number, value?: Array<number> }) => any);
    /**
     * @docid
     * @default 40
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    start?: number;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startName?: string;
    /**
     * @docid
     * @default [40, 60]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Array<number>;
}
/**
 * @docid
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
