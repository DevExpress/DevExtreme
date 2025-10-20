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
export type DisposingEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat<TAttachment>>;

/**
 * @docid _ui_chat_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TAttachment extends Attachment = Attachment> = InitializedEventInfo<dxChat<TAttachment>>;

/**
 * @docid _ui_chat_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat<TAttachment>> & ChangedOptionInfo;

/**
 * @docid _ui_chat_MessageEnteredEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type MessageEnteredEvent<TAttachment extends Attachment = Attachment> = NativeEventInfo<dxChat<TAttachment>, InteractionEvent> & {
    /** @docid _ui_chat_MessageEnteredEvent.message */
    readonly message: Message<TAttachment>;
};

/**
 * @docid _ui_chat_TypingStartEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type TypingStartEvent<TAttachment extends Attachment = Attachment> = NativeEventInfo<dxChat<TAttachment>, UIEvent & { target: HTMLInputElement }> & {
    /** @docid _ui_chat_TypingStartEvent.user */
    readonly user?: User;
};

/**
 * @docid _ui_chat_TypingEndEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type TypingEndEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat<TAttachment>> & {
    /** @docid _ui_chat_TypingEndEvent.user */
    readonly user: User;
};

/**
 * @docid _ui_chat_MessageDeletingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo
 */
export type MessageDeletingEvent<TAttachment extends Attachment = Attachment> = AsyncCancelable & EventInfo<dxChat<TAttachment>> & {
  /** @docid _ui_chat_MessageDeletingEvent.message */
  readonly message: Message<TAttachment>;
};

/**
 * @docid _ui_chat_MessageDeletedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MessageDeletedEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat<TAttachment>> & {
  /** @docid _ui_chat_MessageDeletedEvent.message */
  readonly message: Message<TAttachment>;
};

/**
 * @docid _ui_chat_MessageEditingStartEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo
 */
export type MessageEditingStartEvent<TAttachment extends Attachment = Attachment> = AsyncCancelable & EventInfo<dxChat<TAttachment>> & {
  /** @docid _ui_chat_MessageEditingStartEvent.message */
  readonly message: Message<TAttachment>;
};

/**
 * @docid _ui_chat_MessageEditCanceledEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MessageEditCanceledEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat<TAttachment>> & {
  /** @docid _ui_chat_MessageEditCanceledEvent.message */
  readonly message: Message<TAttachment>;
};

/**
 * @docid _ui_chat_MessageUpdatingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo
 */
export type MessageUpdatingEvent<TAttachment extends Attachment = Attachment> = AsyncCancelable & EventInfo<dxChat<TAttachment>> & {
  /** @docid _ui_chat_MessageUpdatingEvent.message */
  readonly message: Message<TAttachment>;
  /** @docid _ui_chat_MessageUpdatingEvent.text */
  readonly text: string;
};

/**
 * @docid _ui_chat_MessageUpdatedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type MessageUpdatedEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat<TAttachment>> & {
  /** @docid _ui_chat_MessageUpdatedEvent.message */
  readonly message: Message<TAttachment>;
  /** @docid _ui_chat_MessageUpdatedEvent.text */
  readonly text: string;
};

/**
 * @docid _ui_chat_AttachmentDownloadEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type AttachmentDownloadEvent<TAttachment extends Attachment = Attachment> = EventInfo<dxChat<TAttachment>> & {
  /** @docid _ui_chat_AttachmentDownloadEvent.attachment */
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
export type Message<TAttachment extends Attachment = Attachment> = TextMessage<TAttachment> | ImageMessage;

/** @public */
export type MessageTemplateData<TAttachment extends Attachment = Attachment> = {
    readonly component: dxChat<TAttachment>;
    readonly message?: Message<TAttachment>;
};

/** @public */
export type EmptyViewTemplateData<TAttachment extends Attachment = Attachment> = {
    readonly component: dxChat<TAttachment>;
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
export interface dxChatOptions<TAttachment extends Attachment = Attachment> extends WidgetOptions<dxChat<TAttachment>> {
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
    fileUploaderOptions?: Omit<FileUploaderOptions, 'dialogTrigger' | 'showFileList' | 'uploadMode'>;
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
    items?: Array<Message<TAttachment>>;
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
      allowUpdating?: boolean | ((options: { component?: dxChat<TAttachment>; message?: Message<TAttachment> }) => boolean);
      /**
       * @docid
       * @default false
       * @public
       */
      allowDeleting?: boolean | ((options: { component?: dxChat<TAttachment>; message?: Message<TAttachment> }) => boolean);
    };
    /**
     * @docid
     * @default null
     * @type_function_return string|Element|jQuery
     * @public
     */
    emptyViewTemplate?: template | null | ((data: EmptyViewTemplateData<TAttachment>, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @type string | Array<Message> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<Message<TAttachment>> | null;
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
    messageTemplate?: template | null | ((data: MessageTemplateData<TAttachment>, messageBubbleElement: DxElement) => string | UserDefinedElement);
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
    onAttachmentDownload?: ((e: AttachmentDownloadEvent<TAttachment>) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageEnteredEvent}
     * @action
     * @public
     */
    onMessageEntered?: ((e: MessageEnteredEvent<TAttachment>) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:TypingStartEvent}
     * @action
     * @public
     */
    onTypingStart?: ((e: TypingStartEvent) => void) | undefined ;
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
    onMessageDeleting?: ((e: MessageDeletingEvent<TAttachment>) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageDeletedEvent}
     * @action
     * @public
     */
    onMessageDeleted?: ((e: MessageDeletedEvent<TAttachment>) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageEditingStartEvent}
     * @action
     * @public
     */
    onMessageEditingStart?: ((e: MessageEditingStartEvent<TAttachment>) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageEditCanceledEvent}
     * @action
     * @public
     */
    onMessageEditCanceled?: ((e: MessageEditCanceledEvent<TAttachment>) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageUpdatingEvent}
     * @action
     * @public
     */
    onMessageUpdating?: ((e: MessageUpdatingEvent<TAttachment>) => void) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:{ui/chat:MessageUpdatedEvent}
     * @action
     * @public
     */
    onMessageUpdated?: ((e: MessageUpdatedEvent<TAttachment>) => void) | undefined;
}

/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @namespace DevExpress.ui
 * @public
 */
export default class dxChat<TAttachment extends Attachment = Attachment> extends Widget<Properties<TAttachment>> {
    /**
     * @docid
     * @publicName renderMessage(message)
     * @public
     */
    renderMessage(message: Message<TAttachment>): void;

    getDataSource(): DataSource<Message<TAttachment>>;
}

/** @public */
export type ExplicitTypes<TAttachment extends Attachment = Attachment> = {
    Properties: Properties<TAttachment>;
    DisposingEvent: DisposingEvent<TAttachment>;
    InitializedEvent: InitializedEvent<TAttachment>;
    OptionChangedEvent: OptionChangedEvent<TAttachment>;
};

/** @public */
export type Properties<TAttachment extends Attachment = Attachment> = dxChatOptions<TAttachment>;

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
