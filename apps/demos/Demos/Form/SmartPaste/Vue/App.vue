<template>
  <div
    class="instruction"
    id="textarea-label"
  >
    Copy text from the editor below to the clipboard.
    Edit the text to see how your changes affect Smart Paste result.
  </div>
  <div class="instruction">
    Paste text from the clipboard to populate the form.
    Press Ctrl+Shift+V (when the form is focused) or use the "Smart Paste" button under the form.
  </div>
  <div class="textarea-container">
    <DxButton
      text="Copy Text"
      icon="copy"
      stylingMode="contained"
      type="default"
      width="fit-content"
      @click="onCopy()"
    />
    <DxTextArea
      id="textarea"
      :input-attr="{ 'aria-labelledby': 'textarea-label' }"
      v-model:value="text"
      stylingMode="filled"
      height="100%"
    />
  </div>
  <DxForm
    id="form"
    ref="formRef"
    labelMode="outside"
    labelLocation="top"
    :showColonAfterLabel="false"
    :minColWidth="220"
    :aiIntegration="aiIntegration"
  >
    <DxGroupItem
      :colCountByScreen="colCountByScreen"
      caption="Billing Summary"
    >
      <DxItem
        dataField="Amount Due"
        editorType="dxTextBox"
        :editorOptions="amountDueEditorOptions"
        :aiOptions="amountDueAIOptions"
      />
      <DxItem
        dataField="Statement Date"
        editorType="dxDateBox"
        :editorOptions="statementDueEditorOptions"
        :aiOptions="statementDueAIOptions"
      />
    </DxGroupItem>
    <DxGroupItem
      :colCountByScreen="colCountByScreen"
      caption="Billing Information"
    >
      <DxItem
        dataField="First Name"
        editorType="dxTextBox"
        :editorOptions="textEditorOptions"
      />
      <DxItem
        dataField="Last Name"
        editorType="dxTextBox"
        :editorOptions="textEditorOptions"
      />
      <DxItem
        dataField="Phone Number"
        editorType="dxTextBox"
        :editorOptions="phoneEditorOptions"
        :aiOptions="phoneAIOptions"
      />
      <DxItem
        dataField="Email"
        editorType="dxTextBox"
        :editorOptions="textEditorOptions"
        :aiOptions="emailAIOptions"
        :validationRules="emailValidationRules"
      />
    </DxGroupItem>
    <DxGroupItem
      :colCountByScreen="colCountByScreen"
      caption="Billing Address"
    >
      <DxItem
        dataField="Street Address"
        editorType="dxTextBox"
        :editorOptions="textEditorOptions"
      />
      <DxItem
        dataField="City"
        editorType="dxTextBox"
        :editorOptions="textEditorOptions"
      />
      <DxItem
        dataField="State/Province/Region"
        editorType="dxTextBox"
        :editorOptions="textEditorOptions"
      />
      <DxItem
        dataField="ZIP"
        editorType="dxNumberBox"
        :editorOptions="zipEditorOptions"
        :aiOptions="zipAIOptions"
      />
    </DxGroupItem>
    <DxGroupItem
      cssClass="buttons-group"
      :colCountByScreen="colCountByScreen"
    >
      <DxButtonItem
        :buttonOptions="smartPasteButtonOptions"
        name="smartPaste"
      />
      <DxButtonItem
        :buttonOptions="resetButtonOptions"
        name="reset"
      />
    </DxGroupItem>
  </DxForm>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AzureOpenAI, type OpenAI } from 'openai';
import {
  DxForm, DxItem, DxButtonItem, DxGroupItem,
} from 'devextreme-vue/form';
import type { ValidationRule } from 'devextreme-vue/common';
import type { RequestParams, Response } from 'devextreme-vue/common/ai-integration';
import { DxButton, type DxButtonTypes } from 'devextreme-vue/button';
import DxTextArea from 'devextreme-vue/text-area';
import { AIIntegration } from 'devextreme-vue/common/ai-integration';
import notify from 'devextreme/ui/notify';
import { AzureOpenAIConfig, defaultText } from './data.ts';

const text = ref(defaultText);
const formRef = ref();

type AIMessage = (
  OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam
) & {
  content: string;
};

const aiService = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages: AIMessage[], signal: AbortSignal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_completion_tokens: 1000,
    temperature: 0.7,
  };

  const response = await aiService.chat.completions.create(params, { signal });
  const result = response.choices[0].message?.content;

  return result || '';
}

const aiIntegration = new AIIntegration({
  sendRequest({ prompt }: RequestParams) {
    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system || '' },
      { role: 'user', content: prompt.user || '' },
    ];

    const promise = getAIResponse(aiPrompt, signal);

    promise.catch(() => {
      showNotification('Something went wrong. Please try again.', '#form', true);
    });

    const result: Response = {
      promise,
      abort: () => {
        controller.abort();
      },
    };

    return result;
  },
});

const stylingMode = 'filled';

const amountDueEditorOptions = { placeholder: '$0.00', stylingMode };
const amountDueAIOptions = { instruction: 'Format as the following: $0.00' };

const statementDueEditorOptions = { placeholder: 'MM/DD/YYYY', stylingMode };
const statementDueAIOptions = { instruction: 'Format as the following: MM/DD/YYYY' };

const textEditorOptions = { stylingMode };

const phoneEditorOptions = { placeholder: '(000) 000-0000', stylingMode };
const phoneAIOptions = { instruction: 'Format as the following: (000) 000-0000' };

const emailValidationRules: ValidationRule[] = [{ type: 'email' }];
const emailAIOptions = { instruction: 'Do not fill this field if the text contains an invalid email address. A valid email is in the following format: email@example.com' };

const zipEditorOptions = { stylingMode, mode: 'text', value: null };
const zipAIOptions = { instruction: 'If the text does not contain a ZIP, determine the ZIP code from the provided address.' };

const resetButtonOptions: DxButtonTypes.Properties = {
  stylingMode: 'outlined',
  type: 'normal',
};
const smartPasteButtonOptions: DxButtonTypes.Properties = {
  stylingMode: 'contained',
  type: 'default',
};

const colCountByScreen = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
};

const showNotification = (message: string, of: string, isError?: boolean, offset?: string) => {
  notify({
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
  }, isError ? 'error' : 'info', 1500);
};

const onCopy = () => {
  navigator.clipboard.writeText(text.value);
  showNotification('Text copied to clipboard', '#textarea', false, '0 -20');
};

onMounted(() => {
  formRef.value.instance.registerKeyHandler('V', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey) {
      navigator.clipboard.readText()
        .then((clipboardText) => {
          if (clipboardText) {
            formRef.value.instance.smartPaste(clipboardText);
          } else {
            showNotification('Clipboard is empty. Copy text before pasting', '#form');
          }
        })
        .catch(() => {
          showNotification('Could not access the clipboard', '#form');
        });
    }
  });
});

</script>
<style scoped>
#app {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto auto;
  gap: 24px 40px;
  min-width: 720px;
  max-width: 900px;
  margin: auto;
}

.instruction {
  color: var(--dx-texteditor-color-label);
}

.textarea-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dx-layout-manager .dx-field-item.dx-last-row {
  padding-top: 4px;
}

.dx-toast-info .dx-toast-icon {
  display: none;
}

.buttons-group {
  display: flex;
  width: 100%;
  justify-content: end;
}

.buttons-group .dx-item-content {
  gap: 8px;
}

.buttons-group .dx-field-item:not(.dx-first-col),
.buttons-group .dx-field-item:not(.dx-last-col) {
  padding: 0;
}

.buttons-group .dx-item {
  flex: unset !important;
}
</style>
