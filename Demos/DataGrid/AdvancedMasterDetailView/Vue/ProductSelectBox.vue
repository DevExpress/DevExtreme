<template>
  <DxSelectBox
    :defer-rendering="false"
    :data-source="dataSource"
    :value="value"
    value-expr="ProductID"
    display-expr="ProductName"
    @valueChanged="$emit('product-changed', $event.value)"
  />
</template>

<script>

import { DxSelectBox } from 'devextreme-vue';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

export default {
  components: { DxSelectBox },
  props: {
    supplierId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dataSource: createStore({
        key: 'ProductID',
        loadParams: { SupplierID: this.supplierId },
        loadUrl: `${url}/GetProductsBySupplier`,
        onLoaded: this.setDefaultValue
      }),
      value: null
    };
  },
  methods: {
    setDefaultValue(items) {
      let firstItem = items[0];
      if(firstItem && this.value === null) {
        this.value = firstItem.ProductID;
      }
    }
  }
};
</script>
