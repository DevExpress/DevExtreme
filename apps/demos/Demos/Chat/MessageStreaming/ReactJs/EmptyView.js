import React, { useCallback } from 'react';
import { suggestionCards } from './data.js';

const EmptyView = ({ texts, onSuggestionClick }) => {
  const handleSuggestionClick = useCallback(
    (prompt) => () => onSuggestionClick(prompt),
    [onSuggestionClick],
  );
  return (
    <div>
      <div className="dx-chat-messagelist-empty-message">{texts.message}</div>
      <div className="dx-chat-messagelist-empty-prompt">{texts.prompt}</div>
      <div className="chat-suggestion-cards">
        {suggestionCards.map((card) => (
          <button
            key={card.title}
            type="button"
            className="chat-suggestion-card"
            onClick={handleSuggestionClick(card.prompt)}
          >
            <div className="chat-suggestion-card-title">{card.title}</div>
            <div className="chat-suggestion-card-prompt">{card.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
export default EmptyView;
