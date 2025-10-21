<template>
  <div>
    <div>{{ itemData.name }}</div>
    <div>{{ itemData.phone }}</div>
    <div>{{ itemData.email }}</div>
  </div>
</template>
<script setup lang="ts">
import { type ContactInfo } from './data';

defineProps<{
  itemData: ContactInfo
}>();
</script>
