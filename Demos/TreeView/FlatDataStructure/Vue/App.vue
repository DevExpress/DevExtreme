<template>
  <div class="form">
    <DxTreeView
      id="simple-treeview"
      :items="products"
      :width="300"
      data-structure="plain"
      parent-id-expr="categoryId"
      key-expr="ID"
      display-expr="name"
      @item-click="selectItem"
    />
    <div
      v-if="currentItem.price"
      id="product-details"
    >
      <img :src="currentItem.icon">
      <div class="name">{{ currentItem.name }}</div>
      <div class="price">{{ "$" + currentItem.price }}</div>
    </div>
  </div>
</template>
<script>
import DxTreeView from 'devextreme-vue/tree-view';

import service from './data.js';

export default {
  components: {
    DxTreeView,
  },
  data() {
    const products = service.getProducts();
    return {
      products,
      currentItem: products[0],
    };
  },
  methods: {
    selectItem(e) {
      this.currentItem = e.itemData;
    },
  },
};
</script>
<style scoped>
#simple-treeview,
#product-details {
  display: inline-block;
}

#product-details {
  vertical-align: top;
  width: 400px;
  height: 420px;
  margin-left: 20px;
}

#product-details > img {
  border: none;
  height: 300px;
  width: 400px;
}

#product-details > .name {
  text-align: center;
  font-size: 20px;
}

#product-details > .price {
  text-align: center;
  font-size: 24px;
}

.dark #product-details > div {
  color: #f0f0f0;
}

.hidden {
  visibility: hidden;
}
</style>
