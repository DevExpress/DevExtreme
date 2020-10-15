<template>
  <div>
    <div class="product">
      <img :src="item.ImageSrc">
      <div>{{ item.Name }}</div>
      <div class="price">{{ currency(item.Price) }}</div>
    </div>
  </div>
</template>
<script>

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
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
<style scoped>
.product {
    height: 65px;
}

.product > img {
    height: 100%;
    width: 95px;
    float: left;
}

.product > div {
    padding-left: 10px;
    vertical-align: top;
    line-height: 65px;
    font-size: 15px;
    float: left;
}

.product > div.price {
    float: right;
    font-size: 18px;
}
</style>
