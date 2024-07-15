import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/**
 * @docid _ui_splitter_ResizeStartEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo,_ui_splitter_ResizeInfo
 */
export type MessageSendEvent = any;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxChatOptions extends WidgetOptions<dxChat> {
    /**
     * @docid
     * @type Array<dxChatItem>
     * @fires dxChatOptions.onOptionChanged
     * @public
     */
    items?: [];
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
