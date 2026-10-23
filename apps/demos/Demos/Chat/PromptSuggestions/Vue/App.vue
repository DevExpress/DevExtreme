<template>
  <div class="ai-chat-card">
    <DxToolbar>
      <DxItem
        location="before"
        text="AI Assistant"
        css-class="ai-chat-title"
      />
      <DxItem
        location="after"
        widget="dxButton"
        :options="clearButtonOptions"
      />
    </DxToolbar>
    <DxChat
      :class="{ 'chat-disabled': isDisabled }"
      :height="520"
      :data-source="dataSource"
      :reload-on-change="false"
      :show-avatar="false"
      :show-day-headers="false"
      :user="user"
      :speech-to-text-enabled="true"
      :input-field-text="inputFieldText"
      :suggestions="suggestions"
      message-template="message"
      v-model:typing-users="typingUsers"
      v-model:alerts="alerts"
      @message-entered="onMessageEntered($event)"
      @input-field-text-changed="onInputFieldTextChanged($event)"
    >
      <template #message="{ data }">
        <div
          v-html="convertToHtml(data.message.text)"
          class="chat-messagebubble-text"
        />
      </template>
    </DxChat>
  </div>

  <div class="options">
    <div class="caption">Suggestion Options</div>
    <div class="suggestions-options">
      <div class="option">
        <DxSwitch
          :value="sendImmediately"
          @value-changed="sendImmediately = $event.value"
        />
        <span>Send Immediately</span>
      </div>
      <div class="option">
        <DxSwitch
          :value="hideAfterUse"
          @value-changed="hideAfterUse = $event.value"
        />
        <span>Hide After Use</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import DxChat, { type DxChatTypes } from 'devextreme-vue/chat';
import DxSwitch from 'devextreme-vue/switch';
import { type DxButtonTypes } from 'devextreme-vue/button';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import { loadMessages } from 'devextreme-vue/common/core/localization';
import { type Events } from 'devextreme-vue/common/core';

import {
  dictionary,
  messages,
  user,
  assistant,
  dataSource,
  clearMessages,
  convertToHtml,
  suggestionItems,
  ALERT_TIMEOUT,
} from './data.ts';
import { getAIResponse } from './service.ts';

const typingUsers = ref<DxChatTypes.User[]>([]);
const alerts = ref<DxChatTypes.Alert[]>([]);
const isDisabled = ref(false);
const inputFieldText = ref('');
const sendImmediately = ref(false);
const hideAfterUse = ref(false);
const defaultSuggestions: DxChatTypes.Properties['suggestions'] = {
  items: suggestionItems,
  onItemClick: onSuggestionItemClick,
};
const suggestions = ref<DxChatTypes.Properties['suggestions']>(defaultSuggestions);

const clearButtonOptions = computed<DxButtonTypes.Properties>(() => ({
  icon: 'clearhistory',
  stylingMode: 'text',
  hint: 'Clear chat',
  disabled: isDisabled.value,
  onClick: onClearButtonClick,
}));

onBeforeMount(() => {
  loadMessages(dictionary);
});

function toggleDisabledState(disabled: boolean, event?: Events.EventObject): void {
  isDisabled.value = disabled;
  suggestions.value = { ...suggestions.value, disabled };

  if (disabled) {
    (event?.target as HTMLElement)?.blur();
  } else {
    (event?.target as HTMLElement)?.focus();
  }
}

function renderAssistantMessage(text: string): void {
  dataSource.store().push([{
    type: 'insert',
    data: {
      id: Date.now(),
      timestamp: new Date(),
      author: assistant,
      text,
    },
  }]);
}

async function processMessageSending(
  message: DxChatTypes.TextMessage,
  event?: Events.EventObject,
): Promise<void> {
  toggleDisabledState(true, event);

  messages.push({ role: 'user', content: message.text ?? '' });
  typingUsers.value = [assistant];

  try {
    const aiResponse = await getAIResponse(messages) as string;

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    typingUsers.value = [];
    messages.push({ role: 'assistant', content: aiResponse });
    renderAssistantMessage(aiResponse);
  } catch (err: unknown) {
    typingUsers.value = [];
    messages.pop();
    alertError(getErrorMessage(err));
  } finally {
    toggleDisabledState(false, event);
  }
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Unknown error';
}

function alertError(message: string): void {
  alerts.value = [{ message }];

  setTimeout(() => {
    alerts.value = [];
  }, ALERT_TIMEOUT);
}

function onMessageEntered({ message, event }: DxChatTypes.MessageEnteredEvent): void {
  if (isDisabled.value) return;

  dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

  if (!alerts.value.length) {
    processMessageSending(message, event);
  }
}

function onClearButtonClick(): void {
  alerts.value = [];
  typingUsers.value = [];
  suggestions.value = defaultSuggestions;
  clearMessages();
}

function onInputFieldTextChanged(e: DxChatTypes.InputFieldTextChangedEvent): void {
  inputFieldText.value = e.value ?? '';
}

function onSuggestionItemClick(e: { itemData?: { text: string; prompt: string } }): void {
  const { text = '', prompt = '' } = e.itemData ?? {};

  if (hideAfterUse.value) {
    const currentItems = (suggestions.value?.items ?? []) as { text: string; prompt: string }[];
    suggestions.value = {
      ...defaultSuggestions,
      items: currentItems.filter((item) => item.text !== text),
    };
  }

  if (sendImmediately.value) {
    const message: DxChatTypes.Message = {
      id: Date.now(),
      timestamp: new Date(),
      author: user,
      text: prompt,
    };

    dataSource.store().push([{ type: 'insert', data: message }]);

    if (!alerts.value.length) {
      processMessageSending(message);
    }
  } else {
    inputFieldText.value = prompt;
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.options {
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-width: 280px;
  background-color: var(--dx-color-options-panel-bg);
  gap: 16px;
  width: 100%;
  max-width: 900px;
  box-sizing: border-box;
}

.suggestions-options {
  display: flex;
  align-items: center;
  gap: 24px;
}

.option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.caption {
  font-size: var(--dx-font-size-sm);
  font-weight: 500;
}

.ai-chat-card {
  position: relative;
  width: 100%;
  max-width: 900px;
}

.ai-chat-card > .dx-toolbar {
  position: absolute;
  height: var(--dxds-spacing-480, 48px);
  padding-inline: var(--dxds-spacing-240, 24px);
  border-bottom: var(--dx-border-width) solid var(--dx-color-border);
  background-color: transparent;
}

.ai-chat-card > .dx-toolbar .dx-toolbar-items-container {
  height: 100%;
}

.ai-chat-title .dx-toolbar-item-content {
  font-size: var(--dxds-font-size-title-md, 20px);
  font-weight: var(--dxds-font-weight-title-default, 600);
}

.ai-chat-card > .dx-chat {
  padding-top: var(--dxds-spacing-480, 48px);
}

.dx-chat-messagelist-empty-image {
  display: none;
}

.dx-chat-messagelist-empty-message {
  font-size: var(--dx-font-size-heading-5);
}

.dx-chat-messagelist-empty-prompt {
  max-width: 462px;
  line-height: 20px;
}

.dx-chat-messagebubble-content > div > p:first-child {
  margin-top: 0;
}

.dx-chat-messagebubble-content > div > p:last-child {
  margin-bottom: 0;
}

.dx-chat-messagebubble-content h1,
.dx-chat-messagebubble-content h2,
.dx-chat-messagebubble-content h3,
.dx-chat-messagebubble-content h4,
.dx-chat-messagebubble-content h5,
.dx-chat-messagebubble-content h6 {
  font-size: revert;
  font-weight: revert;
}

.chat-disabled .dx-chat-messagebox {
  opacity: 0.5;
  pointer-events: none;
}

.dx-chat-suggestions .dx-button {
  max-width: 255px;
}
</style>
