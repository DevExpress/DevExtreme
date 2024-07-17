import Chat, { Properties } from "devextreme/ui/chat";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "disabled" |
  "elementAttr" |
  "height" |
  "hoverStateEnabled" |
  "items" |
  "onDisposing" |
  "onInitialized" |
  "onMessageSend" |
  "onOptionChanged" |
  "rtlEnabled" |
  "visible" |
  "width"
>;

interface DxChat extends AccessibleOptions {
  readonly instance?: Chat;
}
const DxChat = createComponent({
  props: {
    disabled: Boolean,
    elementAttr: Object,
    height: [Function, Number, String],
    hoverStateEnabled: Boolean,
    items: Array,
    onDisposing: Function,
    onInitialized: Function,
    onMessageSend: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:height": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onMessageSend": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
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
      item: { isCollectionItem: true, optionName: "items" }
    };
  }
});

const DxItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:text": null,
    "update:timestamp": null,
    "update:typing": null,
    "update:user": null,
  },
  props: {
    text: String,
    timestamp: String,
    typing: Boolean,
    user: Object
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
(DxItem as any).$_expectedChildren = {
  user: { isCollectionItem: false, optionName: "user" }
};
const DxUser = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:avatarUrl": null,
    "update:id": null,
    "update:name": null,
  },
  props: {
    avatarUrl: String,
    id: Number,
    name: String
  }
});
(DxUser as any).$_optionName = "user";

export default DxChat;
export {
  DxChat,
  DxItem,
  DxUser
};
import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };
