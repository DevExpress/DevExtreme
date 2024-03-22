<template>
  <div class="pane-content">
    <div class="pane-title">
      {{ data.text }}
    </div>
    <div class="pane-state">
      {{ getStateText() }}
    </div>

    <div
      class="pane-option"
      v-for="(value, key) in filteredData"
      :key="key"
    >
      {{ `${key}: ${value}` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps<{
  data: Record<string, any>
}>();

const { data } = props;

const dimensionOptions = new Set(['size', 'minSize', 'maxSize']);

const getStateText = () => `${data.resizable ? 'Resizable ' : ''}${data.resizable && data.collapsible ? 'and' : ''}${data.collapsible ? ' Collapsible' : ''}`

const filteredData = computed(() => Object.fromEntries(
  Object.entries(data)
    .filter(([key]) => dimensionOptions.has(key))
));
</script>

<style scoped>
  .pane-content {
    padding: 12px;
  }
  .pane-title {
    font-weight: 600;
    margin-bottom: 2px;
  }
  .pane-state {
    font-size: var(--dx-font-size-xs);
    margin-bottom: 4px;
  }
  .pane-option {
    color: var(--dx-texteditor-color-label);
    font-size: 10px;
  }
</style>
