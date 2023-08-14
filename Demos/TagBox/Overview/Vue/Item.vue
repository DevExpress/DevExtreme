<template>
  <div class="custom-item">
    <img :src="itemData.ImageSrc">
    <div class="product-name">
      {{ itemData.Name }}
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  itemData?: {[key:string]: string}
}>(), {
  itemData: () => ({ Name: '' }),
});
</script>
