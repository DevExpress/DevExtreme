import { Format } from '../../localization';
import DOMComponent, {
    DOMComponentOptions,
} from '../../core/dom_component';

import {
    EventInfo,
} from '../../common/core/events';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface WidgetOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * Specifies the shortcut key that sets focus on the UI component.
     */
    accessKey?: string | undefined;
    /**
     * Specifies whether the UI component changes its visual state as a result of user interaction.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies whether the UI component responds to user interaction.
     */
    disabled?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies text for a hint that appears when a user pauses on the UI component.
     */
    hint?: string | undefined;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * A function that is executed when the UI component is rendered and each time the component is repainted.
     */
    onContentReady?: ((e: EventInfo<TComponent>) => void);
    /**
     * Specifies the number of the element when the Tab key is used for navigating.
     */
    tabIndex?: number;
    /**
     * Specifies whether the UI component is visible.
     */
    visible?: boolean;
}
/**
 * The base class for UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class Widget<TProperties> extends DOMComponent<TProperties> {
    /**
     * Sets focus on the UI component.
     */
    focus(): void;
    /**
     * Registers a handler to be executed when a user presses a specific key.
     */
    registerKeyHandler(key: string, handler: Function): void;
    /**
     * Renders the component again without reloading data. Use the method to update the component&apos;s markup and appearance dynamically.
     */
    repaint(): void;
}

/**
                                                                                                                                                      * Specifies markup for a UI component item.
                                                                                                                                                      */
                                                                                                                                                     export var dxItem: any;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type format = Format;
