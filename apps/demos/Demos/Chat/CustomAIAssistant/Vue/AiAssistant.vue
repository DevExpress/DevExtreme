<template>
  <DxPopup
    v-model:visible="popupVisible"
    title="AI Assistant"
    :wrapperAttr="{ class: 'chat-popup' }"
    :width="400"
    height="90%"
    :dragEnabled="true"
    :resizeEnabled="true"
    :showCloseButton="true"
    :shading="false"
    :position="popupPosition"
    :onHiding="onPopupHiding"
    :onShowing="onPopupShowing"
  >
    <DxToolbarItem
      toolbar="top"
      location="after"
      widget="dxButton"
      :cssClass="CLASSES.clearChatButton"
      :options="clearButtonOptions"
    />

    <div class="ai-chat-content">
      <DxChat
        :disabled="disabled"
        height="100%"
        :showAvatar="false"
        width="auto"
        :dataSource="dataSource"
        :reloadOnChange="true"
        :user="chatUser"
        :showUserName="false"
        :speechToTextEnabled="true"
        emptyViewTemplate="empty-view"
        :onMessageEntered="onMessageEntered"
      >
        <DxSuggestions
          :items="suggestions"
          :onItemClick="onSuggestionClick"
        />
        <template #empty-view>
          <div class="dx-chat-messagelist-empty-image dx-ai-chat__empty-image"/>
          <div class="ai-chat-empty-message">{{ emptyViewMessage }}</div>
          <div
            class="ai-chat-empty-prompt"
            v-html="emptyViewPromptHtml"
          />
        </template>
      </DxChat>
    </div>
  </DxPopup>

  <DxSpeedDialAction
    icon="sparkle"
    label="AI Assistant"
    :visible="fabVisible"
    :onClick="toggle"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import DxChat, { DxSuggestions } from 'devextreme-vue/chat';
import type { DxChatTypes } from 'devextreme-vue/chat';
import { DxSpeedDialAction } from 'devextreme-vue/speed-dial-action';
import type { DxButtonTypes } from 'devextreme-vue/button';
import type dxButton from 'devextreme/ui/button';
import { ArrayStore, DataSource } from 'devextreme-vue/common/data';
import {
  CLASSES, chatSuggestions, EMPTY_VIEW_MESSAGE, EMPTY_VIEW_PROMPT,
} from './data.ts';

interface AiAssistantProps { disabled: boolean }
interface AiAssistantEmits { (e: 'message-submitted', message: DxChatTypes.TextMessage): void }

const props = defineProps<AiAssistantProps>();
const emit = defineEmits<AiAssistantEmits>();

const emptyViewMessage = EMPTY_VIEW_MESSAGE;
const emptyViewPromptHtml = EMPTY_VIEW_PROMPT;
const suggestions = chatSuggestions;
const chatUser = { id: 'user' };

const popupPosition = {
  my: 'right top',
  at: 'right top',
  of: '.demo-container',
  offset: '-20 20',
};

const popupVisible = ref(false);
const fabVisible = ref(true);
const isClearDisabled = ref(true);
const clearButtonInstance = ref<dxButton>();

const store = new ArrayStore({ key: 'id' });
const dataSource = new DataSource({ store, paginate: false });

const clearButtonOptions = {
  icon: 'clearhistory',
  disabled: true,
  hint: 'Clear chat',
  onClick: () => clearChat(),
  onInitialized: (e: DxButtonTypes.InitializedEvent) => {
    clearButtonInstance.value = e.component;
  },
};

function updateClearButtonState() {
  isClearDisabled.value = dataSource.items().length === 0;
  clearButtonInstance.value?.option('disabled', isClearDisabled.value);
}

function pushMessage(message: Partial<DxChatTypes.TextMessage>) {
  store.push([
    {
      type: 'insert',
      data: {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        ...message,
      },
    },
  ]);
}

function clearChat() {
  store.clear();
  dataSource.reload();
  updateClearButtonState();
}

function toggle() {
  popupVisible.value = !popupVisible.value;
}

function onPopupShowing() {
  fabVisible.value = false;
}

function onPopupHiding() {
  fabVisible.value = true;
}

function onSuggestionClick(e: { itemData?: { prompt?: string } }) {
  const { prompt } = e.itemData ?? {};

  const message: DxChatTypes.TextMessage = {
    id: Date.now() + Math.random(),
    timestamp: new Date(),
    author: { id: 'user' },
    text: prompt,
  };

  pushMessage(message);
  emit('message-submitted', message);
}

function onMessageEntered(e: DxChatTypes.MessageEnteredEvent) {
  emit('message-submitted', e.message);
}

watch(() => props.disabled, (disabled) => {
  if (!disabled) {
    updateClearButtonState();
  }
});

defineExpose({ pushMessage });
</script>

<style>
.ai-chat-content {
  height: 100%;
}

.dx-chat {
  max-width: 900px;
  border-radius: 0;
  min-height: 20em;
}

.ai-chat-empty-message {
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  color: var(--dx-color-text);
  margin-bottom: 8px;
}

.ai-chat-empty-prompt {
  font-size: 14px;
  color: #888;
  text-align: center;
  padding: 0 24px;
  white-space: pre-line;
}

.ai-chat-clear-button {
  margin-right: 8px;
}

.chat-popup .dx-popup-content {
  padding: 0;
}

.dx-chat-messagebox {
  border-top-color: transparent;
}

.dx-chat-messagelist-empty-view,
.dx-chat-messagebox {
  padding-top: 0;
}
</style>
