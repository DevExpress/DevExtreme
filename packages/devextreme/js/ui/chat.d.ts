import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';
import DataSource, { DataSourceLike } from '../data/data_source';

/**
 * @docid _ui_chat_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxChat>;

/**
 * @docid _ui_chat_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxChat>;

/**
 * @docid _ui_chat_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxChat> & ChangedOptionInfo;

/**
 * @docid _ui_chat_MessageEnteredEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type MessageEnteredEvent = NativeEventInfo<dxChat, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
    /** @docid _ui_chat_MessageEnteredEvent.message */
    readonly message?: Message;
};

/**
 * @docid _ui_chat_TypingStartEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type TypingStartEvent = NativeEventInfo<dxChat, UIEvent & { target: HTMLInputElement }> & {
    /** @docid _ui_chat_TypingStartEvent.user */
    readonly user?: User;
};

/**
 * @docid _ui_chat_TypingEndEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type TypingEndEvent = EventInfo<dxChat> & {
    /** @docid _ui_chat_TypingEndEvent.user */
    readonly user?: User;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export type User = {
    /**
     * @docid
     * @public
     */
    id?: number | string;
    /**
     * @docid
     * @default ''
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default ''
     * @public
     */
    avatarUrl?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    avatarAlt?: string;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export type ChatError = {
    /**
     * @docid
     * @public
     */
    id?: number | string;
    /**
     * @docid
     * @default ''
     * @public
     */
    message?: string;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export type Message = {
    /**
     * @docid
     * @public
     */
    id?: number | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    timestamp?: Date | number | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    author?: User;
    /**
     * @docid
     * @default ''
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    typing?: boolean;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxChatOptions extends WidgetOptions<dxChat> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default { id: new Guid().toString() }
     * @public
     */
    user?: User;
    /**
     * @docid
     * @fires dxChatOptions.onOptionChanged
     * @public
     */
    items?: Array<Message>;
    /**
     * @docid
     * @type string | Array<Message> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<Message> | null;
    /**
     * @docid
     * @default true
     * @public
     */
    reloadOnChange?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    errors?: Array<ChatError>;
    /**
     * @docid
     * @default []
     * @public
     */
    typingUsers?: Array<User>;
    /**
     * @docid
     * @default true
     * @public
     */
    showDayHeaders?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showUserName?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showAvatar?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showMessageTimestamp?: boolean;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageEnteredEvent}
     * @action
     * @public
     */
    onMessageEntered?: ((e: MessageEnteredEvent) => void);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:TypingStartEvent}
     * @action
     * @public
     */
    onTypingStart?: ((e: TypingEndEvent) => void);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:TypingEndEvent}
     * @action
     * @public
     */
    onTypingEnd?: ((e: TypingEndEvent) => void);
}

/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @namespace DevExpress.ui
 * @public
 */
export default class dxChat extends Widget<Properties> {
    /**
     * @docid
     * @publicName renderMessage(message)
     * @public
     */
    renderMessage(message: Message): void;

    getDataSource(): DataSource<Message>;
}

/** @public */
export type ExplicitTypes = {
    Properties: Properties;
    DisposingEvent: DisposingEvent;
    InitializedEvent: InitializedEvent;
    OptionChangedEvent: OptionChangedEvent;
};

/** @public */
export type Properties = dxChatOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut' >;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onMessageEntered' | 'onTypingStart' | 'onTypingEnd'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxChatOptions.onDisposing
 * @type_function_param1 e:{ui/chat:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxChatOptions.onInitialized
 * @type_function_param1 e:{ui/chat:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxChatOptions.onOptionChanged
 * @type_function_param1 e:{ui/chat:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
