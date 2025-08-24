<template>
  <div className="task__header" :title="text">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string,
}>();
</script>

<style>
.task__header {
  padding: 18px 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
