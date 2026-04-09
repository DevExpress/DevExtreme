<template>
  <div class="chat-container">
    <DxChat
      :height="710"
      :data-source="dataSource"
      :reload-on-change="false"
      :show-avatar="false"
      :show-day-headers="false"
      :user="user"
      :speech-to-text-enabled="true"
      :typing-users="typingUsers"
      :alerts="alerts"
      :send-button-options="sendButtonOptions"
      message-template="message"
      empty-view-template="emptyView"
      @message-entered="onMessageEntered($event)"
    >
      <template #message="{ data }">
        <div
          v-html="convertToHtml(data.message.text)"
          class="chat-messagebubble-text"
        />
      </template>

      <template #emptyView="{ data }">
        <div>
          <div class="dx-chat-messagelist-empty-message">{{ data.texts.message }}</div>
          <div class="dx-chat-messagelist-empty-prompt">{{ data.texts.prompt }}</div>
          <div class="chat-suggestion-cards">
            <button
              v-for="card in suggestionCards"
              :key="card.title"
              type="button"
              class="chat-suggestion-card"
              @click="sendSuggestion(card.prompt)"
            >
              <div class="chat-suggestion-card-title">{{ card.title }}</div>
              <div class="chat-suggestion-card-prompt">{{ card.description }}</div>
            </button>
          </div>
        </div>
      </template>
    </DxChat>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import DxChat, { type DxChatTypes } from 'devextreme-vue/chat';
import { loadMessages } from 'devextreme-vue/common/core/localization';
import {
  dictionary,
  user,
  assistant,
  dataSource,
  convertToHtml,
  ALERT_TIMEOUT,
  suggestionCards,
} from './data.ts';
import { getAIResponseStream } from './service.ts';
import type { AIMessage } from './service.ts';

const typingUsers = ref<DxChatTypes.User[]>([]);
const alerts = ref<DxChatTypes.Alert[]>([]);
const isStreaming = ref(false);
let abortController: AbortController | null = null;

onBeforeMount(() => {
  loadMessages(dictionary);
});

const sendButtonOptions = computed<DxChatTypes.SendButtonProperties>(() => (
  isStreaming.value
    ? { action: 'custom', icon: 'stopfilled', onClick: stopStreaming }
    : { action: 'send', icon: 'arrowright', onClick: () => {} }
));

function insertMessage(data: DxChatTypes.Message): void {
  dataSource.store().push([{ type: 'insert', data }]);
}

function updateMessageText(id: number, text: string): void {
  dataSource.store().push([{ type: 'update', key: id, data: { text } }]);
}

function insertAssistantPlaceholder(): number {
  const id = Date.now();
  dataSource.store().push([{
    type: 'insert',
    data: { id, timestamp: new Date(), author: assistant, text: '' },
  }]);
  return id;
}

function alertLimitReached(): void {
  alerts.value = [{ message: 'Request limit reached, try again in a minute.' }];
  setTimeout(() => { alerts.value = []; }, ALERT_TIMEOUT);
}

function createDelayedRenderer(onRender: (chunk: string) => void, delay = 20) {
  let queue: string[] = [];
  let rendering = false;

  function processQueue() {
    if (!queue.length) { rendering = false; return; }
    rendering = true;
    const chunk = queue.shift();
    if (chunk !== undefined) { onRender(chunk); }
    setTimeout(processQueue, delay);
  }

  return {
    pushChunk(chunk: string) {
      queue.push(chunk);
      if (!rendering) { processQueue(); }
    },
    stop() { queue = []; rendering = false; },
  };
}

function stopStreaming(): void {
  abortController?.abort();
}

async function fetchAIResponse(message: DxChatTypes.Message): Promise<void> {
  const dataItemToAIMessage = (item: DxChatTypes.Message): AIMessage => ({
    role: item.author?.id as AIMessage['role'],
    content: item.text,
  });

  const messages: AIMessage[] = [
    ...dataSource.items().map(dataItemToAIMessage),
    dataItemToAIMessage(message),
  ];

  abortController = new AbortController();
  setTimeout(() => { isStreaming.value = true; }, 0);
  typingUsers.value = [assistant];

  let assistantId: number | undefined;
  let buffer = '';
  let typingCleared = false;

  const renderer = createDelayedRenderer((chunk) => {
    if (!typingCleared) {
      typingUsers.value = [];
      typingCleared = true;
    }
    if (assistantId === undefined) {
      assistantId = insertAssistantPlaceholder();
    }
    buffer += chunk;
    updateMessageText(assistantId, buffer);
  });

  try {
    await getAIResponseStream(messages, {
      onAborted: () => renderer.stop(),
      onDelta: renderer.pushChunk,
      signal: abortController.signal,
    });
    typingUsers.value = [];
  } catch (e: unknown) {
    typingUsers.value = [];
    if ((e as Error)?.name !== 'AbortError' && assistantId !== undefined) {
      updateMessageText(assistantId, '');
      alertLimitReached();
    }
  } finally {
    abortController = null;
    isStreaming.value = false;
  }
}

function onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent): void {
  insertMessage({ id: Date.now(), ...message });
  if (!alerts.value.length) {
    fetchAIResponse(message);
  }
}

function sendSuggestion(prompt: string): void {
  const message: DxChatTypes.Message = {
    id: Date.now(),
    timestamp: new Date(),
    author: user,
    text: prompt,
  };
  insertMessage(message);
  if (!alerts.value.length) {
    fetchAIResponse(message);
  }
}
</script>

<style scoped>
.chat-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dx-chat {
  max-width: 900px;
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

.chat-suggestion-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
}

.chat-suggestion-card {
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #EBEBEB;
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 0 1 230px;
  max-width: 230px;
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
  width: 230px;
}

.chat-suggestion-card:hover {
  border: 1px solid #E0E0E0;
  background: #F5F5F5;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.04), 0 4px 24px 0 rgba(0, 0, 0, 0.02);
}

.chat-suggestion-card-title {
  color: #242424;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

.chat-suggestion-card-prompt {
  color: #616161;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.dx-chat-messagelist-empty-prompt {
  margin-top: 4px;
}
</style>
