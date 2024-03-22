<template>
    <div class="pane-content">
      <div class="pane-title">
        {{ data.text }}
      </div>
      <div class="pane-state">
        {{ `${data.resizable ? 'Resizable ' : ''}${data.resizable && data.collapsible ? 'and' : ''}${data.collapsible ? ' Collapsible' : ''}` }}
      </div>
  
      <div class="pane-option" v-html="renderOptions()"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    data: Record<string, any>
  }>();
  const dimensionOptions = new Set(['size', 'minSize', 'maxSize']);
  
  const { data } = props;

  const renderOptions = () => {
    return Object.entries(data)
      .filter(([key]) => dimensionOptions.has(key))
      .map(([key, value]) => `<div class='pane-option'>${key}: ${value}</div>`).join('');
  }
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
