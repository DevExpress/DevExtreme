<template>
  <div class="demo-container">
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
        :height="710"
        :data-source="dataSource"
        :reload-on-change="false"
        :show-avatar="true"
        :show-day-headers="false"
        :user="user"
        :speech-to-text-enabled="true"
        :tool-call-options="toolCallOptions"
        empty-view-template="empty-view"
        v-model:typing-users="typingUsers"
        v-model:alerts="alerts"
        @message-entered="onMessageEntered($event)"
      >
        <template #empty-view>
          <div class="dx-chat-messagelist-empty-message">{{ dictionary.en['dxChat-emptyListMessage'] }}</div>
          <div class="dx-chat-messagelist-empty-prompt">{{ dictionary.en['dxChat-emptyListPrompt'] }}</div>
          <div class="chat-suggestion-cards">
            <button
              v-for="card in suggestionCards"
              :key="card.title"
              type="button"
              class="chat-suggestion-card"
              @click="sendSuggestion(card.prompt)"
            >
              <div class="chat-suggestion-card-title">{{ card.title }}</div>
              <div class="chat-suggestion-card-description">{{ card.description }}</div>
            </button>
          </div>
        </template>
      </DxChat>
    </div>

    <div class="options">
      <div class="caption">Options</div>

      <div class="option">
        <DxCheckBox
          v-model:value="expandAll"
          text="Expand all tool calls"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import DxChat, { type DxChatTypes } from 'devextreme-vue/chat';
import DxCheckBox from 'devextreme-vue/check-box';
import { type DxButtonTypes } from 'devextreme-vue/button';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import { loadMessages } from 'devextreme-vue/common/core/localization';
import { type Events } from 'devextreme-vue/common/core';

import {
  dictionary,
  user,
  assistant,
  dataSource,
  clearStore,
  suggestionCards,
  SYSTEM_PROMPT,
  ALERT_TIMEOUT,
  MAX_TOOL_ROUNDS,
  TOOL_DELAY,
  TOOL_ERROR_TEXT,
  toolImplementations,
} from './data.ts';
import { requestModel, type AIMessage } from './service.ts';

type ToolCall = DxChatTypes.ToolCall;

const typingUsers = ref<DxChatTypes.User[]>([]);
const alerts = ref<DxChatTypes.Alert[]>([]);
const isDisabled = ref(false);
const expandAll = ref(false);
const messages: AIMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];
let isProcessing = false;

const toolCallOptions = computed(() => ({ expandAll: expandAll.value }));

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

function wait(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

type FunctionCall = { id: string; function: { name: string; arguments: string } };

async function runTool(call: FunctionCall): Promise<ToolCall> {
  const { name } = call.function;
  let args: Record<string, any> = {};

  try {
    args = JSON.parse(call.function.arguments || '{}');
  } catch {
    args = {};
  }

  await wait(TOOL_DELAY);

  try {
    const implementation = toolImplementations[name];

    if (!implementation) {
      throw new Error(TOOL_ERROR_TEXT);
    }

    return {
      name, arguments: args, status: 'success', result: implementation(args),
    };
  } catch (err: unknown) {
    return {
      name, arguments: args, status: 'error', result: (err as Error).message,
    };
  }
}

async function getAIResponse(
  messageList: AIMessage[],
  toolCalls: ToolCall[] = [],
  round = 0,
): Promise<{ text: string; toolCalls: ToolCall[] }> {
  const answer = await requestModel(messageList);
  const calls = (answer.tool_calls ?? []).filter(({ type }) => type === 'function') as
    { id: string; type: 'function'; function: { name: string; arguments: string } }[];

  if (!calls.length || round === MAX_TOOL_ROUNDS) {
    return { text: answer.content ?? '', toolCalls };
  }

  messageList.push({
    role: 'assistant',
    content: answer.content,
    tool_calls: calls,
  });

  const results = await Promise.all(calls.map(runTool));

  results.forEach((result, index) => {
    messageList.push({
      role: 'tool',
      tool_call_id: calls[index].id,
      content: result.status === 'error' ? `Error: ${result.result as string}` : result.result as string,
    });
  });

  return getAIResponse(messageList, [...toolCalls, ...results], round + 1);
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

function toggleDisabledState(disabled: boolean, event?: Events.EventObject): void {
  isDisabled.value = disabled;

  if (disabled) {
    (event?.target as HTMLElement)?.blur();
  } else {
    (event?.target as HTMLElement)?.focus();
  }
}

function renderAssistantMessage(text: string, toolCalls: ToolCall[]): void {
  const message: DxChatTypes.TextMessage = {
    id: Date.now(),
    timestamp: new Date(),
    author: assistant,
    text,
  };

  if (toolCalls.length) {
    message.toolCalls = toolCalls;
  }

  dataSource.store().push([{ type: 'insert', data: message }]);
}

async function processMessageSending(
  message: DxChatTypes.TextMessage,
  event?: Events.EventObject,
): Promise<void> {
  isProcessing = true;
  toggleDisabledState(true, event);

  const historyLength = messages.length;

  messages.push({ role: 'user', content: message.text ?? '' });
  typingUsers.value = [assistant];

  try {
    const { text, toolCalls } = await getAIResponse(messages);

    typingUsers.value = [];
    messages.push({ role: 'assistant', content: text });
    renderAssistantMessage(text, toolCalls);
  } catch (err: unknown) {
    typingUsers.value = [];
    messages.length = historyLength;
    alertError(getErrorMessage(err));
  } finally {
    isProcessing = false;
    toggleDisabledState(false, event);
  }
}

function onMessageEntered({ message, event }: DxChatTypes.MessageEnteredEvent): void {
  if (isProcessing) {
    return;
  }

  dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

  if (!alerts.value.length) {
    processMessageSending(message as DxChatTypes.TextMessage, event);
  }
}

function sendSuggestion(prompt: string): void {
  if (isProcessing) {
    return;
  }

  const message: DxChatTypes.TextMessage = {
    id: Date.now(),
    timestamp: new Date(),
    author: user,
    text: prompt,
  };

  dataSource.store().push([{ type: 'insert', data: message }]);

  if (!alerts.value.length) {
    processMessageSending(message);
  }
}

function onClearButtonClick(): void {
  messages.length = 1;
  alerts.value = [];
  typingUsers.value = [];
  clearStore();
}
</script>

<style>
.demo-container {
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

.dx-chat-messagebubble-content {
  display: flex;
  flex-direction: column;
}

.dx-chat-messagebubble:has(> .dx-chat-tool-call-view) {
  min-width: 344px;
}

.dx-theme-fluent-typography .dx-chat-messagebubble:has(> .dx-chat-tool-call-view),
.dx-theme-fluent-next-typography .dx-chat-messagebubble:has(> .dx-chat-tool-call-view) {
  min-width: 320px;
}

.chat-suggestion-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
}

.chat-suggestion-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 0 1 230px;
  width: 230px;
  max-width: 230px;
  padding: 16px;
  border: var(--dx-border-width) solid var(--dx-color-border);
  border-radius: calc(var(--dx-border-radius) * 3);
  background: color-mix(in srgb, var(--dx-color-text) 4%, var(--dx-component-color-bg));
  color: var(--dx-color-text);
  font-family: inherit;
  text-align: start;
  cursor: pointer;
  transition: 0.2s ease;
}

.chat-suggestion-card:hover {
  background: color-mix(in srgb, var(--dx-color-text) 10%, var(--dx-component-color-bg));
  box-shadow: var(--dxds-box-shadow-md, 0 4px 12px 0 rgba(0, 0, 0, 0.04), 0 4px 24px 0 rgba(0, 0, 0, 0.02));
}

.chat-suggestion-card-title {
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

.chat-suggestion-card-description {
  color: color-mix(in srgb, var(--dx-color-text) 70%, var(--dx-component-color-bg));
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.chat-disabled .dx-chat-messagebox {
  opacity: 0.5;
  pointer-events: none;
}
</style>
