<template>
  <div id="toast">

    <h1>Product List</h1>

    <ul>
      <ProductItem
        v-for="product in products"
        :key="product.ID"
        :product="product"
      />
    </ul>
  </div>
</template>
<script>
import { products } from './data.js';
import ProductItem from './ProductItem.vue';

export default {
  components: {
    ProductItem
  },

  data() {
    return {
      products
    };
  }
};
</script>
<style>
#toast {
  padding: 10px;
}

#toast ul {
  text-align: center;
  list-style-type: none;
  margin: 20px 0;
}

#toast ul li {
  display: inline-block;
  width: 160px;
  margin: 10px;
}

#toast ul li img {
  width: 100px;
}

.dx-toast-content {
  min-width: 300px;
  max-width: 400px;
}
</style>
