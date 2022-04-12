<template>
  <div>
    <div id="exportContainer">
      <DxButton
        text="Export multiple grids"
        icon="exportpdf"
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
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'devextreme/data/odata/store';

const priceGridRefKey = 'priceDataGrid';
const ratingGridRefKey = 'ratingDataGrid';

export default {
  components: {
    DxButton,
    DxTabPanel,
    DxItem,
    DxDataGrid,
    DxColumn,
  },
  data() {
    return {
      priceGridRefKey,
      ratingGridRefKey,
      priceDataSource: {
        store: {
          type: 'odata',
          url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
          key: 'Product_ID',
        },
        select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
        filter: ['Product_ID', '<', 10],
      },
      ratingDataSource: {
        store: {
          type: 'odata',
          url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
          key: 'Product_ID',
        },
        select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
        filter: ['Product_ID', '<', 10],
      },
    };
  },
  computed: {
    priceGridInstance() {
      return this.$refs[priceGridRefKey].instance;
    },
    ratingGridInstance() {
      return this.$refs[ratingGridRefKey].instance;
    },
  },
  methods: {
    exportGrids() {
      const context = this;
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();

      exportDataGrid({
        jsPDFDocument: doc,
        component: context.priceGridInstance,
        topLeft: { x: 0, y: 5 },
        columnWidths: [20, 40, 40, 40],
        customizeCell: ({ gridCell, pdfCell }) => {
          setAlternatingRowsBackground(context.priceGridInstance, gridCell, pdfCell);
        },
      }).then(() => {
        doc.addPage();
        exportDataGrid({
          jsPDFDocument: doc,
          component: context.ratingGridInstance,
          topLeft: { x: 0, y: 5 },
          columnWidths: [20, 40, 40, 40],
          customizeCell: ({ gridCell, pdfCell }) => {
            setAlternatingRowsBackground(context.ratingGridInstance, gridCell, pdfCell);
          },
        }).then(() => {
          doc.save('MultipleGrids.pdf');
        });
      });
    },
  },
};

function setAlternatingRowsBackground(dataGrid, gridCell, pdfCell) {
  if (gridCell.rowType === 'data') {
    const rowIndex = dataGrid.getRowIndexByKey(gridCell.data.Product_ID);
    if (rowIndex % 2 === 0) {
      pdfCell.backgroundColor = '#D3D3D3';
    }
  }
}
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
