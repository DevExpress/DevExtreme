<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :show-borders="true"
      :show-row-lines="true"
      :show-column-lines="false"
      @exporting="onExporting"
    >
      <DxExport
        :enabled="true"
        :formats="['pdf']"
      />
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
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxExport,
} from 'devextreme-vue/data-grid';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { employees } from './data.js';

const onExporting = ({ component }) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();

  exportDataGrid({
    jsPDFDocument: doc,
    component,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    topLeft: { x: 5, y: 5 },
    columnWidths: [30, 30, 30, 30, 30, 30],
    onRowExporting: (e) => {
      const isHeader = e.rowCells[0].text === 'Picture';
      if (!isHeader) {
        e.rowHeight = 40;
      }
    },
    customDrawCell: (e) => {
      if (e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'Picture') {
        doc.addImage(e.gridCell.value, 'PNG', e.rect.x, e.rect.y, e.rect.w, e.rect.h);
        e.cancel = true;
      }
    },
  }).then(() => {
    doc.save('DataGrid.pdf');
  });
};
</script>

<style scoped>
img {
  height: 100px;
}
</style>
