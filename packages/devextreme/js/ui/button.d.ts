import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    ButtonType,
    ButtonStyle,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export {
    ButtonType,
    ButtonStyle,
};

/**
 * The type of the click event handler&apos;s argument.
 */
export type ClickEvent = NativeEventInfo<dxButton, KeyboardEvent | MouseEvent | PointerEvent> & {
    /**
     * 
     */
    validationGroup?: any;
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxButton>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxButton>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxButton>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxButton> & ChangedOptionInfo;

export type TemplateData = {
    readonly text?: string;
    readonly icon?: string;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxButtonOptions extends WidgetOptions<dxButton> {
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
     * Specifies the icon to be displayed on the button.
     */
    icon?: string;
    /**
     * A function that is executed when the Button is clicked or tapped.
     */
    onClick?: ((e: ClickEvent) => void);
    /**
     * Specifies how the button is styled.
     */
    stylingMode?: ButtonStyle;
    /**
     * Specifies a custom template for the Button UI component.
     */
    template?: template | ((data: TemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * The text displayed on the button.
     */
    text?: string;
    /**
     * Specifies the button type.
     */
    type?: ButtonType | string;
    /**
     * Specifies whether the button submits an HTML form.
     */
    useSubmitBehavior?: boolean;
    /**
     * Specifies the name of the validation group to be accessed in the click event handler.
     */
    validationGroup?: string | undefined;
}
/**
 * The Button UI component is a simple button that performs specified commands when a user clicks it.
 */
export default class dxButton extends Widget<dxButtonOptions> { }

export type Properties = dxButtonOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxButtonOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onClick'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxButtonOptions.onContentReady
 * @type_function_param1 e:{ui/button:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxButtonOptions.onDisposing
 * @type_function_param1 e:{ui/button:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxButtonOptions.onInitialized
 * @type_function_param1 e:{ui/button:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxButtonOptions.onOptionChanged
 * @type_function_param1 e:{ui/button:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
