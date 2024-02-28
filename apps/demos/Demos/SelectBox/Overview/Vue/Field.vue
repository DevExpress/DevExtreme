<template>
  <div class="custom-item">
    <img
      v-if="fieldData"
      alt="Product name"
      :src="fieldData.ImageSrc"
    >
    <DxTextBox
      :value="fieldData?.Name"
      :read-only="true"
      :input-attr="{ 'aria-label': 'Name' }"
      class="product-name"
    />
  </div>
</template>
<script setup lang="ts">
import DxTextBox from 'devextreme-vue/text-box';

withDefaults(defineProps<{
  fieldData?: Record<string, any>
}>(), {
  fieldData: () => {},
});
</script>
