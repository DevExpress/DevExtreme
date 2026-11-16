import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import Chat, { ToolCallOptions } from 'devextreme-react/chat';
import type { ChatTypes } from 'devextreme-react/chat';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import type { ButtonTypes } from 'devextreme-react/button';
import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import { loadMessages } from 'devextreme-react/common/core/localization';
import {
  user,
  assistant,
  suggestionCards,
} from './data.ts';
import { dataSource, useApi } from './useApi.ts';

loadMessages({
  en: {
    'dxChat-emptyListMessage': 'Chat is Empty',
    'dxChat-emptyListPrompt': 'Click a tile below to call a function.',
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
});

function SuggestionCard({ card, onSelect }: {
  card: typeof suggestionCards[number];
  onSelect: (prompt: string) => void;
}) {
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
    alerts,
    insertMessage,
    fetchAIResponse,
    clearMessages,
  } = useApi();

  const [typingUsers, setTypingUsers] = useState<ChatTypes.User[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [expandAll, setExpandAll] = useState<CheckBoxTypes.Properties['value']>(false);
  const isProcessingRef = useRef<boolean>(false);

  const processAIRequest = useCallback(async (message: ChatTypes.Message): Promise<void> => {
    isProcessingRef.current = true;
    setIsProcessing(true);
    setTypingUsers([assistant]);

    await fetchAIResponse(message);

    setTypingUsers([]);
    setIsProcessing(false);
    isProcessingRef.current = false;
  }, [fetchAIResponse]);

  const onMessageEntered = useCallback(async ({ message, event }: ChatTypes.MessageEnteredEvent): Promise<void> => {
    if (isProcessingRef.current) {
      return;
    }

    insertMessage({ id: Date.now(), ...message });

    if (!alerts.length) {
      (event?.target as HTMLElement).blur();

      await processAIRequest(message);

      setTimeout(() => (event?.target as HTMLElement).focus());
    }
  }, [insertMessage, alerts.length, processAIRequest]);

  const sendSuggestion = useCallback((prompt: string): void => {
    if (isProcessingRef.current) {
      return;
    }

    const message: ChatTypes.Message = {
      id: Date.now(),
      timestamp: new Date(),
      author: user,
      text: prompt,
    };

    insertMessage(message);

    if (!alerts.length) {
      processAIRequest(message);
    }
  }, [insertMessage, alerts.length, processAIRequest]);

  const clearButtonOptions = useMemo((): ButtonTypes.Properties => ({
    icon: 'clearhistory',
    stylingMode: 'text',
    hint: 'Clear chat',
    disabled: isProcessing,
    onClick: () => {
      setTypingUsers([]);
      clearMessages();
    },
  }), [isProcessing, clearMessages]);

  const emptyViewRender = useCallback(({ texts }: { texts: { message: string; prompt: string } }) => (
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
  ), [sendSuggestion]);

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
          emptyViewRender={emptyViewRender}
          speechToTextEnabled={true}
        >
          <ToolCallOptions expandAll={!!expandAll} />
        </Chat>
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
