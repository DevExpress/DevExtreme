import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

/**
 * @docid _ui_chat_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxChat>;

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
 * @docid _ui_chat_MessageSendEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo,Message
 */
export type MessageSendEvent = Cancelable & NativeEventInfo<dxChat, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & Message;

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
}

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export interface Message {
    timestamp: string;
    author: User;
    text: string;
    typing?: boolean;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxChatOptions extends WidgetOptions<dxChat> {
    /**
     * @docid
     * @fires dxChatOptions.onOptionChanged
     * @public
     */
    items?: Array<Message>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/chat:MessageSendEvent}
     * @action
     * @public
     */
    onMessageSend?: ((e: MessageSendEvent) => void);
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxChat extends Widget<dxChatOptions> { }

/** @public */
export type ExplicitTypes = {
    Properties: Properties;
    ContentReadyEvent: ContentReadyEvent;
    DisposingEvent: DisposingEvent;
    InitializedEvent: InitializedEvent;
    OptionChangedEvent: OptionChangedEvent;
};

/** @public */
export type Properties = dxChatOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' >;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onMessageSend'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxChatOptions.onContentReady
 * @type_function_param1 e:{ui/chat:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
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
