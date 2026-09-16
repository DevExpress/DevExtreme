import React, { useCallback, useMemo, useRef, useState } from 'react';
import Chat, { type ChatTypes } from 'devextreme-react/chat';
import Popup, { type PopupTypes } from 'devextreme-react/popup';
import SpeedDialAction from 'devextreme-react/speed-dial-action';
import type { ButtonRef, ButtonTypes } from 'devextreme-react/button';
import { ArrayStore, DataSource } from 'devextreme-react/common/data';
import type { AIIntegration } from 'devextreme-react/common/ai-integration';
import { routeMessage } from '../routing/chat-router.ts';
import type { EmployeeForm, PushMessage, TaskGrid } from '../types/types.ts';

interface AiAssistantProps { form: EmployeeForm | null; grid: TaskGrid | null; aiIntegration: AIIntegration; }
const chatStore = new ArrayStore<ChatTypes.Message, number>({ key: 'id' });
const chatDataSource = new DataSource({ store: chatStore, paginate: false });
const chatSuggestionItems = [
  { text: 'Show Completed Tasks', prompt: 'Show Completed Tasks' },
  { text: 'Change State to Texas', prompt: 'Change State to Texas' },
];
const chatUser = { id: 'user' };
const popupPosition: PopupTypes.Properties['position'] = {
  my: 'right top',
  at: 'right top',
  of: '.demo-container',
  offset: '-20 20',
};
const clearButtonOptions: ButtonTypes.Properties = { icon: 'clearhistory', hint: 'Clear chat' };
const emptyViewMessage = 'How can I help with this page?';
const emptyViewPrompt = 'Update employee <b>Form</b> fields.\nFilter or sort tasks, display or hide <b>DataGrid</b> columns, or clear all filters and sorting.';
const emptyViewHtml = { __html: emptyViewPrompt };

function EmptyView(): React.JSX.Element {
  return (
    <>
      <div className="dx-chat-messagelist-empty-image dx-ai-chat__empty-image" />
      <div className="ai-chat-empty-message">{emptyViewMessage}</div>
      <div className="ai-chat-empty-prompt" dangerouslySetInnerHTML={emptyViewHtml} />
    </>
  );
}

export default function AiAssistant({ form, grid, aiIntegration }: AiAssistantProps) {
  const clearButtonInstance = useRef<ReturnType<ButtonRef['instance']> | null>(null);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const updateClearButtonState = useCallback((): void => {
    clearButtonInstance.current?.option('disabled', chatDataSource.items().length === 0);
  }, []);

  const pushMessage: PushMessage = useCallback((message) => {
    chatStore.push([{ type: 'insert', data: { id: Date.now() + Math.random(), timestamp: new Date(), ...message } }]);
    chatDataSource.reload();
    updateClearButtonState();
  }, [updateClearButtonState]);

  const handleUserMessage = useCallback((message: ChatTypes.Message): void => {
    setDisabled(true);
    if (form && grid) {
      routeMessage(String(message.text), { form, gridInstance: grid, aiIntegration, pushMessage }).finally(() => {
        setDisabled(false);
        updateClearButtonState();
      });
    }
  }, [aiIntegration, form, grid, pushMessage, updateClearButtonState]);

  const onMessageEntered = useCallback(({ message }: ChatTypes.MessageEnteredEvent): void => {
    handleUserMessage(message);
  }, [handleUserMessage]);

  const onSuggestionItemClick = useCallback(({ itemData }: { itemData?: { prompt?: string } }): void => {
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
  }, [handleUserMessage, pushMessage]);

  const clearChat = useCallback((): void => {
    chatStore.clear();
    chatDataSource.reload();
    updateClearButtonState();
  }, [updateClearButtonState]);

  const onPopupShowing = useCallback((): void => setVisible(true), []);
  const onPopupHiding = useCallback((): void => setVisible(false), []);

  const onClearButtonInitialized = useCallback((event: { component?: ReturnType<ButtonRef['instance']> }): void => {
    if (event.component) {
      clearButtonInstance.current = event.component;
      updateClearButtonState();
    }
  }, [updateClearButtonState]);

  const toolbarItems = useMemo<PopupTypes.Properties['toolbarItems']>(() => [{
    widget: 'dxButton',
    toolbar: 'top',
    location: 'after',
    options: {
      ...clearButtonOptions,
      disabled: true,
      onClick: clearChat,
      onInitialized: onClearButtonInitialized,
    },
  }], [clearChat, onClearButtonInitialized]);

  const suggestions = useMemo(() => ({
    items: chatSuggestionItems,
    onItemClick: onSuggestionItemClick,
    disabled,
  }), [disabled, onSuggestionItemClick]);

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
