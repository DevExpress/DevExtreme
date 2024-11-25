<template>
  <div>
    <div id="exportContainer">
      <DxButton
        text="Export multiple grids"
        icon="xlsxfile"
        @click="exportGrids"
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
            ref="priceGridRef"
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
            ref="ratingGridRef"
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
<script setup lang="ts">
import { ref } from 'vue';
import DxButton from 'devextreme-vue/button';
import DxTabPanel, { DxItem } from 'devextreme-vue/tab-panel';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';

import { Workbook } from 'exceljs';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { saveAs } from 'file-saver-es';
import { DataGridCell, exportDataGrid } from 'devextreme/excel_exporter';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';

const priceGridRef = ref<DxDataGrid | null>(null);
const ratingGridRef = ref<DxDataGrid | null>(null);

const priceDataSource: DataSourceOptions = {
  store: {
    type: 'odata',
    version: 2,
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
    key: 'Product_ID',
  },
  select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
  filter: ['Product_ID', '<', 10],
};
const ratingDataSource: DataSourceOptions = {
  store: {
    type: 'odata',
    version: 2,
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
    key: 'Product_ID',
  },
  select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
  filter: ['Product_ID', '<', 10],
};

const exportGrids = () => {
  const workbook = new Workbook();
  const priceSheet = workbook.addWorksheet('Price');
  const ratingSheet = workbook.addWorksheet('Rating');

  priceSheet.getRow(2).getCell(2).value = 'Price';
  priceSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

  ratingSheet.getRow(2).getCell(2).value = 'Rating';
  ratingSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

  exportDataGrid({
    worksheet: priceSheet,
    component: priceGridRef.value?.instance,
    topLeftCell: { row: 4, column: 2 },
    customizeCell: ({ gridCell, excelCell }) => {
      setAlternatingRowsBackground(gridCell, excelCell);
    },
  }).then(() => exportDataGrid({
    worksheet: ratingSheet,
    component: ratingGridRef.value?.instance,
    topLeftCell: { row: 4, column: 2 },
    customizeCell: ({ gridCell, excelCell }) => {
      setAlternatingRowsBackground(gridCell, excelCell);
    },
  })).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MultipleGrids.xlsx');
    });
  });
};

const setAlternatingRowsBackground = (gridCell: DataGridCell, excelCell: any) => {
  if (gridCell.rowType === 'header' || gridCell.rowType === 'data') {
    if (excelCell.fullAddress.row % 2 === 0) {
      excelCell.fill = {
        type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }, bgColor: { argb: 'D3D3D3' },
      };
    }
  }
};
</script>

<style scoped>
#priceDataGrid,
#ratingDataGrid {
  padding: 10px;
}

#exportContainer {
  text-align: right;
}

#tabPanel {
  padding-top: 10px;
}
</style>
