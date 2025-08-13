import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Chat, { Properties } from "devextreme/ui/chat";
import  DataSource from "devextreme/data/data_source";
import  dxChat from "devextreme/ui/chat";
import {
 Alert,
 Message,
 DisposingEvent,
 InitializedEvent,
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
 User,
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
} from "devextreme/common";
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
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "messageTemplate" |
  "messageTimestampFormat" |
  "onDisposing" |
  "onInitialized" |
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
  "showAvatar" |
  "showDayHeaders" |
  "showMessageTimestamp" |
  "showUserName" |
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
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array as PropType<Array<Message>>,
    messageTemplate: {},
    messageTimestampFormat: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
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
    showAvatar: Boolean,
    showDayHeaders: Boolean,
    showMessageTimestamp: Boolean,
    showUserName: Boolean,
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
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:messageTemplate": null,
    "update:messageTimestampFormat": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
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
    "update:showAvatar": null,
    "update:showDayHeaders": null,
    "update:showMessageTimestamp": null,
    "update:showUserName": null,
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
      item: { isCollectionItem: true, optionName: "items" },
      messageTimestampFormat: { isCollectionItem: false, optionName: "messageTimestampFormat" },
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

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alt": null,
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
  DxAuthor,
  DxDayHeaderFormat,
  DxEditing,
  DxItem,
  DxMessageTimestampFormat,
  DxTypingUser,
  DxUser
};
import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };
