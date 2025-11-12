<template>
  <div class="chat-container">
    <DxChat
      :height="710"
      :data-source="dataSource"
      :reload-on-change="false"
      :user="currentUser"
      @message-entered="onMessageEntered($event)"
      @attachment-download-click="onAttachmentDownloadClick($event)"
    >
      <DxFileUploaderOptions
        :upload-file="uploadFile"
        @uploaded="onUploaded"
      />
    </DxChat>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxChat, { DxFileUploaderOptions, type DxChatTypes } from 'devextreme-vue/chat';
import { type DxFileUploaderTypes } from 'devextreme-vue/file-uploader';
import { Guid } from 'devextreme-vue/common';

import {
  dataSource,
  currentUser,
} from './data.ts';

const uploadedFilesMap = ref(new Map<string, string>());

function getFileUrl(filename: string): string | undefined {
  return uploadedFilesMap.value.get(filename);
}

function uploadFile(): void {};

function onUploaded({ file }: DxFileUploaderTypes.UploadedEvent): void {
  const url = URL.createObjectURL(file);
  uploadedFilesMap.value.set(file.name, url);
};

function onMessageEntered({ message }: DxChatTypes.MessageEnteredEvent): void {
  const attachmentsWithUrls = message.attachments?.map((attachment: DxChatTypes.Attachment) => ({
    ...attachment,
    url: getFileUrl(attachment.name),
  }));

  dataSource.store().push([{
    type: 'insert',
    data: {
      id: new Guid().toString(),
      ...message,
      attachments: attachmentsWithUrls,
    },
  }]);
}

function onAttachmentDownloadClick({ attachment }: DxChatTypes.AttachmentDownloadClickEvent): void {
  if (!attachment?.url) {
    return;
  }

  const link = document.createElement('a');
  link.setAttribute('href', attachment.url);
  link.setAttribute('download', attachment.name);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
.demo-container {
  min-width: 720px;
}

.chat-container {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.dx-chat {
  max-width: 480px;
}

.caption {
  font-size: var(--dx-font-size-sm);
  font-weight: 500;
}

.dx-avatar {
  border: 1px solid var(--dx-color-border);
}
</style>
