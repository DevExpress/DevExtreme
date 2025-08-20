<template>
  <div style="width: 200px;">
    <DxList
      :data-source="navigation"
      class="panel-list"
    />
  </div>
</template>
<script setup lang="ts">
import { DxList } from 'devextreme-vue/list';
import { navigation } from './data.ts';
</script>
