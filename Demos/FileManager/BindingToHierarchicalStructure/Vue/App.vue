<template>
  <DxFileManager
    :height="450"
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

<script setup lang="ts">
import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
import { fileItems } from './data.js';
</script>
