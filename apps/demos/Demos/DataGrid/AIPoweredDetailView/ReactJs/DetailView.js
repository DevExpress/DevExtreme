import React, { useCallback, useMemo, useState } from "react";
import { TextBox } from "devextreme-react/text-box";
import { ButtonGroup } from "devextreme-react/button-group";
import { Button } from "devextreme-react/button";
import { TextArea } from "devextreme-react/text-area";
import { LoadPanel, Position } from "devextreme-react/load-panel";
import { getAIResponse, SYSTEM_PROMPT } from "./service.js";
const promptElementAttr = { class: "prompt-editor" };
const suggestionsElementAttr = { class: "dx-chat-suggestions" };
const responseElementAttr = { class: "response-editor" };
const suggestions = [
  {
    type: "default",
    text: "✨ Summary",
    prompt: "Display general information about this vehicle and its features.",
  },
  {
    type: "default",
    text: "⚡ Ideal Buyer",
    prompt: "Describe who this vehicle appeals to the most in a sentence.",
  },
  {
    type: "default",
    text: "🏎️ Competitors",
    prompt: "List 2-3 models that directly compete with this vehicle.",
  },
];
const DetailView = ({ data: templateData }) => {
  const [promptValue, setPromptValue] = useState("");
  const [responseValue, setResponseValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const submitButtonText = useMemo(() => {
    if (!responseValue && !isError) {
      return "Submit";
    } else {
      return "Resubmit";
    }
  }, [isLoading, responseValue, isError]);
  const outputAreaMinHeight = useMemo(() => {
    const isMaterial = document.querySelector(".dx-theme-material");
    if (isMaterial) return 68;
    return 56;
  }, []);
  const outputAreaMaxHeight = useMemo(() => {
    const isMaterial = document.querySelector(".dx-theme-material");
    if (isMaterial) return 244;
    const isGeneric = document.querySelector(".dx-theme-generic");
    if (isGeneric) return 178;
    return 196;
  }, []);
  const onSuggestionClick = useCallback(({ itemData: suggestion }) => {
    setPromptValue(suggestion.prompt);
  }, []);
  const handlePromptChange = useCallback((value) => {
    setPromptValue(value);
  }, []);
  const handleSubmit = useCallback(
    async ({ event }) => {
      if (promptValue === "") return;
      setIsError(false);
      setIsLoading(true);
      (event?.target).blur();
      try {
        const rowData = templateData.data;
        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `User prompt: ${promptValue}\nRow data: ${JSON.stringify(rowData)}`,
          },
        ];
        const aiResponse = await getAIResponse(messages);
        setResponseValue(aiResponse);
      } catch {
        setResponseValue("");
        setIsError(true);
      } finally {
        setIsLoading(false);
        (event?.target).focus();
      }
    },
    [promptValue, templateData.data]
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
            onEnterKey={handleSubmit}
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
            onClick={handleSubmit}
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
          hoverStateEnabled={true}
          focusStateEnabled={true}
          elementAttr={responseElementAttr}
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
          <div className="output-empty-message">
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
