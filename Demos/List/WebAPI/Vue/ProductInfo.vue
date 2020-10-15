<template>
  <div>
    <div>{{ item.CategoryName }}</div>
    <div>{{ item.ProductName }}</div>
    <b class="price">{{ currency(item.UnitPrice) }}</b>
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
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    currency(data) {
      return currencyFormatter.format(data);
    }
  }
};
</script>
