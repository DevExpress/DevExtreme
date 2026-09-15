import React, { useCallback, useMemo, useState } from 'react';
import { TextBox } from 'devextreme-react/text-box';
import { ButtonGroup } from 'devextreme-react/button-group';
import { Button } from 'devextreme-react/button';
import { TextArea } from 'devextreme-react/text-area';
import { LoadPanel, Position } from 'devextreme-react/load-panel';
import themes from 'devextreme/ui/themes';
import { getAIResponse, SYSTEM_PROMPT } from './service.js';

const promptElementAttr = { class: 'prompt-editor' };
const suggestionsElementAttr = { class: 'dx-chat-suggestions' };
const responseElementAttr = { class: 'response-editor' };
const responseInputAttr = { 'aria-label': 'AI Response' };
const suggestions = [
  {
    type: 'default',
    text: '✨ Summary',
    prompt: 'Display general information about this vehicle and its features.',
  },
  {
    type: 'default',
    text: '⚡ Ideal Buyer',
    prompt: 'Describe who this vehicle appeals to the most in a sentence.',
  },
  {
    type: 'default',
    text: '🏎️ Competitors',
    prompt: 'List 2-3 models that directly compete with this vehicle.',
  },
];
const DetailView = ({ data: templateData, onRequestStart, onRequestEnd }) => {
  const [promptValue, setPromptValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const getTheme = useCallback(() => {
    const themeName = themes.current();
    return {
      isCompact: themeName.endsWith('compact'),
      isMaterial: themeName.startsWith('material'),
      isGeneric: themeName.startsWith('generic'),
    };
  }, []);
  const outputAreaMinHeight = useMemo(() => {
    const { isCompact, isMaterial } = getTheme();
    if (isMaterial) return isCompact ? 60 : 68;
    return isCompact ? 42 : 56;
  }, [getTheme]);
  const outputAreaMaxHeight = useMemo(() => {
    const { isCompact, isMaterial, isGeneric } = getTheme();
    if (isMaterial) return isCompact ? 200 : 244;
    if (isGeneric) return isCompact ? 154 : 178;
    return isCompact ? 154 : 196;
  }, [getTheme]);
  const handlePromptChange = useCallback((value) => {
    setPromptValue(value);
  }, []);
  const handleSubmit = useCallback(
    async (event, prompt) => {
      if (!prompt) return;
      const controller = new AbortController();
      onRequestStart(controller);
      setIsError(false);
      setIsLoading(true);
      event?.target?.blur();
      try {
        const rowData = templateData.data;
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `User prompt: ${prompt}\nRow data: ${JSON.stringify(rowData)}` },
        ];
        const aiResponse = await getAIResponse(messages, controller.signal);
        if (aiResponse === '') throw new Error('AI response is empty');
        setResponseValue(aiResponse);
      } catch {
        setResponseValue('');
        setIsError(true);
      } finally {
        onRequestEnd(controller);
        setSubmitButtonText('Resubmit');
        setIsLoading(false);
        event?.target?.focus();
      }
    },
    [templateData.data, onRequestStart, onRequestEnd],
  );
  const onSubmit = useCallback(
    (e) => {
      handleSubmit(e.event, promptValue);
    },
    [promptValue, handleSubmit],
  );
  const onSuggestionClick = useCallback(
    (e) => {
      const { itemData: suggestion, event } = e;
      setPromptValue(suggestion.prompt);
      handleSubmit(event, suggestion.prompt);
    },
    [handleSubmit],
  );
  return (
    <>
      <div className="input-container">
        <div className="prompt-container">
          <TextBox
            placeholder="Ask AI Assistant..."
            stylingMode="filled"
            valueChangeEvent="input"
            value={promptValue}
            onValueChange={handlePromptChange}
            onEnterKey={onSubmit}
            elementAttr={promptElementAttr}
            disabled={isLoading}
          />

          <ButtonGroup
            items={suggestions}
            stylingMode="outlined"
            selectionMode="none"
            onItemClick={onSuggestionClick}
            elementAttr={suggestionsElementAttr}
            disabled={isLoading}
          />
        </div>

        <div className="submit-container">
          <Button
            icon="sparkle"
            text={submitButtonText}
            type="default"
            disabled={!promptValue || isLoading}
            onClick={onSubmit}
          />
        </div>
      </div>

      <div className="output-container">
        <TextArea
          value={responseValue}
          autoResizeEnabled={true}
          width="100%"
          minHeight={outputAreaMinHeight}
          maxHeight={outputAreaMaxHeight}
          readOnly={true}
          disabled={isLoading || !responseValue}
          stylingMode="outlined"
          hoverStateEnabled={false}
          focusStateEnabled={false}
          elementAttr={responseElementAttr}
          inputAttr={responseInputAttr}
        />

        <LoadPanel
          container=".output-container"
          showPane={false}
          shading={true}
          message=""
          visible={isLoading}
        >
          <Position of=".output-container" />
        </LoadPanel>

        {!isLoading && !responseValue && !isError && (
          <div className="output-initial-message">
            AI Assistant is ready to answer your questions about this record.
          </div>
        )}

        {!isLoading && !responseValue && isError && (
          <div className="output-error-message">
            <span className="dx-icon-warning"></span>
            An unexpected error occurred. Please try again.
          </div>
        )}
      </div>
    </>
  );
};
export default DetailView;
