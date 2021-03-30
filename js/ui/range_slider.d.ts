import {
    TElement
} from '../core/element';

import {
    ComponentValueChangedEvent
} from './editor/editor';

import {
    dxSliderBaseOptions
} from './slider';

import dxTrackBar from './track_bar';

import {
    ComponentContentReadyEvent
} from './widget/ui.widget'

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxRangeSlider>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxRangeSlider> & {
    readonly start?: number;
    readonly end?: number;
    readonly value?: Array<number>;
}

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
     * @type_function_param1_field1 component:dxRangeSlider
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @default null
     * @type_function_param1_field4 start:number
     * @type_function_param1_field5 end:number
     * @type_function_param1_field6 value:array<number>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
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
    constructor(element: TElement, options?: dxRangeSliderOptions)
}

export type Options = dxRangeSliderOptions;

/** @deprecated use Options instead */
export type IOptions = dxRangeSliderOptions;
