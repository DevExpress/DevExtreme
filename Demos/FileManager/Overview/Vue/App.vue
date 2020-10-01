<template>
  <div>
    <DxFileManager
      :file-system-provider="remoteProvider"
      :on-selected-file-opened="displayImagePopup"
      current-path="Widescreen"
    >
      <DxPermissions
        :create="true"
        :copy="true"
        :move="true"
        :delete="true"
        :rename="true"
        :upload="true"
        :download="true"
      />
    </DxFileManager>

    <DxPopup
      :close-on-outside-click="true"
      v-model:visible="popupVisible"
      v-model:title="imageItemToDisplay.name"
      max-height="600"
      class="photo-popup-content"
    >
      <img
        :src="imageItemToDisplay.url"
        class="photo-popup-image"
      >
    </DxPopup>
  </div>
</template>

<script>
import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
import { DxPopup } from 'devextreme-vue/popup';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

const remoteProvider = new RemoteFileSystemProvider({
  endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images'
});

export default {
  components: {
    DxFileManager,
    DxPermissions,
    DxPopup
  },

  data() {
    return {
      remoteProvider,
      popupVisible: false,
      imageItemToDisplay: {}
    };
  },

  methods: {
    displayImagePopup(e) {
      this.imageItemToDisplay = {
        name: e.file.name,
        url: e.file.dataItem.url
      };
      this.popupVisible = true;
    }
  }
};
</script>

<style>
.photo-popup-content {
    text-align: center;
}
.photo-popup-content .photo-popup-image {
    height: 100%;
    max-width: 100%;
}
</style>
