<template>
  <div class="header">{{ itemData.CompanyName }}</div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  itemData?: Record<string, any>
}>(), {
  itemData: () => ({}),
});
</script>
