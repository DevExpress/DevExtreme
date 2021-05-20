<template>
  <div>
    <div id="exportContainer">
      <DxButton
        text="Export multiple grids"
        icon="xlsxfile"
        @click="exportGrids($event)"
      />
    </div>
    <DxTabPanel
      id="tabPanel"
      :defer-rendering="false"
    >
      <DxItem title="Price">
        <template #default>
          <DxDataGrid
            id="priceDataGrid"
            width="100%"
            :ref="priceGridRefKey"
            :data-source="priceDataSource"
            :show-borders="true"
            :row-alternation-enabled="true"
          >
            <DxColumn
              data-field="Product_ID"
              caption="ID"
              :width="50"
            />
            <DxColumn
              data-field="Product_Name"
              caption="Name"
            />
            <DxColumn
              data-field="Product_Sale_Price"
              caption="Sale Price"
              data-type="number"
              format="currency"
            />
            <DxColumn
              data-field="Product_Retail_Price"
              caption="Retail Price"
              data-type="number"
              format="currency"
            />
          </DxDataGrid>
        </template>
      </DxItem>
      <DxItem title="Rating">
        <template #default>
          <DxDataGrid
            id="ratingDataGrid"
            width="100%"
            :ref="ratingGridRefKey"
            :data-source="ratingDataSource"
            :show-borders="true"
            :row-alternation-enabled="true"
          >
            <DxColumn
              data-field="Product_ID"
              caption="ID"
              :width="50"
            />
            <DxColumn
              data-field="Product_Name"
              caption="Name"
            />
            <DxColumn
              data-field="Product_Consumer_Rating"
              caption="Rating"
            />
            <DxColumn
              data-field="Product_Category"
              caption="Category"
            />
          </DxDataGrid>
        </template>
      </DxItem>
    </DxTabPanel>
  </div>
</template>
<script>

import DxButton from 'devextreme-vue/button';
import DxTabPanel, { DxItem } from 'devextreme-vue/tab-panel';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from 'file-saver';
*/
import 'devextreme/data/odata/store';

const priceGridRefKey = 'priceDataGrid';
const ratingGridRefKey = 'ratingDataGrid';

export default {
  components: {
    DxButton,
    DxTabPanel,
    DxItem,
    DxDataGrid,
    DxColumn
  },
  data() {
    return {
      priceGridRefKey,
      ratingGridRefKey,
      priceDataSource: {
        store: {
          type: 'odata',
          url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
          key: 'Product_ID'
        },
        select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
        filter: ['Product_ID', '<', 10]
      },
      ratingDataSource:{
        store: {
          type: 'odata',
          url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
          key: 'Product_ID'
        },
        select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
        filter: ['Product_ID', '<', 10]
      }
    };
  },
  computed: {
    priceGridInstance: function() {
      return this.$refs[priceGridRefKey].instance;
    },
    ratingGridInstance: function() {
      return this.$refs[ratingGridRefKey].instance;
    }
  },
  methods: {
    exportGrids() {
      const context = this;
      const workbook = new ExcelJS.Workbook();
      const priceSheet = workbook.addWorksheet('Price');
      const ratingSheet = workbook.addWorksheet('Rating');

      priceSheet.getRow(2).getCell(2).value = 'Price';
      priceSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

      ratingSheet.getRow(2).getCell(2).value = 'Rating';
      ratingSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

      exportDataGrid({
        worksheet: priceSheet,
        component: context.priceGridInstance,
        topLeftCell: { row: 4, column: 2 },
        customizeCell: ({ gridCell, excelCell }) => {
          setAlternatingRowsBackground(gridCell, excelCell);
        }
      }).then(() => {
        return exportDataGrid({
          worksheet: ratingSheet,
          component: context.ratingGridInstance,
          topLeftCell: { row: 4, column: 2 },
          customizeCell: ({ gridCell, excelCell }) => {
            setAlternatingRowsBackground(gridCell, excelCell);
          }
        });
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MultipleGrids.xlsx');
        });
      });
    }
  }
};

function setAlternatingRowsBackground(gridCell, excelCell) {
  if(gridCell.rowType === 'header' || gridCell.rowType === 'data') {
    if(excelCell.fullAddress.row % 2 === 0) {
      excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }, bgColor: { argb: 'D3D3D3' } };
    }
  }
}
</script>

<style scoped>
#priceDataGrid, #ratingDataGrid {
  padding: 10px;
}
#exportContainer {
    text-align: right;
}
#tabPanel {
    padding-top: 10px;
}
</style>
