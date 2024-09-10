import Chat, { Properties } from "devextreme/ui/chat";
import { defineComponent } from "vue";
import { prepareComponentConfig, prepareConfigurationComponentConfig } from "./core/strategy/vue3";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "dataSource" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "onDisposing" |
  "onInitialized" |
  "onMessageSend" |
  "onOptionChanged" |
  "rtlEnabled" |
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
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array,
    onDisposing: Function,
    onInitialized: Function,
    onMessageSend: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
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
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onMessageSend": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
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
      item: { isCollectionItem: true, optionName: "items" },
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
    "update:avatarUrl": null,
    "update:id": null,
    "update:name": null,
  },
  props: {
    avatarUrl: String,
    id: [Number, String],
    name: String
  }
};

prepareConfigurationComponentConfig(DxAuthorConfig);

const DxAuthor = defineComponent(DxAuthorConfig);

(DxAuthor as any).$_optionName = "author";

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

const DxUserConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:avatarUrl": null,
    "update:id": null,
    "update:name": null,
  },
  props: {
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
  DxItem,
  DxUser
};
import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };
