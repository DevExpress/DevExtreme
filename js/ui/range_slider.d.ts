import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    dxSliderBaseOptions,
} from './slider';

import dxTrackBar from './track_bar';

export {
    ValueChangeMode,
} from './slider';

/** @public */
export type ContentReadyEvent = EventInfo<dxRangeSlider>;

/** @public */
export type DisposingEvent = EventInfo<dxRangeSlider>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxRangeSlider>;

/** @public */
export type OptionChangedEvent = EventInfo<dxRangeSlider> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxRangeSlider, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | UIEvent | Event> & ValueChangedInfo & {
    readonly start?: number;
    readonly end?: number;
    readonly value?: Array<number>;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
    /**
     * @docid
     * @default 60
     * @public
     */
    end?: number;
    /**
     * @docid
     * @default ""
     * @public
     */
    endName?: string;
    /**
     * @docid
     * @type_function_param1_field component:dxRangeSlider
     * @action
     * @default null
     * @type_function_param1_field value:array<number>
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @default 40
     * @public
     */
    start?: number;
    /**
     * @docid
     * @default ""
     * @public
     */
    startName?: string;
    /**
     * @docid
     * @default [40, 60]
     * @public
     */
    value?: Array<number>;
}
/**
 * @docid
 * @isEditor
 * @inherits dxSliderBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxRangeSlider extends dxTrackBar<dxRangeSliderOptions> { }

/** @public */
export type Properties = dxRangeSliderOptions;

/** @deprecated use Properties instead */
export type Options = dxRangeSliderOptions;
