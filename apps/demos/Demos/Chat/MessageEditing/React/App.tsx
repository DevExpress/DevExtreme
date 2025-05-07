import React, { useState, useMemo, useCallback } from 'react';
import Chat, { type ChatTypes } from 'devextreme-react/chat';
import { Editing } from 'devextreme/ui/chat';
import { MessageDeletedEvent, MessageEnteredEvent, MessageUpdatedEvent } from 'devextreme/ui/chat';
import SelectBox from 'devextreme-react/select-box';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import Guid from 'devextreme/core/guid';

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
  custom: ({ component, message }) => {
    const { items, user } = component.option();
    const userId = user.id;

    const lastNotDeletedMessage = items.findLast((item) => {
      return item.author?.id === userId && !item.isDeleted;
    });

    return message.id === lastNotDeletedMessage?.id;
  },
};

export default function App() {
  const [chatEditing, setChatEditing] = useState<Editing>({
    allowUpdating: true,
    allowDeleting: true,
  });

  const store: ChatTypes.Message[] = [...initialMessages];

  const customStore = new CustomStore({
    key: 'id',
    load: (): Promise<ChatTypes.Message[]> => new Promise((resolve) => {
      setTimeout(() => {
        resolve([...store]);
      }, 0);
    }),
    insert: (message: ChatTypes.Message): Promise<ChatTypes.Message> => new Promise((resolve) => {
      setTimeout(() => {
        store.push(message);
        resolve(message);
      });
    }),
  });

  const dataSource = useMemo(() => new DataSource({
    store: customStore,
    paginate: false,
  }), []);

  const onMessageEntered = useCallback(({ message }: MessageEnteredEvent) => {
    const newMessage = {
      id: new Guid().toString(),
      ...message,
    }

    dataSource.store().push([{
      type: 'insert',
      key: newMessage.id,
      data: newMessage,
    }]);
  }, []);

  const onMessageDeleted = useCallback(({ message }: MessageDeletedEvent) => {
    dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { isDeleted: true },
    }]);
  }, []);

  const onMessageUpdated = useCallback(({ message, text }: MessageUpdatedEvent) => {
    dataSource.store().push([{
      type: 'update',
      key: message.id,
      data: { text, isEdited: true },
    }]);
  }, []);

  const handleEditingChange = useCallback((e, type) => {
    setChatEditing({
      [type]: editingStrategy[e.value]
    })
  }, [chatInstance]);

  return (
    <React.Fragment>
      <div className="chat-container">
        <Chat
          height={600}
          dataSource={dataSource}
          user={currentUser}
          reloadOnChange={false}
          editing={chatEditing}
          onMessageEntered={onMessageEntered}
          onMessageDeleted={onMessageDeleted}
          onMessageUpdated={onMessageUpdated}
        />
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
            onValueChanged={(e) => handleEditingChange(e, 'allowUpdating')}
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
            onValueChanged={(e) => handleEditingChange(e, 'allowDeleting')}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
