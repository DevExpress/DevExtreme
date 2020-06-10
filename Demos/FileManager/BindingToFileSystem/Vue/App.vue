<template>
  <DxFileManager
    :file-system-provider="remoteProvider"
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
</template>

<script>
import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-scripts'
});

const allowedFileExtensions = ['.js', '.json', '.css'];

export default {
  components: {
    DxFileManager,
    DxPermissions
  },

  data() {
    return {
      remoteProvider,
      allowedFileExtensions
    };
  }
};
</script>
