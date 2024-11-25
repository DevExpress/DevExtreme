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
        height: 810px;
    }

    .dx-avatar {
        border: 1px solid var(--dx-color-border);
    }
</style>

<script setup lang="ts">
    import { ref } from 'vue';
    import DxChat from 'devextreme-vue/chat';

    const date = new Date();
    date.setHours(0, 0, 0, 0);

    function getTimestamp(date, offsetMinutes = 0) {
        return date.getTime() + offsetMinutes * 60000;
    }

    const currentUser = ref({
        id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
        name: "John Doe",
    });

    const supportAgent = ref({
        id: "d16d1a4c-5c67-4e20-b7v0e-2991c22747c3",
        name: "Support Agent",
        avatarUrl: "../../../../images/petersmith.png",
    });

    const userChatTypingUsers = ref([]);
    const supportChatTypingUsers = ref([]);

    const messages = ref([
        {
            timestamp: getTimestamp(date, -9),
            author: supportAgent,
            text: "Hello, John!\nHow can I assist you today?"
        },
        {
            timestamp: getTimestamp(date, -7),
            author: currentUser,
            text: "Hi, I'm having trouble accessing my account."
        },
        {
            timestamp: getTimestamp(date, -7),
            author: currentUser,
            text: "It says my password is incorrect."
        },
        {
            timestamp: getTimestamp(date, -7),
            author: supportAgent,
            text: "I can help with that. Can you please confirm your UserID for security purposes?"
        },
        {
            timestamp: getTimestamp(date, 1),
            author: currentUser,
            text: "john.doe1357"
        },
        {
            timestamp: getTimestamp(date, 1),
            author: supportAgent,
            text: "✅ Instructions to restore access have been sent to the email address registered to your account."
        },
    ]);

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
