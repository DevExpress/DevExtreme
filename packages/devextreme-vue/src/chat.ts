import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Chat, { Properties } from "devextreme/ui/chat";
import  DataSource from "devextreme/data/data_source";
import {
 Alert,
 Message,
 DisposingEvent,
 InitializedEvent,
 MessageEnteredEvent,
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
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "messageTemplate" |
  "messageTimestampFormat" |
  "onDisposing" |
  "onInitialized" |
  "onMessageEntered" |
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
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array as PropType<Array<Message>>,
    messageTemplate: {},
    messageTimestampFormat: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onMessageEntered: Function as PropType<((e: MessageEnteredEvent) => void)>,
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
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
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
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:messageTemplate": null,
    "update:messageTimestampFormat": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onMessageEntered": null,
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

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:author": null,
    "update:id": null,
    "update:text": null,
    "update:timestamp": null,
  },
  props: {
    author: Object as PropType<User | Record<string, any>>,
    id: [Number, String],
    text: String,
    timestamp: [Date, Number, String]
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
  DxItem,
  DxMessageTimestampFormat,
  DxTypingUser,
  DxUser
};
import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };
