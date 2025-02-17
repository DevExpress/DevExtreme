import {
    DxElement,
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/**
 * The type of the click event handler&apos;s argument.
 */
export type ClickEvent = NativeEventInfo<dxSpeedDialAction, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    actionElement?: DxElement;
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxSpeedDialAction> & {
    /**
     * 
     */
    actionElement?: DxElement;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxSpeedDialAction>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxSpeedDialAction>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxSpeedDialAction> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
    /**
     * Specifies the icon the FAB or speed dial action button displays.
     */
    icon?: string;
    /**
     * Allows you to reorder action buttons in the speed dial menu.
     */
    index?: number;
    /**
     * Specifies the text label displayed inside the FAB or near the speed dial action button.
     */
    label?: string;
    /**
     * A function that is executed when the FAB or speed dial action button is clicked or tapped.
     */
    onClick?: ((e: ClickEvent) => void);
    /**
     * A function that is executed when the UI component is rendered and each time the component is repainted.
     */
    onContentReady?: ((e: ContentReadyEvent) => void);
    /**
     * Allows you to hide the FAB from the view or the action from the speed dial menu.
     */
    visible?: boolean;
}
/**
 * The SpeedDialAction is a button that performs a custom action. It can be represented by a Floating Action Button (FAB) or a button in a speed dial menu opened with the FAB.
 */
export default class dxSpeedDialAction extends Widget<dxSpeedDialActionOptions> { }

export type Properties = dxSpeedDialActionOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxSpeedDialActionOptions;

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
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onClick' | 'onContentReady'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
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
