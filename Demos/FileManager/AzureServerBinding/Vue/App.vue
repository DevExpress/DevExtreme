<template>
  <div
    id="wrapper"
    :class="wrapperClassName"
  >
    <DxLoadPanel
      :position="loadPanelPosition"
      v-model:visible="loadPanelVisible"
    />
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
    <div id="message-box">
      To run the demo locally, specify your Azure storage account name, access key and container name in the web.config file.
      Refer to the
      <a
        href="https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureServerBinding/Vue/Light/"
        target="_blank"
      >
        https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/AzureServerBinding/Vue/Light/
      </a>
      to see the demo online.
    </div>
  </div>
</template>

<script>
import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { DxLoadPanel } from 'devextreme-vue/load-panel';

const fileSystemProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure'
});

const allowedFileExtensions = [];

export default {
  components: {
    DxFileManager,
    DxPermissions,
    DxLoadPanel
  },

  data() {
    return {
      fileSystemProvider,
      allowedFileExtensions,
      loadPanelPosition: { of: '#file-manager' },
      loadPanelVisible: true,
      wrapperClassName: ''
    };
  },

  created() {
    fetch('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager')
      .then(response => response.json())
      .then(result => {
        this.wrapperClassName = result.active ? 'show-widget' : 'show-message';
        this.loadPanelVisible = false;
      });
  }
};
</script>
<style>
#wrapper #file-manager {
    visibility: hidden;
}

#wrapper #message-box {
    display: none;
}

#wrapper.show-widget #file-manager {
    visibility: visible;
}

#wrapper.show-message #file-manager {
    display: none;
}

#wrapper.show-message #message-box {
    display: block;
}
</style>
