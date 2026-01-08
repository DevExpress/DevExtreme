import React, { useState, useCallback } from 'react';
import { Chat, Editing } from 'devextreme-react/chat';
import type { ChatTypes, ChatRef } from 'devextreme-react/chat';
import { SelectBox } from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import { Guid } from 'devextreme-react/common';
import { CustomStore, DataSource } from 'devextreme-react/common/data';

import {
  currentUser,
  messages as initialMessages,
  allowEditingLabel,
  allowDeletingLabel,
  editingOptions,
} from './data.ts';

const editingStrategy = {
  enabled: true,
  disabled: false,
  custom: ({ component, message }: { component?: ReturnType<ChatRef['instance']>, message?: ChatTypes.Message }): boolean => {
    const { items, user } = component?.option() ?? {};
    const userId = user?.id;

    const lastNotDeletedMessage = items?.findLast((item: ChatTypes.Message): boolean => item.author?.id === userId && !item.isDeleted);

    return message?.id === lastNotDeletedMessage?.id;
  },
} as const;

type EditingStrategyKey = keyof typeof editingStrategy;

const store: ChatTypes.Message[] = [...initialMessages];

const customStore = new CustomStore({
  key: 'id',
  load: async (): Promise<ChatTypes.Message[]> => store,
  insert: async (message: ChatTypes.Message): Promise<ChatTypes.Message> => {
    store.push(message);
    return message;
  },
});

const dataSource = new DataSource({
  store: customStore,
  paginate: false,
});

type EditingStrategy = NonNullable<ChatTypes.Properties['editing']>['allowUpdating'];

export default function App() {
  const [allowUpdating, setAllowUpdating] = useState<EditingStrategy>(true);
  const [allowDeleting, setAllowDeleting] = useState<EditingStrategy>(true);

  const onMessageEntered = useCallback((
    { message }: ChatTypes.MessageEnteredEvent,
  ): void => {
    const newMessage = {
      id: new Guid().toString(),
      ...message,
    };

    dataSource.store().push([{
      type: 'insert',
      key: newMessage.id,
      data: newMessage,
    }]);
  }, []);

  const onMessageDeleted = useCallback((
    { message }: ChatTypes.MessageDeletedEvent,
  ): void => {
    dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { isDeleted: true },
    }]);
  }, []);

  const onMessageUpdated = useCallback((
    { message, text }: ChatTypes.MessageUpdatedEvent,
  ): void => {
    dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { text, isEdited: true },
    }]);
  }, []);

  const handleAllowUpdatingChange = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    const strategy = editingStrategy[e.value as EditingStrategyKey];
    setAllowUpdating(() => strategy);
  }, []);

  const handleAllowDeletingChange = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    const strategy = editingStrategy[e.value as EditingStrategyKey];
    setAllowDeleting(() => strategy);
  }, []);

  return (
    <>
      <div className="chat-container">
        <Chat
          height={600}
          dataSource={dataSource}
          user={currentUser}
          reloadOnChange={false}
          onMessageEntered={onMessageEntered}
          onMessageDeleted={onMessageDeleted}
          onMessageUpdated={onMessageUpdated}
        >
          <Editing
            allowDeleting={allowDeleting}
            allowUpdating={allowUpdating}
          />
        </Chat>
      </div>

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Allow Editing:</span>
          <SelectBox
            items={editingOptions}
            valueExpr="key"
            displayExpr="text"
            inputAttr= {allowEditingLabel}
            defaultValue={editingOptions[0].key}
            onValueChanged={handleAllowUpdatingChange}
          />
        </div>
        <div className="option">
          <span>Allow Deleting:</span>
          <SelectBox
            items={editingOptions}
            valueExpr="key"
            displayExpr="text"
            inputAttr= {allowDeletingLabel}
            defaultValue={editingOptions[0].key}
            onValueChanged={handleAllowDeletingChange}
          />
        </div>
      </div>
    </>
  );
}
