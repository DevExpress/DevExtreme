<template>
  <DxFileManager
    :file-system-provider="fileItems"
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
</template>

<script>
import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
import { fileItems } from './data.js';

export default {
  components: {
    DxFileManager,
    DxPermissions
  },

  data() {
    return {
      fileItems
    };
  }
};
</script>
