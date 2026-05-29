import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { AzureOpenAI } from 'openai';
import { AIIntegration } from 'devextreme-react/common/ai-integration';
import { Button } from 'devextreme-react/button';
import {
  Form, Item, GroupItem, ButtonItem,
} from 'devextreme-react/form';
import { TextArea } from 'devextreme-react/text-area';
import notify from 'devextreme/ui/notify';
import { AzureOpenAIConfig, defaultText } from './data.js';

const stylingMode = 'filled';
const amountDueEditorOptions = { placeholder: '$0.00', stylingMode };
const amountDueAIOptions = { instruction: 'Format as the following: $0.00' };
const statementDueEditorOptions = { placeholder: 'MM/DD/YYYY', stylingMode };
const statementDueAIOptions = { instruction: 'Format as the following: MM/DD/YYYY' };
const textEditorOptions = { stylingMode };
const phoneEditorOptions = { placeholder: '(000) 000-0000', stylingMode };
const phoneAIOptions = { instruction: 'Format as the following: (000) 000-0000' };
const emailValidationRules = [{ type: 'email' }];
const emailAIOptions = {
  instruction:
    'Do not fill this field if the text contains an invalid email address. A valid email is in the following format: email@example.com',
};
const zipEditorOptions = { stylingMode, mode: 'text' };
const zipAIOptions = {
  instruction:
    'If the text does not contain a ZIP, determine the ZIP code from the provided address.',
};
const resetButtonOptions = {
  stylingMode: 'outlined',
  type: 'normal',
};
const smartPasteButtonOptions = {
  stylingMode: 'contained',
  type: 'default',
};
const colCountByScreen = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
};
const showNotification = (message, of, isError, offset) => {
  notify(
    {
      message,
      position: {
        my: 'bottom center',
        at: 'bottom center',
        of,
        offset: offset ?? '0 -50',
      },
      width: 'fit-content',
      maxWidth: 'fit-content',
      minWidth: 'fit-content',
    },
    isError ? 'error' : 'info',
    1500,
  );
};
const aiService = new AzureOpenAI(AzureOpenAIConfig);
export async function getAIResponse(messages, signal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };
  const response = await aiService.chat.completions.create(params, { signal });
  return response.choices[0].message?.content ?? '';
}
export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }) {
    const controller = new AbortController();
    const signal = controller.signal;
    const aiPrompt = [
      { role: 'system', content: prompt.system ?? '' },
      { role: 'user', content: prompt.user ?? '' },
    ];
    const promise = getAIResponse(aiPrompt, signal);
    promise.catch(() => {
      showNotification('Something went wrong. Please try again.', '#form', true);
    });
    return {
      promise,
      abort: () => {
        controller.abort();
      },
    };
  },
});
const App = () => {
  const formRef = useRef(null);
  const [text, setText] = useState(defaultText);
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    showNotification('Text copied to clipboard', '#textarea', false, '0 -20');
  }, [text]);
  const shortcutHandler = useCallback((event) => {
    if (event.ctrlKey && event.shiftKey) {
      navigator.clipboard
        .readText()
        .then((clipboardText) => {
          if (clipboardText) {
            formRef.current?.instance().smartPaste(clipboardText);
          } else {
            showNotification('Clipboard is empty. Copy text before pasting', '#form');
          }
        })
        .catch(() => {
          showNotification('Could not access the clipboard', '#form');
        });
    }
  }, []);
  useEffect(() => {
    formRef.current?.instance().registerKeyHandler('V', shortcutHandler);
  }, [shortcutHandler]);
  const onTextAreaValueChanged = useCallback((e) => {
    setText(e.value);
  }, []);
  return (
    <>
      <div
        id="textarea-label"
        className="instruction"
      >
        Copy text from the editor below to the clipboard. Edit the text to see how your changes
        affect Smart Paste result.
      </div>
      <div className="instruction">
        Paste text from the clipboard to populate the form. Press Ctrl+Shift+V (when the form is
        focused) or use the "Smart Paste" button under the form.
      </div>
      <div className="textarea-container">
        <Button
          text="Copy Text"
          icon="copy"
          stylingMode="contained"
          type="default"
          width="fit-content"
          onClick={onCopy}
        />
        <TextArea
          id="textarea"
          inputAttr={{ 'aria-labelledby': 'textarea-label' }}
          value={text}
          stylingMode="filled"
          height="100%"
          onValueChanged={onTextAreaValueChanged}
        />
      </div>
      <Form
        id="form"
        ref={formRef}
        labelMode="outside"
        labelLocation="top"
        showColonAfterLabel={false}
        minColWidth={220}
        aiIntegration={aiIntegration}
      >
        <GroupItem
          colCountByScreen={colCountByScreen}
          caption="Billing Summary"
        >
          <Item
            dataField="Amount Due"
            editorType="dxTextBox"
            editorOptions={amountDueEditorOptions}
            aiOptions={amountDueAIOptions}
          />
          <Item
            dataField="Statement Date"
            editorType="dxDateBox"
            editorOptions={statementDueEditorOptions}
            aiOptions={statementDueAIOptions}
          />
        </GroupItem>
        <GroupItem
          colCountByScreen={colCountByScreen}
          caption="Billing Information"
        >
          <Item
            dataField="First Name"
            editorType="dxTextBox"
            editorOptions={textEditorOptions}
          />
          <Item
            dataField="Last Name"
            editorType="dxTextBox"
            editorOptions={textEditorOptions}
          />
          <Item
            dataField="Phone Number"
            editorType="dxTextBox"
            editorOptions={phoneEditorOptions}
            aiOptions={phoneAIOptions}
          />
          <Item
            dataField="Email"
            editorType="dxTextBox"
            editorOptions={textEditorOptions}
            aiOptions={emailAIOptions}
            validationRules={emailValidationRules}
          />
        </GroupItem>
        <GroupItem
          colCountByScreen={colCountByScreen}
          caption="Billing Address"
        >
          <Item
            dataField="Street Address"
            editorType="dxTextBox"
            editorOptions={textEditorOptions}
          />
          <Item
            dataField="City"
            editorType="dxTextBox"
            editorOptions={textEditorOptions}
          />
          <Item
            dataField="State/Province/Region"
            editorType="dxTextBox"
            editorOptions={textEditorOptions}
          />
          <Item
            dataField="ZIP"
            editorType="dxNumberBox"
            editorOptions={zipEditorOptions}
            aiOptions={zipAIOptions}
          />
        </GroupItem>
        <GroupItem
          cssClass="buttons-group"
          colCountByScreen={colCountByScreen}
        >
          <ButtonItem
            buttonOptions={smartPasteButtonOptions}
            name="smartPaste"
          />
          <ButtonItem
            buttonOptions={resetButtonOptions}
            name="reset"
          />
        </GroupItem>
      </Form>
    </>
  );
};
export default App;
