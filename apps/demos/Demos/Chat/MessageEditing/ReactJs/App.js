import React, { useState, useCallback } from 'react';
import Chat from 'devextreme-react/chat';
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
} from './data.js';

const editingStrategy = {
  enabled: true,
  disabled: false,
  custom: ({ component, message }) => {
    const { items, user } = component.option();
    const userId = user.id;
    const lastNotDeletedMessage = items.findLast(
      (item) => item.author?.id === userId && !item.isDeleted,
    );
    return message.id === lastNotDeletedMessage?.id;
  },
};
const store = [...initialMessages];
const customStore = new CustomStore({
  key: 'id',
  load: async() => store,
  insert: async(message) => {
    store.push(message);
    return message;
  },
});
const dataSource = new DataSource({
  store: customStore,
  paginate: false,
});
export default function App() {
  const [chatEditing, setChatEditing] = useState({
    allowUpdating: true,
    allowDeleting: true,
  });
  const onMessageEntered = useCallback(({ message }) => {
    const newMessage = {
      id: new Guid().toString(),
      ...message,
    };
    dataSource.store().push([
      {
        type: 'insert',
        key: newMessage.id,
        data: newMessage,
      },
    ]);
  }, []);
  const onMessageDeleted = useCallback(({ message }) => {
    dataSource.store().push([
      {
        type: 'update',
        key: message.id,
        data: { isDeleted: true },
      },
    ]);
  }, []);
  const onMessageUpdated = useCallback(({ message, text }) => {
    dataSource.store().push([
      {
        type: 'update',
        key: message.id,
        data: { text, isEdited: true },
      },
    ]);
  }, []);
  const handleEditingChange = useCallback(
    (type) => (e) => {
      setChatEditing((prev) => ({
        ...prev,
        [type]: editingStrategy[e.value],
      }));
    },
    [],
  );
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
            inputAttr={allowEditingLabel}
            defaultValue={editingOptions[0].key}
            onValueChanged={handleEditingChange('allowUpdating')}
          />
        </div>
        <div className="option">
          <span>Allow Deleting:</span>
          <SelectBox
            items={editingOptions}
            valueExpr="key"
            displayExpr="text"
            inputAttr={allowDeletingLabel}
            defaultValue={editingOptions[0].key}
            onValueChanged={handleEditingChange('allowDeleting')}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
