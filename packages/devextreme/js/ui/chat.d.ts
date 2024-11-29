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
     * @public
     */
    name?: string;
    /**
     * @docid
     * @public
     */
    avatarUrl?: string;
    /**
     * @docid
     * @public
     */
    avatarAlt?: string;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export type Alert = {
    /**
     * @docid
     * @public
     */
    id?: number | string;
    /**
     * @docid
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
     * @public
     */
    timestamp?: Date | number | string;
    /**
     * @docid
     * @public
     */
    author?: User;
    /**
     * @docid
     * @public
     */
    text?: string;
};

/** @public */
export type MessageTemplateData = {
    readonly component: dxChat;
    readonly message?: Message;
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
     * @default 'shortdate'
     * @public
     */
    dayHeaderFormat?: Format;
    /**
     * @docid
     * @default true
     * @public
     */
    reloadOnChange?: boolean;
    /**
     * @docid
     * @default []
     * @public
     */
    alerts?: Array<Alert>;
    /**
     * @docid
     * @default null
     * @type_function_return string|Element|jQuery
     * @public
     */
    messageTemplate?: template | null | ((data: MessageTemplateData, messageBubbleElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default 'shorttime'
     * @public
     */
    messageTimestampFormat?: Format;
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
    onMessageEntered?: ((e: MessageEnteredEvent) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:TypingStartEvent}
     * @action
     * @public
     */
    onTypingStart?: ((e: TypingEndEvent) => void) | undefined ;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:TypingEndEvent}
     * @action
     * @public
     */
    onTypingEnd?: ((e: TypingEndEvent) => void) | undefined;
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
