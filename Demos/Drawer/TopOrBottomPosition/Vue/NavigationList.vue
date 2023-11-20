<template>
  <div>
    <DxList
      :data-source="navigation"
      :active-state-enabled="false"
      :hover-state-enabled="false"
      :focus-state-enabled="false"
      class="panel-list dx-theme-typography-background-color"
    />
  </div>
</template>
<script setup lang="ts">
import { DxList } from 'devextreme-vue/list';
import { navigation } from './data.js';
</script>
