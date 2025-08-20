<template>
  <div class="chat-container">
    <DxChat
      :height="600"
      :data-source="dataSource"
      :user="currentUser"
      :reload-on-change="false"
      @messageEntered="onMessageEntered"
      @messageDeleted="onMessageDeleted"
      @messageUpdated="onMessageUpdated"
    >
      <DxEditing
        :allow-deleting="allowDeleting"
        :allow-updating="allowUpdating"
      />
    </DxChat>
  </div>
  <div class="options">
    <div class="caption">Options</div>
    <div class="option">
      <span>Allow Editing:</span>
      <DxSelectBox
        :items="editingOptions"
        value-expr="key"
        display-expr="text"
        :input-attr="allowEditingLabel"
        :value="selectedEditingStrategy"
        @valueChanged="onAllowEditingChange"
      />
    </div>
    <div class="option">
      <span>Allow Deleting:</span>
      <DxSelectBox
        :items="editingOptions"
        value-expr="key"
        display-expr="text"
        :input-attr="allowDeletingLabel"
        :value="selectedDeletingStrategy"
        @valueChanged="onAllowDeletingChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DxChat, DxEditing, type DxChatTypes } from 'devextreme-vue/chat';
import { DxSelectBox, type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { Guid } from 'devextreme-vue/common';
import { CustomStore, DataSource } from 'devextreme-vue/common/data';
import {
  messages as initialMessages,
  currentUser,
  editingOptions,
  allowEditingLabel,
  allowDeletingLabel,
} from './data.ts';

const store = [...initialMessages];

const customStore = new CustomStore({
  key: 'id',
  load: async() => store,
  insert: async(message: DxChatTypes.Message) => {
    store.push(message);
    return message;
  },
});

const dataSource = computed(() => new DataSource({
  store: customStore,
  paginate: false,
}));

const onMessageEntered = ({ message }: DxChatTypes.MessageEnteredEvent) => {
  const newMessage = {
    id: new Guid().toString(),
    ...message,
  };

  dataSource.value.store().push([
    {
      type: 'insert',
      key: newMessage.id,
      data: newMessage,
    },
  ]);
};

const onMessageDeleted = ({ message }: DxChatTypes.MessageDeletedEvent) => {
  dataSource.value.store().push([
    {
      type: 'update',
      key: message.id,
      data: { isDeleted: true },
    },
  ]);
};

const onMessageUpdated = ({ message, text }: DxChatTypes.MessageUpdatedEvent) => {
  dataSource.value.store().push([
    {
      type: 'update',
      key: message.id,
      data: { text, isEdited: true },
    },
  ]);
};

const editingStrategy = {
  enabled: true,
  disabled: false,
  custom: ({ component, message }: { component: DxChat['instance'], message: DxChatTypes.Message }) => {
    const { items, user } = component.option();
    const userId = user.id;

    const lastNotDeletedMessage = items.findLast(
      (item: any) => item.author?.id === userId && !item.isDeleted
    );

    return message.id === lastNotDeletedMessage?.id;
  },
};

const selectedEditingStrategy = ref('enabled');
const selectedDeletingStrategy = ref('enabled');

const allowUpdating = ref(editingStrategy[selectedEditingStrategy.value]);
const allowDeleting = ref(editingStrategy[selectedDeletingStrategy.value]);

const onAllowEditingChange = (event: DxSelectBoxTypes.ValueChangedEvent) => {
  selectedEditingStrategy.value = event.value;
  allowUpdating.value = editingStrategy[event.value];
};

const onAllowDeletingChange = (event: DxSelectBoxTypes.ValueChangedEvent) => {
  selectedDeletingStrategy.value = event.value;
  allowDeleting.value = editingStrategy[event.value];
};
</script>

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
