<template>
  <DxSelectBox
    :defer-rendering="false"
    :data-source="dataSource"
    :input-attr="{ 'aria-label': 'Product' }"
    :value="value"
    value-expr="ProductID"
    display-expr="ProductName"
    @valueChanged="$emit('product-changed', $event.value)"
  />
</template>

<script>

import DxSelectBox from 'devextreme-vue/select-box';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

export default {
  components: { DxSelectBox },
  props: {
    supplierId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dataSource: createStore({
        key: 'ProductID',
        loadParams: { SupplierID: this.supplierId },
        loadUrl: `${url}/GetProductsBySupplier`,
        onLoaded: this.setDefaultValue,
      }),
      value: null,
    };
  },
  methods: {
    setDefaultValue(items) {
      const firstItem = items[0];
      if (firstItem && this.value === null) {
        this.value = firstItem.ProductID;
      }
    },
  },
};
</script>
