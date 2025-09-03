<template>
  <div class="custom-addon">
    <img
      v-if="fieldData"
      alt="Product name"
      :src="fieldData.ImageSrc"
    >
  </div>
</template>
<script setup lang="ts">
import DxTextBox from 'devextreme-vue/text-box';

withDefaults(defineProps<{
  fieldData?: Record<string, any>
}>(), {
  fieldData: () => ({} as Record<string, any>),
});
</script>
