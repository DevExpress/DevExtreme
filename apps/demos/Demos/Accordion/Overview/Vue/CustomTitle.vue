<template>
  <div class="header">{{ itemData.CompanyName }}</div>
</template>
<script setup lang="ts">
import { type CompanyData } from './data.ts';

defineProps<{
  itemData: CompanyData
}>();
</script>
