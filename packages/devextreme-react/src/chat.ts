"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxChat, {
    Properties
} from "devextreme/ui/chat";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { Message, DisposingEvent, InitializedEvent, MessageEnteredEvent, TypingEndEvent, TypingStartEvent, User as ChatUser } from "devextreme/ui/chat";
import type { Format } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IChatOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onMessageEntered?: ((e: MessageEnteredEvent) => void) | undefined;
  onTypingEnd?: ((e: TypingEndEvent) => void) | undefined;
  onTypingStart?: ((e: TypingStartEvent) => void) | undefined;
}

type IChatOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IChatOptionsNarrowedEvents> & IHtmlOptions & {
  messageRender?: (...params: any) => React.ReactNode;
  messageComponent?: React.ComponentType<any>;
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
      const independentEvents = useMemo(() => (["onDisposing","onInitialized","onMessageEntered","onTypingEnd","onTypingStart"]), []);

      const defaults = useMemo(() => ({
        defaultItems: "items",
      }), []);

      const expectedChildren = useMemo(() => ({
        alert: { optionName: "alerts", isCollectionItem: true },
        dayHeaderFormat: { optionName: "dayHeaderFormat", isCollectionItem: false },
        item: { optionName: "items", isCollectionItem: true },
        messageTimestampFormat: { optionName: "messageTimestampFormat", isCollectionItem: false },
        typingUser: { optionName: "typingUsers", isCollectionItem: true },
        user: { optionName: "user", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "messageTemplate",
          render: "messageRender",
          component: "messageComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IChatOptions>>, {
          WidgetClass: dxChat,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IChatOptions> & { ref?: Ref<ChatRef> }) => ReactElement | null;


// owners:
// Chat
type IAlertProps = React.PropsWithChildren<{
  id?: number | string;
  message?: string;
}>
const _componentAlert = (props: IAlertProps) => {
  return React.createElement(NestedOption<IAlertProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "alerts",
      IsCollectionItem: true,
    },
  });
};

const Alert = Object.assign<typeof _componentAlert, NestedComponentMeta>(_componentAlert, {
  componentType: "option",
});

// owners:
// Item
type IAuthorProps = React.PropsWithChildren<{
  avatarAlt?: string;
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
type IDayHeaderFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: Format | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentDayHeaderFormat = (props: IDayHeaderFormatProps) => {
  return React.createElement(NestedOption<IDayHeaderFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dayHeaderFormat",
    },
  });
};

const DayHeaderFormat = Object.assign<typeof _componentDayHeaderFormat, NestedComponentMeta>(_componentDayHeaderFormat, {
  componentType: "option",
});

// owners:
// Chat
type IItemProps = React.PropsWithChildren<{
  author?: ChatUser;
  id?: number | string;
  text?: string;
  timestamp?: Date | number | string;
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
type IMessageTimestampFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: Format | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentMessageTimestampFormat = (props: IMessageTimestampFormatProps) => {
  return React.createElement(NestedOption<IMessageTimestampFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "messageTimestampFormat",
    },
  });
};

const MessageTimestampFormat = Object.assign<typeof _componentMessageTimestampFormat, NestedComponentMeta>(_componentMessageTimestampFormat, {
  componentType: "option",
});

// owners:
// Chat
type ITypingUserProps = React.PropsWithChildren<{
  avatarAlt?: string;
  avatarUrl?: string;
  id?: number | string;
  name?: string;
}>
const _componentTypingUser = (props: ITypingUserProps) => {
  return React.createElement(NestedOption<ITypingUserProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "typingUsers",
      IsCollectionItem: true,
    },
  });
};

const TypingUser = Object.assign<typeof _componentTypingUser, NestedComponentMeta>(_componentTypingUser, {
  componentType: "option",
});

// owners:
// Chat
type IUserProps = React.PropsWithChildren<{
  avatarAlt?: string;
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
  Alert,
  IAlertProps,
  Author,
  IAuthorProps,
  DayHeaderFormat,
  IDayHeaderFormatProps,
  Item,
  IItemProps,
  MessageTimestampFormat,
  IMessageTimestampFormatProps,
  TypingUser,
  ITypingUserProps,
  User,
  IUserProps
};
import type * as ChatTypes from 'devextreme/ui/chat_types';
export { ChatTypes };

