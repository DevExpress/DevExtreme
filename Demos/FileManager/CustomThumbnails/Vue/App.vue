<template>
  <DxFileManager
    :file-system-provider="fileItems"
    :customize-thumbnail="customizeIcon"
    :height="450"
  >
    <DxItemView mode="thumbnails"/>
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
import { DxFileManager, DxPermissions, DxItemView } from 'devextreme-vue/file-manager';
import { fileItems } from './data.js';

export default {
  components: {
    DxFileManager,
    DxPermissions,
    DxItemView
  },

  data() {
    return {
      fileItems
    };
  },
  methods: {
    customizeIcon: function(fileSystemItem) {
      if(fileSystemItem.isDirectory) {
        return '../../../../images/thumbnails/folder.svg';
      }

      const fileExtension = fileSystemItem.getFileExtension();
      switch(fileExtension) {
        case '.txt':
          return '../../../../images/thumbnails/doc-txt.svg';
        case '.rtf':
          return '../../../../images/thumbnails/doc-rtf.svg';
        case '.xml':
          return '../../../../images/thumbnails/doc-xml.svg';
      }
    }
  }
};
</script>
