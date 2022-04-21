<template>
  <div>
    <DxDataGrid
      :ref="dataGridRef"
      :allow-column-reordering="true"
      :data-source="customers"
      key-expr="ID"
      :show-borders="true"
      @exporting="onExporting"
    >
      <DxColumn data-field="CompanyName"/>
      <DxColumn data-field="Phone"/>
      <DxColumn data-field="Fax"/>
      <DxColumn data-field="City"/>
      <DxColumn
        :group-index="0"
        data-field="State"
      />

      <DxGrouping :auto-expand-all="true"/>
      <DxPaging :page-size="10"/>
      <DxSelection mode="multiple"/>
      <DxExport
        :enabled="true"
        :formats="['pdf']"
        :allow-export-selected-data="true"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import DxButton from 'devextreme-vue/button';
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxExport,
  DxSelection,
  DxPaging,
  DxItem,
} from 'devextreme-vue/data-grid';

import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';

import { customers } from './data.js';

export default {
  components: {
    DxButton,
    DxColumn,
    DxSelection,
    DxGrouping,
    DxPaging,
    DxExport,
    DxDataGrid,
    DxItem,
  },
  data() {
    return {
      customers,
    };
  },
  methods: {
    onExporting(e) {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();
      exportDataGrid({
        jsPDFDocument: doc,
        component: e.component,
        indent: 5,
      }).then(() => {
        doc.save('Companies.pdf');
      });
    },
  },
};
</script>
