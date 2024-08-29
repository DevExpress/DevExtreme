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
 * @docid _ui_chat_MessageSendEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type MessageSendEvent = NativeEventInfo<dxChat, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * @docid
     */
    readonly message?: Message;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export type User = {
    /**
     * @docid
     * @default string
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
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 */
export type Message = {
    /**
     * @docid
     * @default ''
     * @public
     */
    timestamp?: string;
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
     * @type string | Array<Message> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<Message> | null;
    /**
     * @docid
     * @default { id: new Guid().toString() }
     * @public
     */
    user?: User;
    /**
     * @docid
     * @default ''
     * @public
     */
    title?: string;
    /**
     * @docid
     * @type Array<Message>
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

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onMessageSend'>;

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
