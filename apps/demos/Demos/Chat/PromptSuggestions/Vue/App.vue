<template>
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
import { ref, onBeforeMount } from 'vue';
import DxChat, { type DxChatTypes } from 'devextreme-vue/chat';
import DxSwitch from 'devextreme-vue/switch';
import { loadMessages } from 'devextreme-vue/common/core/localization';
import { type Events } from 'devextreme-vue/common/core';

import {
  dictionary,
  messages,
  user,
  assistant,
  dataSource,
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
const suggestions = ref<DxChatTypes.Properties['suggestions']>({
  items: suggestionItems,
  onItemClick: onSuggestionItemClick,
});

onBeforeMount(() => {
  loadMessages(dictionary);
});

function toggleDisabledState(disabled: boolean, event?: Events.EventObject): void {
  isDisabled.value = disabled;

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

    setTimeout(() => {
      typingUsers.value = [];
      messages.push({ role: 'assistant', content: aiResponse });
      renderAssistantMessage(aiResponse);
    }, 200);
  } catch {
    typingUsers.value = [];
    messages.pop();
    alertLimitReached();
  } finally {
    toggleDisabledState(false, event);
  }
}

function alertLimitReached(): void {
  alerts.value = [{ message: 'Request limit reached, try again in a minute.' }];

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

function onInputFieldTextChanged(e: DxChatTypes.InputFieldTextChangedEvent): void {
  inputFieldText.value = e.value ?? '';
}

function onSuggestionItemClick(e: { itemData?: { text: string; prompt: string } }): void {
  const { text = '', prompt = '' } = e.itemData ?? {};

  if (hideAfterUse.value) {
    const currentItems = (suggestions.value?.items ?? []) as { text: string; prompt: string }[];
    suggestions.value = {
      items: currentItems.filter((item) => item.text !== text),
      onItemClick: onSuggestionItemClick,
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

<style scoped>
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
  background-color: rgba(191, 191, 191, 0.15);
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

.dx-chat {
  max-width: 900px;
}

.chat-disabled .dx-chat-suggestions {
  opacity: 0.5;
  pointer-events: none;
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
