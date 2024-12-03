<template>
    <div class="chat-container">
        <DxChat
            v-model:items="messages"
            v-model:user="currentUser"
            v-model:disabled = "isDisabled"
            v-model:showAvatar = "showAvatar"
            v-model:showUserName = "showUsername"
            v-model:showDayHeaders = "showDayHeaders"
            v-model:showMessageTimestamp = "showMsgTime"
            v-model:dayHeaderFormat = "dayHeaderFormat"
            v-model:messageTimestampFormat = "messageTimestampFormat"
            @message-entered="onMessageEntered($event)"
        ></DxChat>
    </div>

    <div class="options">
        <div class="caption">Options</div>

        <div class="option">
          <DxCheckBox
          v-model:value="showAvatar"
          text="Show Avatar"
          />
        </div>

        <div class="option">
          <DxCheckBox
          v-model:value="showUsername"
          text="Show Username"
          />
        </div>

        <div class="option-separator"></div>

        <div class="option">
          <div id="show-day-headers"></div>
          <DxCheckBox
          v-model:value="showDayHeaders"
          text="Show Day Headers"
          />
        </div>

        <div class="option">
          <span>Day Headers Format:</span>
          <DxSelectBox
          :items="dhFormat"
          v-model:value="dayHeaderFormat"
          />
        </div>

        <div class="option-separator"></div>

        <div class="option">
          <DxCheckBox
          v-model:value="showMsgTime"
          text="Show Message Timestamp"
          />
        </div>

        <div class="option">
          <span>Message Timestamp Format:</span>
          <DxSelectBox
          :items="msgFormat"
          v-model:value="messageTimestampFormat"
          />
        </div>

        <div class="option-separator"></div>

        <div class="option">
          <div id="chat-disabled"></div>
          <DxCheckBox
          v-model:value="isDisabled"
          text="Chat Disabled"
          />
        </div>
      </div>
</template>

<style scoped>
    #app {
        min-width: 720px;
        display: flex;
        gap: 20px;
    }

    .chat-container {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
    }

    .options {
        padding: 20px;
        display: flex;
        flex-direction: column;
        min-width: 280px;
        background-color: rgba(191, 191, 191, 0.15);
        gap: 16px;
    }

    .dx-chat {
        max-width: 480px;
    }

    .caption {
        font-size: var(--dx-font-size-sm);
        font-weight: 500;
    }

    .option-separator {
        border-bottom: 1px solid var(--dx-color-border);
    }

    .dx-avatar {
        border: 1px solid var(--dx-color-border);
    }
</style>

<script setup lang="ts">
    import { ref } from 'vue';
    import DxChat from 'devextreme-vue/chat';
    import DxCheckBox from 'devextreme-vue/check-box';
    import DxSelectBox from 'devextreme-vue/select-box';
    import { messages, currentUser, dayHeaderFormat as dhFormat, messageTimestampFormat as msgFormat } from './data.ts';

    const showAvatar = ref(true);
    const showUsername = ref(true);
    const showDayHeaders = ref(true);
    const showMsgTime = ref(true);
    const dayHeaderFormat = ref(dhFormat[0]);
    const messageTimestampFormat = ref(msgFormat[0]);
    const isDisabled = ref(false);
    
    function onMessageEntered(event) {
        messages.value = [...messages.value, event.message];
    }


</script>
