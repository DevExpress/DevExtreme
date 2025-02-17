import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTrackBar, {
    dxTrackBarOptions,
} from './track_bar';

import {
    Format,
} from '../localization';

import {
    SliderValueChangeMode,
    TooltipShowMode,
    VerticalEdge,
} from '../common';

export {
    TooltipShowMode,
    VerticalEdge,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxSlider>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxSlider>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxSlider>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxSlider> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxSlider, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | UIEvent | Event> & ValueChangedInfo;

/**
 * @deprecated Use /common/SliderValueChangeMode instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ValueChangeMode = SliderValueChangeMode;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
    /**
     * The current slider value.
     */
    value?: number;
}
/**
 * The Slider is a UI component that allows an end user to set a numeric value on a continuous range of possible values.
 */
export default class dxSlider extends dxTrackBar<dxSliderOptions> {
    /**
     * Resets the value property to the value passed as an argument.
     */
    reset(value?: number): void;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSliderBaseOptions<TComponent> extends dxTrackBarOptions<TComponent> {
    /**
     * Specifies whether the UI component changes its visual state as a result of user interaction.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies the step by which a handle moves when a user presses Page Up or Page Down.
     */
    keyStep?: number;
    /**
     * Configures the labels displayed at the min and max values.
     */
    label?: {
      /**
       * Formats a value before it is displayed in a label.
       */
      format?: Format;
      /**
       * Specifies whether labels are over or under the scale.
       */
      position?: VerticalEdge;
      /**
       * Specifies whether slider labels are visible.
       */
      visible?: boolean;
    };
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * Specifies whether to highlight the selected range.
     */
    showRange?: boolean;
    /**
     * Specifies the step by which the UI component&apos;s value changes when a user drags a handler.
     */
    step?: number;
    /**
     * Configures a tooltip.
     */
    tooltip?: {
      /**
       * Specifies whether a tooltip is enabled.
       */
      enabled?: boolean;
      /**
       * Specifies a tooltip&apos;s display format.
       */
      format?: Format;
      /**
       * Specifies whether a tooltip is over or under the slider.
       */
      position?: VerticalEdge;
      /**
       * Specifies when the UI component shows a tooltip.
       */
      showMode?: TooltipShowMode;
    };
    /**
      * Specifies when to change the component&apos;s value.
      */
     valueChangeMode?: SliderValueChangeMode;
}

/**
                                                                   * A base class for track bar UI components.
                                                                   * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
                                                                   */
                                                                  export interface dxSliderBase { }

export type Properties = dxSliderOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxSliderOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxSliderOptions.onContentReady
 * @type_function_param1 e:{ui/slider:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxSliderOptions.onDisposing
 * @type_function_param1 e:{ui/slider:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxSliderOptions.onInitialized
 * @type_function_param1 e:{ui/slider:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxSliderOptions.onOptionChanged
 * @type_function_param1 e:{ui/slider:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxSliderOptions.onValueChanged
 * @type_function_param1 e:{ui/slider:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
