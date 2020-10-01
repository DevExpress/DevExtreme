<template>
  <div>
    <div class="filter-container">
      <DxFilterBuilder
        :fields="fields"
        v-model:value="filter"
      />
      <DxButton
        text="Apply Filter"
        type="default"
        @click="buttonClick()"
      />
      <div class="dx-clearfix"/>
    </div>
    <DxDataGrid
      :data-source="dataSource"
      :filter-value="gridFilterValue"
      :show-borders="true"
      :columns="fields"
      :height="300"
    />
  </div>
</template>
<script>
import DxFilterBuilder from 'devextreme-vue/filter-builder';
import DxButton from 'devextreme-vue/button';
import DxDataGrid from 'devextreme-vue/data-grid';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { filter, fields } from './data.js';

export default {
  components: {
    DxFilterBuilder,
    DxButton,
    DxDataGrid
  },
  data() {
    return {
      filter,
      fields,
      gridFilterValue: filter,
      dataSource: new DataSource({
        store: new ODataStore({
          fieldTypes: {
            'Product_Cost': 'Decimal',
            'Product_Sale_Price': 'Decimal',
            'Product_Retail_Price': 'Decimal'
          },
          url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
        }),
        select: [
          'Product_ID',
          'Product_Name',
          'Product_Cost',
          'Product_Sale_Price',
          'Product_Retail_Price',
          'Product_Current_Inventory'
        ]
      })
    };
  },
  methods: {
    buttonClick() {
      this.gridFilterValue = this.filter;
    }
  }
};
</script>
<style scoped>
.filter-container {
  background-color: rgba(191, 191, 191, 0.15);
  padding: 5px;
  width: 500px;
  margin-bottom: 25px;
}

.dx-filterbuilder {
  padding: 10px;
}

.dx-button {
  margin: 10px;
  float: right;
}

.dx-filterbuilder .dx-numberbox {
  width: 80px;
}
</style>
