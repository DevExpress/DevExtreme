"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxChat, {
    Properties
} from "devextreme/ui/chat";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
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
        item: { optionName: "items", isCollectionItem: true },
        user: { optionName: "user", isCollectionItem: false }
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
// Item
type IAuthorProps = React.PropsWithChildren<{
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
// Chat
type IItemProps = React.PropsWithChildren<{
  author?: ChatUser;
  text?: string;
  timestamp?: Date | number | string;
  typing?: boolean;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
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
type IUserProps = React.PropsWithChildren<{
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
  Author,
  IAuthorProps,
  Item,
  IItemProps,
  User,
  IUserProps
};
import type * as ChatTypes from 'devextreme/ui/chat_types';
export { ChatTypes };

