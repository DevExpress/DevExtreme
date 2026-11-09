<template>
  <div
    class="chat-container"
  >
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
        :class="{'chat-disabled' : isDisabled == true }"
        ref="chatElement"
        :height="710"
        :data-source="dataSource"
        :reload-on-change="false"
        :show-avatar="false"
        :show-day-headers="false"
        :user="user"
        :speech-to-text-enabled="true"
        message-template="message"
        v-model:typing-users="typingUsers"
        v-model:alerts="alerts"
        @message-entered="onMessageEntered($event)"
      >
        <template #message="{ data }">
          <span
            v-if="data.message.text === REGENERATION_TEXT"
          >
            {{ REGENERATION_TEXT }}
          </span>
          <template v-else>
            <div
              v-html="convertToHtml(data.message.text)"
              class="chat-messagebubble-text"
            />
            <div class="bubble-button-container">
              <DxButton
                :icon="copyButtonIcon"
                styling-mode="text"
                hint="Copy"
                @click="onCopyButtonClick(data.message)"
              />
              <DxButton
                icon="refresh"
                styling-mode="text"
                hint="Regenerate"
                @click="onRegenerateButtonClick()"
              />
            </div>
          </template>
        </template>
      </DxChat>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import DxChat, { type DxChatTypes } from 'devextreme-vue/chat';
import DxButton, { type DxButtonTypes } from 'devextreme-vue/button';
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
  REGENERATION_TEXT,
  ALERT_TIMEOUT,
} from './data.ts';
import { getAIResponse } from './service.ts';

const typingUsers = ref<{ id: string, name: string }[]>([]);
const alerts = ref<{ message: string }[]>([]);
const isDisabled = ref(false);
const copyButtonIcon = ref('copy');

const clearButtonOptions = computed((): DxButtonTypes.Properties => ({
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

  if (disabled) {
    (event?.target as HTMLElement)?.blur();
  } else {
    (event?.target as HTMLElement)?.focus();
  }
}

function updateLastMessage(text: string = REGENERATION_TEXT): void {
  const items = dataSource.items();
  const lastMessage = items.at(-1);

  dataSource.store().push([{
    type: 'update',
    key: lastMessage.id,
    data: { text },
  }]);
}

function renderAssistantMessage(text: string): void {
  const message = {
    id: Date.now(),
    timestamp: new Date(),
    author: assistant,
    text,
  };

  dataSource.store().push([{ type: 'insert', data: message }]);
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Unknown error';
}

async function processMessageSending(
  message: DxChatTypes.TextMessage,
  event: Events.EventObject | undefined,
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

function alertError(message: string): void {
  alerts.value = [{
    message,
  }];

  setTimeout(() => {
    alerts.value = [];
  }, ALERT_TIMEOUT);
}

async function regenerate(): Promise<void> {
  toggleDisabledState(true);
  const lastMessage = messages.at(-1);

  try {
    const aiResponse = await getAIResponse(messages.slice(0, -1)) as string;

    updateLastMessage(aiResponse);

    if (lastMessage?.content) {
      lastMessage.content = aiResponse;
    }
  } catch (err: unknown) {
    if (lastMessage?.content) {
      updateLastMessage(lastMessage.content);
    }
    alertError(getErrorMessage(err));
  } finally {
    toggleDisabledState(false);
  }
}

function onMessageEntered({ message, event }: DxChatTypes.MessageEnteredEvent): void {
  dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

  if (!alerts.value.length) {
    processMessageSending(message, event);
  }
}

function onCopyButtonClick(message: { text: string }): void {
  navigator.clipboard?.writeText(message.text);
  copyButtonIcon.value = 'check';

  setTimeout(() => {
    copyButtonIcon.value = 'copy';
  }, 2500);
}

function onClearButtonClick(): void {
  alerts.value = [];
  typingUsers.value = [];
  clearMessages();
}

function onRegenerateButtonClick(): void {
  alerts.value = [];
  updateLastMessage();
  regenerate();
}

</script>

<style>
.chat-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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

.dx-chat-messagebubble-content,
.chat-messagebubble-text {
  display: flex;
  flex-direction: column;
}

.bubble-button-container {
  display: none;
}

.dx-button {
  color: var(--dx-color-icon);
}

.dx-chat-messagegroup-alignment-start:last-child .dx-chat-messagebubble:last-child .bubble-button-container {
  display: flex;
  gap: 4px;
  margin-top: 8px;
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
</style>
