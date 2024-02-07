<template>
  <div id="template-content">
    <i
      id="helpedInfo"
      class="dx-icon dx-icon-info"
    />
    Additional
    <br>
    {{ data.text }}

    <DxTooltip
      target="#helpedInfo"
      show-event="mouseenter"
      hide-event="mouseleave"
    >
      <template #content>
        <div id="tooltip-content">This field must not exceed 200 characters</div>
      </template>
    </DxTooltip>
  </div>
</template>
<script setup lang="ts">
import { DxTooltip } from 'devextreme-vue/tooltip';

withDefaults(defineProps<{
  data?: Record<string, any>
}>(), {
  data: () => ({}),
});
</script>
<style scoped>
#helpedInfo {
  color: #42a5f5;
}

#tooltip-content {
  font-size: 14px;
  font-weight: bold;
}

#template-content {
  display: inline-flex;
}
</style>
