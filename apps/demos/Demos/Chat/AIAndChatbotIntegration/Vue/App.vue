<template>
  <div
    class="chat-container"
    :class="{'dx-chat-disabled' : isDisabled == true }"
  >
    <DxChat
      ref="chatElement"
      :height="710"
      :data-source="dataSource"
      :reload-on-change="false"
      :show-avatar="false"
      :show-day-headers="false"
      :user="user"
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
            class="dx-chat-messagebubble-text"
          >
          </div>
          <div class="dx-bubble-button-container">
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
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import DxChat from 'devextreme-vue/chat';
import DxButton from 'devextreme-vue/button';
import { loadMessages } from 'devextreme/localization';
import { AzureOpenAI } from 'openai';
import {
  dictionary,
  messages,
  user,
  assistant,
  dataSource,
  convertToHtml,
  AzureOpenAIConfig,
  REGENERATION_TEXT,
  ALERT_TIMEOUT,
} from './data.ts';

const chatService = new AzureOpenAI(AzureOpenAIConfig);

const typingUsers = ref([]);
const alerts = ref([]);
const isDisabled = ref(false);
const copyButtonIcon = ref('copy');

onBeforeMount(() => {
  loadMessages(dictionary);
});

async function getAIResponse(messages) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_tokens: 1000,
    temperature: 0.7,
  };

  const response = await chatService.chat.completions.create(params);
  const data = { choices: response.choices };

  return data.choices[0].message?.content;
}

function toggleDisabledState(disabled, event = undefined) {
  isDisabled.value = disabled;

  if (disabled) {
    event?.target.blur();
  } else {
    event?.target.focus();
  }
};

function updateLastMessage(text = REGENERATION_TEXT) {
  const items = dataSource.items();
  const lastMessage = items.at(-1);

  dataSource.store().push([{
    type: 'update',
    key: lastMessage.id,
    data: { text },
  }]);
}

function renderAssistantMessage(text) {
  const message = {
    id: Date.now(),
    timestamp: new Date(),
    author: assistant,
    text,
  };

  dataSource.store().push([{ type: 'insert', data: message }]);
}

async function processMessageSending(message, event) {
  toggleDisabledState(true, event);

  messages.push({ role: 'user', content: message.text });
  typingUsers.value = [assistant];

  try {
    const aiResponse = await getAIResponse(messages);

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

function alertLimitReached() {
  alerts.value = [{
    message: 'Request limit reached, try again in a minute.'
  }];

  setTimeout(() => {
    alerts.value = [];
  }, ALERT_TIMEOUT);
}

async function regenerate() {
  toggleDisabledState(true);

  try {
    const aiResponse = await getAIResponse(messages.slice(0, -1));

    updateLastMessage(aiResponse);
    messages.at(-1).content = aiResponse;
  } catch {
    updateLastMessage(messages.at(-1).content);
    alertLimitReached();
  } finally {
    toggleDisabledState(false);
  }
}

function onMessageEntered({ message, event }) {
  dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

  if (!alerts.value.length) {
    processMessageSending(message, event);
  }
}

function onCopyButtonClick(message) {
  navigator.clipboard?.writeText(message.text);
  copyButtonIcon.value = 'check';

  setTimeout(() => {
      copyButtonIcon.value = 'copy';
  }, 2500);
}

function onRegenerateButtonClick() {
  updateLastMessage();
  regenerate();
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
.dx-chat-messagebubble-text {
  display: flex;
  flex-direction: column;
}

.dx-bubble-button-container {
  display: none;
}

.dx-button {
  display: inline-block;
  color: var(--dx-color-icon);
}

.dx-chat-messagegroup-alignment-start:last-child .dx-chat-messagebubble:last-child .dx-bubble-button-container {
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

.dx-chat-messagebubble-content ol,
.dx-chat-messagebubble-content ul {
  white-space: normal;
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

.dx-chat-disabled .dx-chat-messagebox {
  opacity: 0.5;
  pointer-events: none;
}
</style>
