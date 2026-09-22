<template>
  <div class="demo-container">
    <EmployeeForm
      ref="employeeFormRef"
      :aiIntegration="aiIntegration"
    />
    <TaskGrid ref="taskGridRef"/>
    <AiAssistant
      ref="aiAssistantRef"
      :disabled="chatDisabled"
      @message-submitted="onMessageSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-vue/common/core/localization';
import type { DxChatTypes } from 'devextreme-vue/chat';
import EmployeeForm from './EmployeeForm.vue';
import TaskGrid from './TaskGrid.vue';
import AiAssistant from './AiAssistant.vue';
import { createAiIntegration } from './aiService.ts';
import { routeMessage } from './chatRouter.ts';

config({
  editorStylingMode: 'filled',
});

config({
  floatingActionButtonConfig: {
    position: {
      my: 'right bottom',
      at: 'right bottom',
      of: '#grid-container',
      offset: '-16 -16',
    },
  },
});

loadMessages({
  en: {
    'dxChat-textareaPlaceholder': 'Enter a prompt...',
  },
});

const employeeFormRef = ref<InstanceType<typeof EmployeeForm>>();
const taskGridRef = ref<InstanceType<typeof TaskGrid>>();
const aiAssistantRef = ref<InstanceType<typeof AiAssistant>>();

const aiIntegration = createAiIntegration();
const chatDisabled = ref(false);

async function onMessageSubmitted(message: DxChatTypes.TextMessage): Promise<void> {
  chatDisabled.value = true;

  try {
    await routeMessage(message.text ?? '', {
      form: employeeFormRef.value!.instance,
      gridInstance: taskGridRef.value!.instance,
      aiIntegration,
      pushMessage: (msg) => aiAssistantRef.value!.pushMessage(msg),
    });
  } finally {
    chatDisabled.value = false;
  }
}
</script>

<style scoped>
.demo-container {
  margin: 20px;
  height: 556px;
}
</style>
