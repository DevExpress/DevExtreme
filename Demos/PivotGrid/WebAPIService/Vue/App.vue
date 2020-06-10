<template>
  <DxPivotGrid
    :allow-sorting="true"
    :allow-sorting-by-summary="true"
    :allow-filtering="true"
    :height="620"
    :show-borders="true"
    :data-source="dataSource"
    row-header-layout="tree"
  >

    <DxScrolling
      mode="virtual"
    />
  </DxPivotGrid>
</template>
<script>
import {
  DxPivotGrid,
  DxScrolling
} from 'devextreme-vue/pivot-grid';

import { createStore } from 'devextreme-aspnet-data-nojquery';

export default {
  components: {
    DxPivotGrid,
    DxScrolling
  },
  data() {
    return {
      dataSource: {
        remoteOperations: true,
        store: createStore({
          key: 'OrderID',
          loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales/Orders'
        }),
        fields: [{
          caption: 'Category',
          dataField: 'ProductCategoryName',
          width: 250,
          expanded: true,
          sortBySummaryField: 'SalesAmount',
          sortBySummaryPath: [],
          sortOrder: 'desc',
          area: 'row'
        }, {
          caption: 'Subcategory',
          dataField: 'ProductSubcategoryName',
          width: 250,
          sortBySummaryField: 'SalesAmount',
          sortBySummaryPath: [],
          sortOrder: 'desc',
          area: 'row'
        }, {
          caption: 'Product',
          dataField: 'ProductName',
          area: 'row',
          sortBySummaryField: 'SalesAmount',
          sortBySummaryPath: [],
          sortOrder: 'desc',
          width: 250
        }, {
          caption: 'Date',
          dataField: 'DateKey',
          dataType: 'date',
          area: 'column'
        }, {
          caption: 'Amount',
          dataField: 'SalesAmount',
          summaryType: 'sum',
          format: 'currency',
          area: 'data'
        }, {
          caption: 'Store',
          dataField: 'StoreName'
        }, {
          caption: 'Quantity',
          dataField: 'SalesQuantity',
          summaryType: 'sum'
        }, {
          caption: 'Unit Price',
          dataField: 'UnitPrice',
          format: 'currency',
          summaryType: 'sum'
        }, {
          dataField: 'Id',
          visible: false
        }]
      }
    };
  }
};
</script>
