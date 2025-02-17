import { DataSource } from '../common/data';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import Editor, {
    ValueChangedInfo,
    EditorOptions,
} from './editor/editor';

import {
    DataExpressionMixinOptions,
} from './editor/ui.data_expression';

import {
    Orientation,
} from '../common';

export {
    Orientation,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxRadioGroup>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxRadioGroup>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxRadioGroup>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxRadioGroup> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxRadioGroup, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxRadioGroupOptions extends EditorOptions<dxRadioGroup>, DataExpressionMixinOptions<dxRadioGroup> {
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
     * Specifies the radio group layout.
     */
    layout?: Orientation;
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * Specifies the UI component&apos;s value.
     */
    value?: any;
}
/**
 * The RadioGroup is a UI component that contains a set of radio buttons and allows an end user to make a single selection from the set.
 */
export default class dxRadioGroup extends Editor<dxRadioGroupOptions> {
    getDataSource(): DataSource;
}

export type Properties = dxRadioGroupOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxRadioGroupOptions;

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
 * @docid dxRadioGroupOptions.onContentReady
 * @type_function_param1 e:{ui/radio_group:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxRadioGroupOptions.onDisposing
 * @type_function_param1 e:{ui/radio_group:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxRadioGroupOptions.onInitialized
 * @type_function_param1 e:{ui/radio_group:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxRadioGroupOptions.onOptionChanged
 * @type_function_param1 e:{ui/radio_group:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxRadioGroupOptions.onValueChanged
 * @type_function_param1 e:{ui/radio_group:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
