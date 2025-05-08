<template>
  <div class="chat-container">
    <DxChat
      :height="600"
      :data-source="dataSource"
      :user="currentUser"
      :reload-on-change="false"
      v-model:editing="chatEditing"
      @messageEntered="onMessageEntered"
      @messageDeleted="onMessageDeleted"
      @messageUpdated="onMessageUpdated"
    />
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
        :value="editingOptions[0].key"
        @valueChanged="(e) => handleEditingChange(e, 'allowUpdating')"
      />
    </div>
    <div class="option">
      <span>Allow Deleting:</span>
      <DxSelectBox
        :items="editingOptions"
        value-expr="key"
        display-expr="text"
        :input-attr="allowDeletingLabel"
        :value="editingOptions[0].key"
        @valueChanged="(e) => handleEditingChange(e, 'allowDeleting')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DxChat from 'devextreme-vue/chat';
import DxSelectBox from 'devextreme-vue/select-box';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import Guid from 'devextreme/core/guid';
import {
  messages as initialMessages,
  currentUser,
  editingOptions,
  allowEditingLabel,
  allowDeletingLabel,
} from './data.ts';

const chatEditing = ref<{ allowUpdating?: boolean, allowDeleting?: boolean }>({
  allowUpdating: true,
  allowDeleting: true,
});

const store = [...initialMessages];

const customStore = new CustomStore({
  key: 'id',
  load: async() => store,
  insert: async(message) => {
    store.push(message);
    return message;
  },
});

const dataSource = computed(() => new DataSource({
  store: customStore,
  paginate: false,
}));

const onMessageEntered = ({ message }) => {
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

const onMessageDeleted = ({ message }) => {
  dataSource.value.store().push([
    {
      type: 'update',
      key: message.id,
      data: { isDeleted: true },
    },
  ]);
};

const onMessageUpdated = ({ message, text }) => {
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
  custom: ({ component, message }) => {
    const { items, user } = component.option();
    const userId = user.id;

    const lastNotDeletedMessage = items.findLast(
      (item) => item.author?.id === userId && !item.isDeleted
    );

    return message.id === lastNotDeletedMessage?.id;
  },
};

const handleEditingChange = (e, type: 'allowUpdating' | 'allowDeleting') => {
  chatEditing.value = { [type]: editingStrategy[e.value] };
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
