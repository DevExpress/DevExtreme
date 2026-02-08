<template>
  <div>
    <div>{{ item.CategoryName }}</div>
    <div>{{ item.ProductName }}</div>
    <b class="price">{{ currency(item.UnitPrice) }}</b>
  </div>
</template>
<script setup lang="ts">
type Item = { CategoryName: string, ProductName: string, UnitPrice: number };

withDefaults(defineProps<{
  item?: Item
}>(), {
  item: () => ({} as Item),
});

function currency(data: number) {
  return currencyFormatter.format(data);
}
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
</script>
