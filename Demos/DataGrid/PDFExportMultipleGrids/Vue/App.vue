<template>
  <div>
    <div id="exportContainer">
      <DxButton
        text="Export multiple grids"
        icon="exportpdf"
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
import { DxDataGrid, DxColumn, DxDataGridTypes } from 'devextreme-vue/data-grid';

import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { exportDataGrid, DataGridCell, Cell } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
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
  const priceGrid = priceGridRef.value?.instance!;
  const ratingGrid = ratingGridRef.value?.instance!;
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();

  exportDataGrid({
    jsPDFDocument: doc,
    component: priceGrid,
    topLeft: { x: 7, y: 5 },
    columnWidths: [20, 50, 50, 50],
    customizeCell: ({ gridCell, pdfCell }) => {
      setAlternatingRowsBackground(priceGrid, gridCell!, pdfCell!);
    },
  }).then(() => {
    doc.addPage();
    exportDataGrid({
      jsPDFDocument: doc,
      component: ratingGrid,
      topLeft: { x: 7, y: 5 },
      columnWidths: [20, 50, 50, 50],
      customizeCell: ({ gridCell, pdfCell }) => {
        setAlternatingRowsBackground(ratingGrid, gridCell!, pdfCell!);
      },
    }).then(() => {
      doc.save('MultipleGrids.pdf');
    });
  });
};

const setAlternatingRowsBackground = (
  dataGrid: DxDataGridTypes.DataGrid, gridCell: DataGridCell, pdfCell: Cell,
) => {
  if (gridCell.rowType === 'data') {
    const rowIndex = dataGrid.getRowIndexByKey(gridCell.data.Product_ID);
    if (rowIndex % 2 === 0) {
      pdfCell.backgroundColor = '#D3D3D3';
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
