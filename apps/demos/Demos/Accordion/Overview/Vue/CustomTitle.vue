<template>
  <div class="header">{{ itemData.CompanyName }}</div>
</template>
<script setup lang="ts">
import { type CompanyData } from './data';

defineProps<{
  itemData: CompanyData
}>();
</script>
