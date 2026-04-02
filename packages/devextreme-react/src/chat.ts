"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxChat, {
    Properties
} from "devextreme/ui/chat";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { Message, AttachmentDownloadClickEvent, DisposingEvent, InitializedEvent, MessageDeletedEvent, MessageDeletingEvent, MessageEditCanceledEvent, MessageEditingStartEvent, MessageEnteredEvent, MessageUpdatedEvent, MessageUpdatingEvent, TypingEndEvent, TypingStartEvent, Attachment as ChatAttachment, User as ChatUser, SendButtonBehavior, SendButtonClickEvent } from "devextreme/ui/chat";
import type { DisposingEvent as FileUploaderDisposingEvent, InitializedEvent as FileUploaderInitializedEvent, BeforeSendEvent, ContentReadyEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, OptionChangedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, ValueChangedEvent, UploadHttpMethod, FileUploadMode } from "devextreme/ui/file_uploader";
import type { DisposingEvent as SpeechToTextDisposingEvent, InitializedEvent as SpeechToTextInitializedEvent, ContentReadyEvent as SpeechToTextContentReadyEvent, OptionChangedEvent as SpeechToTextOptionChangedEvent, CustomSpeechRecognizer as SpeechToTextCustomSpeechRecognizer, EndEvent, ErrorEvent, ResultEvent, StartClickEvent, StopClickEvent, SpeechRecognitionConfig as SpeechToTextSpeechRecognitionConfig } from "devextreme/ui/speech_to_text";
import type { Format, ValidationStatus, ButtonStyle, ButtonType } from "devextreme/common";

import type UploadInfo from "devextreme/file_management/upload_info";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IChatOptionsNarrowedEvents = {
  onAttachmentDownloadClick?: ((e: AttachmentDownloadClickEvent) => void) | undefined;
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onMessageDeleted?: ((e: MessageDeletedEvent) => void) | undefined;
  onMessageDeleting?: ((e: MessageDeletingEvent) => void) | undefined;
  onMessageEditCanceled?: ((e: MessageEditCanceledEvent) => void) | undefined;
  onMessageEditingStart?: ((e: MessageEditingStartEvent) => void) | undefined;
  onMessageEntered?: ((e: MessageEnteredEvent) => void) | undefined;
  onMessageUpdated?: ((e: MessageUpdatedEvent) => void) | undefined;
  onMessageUpdating?: ((e: MessageUpdatingEvent) => void) | undefined;
  onTypingEnd?: ((e: TypingEndEvent) => void) | undefined;
  onTypingStart?: ((e: TypingStartEvent) => void) | undefined;
}

type IChatOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IChatOptionsNarrowedEvents> & IHtmlOptions & {
  emptyViewRender?: (...params: any) => React.ReactNode;
  emptyViewComponent?: React.ComponentType<any>;
  messageRender?: (...params: any) => React.ReactNode;
  messageComponent?: React.ComponentType<any>;
  defaultItems?: Array<Message>;
  onItemsChange?: (value: Array<Message>) => void;
}>

interface ChatRef {
  instance: () => dxChat;
}

const Chat = memo(
  forwardRef(
    (props: React.PropsWithChildren<IChatOptions>, ref: ForwardedRef<ChatRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), []);

      const subscribableOptions = useMemo(() => (["items"]), []);
      const independentEvents = useMemo(() => (["onAttachmentDownloadClick","onDisposing","onInitialized","onMessageDeleted","onMessageDeleting","onMessageEditCanceled","onMessageEditingStart","onMessageEntered","onMessageUpdated","onMessageUpdating","onTypingEnd","onTypingStart"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
      }), []);

      const expectedChildren = useMemo(() => ({
        alert: { optionName: "alerts", isCollectionItem: true },
        dayHeaderFormat: { optionName: "dayHeaderFormat", isCollectionItem: false },
        editing: { optionName: "editing", isCollectionItem: false },
        fileUploaderOptions: { optionName: "fileUploaderOptions", isCollectionItem: false },
        item: { optionName: "items", isCollectionItem: true },
        messageTimestampFormat: { optionName: "messageTimestampFormat", isCollectionItem: false },
        sendButtonOptions: { optionName: "sendButtonOptions", isCollectionItem: false },
        speechToTextOptions: { optionName: "speechToTextOptions", isCollectionItem: false },
        typingUser: { optionName: "typingUsers", isCollectionItem: true },
        user: { optionName: "user", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "emptyViewTemplate",
          render: "emptyViewRender",
          component: "emptyViewComponent"
        },
        {
          tmplOption: "messageTemplate",
          render: "messageRender",
          component: "messageComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IChatOptions>>, {
          WidgetClass: dxChat,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IChatOptions> & { ref?: Ref<ChatRef> }) => ReactElement | null;


// owners:
// Chat
type IAlertProps = React.PropsWithChildren<{
  id?: number | string;
  message?: string;
}>
const _componentAlert = (props: IAlertProps) => {
  return React.createElement(NestedOption<IAlertProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "alerts",
      IsCollectionItem: true,
    },
  });
};

const Alert = Object.assign<typeof _componentAlert, NestedComponentMeta>(_componentAlert, {
  componentType: "option",
});

// owners:
// Item
type IAttachmentProps = React.PropsWithChildren<{
  name?: string;
  size?: number;
}>
const _componentAttachment = (props: IAttachmentProps) => {
  return React.createElement(NestedOption<IAttachmentProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "attachments",
      IsCollectionItem: true,
    },
  });
};

const Attachment = Object.assign<typeof _componentAttachment, NestedComponentMeta>(_componentAttachment, {
  componentType: "option",
});

// owners:
// Item
type IAuthorProps = React.PropsWithChildren<{
  avatarAlt?: string;
  avatarUrl?: string;
  id?: number | string;
  name?: string;
}>
const _componentAuthor = (props: IAuthorProps) => {
  return React.createElement(NestedOption<IAuthorProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "author",
    },
  });
};

const Author = Object.assign<typeof _componentAuthor, NestedComponentMeta>(_componentAuthor, {
  componentType: "option",
});

// owners:
// SpeechToTextOptions
type ICustomSpeechRecognizerProps = React.PropsWithChildren<{
  enabled?: boolean;
  isListening?: boolean;
}>
const _componentCustomSpeechRecognizer = (props: ICustomSpeechRecognizerProps) => {
  return React.createElement(NestedOption<ICustomSpeechRecognizerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "customSpeechRecognizer",
    },
  });
};

const CustomSpeechRecognizer = Object.assign<typeof _componentCustomSpeechRecognizer, NestedComponentMeta>(_componentCustomSpeechRecognizer, {
  componentType: "option",
});

// owners:
// Chat
type IDayHeaderFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: Format | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentDayHeaderFormat = (props: IDayHeaderFormatProps) => {
  return React.createElement(NestedOption<IDayHeaderFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dayHeaderFormat",
    },
  });
};

const DayHeaderFormat = Object.assign<typeof _componentDayHeaderFormat, NestedComponentMeta>(_componentDayHeaderFormat, {
  componentType: "option",
});

// owners:
// Chat
type IEditingProps = React.PropsWithChildren<{
  allowDeleting?: boolean | ((options: { component: dxChat, message: Message }) => boolean);
  allowUpdating?: boolean | ((options: { component: dxChat, message: Message }) => boolean);
}>
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editing",
    },
  });
};

const Editing = Object.assign<typeof _componentEditing, NestedComponentMeta>(_componentEditing, {
  componentType: "option",
});

// owners:
// Chat
type IFileUploaderOptionsProps = React.PropsWithChildren<{
  abortUpload?: ((file: any, uploadInfo?: UploadInfo) => any);
  accept?: string;
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  allowCanceling?: boolean;
  allowedFileExtensions?: Array<string>;
  chunkSize?: number;
  dialogTrigger?: any | string | undefined;
  disabled?: boolean;
  dropZone?: any | string | undefined;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  inputAttr?: any;
  invalidFileExtensionMessage?: string;
  invalidMaxFileSizeMessage?: string;
  invalidMinFileSizeMessage?: string;
  isDirty?: boolean;
  isValid?: boolean;
  labelText?: string;
  maxFileSize?: number;
  minFileSize?: number;
  multiple?: boolean;
  name?: string;
  onBeforeSend?: ((e: BeforeSendEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: FileUploaderDisposingEvent) => void);
  onDropZoneEnter?: ((e: DropZoneEnterEvent) => void);
  onDropZoneLeave?: ((e: DropZoneLeaveEvent) => void);
  onFilesUploaded?: ((e: FilesUploadedEvent) => void);
  onInitialized?: ((e: FileUploaderInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onProgress?: ((e: ProgressEvent) => void);
  onUploadAborted?: ((e: UploadAbortedEvent) => void);
  onUploaded?: ((e: UploadedEvent) => void);
  onUploadError?: ((e: UploadErrorEvent) => void);
  onUploadStarted?: ((e: UploadStartedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
  progress?: number;
  readOnly?: boolean;
  readyToUploadMessage?: string;
  rtlEnabled?: boolean;
  selectButtonText?: string;
  showFileList?: boolean;
  tabIndex?: number;
  uploadAbortedMessage?: string;
  uploadButtonText?: string;
  uploadChunk?: ((file: any, uploadInfo: UploadInfo) => any);
  uploadCustomData?: any;
  uploadedMessage?: string;
  uploadFailedMessage?: string;
  uploadFile?: ((file: any, progressCallback: (() => void)) => any);
  uploadHeaders?: any;
  uploadMethod?: UploadHttpMethod;
  uploadMode?: FileUploadMode;
  uploadUrl?: string;
  validationError?: any;
  validationErrors?: Array<any>;
  validationStatus?: ValidationStatus;
  value?: Array<any>;
  visible?: boolean;
  width?: number | string | undefined;
  defaultValue?: Array<any>;
  onValueChange?: (value: Array<any>) => void;
}>
const _componentFileUploaderOptions = (props: IFileUploaderOptionsProps) => {
  return React.createElement(NestedOption<IFileUploaderOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "fileUploaderOptions",
      DefaultsProps: {
        defaultValue: "value"
      },
    },
  });
};

const FileUploaderOptions = Object.assign<typeof _componentFileUploaderOptions, NestedComponentMeta>(_componentFileUploaderOptions, {
  componentType: "option",
});

// owners:
// Chat
type IItemProps = React.PropsWithChildren<{
  alt?: string;
  attachments?: Array<ChatAttachment>;
  author?: ChatUser;
  id?: number | string;
  isDeleted?: boolean;
  isEdited?: boolean;
  src?: string;
  text?: string;
  timestamp?: Date | number | string;
  type?: string | undefined;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        attachment: { optionName: "attachments", isCollectionItem: true },
        author: { optionName: "author", isCollectionItem: false }
      },
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// Chat
type IMessageTimestampFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: Format | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentMessageTimestampFormat = (props: IMessageTimestampFormatProps) => {
  return React.createElement(NestedOption<IMessageTimestampFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "messageTimestampFormat",
    },
  });
};

const MessageTimestampFormat = Object.assign<typeof _componentMessageTimestampFormat, NestedComponentMeta>(_componentMessageTimestampFormat, {
  componentType: "option",
});

// owners:
// Chat
type ISendButtonOptionsProps = React.PropsWithChildren<{
  behavior?: SendButtonBehavior;
  icon?: string;
  onClick?: ((e: SendButtonClickEvent) => void);
}>
const _componentSendButtonOptions = (props: ISendButtonOptionsProps) => {
  return React.createElement(NestedOption<ISendButtonOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "sendButtonOptions",
    },
  });
};

const SendButtonOptions = Object.assign<typeof _componentSendButtonOptions, NestedComponentMeta>(_componentSendButtonOptions, {
  componentType: "option",
});

// owners:
// SpeechToTextOptions
type ISpeechRecognitionConfigProps = React.PropsWithChildren<{
  continuous?: boolean;
  grammars?: Array<string>;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}>
const _componentSpeechRecognitionConfig = (props: ISpeechRecognitionConfigProps) => {
  return React.createElement(NestedOption<ISpeechRecognitionConfigProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "speechRecognitionConfig",
    },
  });
};

const SpeechRecognitionConfig = Object.assign<typeof _componentSpeechRecognitionConfig, NestedComponentMeta>(_componentSpeechRecognitionConfig, {
  componentType: "option",
});

// owners:
// Chat
type ISpeechToTextOptionsProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  customSpeechRecognizer?: SpeechToTextCustomSpeechRecognizer;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  onContentReady?: ((e: SpeechToTextContentReadyEvent) => void);
  onDisposing?: ((e: SpeechToTextDisposingEvent) => void);
  onEnd?: ((e: EndEvent) => void) | undefined;
  onError?: ((e: ErrorEvent) => void) | undefined;
  onInitialized?: ((e: SpeechToTextInitializedEvent) => void);
  onOptionChanged?: ((e: SpeechToTextOptionChangedEvent) => void);
  onResult?: ((e: ResultEvent) => void) | undefined;
  onStartClick?: ((e: StartClickEvent) => void) | undefined;
  onStopClick?: ((e: StopClickEvent) => void) | undefined;
  rtlEnabled?: boolean;
  speechRecognitionConfig?: Record<string, any> | SpeechToTextSpeechRecognitionConfig;
  startIcon?: string;
  startText?: string;
  stopIcon?: string;
  stopText?: string;
  stylingMode?: ButtonStyle;
  tabIndex?: number;
  type?: ButtonType | string;
  visible?: boolean;
  width?: number | string | undefined;
}>
const _componentSpeechToTextOptions = (props: ISpeechToTextOptionsProps) => {
  return React.createElement(NestedOption<ISpeechToTextOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "speechToTextOptions",
      ExpectedChildren: {
        customSpeechRecognizer: { optionName: "customSpeechRecognizer", isCollectionItem: false },
        speechRecognitionConfig: { optionName: "speechRecognitionConfig", isCollectionItem: false }
      },
    },
  });
};

const SpeechToTextOptions = Object.assign<typeof _componentSpeechToTextOptions, NestedComponentMeta>(_componentSpeechToTextOptions, {
  componentType: "option",
});

// owners:
// Chat
type ITypingUserProps = React.PropsWithChildren<{
  avatarAlt?: string;
  avatarUrl?: string;
  id?: number | string;
  name?: string;
}>
const _componentTypingUser = (props: ITypingUserProps) => {
  return React.createElement(NestedOption<ITypingUserProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "typingUsers",
      IsCollectionItem: true,
    },
  });
};

const TypingUser = Object.assign<typeof _componentTypingUser, NestedComponentMeta>(_componentTypingUser, {
  componentType: "option",
});

// owners:
// Chat
type IUserProps = React.PropsWithChildren<{
  avatarAlt?: string;
  avatarUrl?: string;
  id?: number | string;
  name?: string;
}>
const _componentUser = (props: IUserProps) => {
  return React.createElement(NestedOption<IUserProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "user",
    },
  });
};

const User = Object.assign<typeof _componentUser, NestedComponentMeta>(_componentUser, {
  componentType: "option",
});

export default Chat;
export {
  Chat,
  IChatOptions,
  ChatRef,
  Alert,
  IAlertProps,
  Attachment,
  IAttachmentProps,
  Author,
  IAuthorProps,
  CustomSpeechRecognizer,
  ICustomSpeechRecognizerProps,
  DayHeaderFormat,
  IDayHeaderFormatProps,
  Editing,
  IEditingProps,
  FileUploaderOptions,
  IFileUploaderOptionsProps,
  Item,
  IItemProps,
  MessageTimestampFormat,
  IMessageTimestampFormatProps,
  SendButtonOptions,
  ISendButtonOptionsProps,
  SpeechRecognitionConfig,
  ISpeechRecognitionConfigProps,
  SpeechToTextOptions,
  ISpeechToTextOptionsProps,
  TypingUser,
  ITypingUserProps,
  User,
  IUserProps
};
import type * as ChatTypes from 'devextreme/ui/chat_types';
export { ChatTypes };

