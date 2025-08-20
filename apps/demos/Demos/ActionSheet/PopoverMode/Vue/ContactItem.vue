<template>
  <div>
    <div>{{ itemData.name }}</div>
    <div>{{ itemData.phone }}</div>
    <div>{{ itemData.email }}</div>
  </div>
</template>
<script setup lang="ts">
import { type ContactInfo } from './data.ts';

defineProps<{
  itemData?: ContactInfo
}>();
</script>
