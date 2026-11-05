import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import Chat from 'devextreme-react/chat';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import CheckBox from 'devextreme-react/check-box';
import { loadMessages } from 'devextreme-react/common/core/localization';
import { user, assistant, suggestionCards } from './data.js';
import { dataSource, useApi } from './useApi.js';

loadMessages({
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'Click a tile below to call a function.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
});
function SuggestionCard({ card, onSelect }) {
  const onClick = useCallback(() => onSelect(card.prompt), [card.prompt, onSelect]);
  return (
    <button
      type="button"
      className="chat-suggestion-card"
      onClick={onClick}
    >
      <div className="chat-suggestion-card-title">{card.title}</div>
      <div className="chat-suggestion-card-description">{card.description}</div>
    </button>
  );
}
export default function App() {
  const {
    alerts, insertMessage, fetchAIResponse, clearMessages,
  } = useApi();
  const [typingUsers, setTypingUsers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const isProcessingRef = useRef(false);
  const processAIRequest = useCallback(
    async (message) => {
      isProcessingRef.current = true;
      setIsProcessing(true);
      setTypingUsers([assistant]);
      await fetchAIResponse(message);
      setTypingUsers([]);
      setIsProcessing(false);
      isProcessingRef.current = false;
    },
    [fetchAIResponse],
  );
  const onMessageEntered = useCallback(
    async ({ message, event }) => {
      if (isProcessingRef.current) {
        return;
      }
      insertMessage({ id: Date.now(), ...message });
      if (!alerts.length) {
        (event?.target).blur();
        await processAIRequest(message);
        setTimeout(() => (event?.target).focus());
      }
    },
    [insertMessage, alerts.length, processAIRequest],
  );
  const sendSuggestion = useCallback(
    (prompt) => {
      if (isProcessingRef.current) {
        return;
      }
      const message = {
        id: Date.now(),
        timestamp: new Date(),
        author: user,
        text: prompt,
      };
      insertMessage(message);
      if (!alerts.length) {
        processAIRequest(message);
      }
    },
    [insertMessage, alerts.length, processAIRequest],
  );
  const clearButtonOptions = useMemo(
    () => ({
      icon: 'clearhistory',
      stylingMode: 'text',
      hint: 'Clear chat',
      disabled: isProcessing,
      onClick: () => {
        setTypingUsers([]);
        clearMessages();
      },
    }),
    [isProcessing, clearMessages],
  );
  const toolCallOptions = useMemo(() => ({ expandAll: !!expandAll }), [expandAll]);
  const emptyViewRender = useCallback(
    ({ texts }) => (
      <div>
        <div className="dx-chat-messagelist-empty-message">{texts.message}</div>
        <div className="dx-chat-messagelist-empty-prompt">{texts.prompt}</div>
        <div className="chat-suggestion-cards">
          {suggestionCards.map((card) => (
            <SuggestionCard
              key={card.title}
              card={card}
              onSelect={sendSuggestion}
            />
          ))}
        </div>
      </div>
    ),
    [sendSuggestion],
  );
  return (
    <>
      <div className="ai-chat-card">
        <Toolbar>
          <Item
            location="before"
            text="AI Assistant"
            cssClass="ai-chat-title"
          />
          <Item
            location="after"
            widget="dxButton"
            options={clearButtonOptions}
          />
        </Toolbar>
        <Chat
          disabled={isProcessing}
          dataSource={dataSource}
          reloadOnChange={false}
          showAvatar={true}
          showDayHeaders={false}
          user={user}
          height={710}
          onMessageEntered={onMessageEntered}
          alerts={alerts}
          typingUsers={typingUsers}
          toolCallOptions={toolCallOptions}
          emptyViewRender={emptyViewRender}
          speechToTextEnabled={true}
        />
      </div>

      <div className="options">
        <div className="caption">Options</div>

        <div className="option">
          <CheckBox
            text="Expand all tool calls"
            value={expandAll}
            onValueChange={setExpandAll}
          />
        </div>
      </div>
    </>
  );
}
