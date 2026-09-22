import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import Chat from 'devextreme-react/chat';
import Popup from 'devextreme-react/popup';
import SpeedDialAction from 'devextreme-react/speed-dial-action';
import { ArrayStore, DataSource } from 'devextreme-react/common/data';
import { routeMessage } from './chat-router.js';
import { clearButtonOptions, emptyViewMessage, emptyViewPrompt } from './data.js';

const chatStore = new ArrayStore({ key: 'id' });
const chatDataSource = new DataSource({ store: chatStore, paginate: false });
const chatSuggestionItems = [
  { text: 'Show Completed Tasks', prompt: 'Show Completed Tasks' },
  { text: 'Change State to Texas', prompt: 'Change State to Texas' },
];
const chatUser = { id: 'user' };
const popupPosition = {
  my: 'right top',
  at: 'right top',
  of: '.demo-container',
  offset: '-20 20',
};
const popupWrapperAttr = { class: 'chat-popup' };
const emptyViewHtml = { __html: emptyViewPrompt };
function EmptyView() {
  return (
    <>
      <div className="dx-chat-messagelist-empty-image dx-ai-chat__empty-image" />
      <div className="ai-chat-empty-message">{emptyViewMessage}</div>
      <div
        className="ai-chat-empty-prompt"
        dangerouslySetInnerHTML={emptyViewHtml}
      />
    </>
  );
}
export default function AiAssistant({ form, grid, aiIntegration }) {
  const clearButtonInstance = useRef(null);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const updateClearButtonState = useCallback(() => {
    clearButtonInstance.current?.option('disabled', chatDataSource.items().length === 0);
  }, []);
  const pushMessage = useCallback(
    (message) => {
      chatStore.push([
        {
          type: 'insert',
          data: { id: Date.now() + Math.random(), timestamp: new Date(), ...message },
        },
      ]);
      chatDataSource.reload();
      updateClearButtonState();
    },
    [updateClearButtonState],
  );
  const handleUserMessage = useCallback(
    (message) => {
      setDisabled(true);
      if (form && grid) {
        routeMessage(String(message.text), {
          form,
          gridInstance: grid,
          aiIntegration,
          pushMessage,
        }).finally(() => {
          setDisabled(false);
          updateClearButtonState();
        });
      }
    },
    [aiIntegration, form, grid, pushMessage, updateClearButtonState],
  );
  const onMessageEntered = useCallback(
    ({ message }) => {
      handleUserMessage(message);
    },
    [handleUserMessage],
  );
  const onSuggestionItemClick = useCallback(
    ({ itemData }) => {
      if (!itemData?.prompt) {
        return;
      }
      const suggestionMessage = {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        author: chatUser,
        text: itemData.prompt,
      };
      pushMessage(suggestionMessage);
      handleUserMessage(suggestionMessage);
    },
    [handleUserMessage, pushMessage],
  );
  const clearChat = useCallback(() => {
    chatStore.clear();
    chatDataSource.reload();
    updateClearButtonState();
  }, [updateClearButtonState]);
  const onPopupShowing = useCallback(() => setVisible(true), []);
  const onPopupHiding = useCallback(() => setVisible(false), []);
  const onClearButtonInitialized = useCallback(
    (event) => {
      if (event.component) {
        clearButtonInstance.current = event.component;
        updateClearButtonState();
      }
    },
    [updateClearButtonState],
  );
  const toolbarItems = useMemo(
    () => [
      {
        widget: 'dxButton',
        toolbar: 'top',
        location: 'after',
        options: {
          cssClass: 'ai-chat-clear-button',
          ...clearButtonOptions,
          disabled: true,
          onClick: clearChat,
          onInitialized: onClearButtonInitialized,
        },
      },
    ],
    [clearChat, onClearButtonInitialized],
  );
  const suggestions = useMemo(
    () => ({
      items: chatSuggestionItems,
      onItemClick: onSuggestionItemClick,
      disabled,
    }),
    [disabled, onSuggestionItemClick],
  );
  return (
    <>
      <SpeedDialAction
        icon="sparkle"
        label="AI Assistant"
        visible={!visible}
        onClick={onPopupShowing}
      />
      <Popup
        title="AI Assistant"
        visible={visible}
        width={400}
        height="90%"
        dragEnabled={true}
        resizeEnabled={true}
        showCloseButton={true}
        shading={false}
        wrapperAttr={popupWrapperAttr}
        position={popupPosition}
        onShowing={onPopupShowing}
        onHiding={onPopupHiding}
        toolbarItems={toolbarItems}
      >
        <Chat
          height="100%"
          showAvatar={false}
          user={chatUser}
          showUserName={false}
          speechToTextEnabled={true}
          reloadOnChange={true}
          dataSource={chatDataSource}
          disabled={disabled}
          suggestions={suggestions}
          emptyViewRender={EmptyView}
          onMessageEntered={onMessageEntered}
        />
      </Popup>
    </>
  );
}
