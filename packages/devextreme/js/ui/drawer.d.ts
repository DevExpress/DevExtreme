import {
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    template,
} from '../common';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export type OpenedStateMode = 'overlap' | 'shrink' | 'push';
export type PanelLocation = 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
export type RevealMode = 'slide' | 'expand';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxDrawer>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxDrawer>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxDrawer> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
    /**
     * Specifies the duration of the drawer&apos;s opening and closing animation (in milliseconds). Applies only if animationEnabled is true.
     */
    animationDuration?: number;
    /**
     * Specifies whether to use an opening and closing animation.
     */
    animationEnabled?: boolean;
    /**
     * Specifies whether to close the drawer if a user clicks or taps the view area.
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * Specifies the drawer&apos;s width or height (depending on the drawer&apos;s position) in the opened state.
     */
    maxSize?: number;
    /**
     * Specifies the drawer&apos;s width or height (depending on the drawer&apos;s position) in the closed state.
     */
    minSize?: number;
    /**
     * Specifies whether the drawer is opened.
     */
    opened?: boolean;
    /**
     * Specifies how the drawer interacts with the view in the opened state.
     */
    openedStateMode?: OpenedStateMode;
    /**
     * Specifies the drawer&apos;s position in relation to the view.
     */
    position?: PanelLocation;
    /**
     * Specifies the drawer&apos;s reveal mode.
     */
    revealMode?: RevealMode;
    /**
     * Specifies whether to shade the view when the drawer is opened.
     */
    shading?: boolean;
    /**
     * Specifies the drawer&apos;s content.
     */
    template?: template | ((Element: DxElement) => any);
}
/**
 * The Drawer is a dismissible or permanently visible panel used for navigation in responsive web application layouts.
 */
export default class dxDrawer extends Widget<dxDrawerOptions> {
    /**
     * Gets the drawer&apos;s content.
     */
    content(): DxElement;
    /**
     * Closes the drawer.
     */
    hide(): DxPromise<void>;
    /**
     * Opens the drawer.
     */
    show(): DxPromise<void>;
    /**
     * Opens or closes the drawer, reversing the current state.
     */
    toggle(): DxPromise<void>;
}

export type Properties = dxDrawerOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxDrawerOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

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
