<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="orders"
      key-expr="ID"
      :show-borders="true"
      @cell-prepared="cellPrepared"
    >

      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="true"/>
      <DxSortByGroupSummaryInfo summary-item="count"/>

      <DxColumn
        :group-index="0"
        data-field="Employee"
      />
      <DxColumn
        :width="130"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        :width="160"
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn
        :group-index="1"
        data-field="CustomerStoreCity"
        caption="City"
      />
      <DxColumn
        data-field="CustomerStoreState"
        caption="State"
      />
      <DxColumn
        data-field="SaleAmount"
        alignment="right"
        format="currency"
        sort-order="desc"
      />

      <DxExport
        :enabled="true"
        :customize-excel-cell="customizeExcelCell"
      />

      <DxSummary>
        <DxGroupItem
          :align-by-column="false"
          column="OrderNumber"
          summary-type="count"
          display-format="{0} orders"
        />
        <DxGroupItem
          :align-by-column="true"
          :show-in-group-footer="false"
          column="SaleAmount"
          summary-type="max"
          display-format="Max: {0}"
          value-format="currency"
        />
        <DxGroupItem
          :align-by-column="true"
          :show-in-group-footer="true"
          column="SaleAmount"
          summary-type="sum"
          display-format="Sum: {0}"
          value-format="currency"
        />

        <DxTotalItem
          column="SaleAmount"
          summary-type="sum"
          display-format="Total Sum: {0}"
          value-format="currency"
        />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxExport, DxSummary, DxGroupPanel, DxGrouping, DxGroupItem, DxSortByGroupSummaryInfo, DxTotalItem } from 'devextreme-vue/data-grid';
import service from './data.js';

export default {
  components: {
    DxDataGrid, DxColumn, DxExport, DxSummary, DxGroupPanel, DxGrouping, DxGroupItem, DxSortByGroupSummaryInfo, DxTotalItem
  },
  data() {
    return {
      orders: service.getOrders()
    };
  },
  methods: {
    cellPrepared(e) {
      if(e.rowType === 'data') {
        if(e.data.OrderDate < new Date(2014, 2, 3)) {
          e.cellElement.style.color = '#AAAAAA';
        }
        if(e.data.SaleAmount > 15000) {
          if(e.column.dataField === 'OrderNumber') {
            e.cellElement.style.fontWeight = 'bold';
          }
          if(e.column.dataField === 'SaleAmount') {
            e.cellElement.style.backgroundColor = '#FFBB00';
            e.cellElement.style.color = '#000000';
          }
        }
      }

      if(e.rowType === 'group') {
        if(e.row.groupIndex === 0) {
          e.cellElement.style.backgroundColor = '#BEDFE6';
        }
        if(e.row.groupIndex === 1) {
          e.cellElement.style.backgroundColor = '#C9ECD7';
        }
        e.cellElement.style.color = '#000';
        if(e.cellElement.firstChild && e.cellElement.firstChild.style) e.cellElement.firstChild.style.color = '#000';
      }

      if(e.rowType === 'groupFooter' && e.column.dataField === 'SaleAmount') {
        e.cellElement.style.fontStyle = 'italic';
      }
    },
    customizeExcelCell(options) {
      var gridCell = options.gridCell;
      if(!gridCell) {
        return;
      }

      if(gridCell.rowType === 'data') {
        if(gridCell.data.OrderDate < new Date(2014, 2, 3)) {
          options.font.color = '#AAAAAA';
        }
        if(gridCell.data.SaleAmount > 15000) {
          if(gridCell.column.dataField === 'OrderNumber') {
            options.font.bold = true;
          }
          if(gridCell.column.dataField === 'SaleAmount') {
            options.backgroundColor = '#FFBB00';
            options.font.color = '#000000';
          }
        }
      }

      if(gridCell.rowType === 'group') {
        if(gridCell.groupIndex === 0) {
          options.backgroundColor = '#BEDFE6';
        }
        if(gridCell.groupIndex === 1) {
          options.backgroundColor = '#C9ECD7';
        }
        if(gridCell.column.dataField === 'Employee') {
          options.value = `${gridCell.value} (${gridCell.groupSummaryItems[0].value} items)`;
          options.font.bold = false;
        }
        if(gridCell.column.dataField === 'SaleAmount') {
          options.value = gridCell.groupSummaryItems[0].value;
          options.numberFormat = '&quot;Max: &quot;$0.00';
        }
      }

      if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'SaleAmount') {
        options.value = gridCell.value;
        options.numberFormat = '&quot;Sum: &quot;$0.00';
        options.font.italic = true;
      }

      if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'SaleAmount') {
        options.value = gridCell.value;
        options.numberFormat = '&quot;Total Sum: &quot;$0.00';
      }
    }
  }
};
</script>

<style scoped>
#gridContainer {
    height: 440px;
}
</style>
