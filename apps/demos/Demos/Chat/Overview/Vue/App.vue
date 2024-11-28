<template>
    <DxChat
        v-model:items="messages"
        v-model:user="currentUser"
        v-model:typing-users="userChatTypingUsers"
        @message-entered="onMessageEntered($event)"
        @typing-start="userChatTypingStart()"
        @typing-end="userChatTypingEnd()"
    ></DxChat>
    <DxChat
        v-model:items="messages"
        v-model:user="supportAgent"
        v-model:typing-users="supportChatTypingUsers"
        @message-entered="onMessageEntered($event)"
        @typing-start="supportChatTypingStart()"
        @typing-end="supportChatTypingEnd()"
    ></DxChat>
</template>

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

<script setup lang="ts">
    import { ref } from 'vue';
    import DxChat from 'devextreme-vue/chat';
    import { messages, supportAgent, currentUser } from './data.ts';

    const userChatTypingUsers = ref([]);
    const supportChatTypingUsers = ref([]);

    function onMessageEntered(event) {
        messages.value = [...messages.value, event.message];
    }

    function userChatTypingStart() {
        supportChatTypingUsers.value = [currentUser.value];
    }
    
    function userChatTypingEnd() {
        supportChatTypingUsers.value = [];
    }
    
    function supportChatTypingStart() {
        userChatTypingUsers.value = [supportAgent.value];
    }
    
    function supportChatTypingEnd() {
        userChatTypingUsers.value = [];
    }
</script>
