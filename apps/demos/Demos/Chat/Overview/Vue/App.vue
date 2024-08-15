<template>
  <DxChat
    ref="chatRef"
    v-model:title="title"
    v-model:items="items"
    v-model:user="userSecond"
    :on-message-send="onMessageSend"
    :on-option-changed="onOptionChanged"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DxChat from 'devextreme-vue/chat';
import {
  MOCK_CHAT_HEADER_TEXT,
  messages,
  userFirst,
  userSecond,
} from './data.ts';

const message = {
  timestamp: String(Date.now()),
  author: userFirst,
  text: 'NEW MESSAGE',
};

const items = ref(messages);
const title = ref(MOCK_CHAT_HEADER_TEXT);

const chatRef = ref();

function onOptionChanged(args) {
  const componentItems = items.value;
  const chatOptionItems = chatRef.value.instance.option('items')

  debugger
}

function onMessageSend(args) {
  // No re-rendering occurs
  // After this, onOptionChanged occurs, the elements inside the component are updated (everything is ok, as expected)

  const componentItems = items.value;
  const chatOptionItems = chatRef.value.instance.option('items')

  debugger
}

function updateItems() {
  // After this, onOptionChanged is not called
  // items.value.push(message);

  // After this, onOptionChanged is CALLED, the message is rendered (everything is OK), invalidate occurs (NOT ALL OK)
  // Re-rendering of the dx-chat-message-group elements themselves, but their contents, occurs once
  items.value = [...items.value, message];
}

function renderMessage() {
  // No rerendering
  // Calls onOptionChanged(items), but does not call _optionChanged inside chat and subcomponents
  chatRef.value.instance.renderMessage(message, userFirst);
}

onMounted(() => {
  setTimeout(() => {
    // updateItems();
    renderMessage();
  }, 500);
});
</script>
