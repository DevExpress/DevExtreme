import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    dxSliderBaseOptions,
} from './slider';

import dxTrackBar from './track_bar';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxRangeSlider>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxRangeSlider>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxRangeSlider>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxRangeSlider> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxRangeSlider, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | UIEvent | Event> & ValueChangedInfo & {
    /**
     * 
     */
    readonly start?: number;
    /**
     * 
     */
    readonly end?: number;
    /**
     * 
     */
    readonly value?: Array<number>;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
    /**
     * The right edge of the interval currently selected using the range slider.
     */
    end?: number;
    /**
     * The value to be assigned to the name attribute of the underlying `` element.
     */
    endName?: string;
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * The left edge of the interval currently selected using the range slider.
     */
    start?: number;
    /**
     * The value to be assigned to the name attribute of the underlying `` element.
     */
    startName?: string;
    /**
     * Specifies the UI component&apos;s value.
     */
    value?: Array<number>;
}
/**
 * The RangeSlider is a UI component that allows an end user to choose a range of numeric values.
 */
export default class dxRangeSlider extends dxTrackBar<dxRangeSliderOptions> {
    /**
     * Resets the value property to the value passed as an argument.
     */
    reset(value?: Array<number>): void;
 }

export type Properties = dxRangeSliderOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxRangeSliderOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onValueChanged'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
