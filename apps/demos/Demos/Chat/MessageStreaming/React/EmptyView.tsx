import React from 'react';
import type { FC } from 'react';
import type { ChatTypes } from 'devextreme-react/chat';
import { suggestionCards } from './data.ts';

interface EmptyViewProps {
  texts: ChatTypes.EmptyViewTemplateData['texts'];
  onSuggestionClick: (prompt: string) => void;
}

const EmptyView: FC<EmptyViewProps> = ({ texts, onSuggestionClick }: EmptyViewProps) => (
  <div>
    <div className='dx-chat-messagelist-empty-message'>{texts.message}</div>
    <div className='dx-chat-messagelist-empty-prompt'>{texts.prompt}</div>
    <div className='chat-suggestion-cards'>
      {suggestionCards.map((card) => (
        <button
          key={card.title}
          type='button'
          className='chat-suggestion-card'
          onClick={() => onSuggestionClick(card.prompt)}
        >
          <div className='chat-suggestion-card-title'>{card.title}</div>
          <div className='chat-suggestion-card-prompt'>{card.description}</div>
        </button>
      ))}
    </div>
  </div>
);

export default EmptyView;
