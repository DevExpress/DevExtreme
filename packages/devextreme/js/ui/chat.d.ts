import {
    Format,
} from '../common/core/localization';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';
import DataSource, { DataSourceLike } from '../data/data_source';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxChat>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxChat>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxChat> & ChangedOptionInfo;

/**
 * The type of the messageEntered event handler&apos;s argument.
 */
export type MessageEnteredEvent = NativeEventInfo<dxChat, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * The message that was entered into the chat.
     */
    readonly message?: Message;
};

/**
 * The type of the typingStart event handler&apos;s argument.
 */
export type TypingStartEvent = NativeEventInfo<dxChat, UIEvent & { target: HTMLInputElement }> & {
    /**
     * The user who started typing.
     */
    readonly user?: User;
};

/**
 * The type of the typingEnd event handler&apos;s argument.
 */
export type TypingEndEvent = EventInfo<dxChat> & {
    /**
     * The user who stopped typing.
     */
    readonly user?: User;
};

/**
 * A configuration object for a user.
 */
export type User = {
    /**
     * User&apos;s identification number or string.
     */
    id?: number | string;
    /**
     * A user&apos;s name displayed in the chat.
     */
    name?: string;
    /**
     * An avatar URL.
     */
    avatarUrl?: string;
    /**
     * `alt` attribute for avatar image.
     */
    avatarAlt?: string;
};

/**
 * A configuration object for an alert.
 */
export type Alert = {
    /**
     * Alert&apos;s identification number or string.
     */
    id?: number | string;
    /**
     * The alert&apos;s message.
     */
    message?: string;
};

/**
 * A configuration object for a message.
 */
export type Message = {
    /**
     * Message&apos;s identification number or string.
     */
    id?: number | string;
    /**
     * A timestamp of when the message was sent.
     */
    timestamp?: Date | number | string;
    /**
     * A user who is the author of the message.
     */
    author?: User;
    /**
     * The message text.
     */
    text?: string;
};

export type MessageTemplateData = {
    readonly component: dxChat;
    readonly message?: Message;
};

/**
 * 
 * @deprecated 
 */
export interface dxChatOptions extends WidgetOptions<dxChat> {
    /**
     * Specifies whether the UI component changes its visual state as a result of user interaction.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies whether the Chat&apos;s input element can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies the current chat user (messages displayed on the right side).
     */
    user?: User;
    /**
     * Specifies an array of chat messages.
     */
    items?: Array<Message>;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<Message> | null;
    /**
     * Specifies the day header format.
     */
    dayHeaderFormat?: Format;
    /**
     * Specifies whether the Chat UI component displays newly entered messages immediately. This property only applies if dataSource is used.
     */
    reloadOnChange?: boolean;
    /**
     * A list of available alerts.
     */
    alerts?: Array<Alert>;
    /**
     * Specifies a custom template for a chat message.
     */
    messageTemplate?: template | null | ((data: MessageTemplateData, messageBubbleElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the message timestamp format.
     */
    messageTimestampFormat?: Format;
    /**
     * An array of users who are currently typing.
     */
    typingUsers?: Array<User>;
    /**
     * Specifies whether to show day headers.
     */
    showDayHeaders?: boolean;
    /**
     * Specifies whether to show user names.
     */
    showUserName?: boolean;
    /**
     * Specifies whether to show avatars.
     */
    showAvatar?: boolean;
    /**
     * Specifies whether to show message time stamps.
     */
    showMessageTimestamp?: boolean;
    /**
     * A function that is executed after a message is entered into the chat.
     */
    onMessageEntered?: ((e: MessageEnteredEvent) => void) | undefined;
    /**
     * A function that is called after a user starts typing.
     */
    onTypingStart?: ((e: TypingEndEvent) => void) | undefined ;
    /**
     * A function that is called 2 seconds after a user stops typing or after a message is entered.
     */
    onTypingEnd?: ((e: TypingEndEvent) => void) | undefined;
}

/**
 * The Chat UI component is an interactive interface that allows users to send and receive messages in real time.
 */
export default class dxChat extends Widget<Properties> {
    /**
     * Renders a new message.
     */
    renderMessage(message: Message): void;

    getDataSource(): DataSource<Message>;
}

export type ExplicitTypes = {
    Properties: Properties;
    DisposingEvent: DisposingEvent;
    InitializedEvent: InitializedEvent;
    OptionChangedEvent: OptionChangedEvent;
};

export type Properties = dxChatOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut' >;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onMessageEntered' | 'onTypingStart' | 'onTypingEnd'>;

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
