import Widget, { WidgetOptions } from './widget/ui.widget';
import { Cancelable, NativeEventInfo } from '../events/index';

/**
 * @docid _ui_chat_User
 * @public
 * @type object
 */
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
}

/**
 * @docid _ui_chat_Message
 * @public
 * @type object
 */
export type Message = {
    timestamp: Date;
    author: User;
    text: string;
    typing?: boolean;
};

/**
 * @docid _ui_chat_MessageSendEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo,_ui_chat_Message
 */
export type MessageSendEvent = Cancelable & NativeEventInfo<dxChat, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & Message;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxChatOptions extends WidgetOptions<dxChat> {
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
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxChat extends Widget<dxChatOptions> { }

/** @public */
export type Properties = dxChatOptions;
