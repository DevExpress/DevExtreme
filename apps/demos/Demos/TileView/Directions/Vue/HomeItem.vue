<template>
  <div
    :style="{backgroundImage: 'url(' + itemData.ImageSrc + ')'}"
    class="tile-image"
  />
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  itemData?: Record<string, any>
}>(), {
  itemData: () => ({} as Record<string, any>),
});
</script>
<style scoped>
  .tile-image {
    height: 100%;
    width: 100%;
    background-position: center;
    background-size: cover;
    display: block;
  }
</style>
