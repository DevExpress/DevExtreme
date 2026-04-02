import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Chat, { Properties } from "devextreme/ui/chat";
import  DataSource from "devextreme/data/data_source";
import  dxChat from "devextreme/ui/chat";
import  UploadInfo from "devextreme/file_management/upload_info";
import {
 Alert,
 Message,
 AttachmentDownloadClickEvent,
 DisposingEvent,
 InitializedEvent,
 InputFieldTextChangedEvent,
 MessageDeletedEvent,
 MessageDeletingEvent,
 MessageEditCanceledEvent,
 MessageEditingStartEvent,
 MessageEnteredEvent,
 MessageUpdatedEvent,
 MessageUpdatingEvent,
 OptionChangedEvent,
 TypingEndEvent,
 TypingStartEvent,
 SendButtonProperties,
 User,
 Attachment,
 SendButtonAction,
 SendButtonClickEvent,
} from "devextreme/ui/chat";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 Format,
} from "devextreme/common/core/localization";
import {
 Format as CommonFormat,
 ValidationStatus,
 ButtonStyle,
 ButtonType,
} from "devextreme/common";
import {
 dxFileUploaderOptions,
 BeforeSendEvent,
 ContentReadyEvent,
 DisposingEvent as FileUploaderDisposingEvent,
 DropZoneEnterEvent,
 DropZoneLeaveEvent,
 FilesUploadedEvent,
 InitializedEvent as FileUploaderInitializedEvent,
 OptionChangedEvent as FileUploaderOptionChangedEvent,
 ProgressEvent,
 UploadAbortedEvent,
 UploadedEvent,
 UploadErrorEvent,
 UploadStartedEvent,
 ValueChangedEvent,
 UploadHttpMethod,
 FileUploadMode,
} from "devextreme/ui/file_uploader";
import {
 dxSpeechToTextOptions,
 CustomSpeechRecognizer,
 ContentReadyEvent as SpeechToTextContentReadyEvent,
 DisposingEvent as SpeechToTextDisposingEvent,
 EndEvent,
 ErrorEvent,
 InitializedEvent as SpeechToTextInitializedEvent,
 OptionChangedEvent as SpeechToTextOptionChangedEvent,
 ResultEvent,
 StartClickEvent,
 StopClickEvent,
 SpeechRecognitionConfig,
} from "devextreme/ui/speech_to_text";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "alerts" |
  "dataSource" |
  "dayHeaderFormat" |
  "disabled" |
  "editing" |
  "elementAttr" |
  "emptyViewTemplate" |
  "fileUploaderOptions" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "inputFieldText" |
  "items" |
  "messageTemplate" |
  "messageTimestampFormat" |
  "onAttachmentDownloadClick" |
  "onDisposing" |
  "onInitialized" |
  "onInputFieldTextChanged" |
  "onMessageDeleted" |
  "onMessageDeleting" |
  "onMessageEditCanceled" |
  "onMessageEditingStart" |
  "onMessageEntered" |
  "onMessageUpdated" |
  "onMessageUpdating" |
  "onOptionChanged" |
  "onTypingEnd" |
  "onTypingStart" |
  "reloadOnChange" |
  "rtlEnabled" |
  "sendButtonOptions" |
  "showAvatar" |
  "showDayHeaders" |
  "showMessageTimestamp" |
  "showUserName" |
  "speechToTextEnabled" |
  "speechToTextOptions" |
  "typingUsers" |
  "user" |
  "visible" |
  "width"
>;

interface DxChat extends AccessibleOptions {
  readonly instance?: Chat;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    alerts: Array as PropType<Array<Alert>>,
    dataSource: [Array, Object, String] as PropType<Array<Message> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    dayHeaderFormat: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    disabled: Boolean,
    editing: Object as PropType<Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    emptyViewTemplate: {},
    fileUploaderOptions: Object as PropType<dxFileUploaderOptions | Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    inputFieldText: String,
    items: Array as PropType<Array<Message>>,
    messageTemplate: {},
    messageTimestampFormat: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    onAttachmentDownloadClick: Function as PropType<((e: AttachmentDownloadClickEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onInputFieldTextChanged: Function as PropType<((e: InputFieldTextChangedEvent) => void)>,
    onMessageDeleted: Function as PropType<((e: MessageDeletedEvent) => void)>,
    onMessageDeleting: Function as PropType<((e: MessageDeletingEvent) => void)>,
    onMessageEditCanceled: Function as PropType<((e: MessageEditCanceledEvent) => void)>,
    onMessageEditingStart: Function as PropType<((e: MessageEditingStartEvent) => void)>,
    onMessageEntered: Function as PropType<((e: MessageEnteredEvent) => void)>,
    onMessageUpdated: Function as PropType<((e: MessageUpdatedEvent) => void)>,
    onMessageUpdating: Function as PropType<((e: MessageUpdatingEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onTypingEnd: Function as PropType<((e: TypingEndEvent) => void)>,
    onTypingStart: Function as PropType<((e: TypingStartEvent) => void)>,
    reloadOnChange: Boolean,
    rtlEnabled: Boolean,
    sendButtonOptions: Object as PropType<SendButtonProperties | Record<string, any>>,
    showAvatar: Boolean,
    showDayHeaders: Boolean,
    showMessageTimestamp: Boolean,
    showUserName: Boolean,
    speechToTextEnabled: Boolean,
    speechToTextOptions: Object as PropType<dxSpeechToTextOptions | Record<string, any>>,
    typingUsers: Array as PropType<Array<User>>,
    user: Object as PropType<User | Record<string, any>>,
    visible: Boolean,
    width: [Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:alerts": null,
    "update:dataSource": null,
    "update:dayHeaderFormat": null,
    "update:disabled": null,
    "update:editing": null,
    "update:elementAttr": null,
    "update:emptyViewTemplate": null,
    "update:fileUploaderOptions": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputFieldText": null,
    "update:items": null,
    "update:messageTemplate": null,
    "update:messageTimestampFormat": null,
    "update:onAttachmentDownloadClick": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onInputFieldTextChanged": null,
    "update:onMessageDeleted": null,
    "update:onMessageDeleting": null,
    "update:onMessageEditCanceled": null,
    "update:onMessageEditingStart": null,
    "update:onMessageEntered": null,
    "update:onMessageUpdated": null,
    "update:onMessageUpdating": null,
    "update:onOptionChanged": null,
    "update:onTypingEnd": null,
    "update:onTypingStart": null,
    "update:reloadOnChange": null,
    "update:rtlEnabled": null,
    "update:sendButtonOptions": null,
    "update:showAvatar": null,
    "update:showDayHeaders": null,
    "update:showMessageTimestamp": null,
    "update:showUserName": null,
    "update:speechToTextEnabled": null,
    "update:speechToTextOptions": null,
    "update:typingUsers": null,
    "update:user": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Chat {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Chat;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      alert: { isCollectionItem: true, optionName: "alerts" },
      dayHeaderFormat: { isCollectionItem: false, optionName: "dayHeaderFormat" },
      editing: { isCollectionItem: false, optionName: "editing" },
      fileUploaderOptions: { isCollectionItem: false, optionName: "fileUploaderOptions" },
      item: { isCollectionItem: true, optionName: "items" },
      messageTimestampFormat: { isCollectionItem: false, optionName: "messageTimestampFormat" },
      sendButtonOptions: { isCollectionItem: false, optionName: "sendButtonOptions" },
      speechToTextOptions: { isCollectionItem: false, optionName: "speechToTextOptions" },
      typingUser: { isCollectionItem: true, optionName: "typingUsers" },
      user: { isCollectionItem: false, optionName: "user" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxChat = defineComponent(componentConfig);


const DxAlertConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:id": null,
    "update:message": null,
  },
  props: {
    id: [Number, String],
    message: String
  }
};

prepareConfigurationComponentConfig(DxAlertConfig);

const DxAlert = defineComponent(DxAlertConfig);

(DxAlert as any).$_optionName = "alerts";
(DxAlert as any).$_isCollectionItem = true;

const DxAttachmentConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:name": null,
    "update:size": null,
  },
  props: {
    name: String,
    size: Number
  }
};

prepareConfigurationComponentConfig(DxAttachmentConfig);

const DxAttachment = defineComponent(DxAttachmentConfig);

(DxAttachment as any).$_optionName = "attachments";
(DxAttachment as any).$_isCollectionItem = true;

const DxAuthorConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:avatarAlt": null,
    "update:avatarUrl": null,
    "update:id": null,
    "update:name": null,
  },
  props: {
    avatarAlt: String,
    avatarUrl: String,
    id: [Number, String],
    name: String
  }
};

prepareConfigurationComponentConfig(DxAuthorConfig);

const DxAuthor = defineComponent(DxAuthorConfig);

(DxAuthor as any).$_optionName = "author";

const DxCustomSpeechRecognizerConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:isListening": null,
  },
  props: {
    enabled: Boolean,
    isListening: Boolean
  }
};

prepareConfigurationComponentConfig(DxCustomSpeechRecognizerConfig);

const DxCustomSpeechRecognizer = defineComponent(DxCustomSpeechRecognizerConfig);

(DxCustomSpeechRecognizer as any).$_optionName = "customSpeechRecognizer";

const DxDayHeaderFormatConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<CommonFormat | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxDayHeaderFormatConfig);

const DxDayHeaderFormat = defineComponent(DxDayHeaderFormatConfig);

(DxDayHeaderFormat as any).$_optionName = "dayHeaderFormat";

const DxEditingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDeleting": null,
    "update:allowUpdating": null,
  },
  props: {
    allowDeleting: [Boolean, Function] as PropType<boolean | (((options: { component: dxChat, message: Message }) => boolean))>,
    allowUpdating: [Boolean, Function] as PropType<boolean | (((options: { component: dxChat, message: Message }) => boolean))>
  }
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";

const DxFileUploaderOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:abortUpload": null,
    "update:accept": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowCanceling": null,
    "update:allowedFileExtensions": null,
    "update:chunkSize": null,
    "update:dialogTrigger": null,
    "update:disabled": null,
    "update:dropZone": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:invalidFileExtensionMessage": null,
    "update:invalidMaxFileSizeMessage": null,
    "update:invalidMinFileSizeMessage": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:labelText": null,
    "update:maxFileSize": null,
    "update:minFileSize": null,
    "update:multiple": null,
    "update:name": null,
    "update:onBeforeSend": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onDropZoneEnter": null,
    "update:onDropZoneLeave": null,
    "update:onFilesUploaded": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onProgress": null,
    "update:onUploadAborted": null,
    "update:onUploaded": null,
    "update:onUploadError": null,
    "update:onUploadStarted": null,
    "update:onValueChanged": null,
    "update:progress": null,
    "update:readOnly": null,
    "update:readyToUploadMessage": null,
    "update:rtlEnabled": null,
    "update:selectButtonText": null,
    "update:showFileList": null,
    "update:tabIndex": null,
    "update:uploadAbortedMessage": null,
    "update:uploadButtonText": null,
    "update:uploadChunk": null,
    "update:uploadCustomData": null,
    "update:uploadedMessage": null,
    "update:uploadFailedMessage": null,
    "update:uploadFile": null,
    "update:uploadHeaders": null,
    "update:uploadMethod": null,
    "update:uploadMode": null,
    "update:uploadUrl": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    abortUpload: Function as PropType<((file: any, uploadInfo?: UploadInfo) => any)>,
    accept: String,
    accessKey: String,
    activeStateEnabled: Boolean,
    allowCanceling: Boolean,
    allowedFileExtensions: Array as PropType<Array<string>>,
    chunkSize: Number,
    dialogTrigger: {},
    disabled: Boolean,
    dropZone: {},
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    invalidFileExtensionMessage: String,
    invalidMaxFileSizeMessage: String,
    invalidMinFileSizeMessage: String,
    isDirty: Boolean,
    isValid: Boolean,
    labelText: String,
    maxFileSize: Number,
    minFileSize: Number,
    multiple: Boolean,
    name: String,
    onBeforeSend: Function as PropType<((e: BeforeSendEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: FileUploaderDisposingEvent) => void)>,
    onDropZoneEnter: Function as PropType<((e: DropZoneEnterEvent) => void)>,
    onDropZoneLeave: Function as PropType<((e: DropZoneLeaveEvent) => void)>,
    onFilesUploaded: Function as PropType<((e: FilesUploadedEvent) => void)>,
    onInitialized: Function as PropType<((e: FileUploaderInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: FileUploaderOptionChangedEvent) => void)>,
    onProgress: Function as PropType<((e: ProgressEvent) => void)>,
    onUploadAborted: Function as PropType<((e: UploadAbortedEvent) => void)>,
    onUploaded: Function as PropType<((e: UploadedEvent) => void)>,
    onUploadError: Function as PropType<((e: UploadErrorEvent) => void)>,
    onUploadStarted: Function as PropType<((e: UploadStartedEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    progress: Number,
    readOnly: Boolean,
    readyToUploadMessage: String,
    rtlEnabled: Boolean,
    selectButtonText: String,
    showFileList: Boolean,
    tabIndex: Number,
    uploadAbortedMessage: String,
    uploadButtonText: String,
    uploadChunk: Function as PropType<((file: any, uploadInfo: UploadInfo) => any)>,
    uploadCustomData: {},
    uploadedMessage: String,
    uploadFailedMessage: String,
    uploadFile: Function as PropType<((file: any, progressCallback: (() => void)) => any)>,
    uploadHeaders: {},
    uploadMethod: String as PropType<UploadHttpMethod>,
    uploadMode: String as PropType<FileUploadMode>,
    uploadUrl: String,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationStatus: String as PropType<ValidationStatus>,
    value: Array as PropType<Array<any>>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxFileUploaderOptionsConfig);

const DxFileUploaderOptions = defineComponent(DxFileUploaderOptionsConfig);

(DxFileUploaderOptions as any).$_optionName = "fileUploaderOptions";

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alt": null,
    "update:attachments": null,
    "update:author": null,
    "update:id": null,
    "update:isDeleted": null,
    "update:isEdited": null,
    "update:src": null,
    "update:text": null,
    "update:timestamp": null,
    "update:type": null,
  },
  props: {
    alt: String,
    attachments: Array as PropType<Array<Attachment>>,
    author: Object as PropType<User | Record<string, any>>,
    id: [Number, String],
    isDeleted: Boolean,
    isEdited: Boolean,
    src: String,
    text: String,
    timestamp: [Date, Number, String],
    type: String
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
(DxItem as any).$_expectedChildren = {
  attachment: { isCollectionItem: true, optionName: "attachments" },
  author: { isCollectionItem: false, optionName: "author" }
};

const DxMessageTimestampFormatConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<CommonFormat | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxMessageTimestampFormatConfig);

const DxMessageTimestampFormat = defineComponent(DxMessageTimestampFormatConfig);

(DxMessageTimestampFormat as any).$_optionName = "messageTimestampFormat";

const DxSendButtonOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:action": null,
    "update:icon": null,
    "update:onClick": null,
  },
  props: {
    action: String as PropType<SendButtonAction>,
    icon: String,
    onClick: Function as PropType<((e: SendButtonClickEvent) => void)>
  }
};

prepareConfigurationComponentConfig(DxSendButtonOptionsConfig);

const DxSendButtonOptions = defineComponent(DxSendButtonOptionsConfig);

(DxSendButtonOptions as any).$_optionName = "sendButtonOptions";

const DxSpeechRecognitionConfigConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:continuous": null,
    "update:grammars": null,
    "update:interimResults": null,
    "update:lang": null,
    "update:maxAlternatives": null,
  },
  props: {
    continuous: Boolean,
    grammars: Array as PropType<Array<string>>,
    interimResults: Boolean,
    lang: String,
    maxAlternatives: Number
  }
};

prepareConfigurationComponentConfig(DxSpeechRecognitionConfigConfig);

const DxSpeechRecognitionConfig = defineComponent(DxSpeechRecognitionConfigConfig);

(DxSpeechRecognitionConfig as any).$_optionName = "speechRecognitionConfig";

const DxSpeechToTextOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:customSpeechRecognizer": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onEnd": null,
    "update:onError": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResult": null,
    "update:onStartClick": null,
    "update:onStopClick": null,
    "update:rtlEnabled": null,
    "update:speechRecognitionConfig": null,
    "update:startIcon": null,
    "update:startText": null,
    "update:stopIcon": null,
    "update:stopText": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:type": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    customSpeechRecognizer: Object as PropType<CustomSpeechRecognizer | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    onContentReady: Function as PropType<((e: SpeechToTextContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: SpeechToTextDisposingEvent) => void)>,
    onEnd: Function as PropType<((e: EndEvent) => void)>,
    onError: Function as PropType<((e: ErrorEvent) => void)>,
    onInitialized: Function as PropType<((e: SpeechToTextInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: SpeechToTextOptionChangedEvent) => void)>,
    onResult: Function as PropType<((e: ResultEvent) => void)>,
    onStartClick: Function as PropType<((e: StartClickEvent) => void)>,
    onStopClick: Function as PropType<((e: StopClickEvent) => void)>,
    rtlEnabled: Boolean,
    speechRecognitionConfig: Object as PropType<Record<string, any> | SpeechRecognitionConfig>,
    startIcon: String,
    startText: String,
    stopIcon: String,
    stopText: String,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    type: String as PropType<ButtonType | string>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxSpeechToTextOptionsConfig);

const DxSpeechToTextOptions = defineComponent(DxSpeechToTextOptionsConfig);

(DxSpeechToTextOptions as any).$_optionName = "speechToTextOptions";
(DxSpeechToTextOptions as any).$_expectedChildren = {
  customSpeechRecognizer: { isCollectionItem: false, optionName: "customSpeechRecognizer" },
  speechRecognitionConfig: { isCollectionItem: false, optionName: "speechRecognitionConfig" }
};

const DxTypingUserConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:avatarAlt": null,
    "update:avatarUrl": null,
    "update:id": null,
    "update:name": null,
  },
  props: {
    avatarAlt: String,
    avatarUrl: String,
    id: [Number, String],
    name: String
  }
};

prepareConfigurationComponentConfig(DxTypingUserConfig);

const DxTypingUser = defineComponent(DxTypingUserConfig);

(DxTypingUser as any).$_optionName = "typingUsers";
(DxTypingUser as any).$_isCollectionItem = true;

const DxUserConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:avatarAlt": null,
    "update:avatarUrl": null,
    "update:id": null,
    "update:name": null,
  },
  props: {
    avatarAlt: String,
    avatarUrl: String,
    id: [Number, String],
    name: String
  }
};

prepareConfigurationComponentConfig(DxUserConfig);

const DxUser = defineComponent(DxUserConfig);

(DxUser as any).$_optionName = "user";

export default DxChat;
export {
  DxChat,
  DxAlert,
  DxAttachment,
  DxAuthor,
  DxCustomSpeechRecognizer,
  DxDayHeaderFormat,
  DxEditing,
  DxFileUploaderOptions,
  DxItem,
  DxMessageTimestampFormat,
  DxSendButtonOptions,
  DxSpeechRecognitionConfig,
  DxSpeechToTextOptions,
  DxTypingUser,
  DxUser
};
import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };
