<template>
  <DxChat
    v-model:items="messages"
    v-model:user="currentUser"
    v-model:typing-users="userChatTypingUsers"
    @message-entered="onMessageEntered($event)"
    @typing-start="userChatTypingStart()"
    @typing-end="userChatTypingEnd()"
  />
  <DxChat
    v-model:items="messages"
    v-model:user="supportAgent"
    v-model:typing-users="supportChatTypingUsers"
    @message-entered="onMessageEntered($event)"
    @typing-start="supportChatTypingStart()"
    @typing-end="supportChatTypingEnd()"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxChat from 'devextreme-vue/chat';
import { messages as initialMessages, supportAgent, currentUser } from './data.ts';

const messages = ref(initialMessages);
const userChatTypingUsers = ref([]);
const supportChatTypingUsers = ref([]);

function onMessageEntered(event) {
  messages.value = [...messages.value, event.message];
}

function userChatTypingStart() {
  supportChatTypingUsers.value = [currentUser];
}

function userChatTypingEnd() {
  supportChatTypingUsers.value = [];
}

function supportChatTypingStart() {
  userChatTypingUsers.value = [supportAgent];
}

function supportChatTypingEnd() {
  userChatTypingUsers.value = [];
}
</script>

<style scoped>
#app {
  display: flex;
  gap: 20px;
}

.dx-chat {
  height: 710px;
}

.dx-avatar {
  border: 1px solid var(--dx-color-border);
}
</style>
