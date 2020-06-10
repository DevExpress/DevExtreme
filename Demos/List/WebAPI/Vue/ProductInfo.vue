<template>
  <div>
    <div>{{ item.CategoryName }}</div>
    <div>{{ item.ProductName }}</div>
    <b class="price">{{ item.UnitPrice | currency }}</b>
  </div>
</template>
<script>

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export default {
  filters: {
    currency(data) {
      return currencyFormatter.format(data);
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
};
</script>
