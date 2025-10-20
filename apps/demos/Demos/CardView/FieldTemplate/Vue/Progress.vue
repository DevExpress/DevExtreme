<template>
  <div className="task__progress">
    <DxProgressBar
      :value="value"
      :element-attr="{ 'aria-label': 'Progress Bar' }"
      :statusFormat="statusFormat"
    />
  </div>
</template>

<script setup lang="ts">
import { DxProgressBar } from 'devextreme-vue/progress-bar';

const props = defineProps<{
  value: number,
}>();

const statusFormat = (_: unknown, value: number) => `${value}%`;
</script>

<style>
.task__progress {
  padding-top: 4px;
}
</style>
