<template>
  <div class="custom-icon">
    <span class="dx-icon-box icon"/>
    {{ itemData.key }}
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  itemData?: {[key:string]: unknown}
}>(), {
  itemData: () => ({ key: '' }),
});
</script>
<style scoped>
  .custom-icon .icon {
    color: #f05b41;
  }

  .custom-icon {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
