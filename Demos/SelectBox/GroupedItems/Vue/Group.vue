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
    font-size: 17px;
    color: #f05b41;
    margin-right: 2px;
  }
</style>
