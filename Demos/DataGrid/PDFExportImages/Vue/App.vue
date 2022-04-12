<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :show-borders="true"
      :show-row-lines="true"
      :show-column-lines="false"
    >
      <DxColumn
        data-field="Picture"
        :width="90"
        cell-template="grid-cell-template"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="Position"/>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />

      <template #grid-cell-template="{ data }">
        <div>
          <img
            :src="data.value"
          >
        </div>
      </template>

      <DxToolbar>
        <DxItem location="after">
          <DxButton
            text="Export to PDF"
            icon="exportpdf"
            @click="exportGrid()"
          />
        </DxItem>
      </DxToolbar>
    </DxDataGrid>
  </div>
</template>
<script>
import DxButton from 'devextreme-vue/button';
import {
  DxDataGrid, DxColumn, DxExport, DxToolbar, DxItem,
} from 'devextreme-vue/data-grid';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import service from './data.js';

const dataGridRef = 'dataGrid';

export default {
  components: {
    DxButton, DxDataGrid, DxColumn, DxExport, DxToolbar, DxItem,
  },
  data() {
    return {
      employees: service.getEmployees(),
      dataGridRef,
    };
  },
  computed: {
    dataGrid() {
      return this.$refs[dataGridRef].instance;
    },
  },
  methods: {
    exportGrid() {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();

      exportDataGrid({
        jsPDFDocument: doc,
        component: this.dataGrid,
        margin: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
        topLeft: { x: 0, y: 5 },
        columnWidths: [30, 30, 30, 30, 30, 30],
        onRowExporting: (arg) => {
          const isHeader = arg.rowCells[0].text === 'Picture';
          if (!isHeader) {
            arg.rowHeight = 40;
          }
        },
        customDrawCell: (arg) => {
          if (arg.gridCell.rowType === 'data' && arg.gridCell.column.dataField === 'Picture') {
            doc.addImage(arg.gridCell.value, 'PNG', arg.rect.x, arg.rect.y, arg.rect.w, arg.rect.h);
            arg.cancel = true;
          }
        },
      }).then(() => {
        doc.save('DataGrid.pdf');
      });
    },
  },
};

</script>

<style scoped>
img {
  height: 100px;
}
</style>
