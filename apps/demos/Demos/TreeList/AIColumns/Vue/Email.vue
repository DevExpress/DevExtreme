<template>
  <a :href="`mailto:${email}`">{{ email }}</a>
</template>

<script setup lang="ts">
defineProps<{
  email: string,
}>();
</script>
