<template>
  <div>
    <div>{{ itemData.name }}</div>
    <div>{{ itemData.phone }}</div>
    <div>{{ itemData.email }}</div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  itemData?: Record<string, any>
}>(), {
  itemData: () => ({}),
});
</script>
