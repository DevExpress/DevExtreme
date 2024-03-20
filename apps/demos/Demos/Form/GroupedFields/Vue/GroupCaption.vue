<template>
  <div>
    <i :class="`dx-icon dx-icon-${icon}`"/><span>{{ data.caption }}</span>
  </div>
</template>
<script setup lang="ts">

withDefaults(defineProps<{
  data?: Record<string, any>
  icon?: string
}>(), {
  data: () => {},
  icon: 'info',
});
</script>
