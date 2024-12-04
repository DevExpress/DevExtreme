<template>
    <div class="chat-container">
        <DxChat
            v-model:items="messages"
            v-model:user="currentUser"
            v-model:disabled = "isDisabled"
            v-model:showAvatar = "showAvatar"
            v-model:showUserName = "showUsername"
            v-model:showDayHeaders = "showDayHeaders"
            v-model:showMessageTimestamp = "showMessageTime"
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
            text="Avatar"
          />
        </div>

        <div class="option">
          <DxCheckBox
            v-model:value="showUsername"
            text="User Name"
          />
        </div>

        <div class="option-separator"></div>

        <div class="option">
          <DxCheckBox
            v-model:value="showDayHeaders"
            :input-attr="dayHeaderLabel"
            text="Day Header"
          />
        </div>

        <div class="option">
          <span>Day Header Format:</span>
          <DxSelectBox
            :items="headerFormat"
            :input-attr="dayHeaderLabel"
            v-model:value="dayHeaderFormat"
          />
        </div>

        <div class="option-separator"></div>

        <div class="option">
          <DxCheckBox
            v-model:value="showMessageTime"
            text="Message Timestamp"
          />
        </div>

        <div class="option">
          <span>Message Timestamp Format:</span>
          <DxSelectBox
            :items="messageFormat"
            :input-attr="messageTimestampLabel"
            v-model:value="messageTimestampFormat"
          />
        </div>

        <div class="option-separator"></div>

        <div class="option">
          <DxCheckBox
            v-model:value="isDisabled"
            text="Disable Chat"
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
    import { 
      messages,
      currentUser,
      dayHeaderFormat as headerFormat,
      messageTimestampFormat as messageFormat,
      messageTimestampLabel,
      dayHeaderLabel
    } from './data.ts';

    const showAvatar = ref(true);
    const showUsername = ref(true);
    const showDayHeaders = ref(true);
    const showMessageTime = ref(true);
    const dayHeaderFormat = ref(headerFormat[0]);
    const messageTimestampFormat = ref(messageFormat[0]);
    const isDisabled = ref(false);
    
    function onMessageEntered(event) {
        messages.value = [...messages.value, event.message];
    }


</script>
