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

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxSwitch>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxSwitch>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxSwitch>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxSwitch> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxSwitch, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | UIEvent | Event> & ValueChangedInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
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
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * Specifies the text displayed when the UI component is switched off.
     */
    switchedOffText?: string;
    /**
     * Specifies the text displayed when the UI component is switched on.
     */
    switchedOnText?: string;
    /**
     * A Boolean value specifying whether the current switch state is &apos;On&apos; or &apos;Off&apos;.
     */
    value?: boolean;
}
/**
 * The Switch is a UI component that can be in two states: &apos;On&apos; and &apos;Off&apos;.
 */
export default class dxSwitch extends Editor<dxSwitchOptions> {
    /**
     * Resets the value property to the value passed as an argument.
     */
    reset(value?: boolean): void;
}

export type Properties = dxSwitchOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxSwitchOptions;

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
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

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
/**
 * A function that is executed after the UI component&apos;s value is changed.
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
