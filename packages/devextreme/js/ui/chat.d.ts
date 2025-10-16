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

import {
    Properties as FileUploaderOptions,
} from './file_uploader';

import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    AsyncCancelable,
    InteractionEvent,
} from '../events';

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
export type MessageEnteredEvent = NativeEventInfo<dxChat, InteractionEvent> & {
    /** @docid _ui_chat_MessageEnteredEvent.message */
    readonly message: Message;
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
    readonly user: User;
};

/**
 * @docid _ui_chat_MessageDeletingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo
 */
export type MessageDeletingEvent = AsyncCancelable & EventInfo<dxChat> & {
  /** @docid _ui_chat_MessageDeletingEvent.message */
  readonly message: Message;
};

/**
 * @docid _ui_chat_MessageDeletedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MessageDeletedEvent = EventInfo<dxChat> & {
  /** @docid _ui_chat_MessageDeletedEvent.message */
  readonly message: Message;
};

/**
 * @docid _ui_chat_MessageEditingStartEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo
 */
export type MessageEditingStartEvent = AsyncCancelable & EventInfo<dxChat> & {
  /** @docid _ui_chat_MessageEditingStartEvent.message */
  readonly message: Message;
};

/**
 * @docid _ui_chat_MessageEditCanceledEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MessageEditCanceledEvent = EventInfo<dxChat> & {
  /** @docid _ui_chat_MessageEditCanceledEvent.message */
  readonly message: Message;
};

/**
 * @docid _ui_chat_MessageUpdatingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo
 */
export type MessageUpdatingEvent = AsyncCancelable & EventInfo<dxChat> & {
  /** @docid _ui_chat_MessageUpdatingEvent.message */
  readonly message: Message;
  /** @docid _ui_chat_MessageUpdatingEvent.text */
  readonly text: string;
};

/**
 * @docid _ui_chat_MessageUpdatedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MessageUpdatedEvent = EventInfo<dxChat> & {
  /** @docid _ui_chat_MessageUpdatedEvent.message */
  readonly message: Message;
  /** @docid _ui_chat_MessageUpdatedEvent.text */
  readonly text: string;
};

/**
 * @docid _ui_chat_AttachmentDownloadEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type AttachmentDownloadEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat> & {
  /**
   * @docid _ui_chat_AttachmentDownloadEvent.attachment
   * @type Attachment
   */
  readonly attachment?: TAttachment;
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
export type Attachment = {
    /**
     * @docid
     * @public
     */
    name: string;
    /**
     * @docid
     * @public
     */
    size: number;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @type object
 * @hidden
 */
export type MessageBase = {
    /**
     * @docid
     * @public
     */
    id?: number | string;
    /**
     * @docid
     * @default undefined
     * @type string|undefined
     * @public
     */
    type?: 'text' | 'image' | undefined;
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
    isDeleted?: boolean;

    [key: string]: any;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxChat
 * @inherits MessageBase
 */
export type TextMessage<TAttachment extends Attachment = Attachment> = MessageBase & {
    /**
     * @docid
     * @public
     * @type Array<Attachment>
     */
    attachments?: TAttachment[];
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @public
     */
    isEdited?: boolean;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxChat
 * @inherits MessageBase
 */
export type ImageMessage = MessageBase & {
    /**
     * @docid
     * @public
     */
    src?: string;
    /**
     * @docid
     * @public
     */
    alt?: string;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxChat
 * @public
 * @inherits TextMessage,ImageMessage
 */
export type Message = TextMessage | ImageMessage;

/** @public */
export type MessageTemplateData = {
    readonly component: dxChat;
    readonly message?: Message;
};

/** @public */
export type EmptyViewTemplateData = {
    readonly component: dxChat;
    readonly texts: {
        readonly message: string;
        readonly prompt: string;
    };
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
     * @default null
     * @type dxFileUploaderOptions
     * @public
     */
    fileUploaderOptions?: Omit<FileUploaderOptions, 'dialogTrigger' | 'showFileList' | 'uploadMode '>;
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
     * @public
     */
    editing?: {
      /**
       * @docid
       * @default false
       * @public
       */
      allowUpdating?: boolean | ((options: { component?: dxChat; message?: Message }) => boolean);
      /**
       * @docid
       * @default false
       * @public
       */
      allowDeleting?: boolean | ((options: { component?: dxChat; message?: Message }) => boolean);
    };
    /**
     * @docid
     * @default null
     * @type_function_return string|Element|jQuery
     * @public
     */
    emptyViewTemplate?: template | null | ((data: EmptyViewTemplateData, itemElement: DxElement) => string | UserDefinedElement);
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
     * @type_function_param1 e:{ui/chat:AttachmentDownloadEvent}
     * @action
     * @public
     */
    onAttachmentDownload?: ((e: AttachmentDownloadEvent) => void) | undefined;
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
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageDeletingEvent}
     * @action
     * @public
     */
    onMessageDeleting?: ((e: MessageDeletingEvent) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageDeletedEvent}
     * @action
     * @public
     */
    onMessageDeleted?: ((e: MessageDeletedEvent) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageEditingStartEvent}
     * @action
     * @public
     */
    onMessageEditingStart?: ((e: MessageEditingStartEvent) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageEditCanceledEvent}
     * @action
     * @public
     */
    onMessageEditCanceled?: ((e: MessageEditCanceledEvent) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageUpdatingEvent}
     * @action
     * @public
     */
    onMessageUpdating?: ((e: MessageUpdatingEvent) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageUpdatedEvent}
     * @action
     * @public
     */
    onMessageUpdated?: ((e: MessageUpdatedEvent) => void) | undefined;
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

/// #DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut' >;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onMessageEntered'
  | 'onTypingStart' | 'onTypingEnd' | 'onMessageDeleting' | 'onMessageDeleted'
  | 'onMessageEditingStart' | 'onMessageEditCanceled' | 'onMessageUpdating' | 'onMessageUpdated' | 'onAttachmentDownload'>;

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
/// #ENDDEBUG
