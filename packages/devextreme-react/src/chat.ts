"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxChat, {
    Properties
} from "devextreme/ui/chat";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { Message, DisposingEvent, InitializedEvent, MessageSendEvent, User as ChatUser } from "devextreme/ui/chat";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IChatOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onMessageSend?: ((e: MessageSendEvent) => void);
}

type IChatOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IChatOptionsNarrowedEvents> & IHtmlOptions & {
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
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["items"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onInitialized","onMessageSend"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
      }), []);

      const expectedChildren = useMemo(() => ({
        item: { optionName: "items", isCollectionItem: true }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IChatOptions>>, {
          WidgetClass: dxChat,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IChatOptions> & { ref?: Ref<ChatRef> }) => ReactElement | null;


// owners:
// Chat
type IItemProps = React.PropsWithChildren<{
  text?: string;
  timestamp?: string;
  typing?: boolean;
  user?: ChatUser;
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "items",
  IsCollectionItem: true,
  ExpectedChildren: {
    user: { optionName: "user", isCollectionItem: false }
  },
})

// owners:
// Item
type IUserProps = React.PropsWithChildren<{
  avatarUrl?: string;
  id?: number;
  name?: string;
}>
const _componentUser = memo(
  (props: IUserProps) => {
    return React.createElement(NestedOption<IUserProps>, { ...props });
  }
);

const User: typeof _componentUser & IElementDescriptor = Object.assign(_componentUser, {
  OptionName: "user",
})

export default Chat;
export {
  Chat,
  IChatOptions,
  ChatRef,
  Item,
  IItemProps,
  User,
  IUserProps
};
import type * as ChatTypes from 'devextreme/ui/chat_types';
export { ChatTypes };

