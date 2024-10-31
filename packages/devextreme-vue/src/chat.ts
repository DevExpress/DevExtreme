import Chat, { Properties } from "devextreme/ui/chat";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "dataSource" |
  "dayHeaderFormat" |
  "disabled" |
  "elementAttr" |
  "errors" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "messageTimestampFormat" |
  "onDisposing" |
  "onInitialized" |
  "onMessageSend" |
  "onOptionChanged" |
  "onTypingEnd" |
  "onTypingStart" |
  "rtlEnabled" |
  "showAvatar" |
  "showDayHeaders" |
  "showMessageTimestamp" |
  "showUserName" |
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
    dataSource: {},
    dayHeaderFormat: [Object, Function, String],
    disabled: Boolean,
    elementAttr: Object,
    errors: Array,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array,
    messageTimestampFormat: [Object, Function, String],
    onDisposing: Function,
    onInitialized: Function,
    onMessageSend: Function,
    onOptionChanged: Function,
    onTypingEnd: Function,
    onTypingStart: Function,
    rtlEnabled: Boolean,
    showAvatar: Boolean,
    showDayHeaders: Boolean,
    showMessageTimestamp: Boolean,
    showUserName: Boolean,
    user: Object,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:dataSource": null,
    "update:dayHeaderFormat": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:errors": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:messageTimestampFormat": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onMessageSend": null,
    "update:onOptionChanged": null,
    "update:onTypingEnd": null,
    "update:onTypingStart": null,
    "update:rtlEnabled": null,
    "update:showAvatar": null,
    "update:showDayHeaders": null,
    "update:showMessageTimestamp": null,
    "update:showUserName": null,
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
      dayHeaderFormat: { isCollectionItem: false, optionName: "dayHeaderFormat" },
      error: { isCollectionItem: true, optionName: "errors" },
      item: { isCollectionItem: true, optionName: "items" },
      messageTimestampFormat: { isCollectionItem: false, optionName: "messageTimestampFormat" },
      user: { isCollectionItem: false, optionName: "user" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxChat = defineComponent(componentConfig);


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
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxDayHeaderFormatConfig);

const DxDayHeaderFormat = defineComponent(DxDayHeaderFormatConfig);

(DxDayHeaderFormat as any).$_optionName = "dayHeaderFormat";

const DxErrorConfig = {
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

prepareConfigurationComponentConfig(DxErrorConfig);

const DxError = defineComponent(DxErrorConfig);

(DxError as any).$_optionName = "errors";
(DxError as any).$_isCollectionItem = true;

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:author": null,
    "update:text": null,
    "update:timestamp": null,
    "update:typing": null,
  },
  props: {
    author: Object,
    text: String,
    timestamp: [Date, Number, String],
    typing: Boolean
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
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxMessageTimestampFormatConfig);

const DxMessageTimestampFormat = defineComponent(DxMessageTimestampFormatConfig);

(DxMessageTimestampFormat as any).$_optionName = "messageTimestampFormat";

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
  DxAuthor,
  DxDayHeaderFormat,
  DxError,
  DxItem,
  DxMessageTimestampFormat,
  DxUser
};
import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };
