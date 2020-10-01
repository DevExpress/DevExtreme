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
      <DxFileManager
        id="file-manager"
        :file-system-provider="fileSystemProvider"
        :allowed-file-extensions="allowedFileExtensions"
      >
        <!-- uncomment the code below to enable file/directory management -->
        <!-- <dx-permissions
          :create="true"
          :copy="true"
          :move="true"
          :delete="true"
          :rename="true"
          :upload="true"
          :download="true"
        /> -->
      </DxFileManager>
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
            <div class="parameter-value dx-theme-accent-as-text-color">{{ request.queryString }}</div>
          </div>
          <br>
        </div>
      </div>
    </div>
    <div id="message-box">
      To run the demo locally, specify your Azure storage account name, access key and container name in the web.config file.
      Refer to the
      <a
        href="https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureClientBinding/Vue/Light/"
        target="_blank"
      >
        https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureClientBinding/Vue/Light/
      </a>
      to see the demo online.
    </div>
  </div>
</template>

<script>
import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import { DxLoadPanel } from 'devextreme-vue/load-panel';

const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';

export default {
  components: {
    DxFileManager,
    DxPermissions,
    DxLoadPanel
  },

  data() {
    return {
      fileSystemProvider: new CustomFileSystemProvider({
        getItems,
        createDirectory,
        renameItem,
        deleteItem,
        copyItem,
        moveItem,
        uploadFileChunk,
        downloadItems
      }),
      allowedFileExtensions: [],
      loadPanelPosition: { of: '#file-manager' },
      loadPanelVisible: true,
      wrapperClassName: '',
      requests: []
    };
  },

  created() {
    const onRequestExecuted = ({ method, urlPath, queryString }) => {
      const request = { method, urlPath, queryString };
      this.requests.unshift(request);
    };
    gateway = new AzureGateway(endpointUrl, onRequestExecuted);
    azure = new AzureFileSystem(gateway);

    fetch('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager')
      .then(response => response.json())
      .then(result => {
        this.wrapperClassName = result.active ? 'show-widget' : 'show-message';
        this.loadPanelVisible = false;
      });
  }
};

function getItems(parentDirectory) {
  return azure.getItems(parentDirectory.path);
}

function createDirectory(parentDirectory, name) {
  return azure.createDirectory(parentDirectory.path, name);
}

function renameItem(item, name) {
  return item.isDirectory ? azure.renameDirectory(item.path, name) : azure.renameFile(item.path, name);
}

function deleteItem(item) {
  return item.isDirectory ? azure.deleteDirectory(item.path) : azure.deleteFile(item.path);
}

function copyItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory ? azure.copyDirectory(item.path, destinationPath) : azure.copyFile(item.path, destinationPath);
}

function moveItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory ? azure.moveDirectory(item.path, destinationPath) : azure.moveFile(item.path, destinationPath);
}

function uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
  let promise = null;

  if(uploadInfo.chunkIndex === 0) {
    const filePath = destinationDirectory.path ? `${destinationDirectory.path}/${fileData.name}` : fileData.name;
    promise = gateway.getUploadAccessUrl(filePath).done(accessUrl => {
      uploadInfo.customData.accessUrl = accessUrl;
    });
  } else {
    promise = Promise.resolve();
  }

  promise = promise.then(() => gateway.putBlock(uploadInfo.customData.accessUrl, uploadInfo.chunkIndex, uploadInfo.chunkBlob));

  if(uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
    promise = promise.then(() => gateway.putBlockList(uploadInfo.customData.accessUrl, uploadInfo.chunkCount));
  }

  return promise;
}

function downloadItems(items) {
  azure.downloadFile(items[0].path);
}

let gateway = null;
let azure = null;
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
