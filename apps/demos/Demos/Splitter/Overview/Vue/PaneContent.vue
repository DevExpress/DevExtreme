<template>
    <div class="pane-content">
      <div class="pane-title">
        {{ data.title }}
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
  