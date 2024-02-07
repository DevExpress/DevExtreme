<template>
  <div>
    <div>{{ item.CategoryName }}</div>
    <div>{{ item.ProductName }}</div>
    <b class="price">{{ currency(item.UnitPrice) }}</b>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  item?: Record<string, unknown>
}>(), {
  item: () => ({}),
});

function currency(data) {
  return currencyFormatter.format(data);
}
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
</script>
