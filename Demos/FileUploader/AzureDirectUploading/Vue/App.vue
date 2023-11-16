<template>
  <div
    id="wrapper"
    :class="wrapperClassName"
  >
    <DxLoadPanel
      :position="loadPanelPosition"
      v-model:visible="loadPanelVisible"
    />
    <div id="widget-area">
      <DxFileUploader
        id="file-uploader"
        :chunk-size="200000"
        :max-file-size="1048576"
        :upload-chunk="uploadChunk"
      />
      <div id="request-panel">
        <div
          class="request-info"
          v-for="(request, index) in requests"
          :key="index"
        >
          <div class="parameter-info">
            <div class="parameter-name">Method:</div>
            <div class="parameter-value dx-theme-accent-as-text-color">{{ request.method }}</div>
          </div>
          <div class="parameter-info">
            <div class="parameter-name">Url path:</div>
            <div class="parameter-value dx-theme-accent-as-text-color">{{ request.urlPath }}</div>
          </div>
          <div class="parameter-info">
            <div class="parameter-name">Query string:</div>
            <div
              class="parameter-value dx-theme-accent-as-text-color"
            >{{ request.queryString }}</div>
          </div>
          <br>
        </div>
      </div>
    </div>
    <div id="message-box">
      To run the demo locally, specify your Azure storage account name,
      access key and container name in the web.config file.
      Refer to the
      <a
        href="https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileUploader/AzureDirectUploading/Vue/Light/"
        target="_blank"
      >
        https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileUploader/AzureDirectUploading/Vue/Light/
      </a>
      to see the demo online.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import { AzureGateway } from './azure.file.system.js';

const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
const loadPanelPosition = { of: '#file-uploader' };
const loadPanelVisible = ref(true);
const wrapperClassName = ref('');
const requests = reactive<Record<string, unknown>[]>([]);
const onRequestExecuted = ({ method, urlPath, queryString }) => {
  const request = { method, urlPath, queryString };
  requests.unshift(request);
};
const gateway = new AzureGateway(endpointUrl, onRequestExecuted);

function uploadChunk(file, uploadInfo) {
  let promise;

  if (uploadInfo.chunkIndex === 0) {
    // eslint-disable-next-line spellcheck/spell-checker
    promise = gateway.getUploadAccessUrl(file.name).then((accessUrls) => {
      // eslint-disable-next-line spellcheck/spell-checker
      uploadInfo.customData.accessUrl = accessUrls.url1;
    });
  } else {
    promise = Promise.resolve();
  }

  promise = promise.then(() => gateway.putBlock(
    uploadInfo.customData.accessUrl,
    uploadInfo.chunkIndex,
    uploadInfo.chunkBlob,
  ));

  if (uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
    promise = promise.then(() => gateway.putBlockList(
      uploadInfo.customData.accessUrl,
      uploadInfo.chunkCount,
    ));
  }

  return promise;
}

fetch('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager')
  .then((response) => response.json())
  .then((result) => {
    wrapperClassName.value = result.active ? 'show-widget' : 'show-message';
    loadPanelVisible.value = false;
  });
</script>
<style>
#widget-area {
  visibility: hidden;
}

#message-box {
  display: none;
}

.show-widget #widget-area {
  visibility: visible;
}

.show-message #widget-area {
  display: none;
}

.show-message #message-box {
  display: block;
}

#request-panel {
  min-width: 505px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 18px;
  margin-top: 40px;
  background-color: rgba(191, 191, 191, 0.15);
}

#request-panel .parameter-info {
  display: flex;
}

.request-info .parameter-name {
  flex: 0 0 100px;
}

.request-info .parameter-name,
.request-info .parameter-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
