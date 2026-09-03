<template>
  <div class="input-container">
    <div class="prompt-container">
      <DxTextBox
        placeholder="Ask AI Assistant..."
        styling-mode="filled"
        value-change-event="input"
        :value="promptValue"
        @enter-key="handleSubmit"
        :element-attr="promptElementAttr"
        :disabled="isLoading"
      />

      <DxButtonGroup
        :items="suggestions"
        styling-mode="outlined"
        selection-mode="none"
        @item-click="onSuggestionClick"
        :element-attr="suggestionsElementAttr"
        :disabled="isLoading"
      />
    </div>

    <div class="submit-container">
      <DxButton
        icon="sparkle"
        :text="submitButtonText"
        type="default"
        :disabled="!promptValue || isLoading"
        @click="handleSubmit"
      />
    </div>
  </div>

  <div class="output-container">
    <DxTextArea
      :value="responseValue"
      :auto-resize-enabled="true"
      width="100%"
      :min-height="outputAreaMinHeight"
      :max-height="outputAreaMaxHeight"
      :read-only="true"
      :disabled="isLoading || !responseValue"
      styling-mode="outlined"
      :hover-state-enabled="false"
      :focus-state-enabled="false"
      :element-attr="responseElementAttr"
    />

    <DxLoadPanel
      container=".output-container"
      :show-pane="false"
      :shading="true"
      message=""
      :visible="isLoading"
    >
      <DxPosition of=".output-container" />
    </DxLoadPanel>

    <div v-if="!isLoading && !responseValue && !isError" class="output-empty-message">
      AI Assistant is ready to answer your questions about this record.
    </div>

    <div v-if="!isLoading && !responseValue && isError" class="output-error-message">
      <span class="dx-icon-warning"></span>
      An unexpected error occurred. Please try again.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DxTextBox } from 'devextreme-vue/text-box';
import { DxButtonGroup, type DxButtonGroupTypes } from 'devextreme-vue/button-group';
import { DxButton } from 'devextreme-vue/button';
import { DxTextArea } from 'devextreme-vue/text-area';
import { DxLoadPanel, DxPosition } from 'devextreme-vue/load-panel';
import { getAIResponse, SYSTEM_PROMPT, type AIMessage } from './service.ts';
import { type Vehicle, type SubmitEvent } from './data.ts';

const { rowData } = defineProps<{ rowData: Vehicle }>();

const promptElementAttr = { class: 'prompt-editor' };
const suggestionsElementAttr = { class: 'dx-chat-suggestions' };
const responseElementAttr = { class: 'response-editor' };

const suggestions = [
  { type: 'default', text: '✨ Summary', prompt: 'Display general information about this vehicle and its features.' },
  { type: 'default', text: '⚡ Ideal Buyer', prompt: 'Describe who this vehicle appeals to the most in a sentence.' },
  { type: 'default', text: '🏎️ Competitors', prompt: 'List 2-3 models that directly compete with this vehicle.' },
];

const outputAreaMinHeight = (() => {
  const isMaterial = document.querySelector('.dx-theme-material');
  if (isMaterial) return 68;

  return 56;
})();

const outputAreaMaxHeight = (() => {
  const isMaterial = document.querySelector('.dx-theme-material');
  if (isMaterial) return 244;

  const isGeneric = document.querySelector('.dx-theme-generic');
  if (isGeneric) return 178;

  return 196;
})();

const promptValue = ref('');
const responseValue = ref('');
const isLoading = ref(false);
const isError = ref(false);
const submitButtonText = computed(() => {
  if (!responseValue.value && !isError.value) {
    return 'Submit';
  } else {
    return 'Resubmit';
  }
});

function onSuggestionClick({ itemData: suggestion }: DxButtonGroupTypes.ItemClickEvent) {
  promptValue.value = suggestion.prompt;
}

async function handleSubmit({ event }: SubmitEvent) {
  if (promptValue.value === '') return;

  isError.value = false;
  isLoading.value = true;
  (event?.target as HTMLElement)?.blur();

  try {
    const messages: AIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `User prompt: ${promptValue.value}\nRow data: ${JSON.stringify(rowData)}` }
    ];
    const aiResponse = await getAIResponse(messages);
    responseValue.value = aiResponse!;
  } catch {
    responseValue.value = '';
    isError.value = true;
  } finally {
    isLoading.value = false;
    (event?.target as HTMLElement)?.focus();
  }
}
</script>

<style scoped>
.input-container {
  display: flex;
  border: 1px solid var(--dx-color-border);
  border-radius: var(--dx-border-radius);
  padding: 12px;
  margin-bottom: 16px;
  gap: 12px;
}

.input-container .dx-chat-suggestions {
  padding: 12px 0 0 0;
}

.input-container .dx-chat-suggestions .dx-buttongroup-item.dx-button {
  border-radius: 32px;
}

.prompt-container {
  flex-grow: 1;
}

.prompt-editor {
  height: var(--dx-component-height);
}

.output-container {
  display: grid;
  align-items: center;
  border: 1px solid var(--dx-color-border);
  border-radius: var(--dx-border-radius);
  background-color: var(--dx-datagrid-row-alternation-bg);
}

.output-container>* {
  grid-row: 1;
  grid-column: 1;
}

.output-container .response-editor {
  border: none;
  background-color: var(--dx-datagrid-row-alternation-bg);
}

.output-container .response-editor.dx-texteditor:not(.dx-state-disabled) .dx-texteditor-input {
  color: var(--dx-color-text);
}

.output-empty-message {
  text-align: center;
  white-space: pre-wrap;
  margin-left: 8px;
  margin-right: 8px;
  color: var(--dx-color-icon);
  z-index: 1;
}

.output-error-message {
  text-align: center;
  white-space: pre-wrap;
  margin-left: 8px;
  margin-right: 8px;
  color: var(--dx-color-danger);
  z-index: 1;
}

.output-error-message .dx-icon-warning {
  font-size: 20px;
  margin-right: 4px;
  vertical-align: middle;
}

.dx-theme-material {
  .submit-container {
    height: var(--dx-component-height);
    align-content: center;
  }

  .output-container .response-editor {
    box-shadow: none;
  }
}

.dx-theme-generic {
  .output-empty-message {
    color: #757575;
  }
}
</style>
