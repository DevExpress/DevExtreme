<template>
  <div>
    <DxButton
      id="exportButton"
      icon="exportpdf"
      text="Export to PDF"
      @click="exportGrid()"
    />

    <DxDataGrid
      :ref="dataGridRef"
      :allow-column-reordering="true"
      :data-source="customers"
      :show-borders="true"
    >

      <DxColumn data-field="CompanyName"/>
      <DxColumn data-field="Phone"/>
      <DxColumn data-field="Fax"/>
      <DxColumn data-field="City"/>
      <DxColumn
        :group-index="0"
        data-field="State"
      />

      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="true"/>
      <DxPaging :page-size="10"/>
      <DxSearchPanel :visible="true"/>
    </DxDataGrid>
  </div>
</template>
<script>
import { customers } from './data.js';
import DxButton from 'devextreme-vue/button';
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxPaging
} from 'devextreme-vue/data-grid';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

const dataGridRef = 'dataGrid';

export default {
  components: {
    DxButton,
    DxColumn,
    DxGroupPanel,
    DxGrouping,
    DxPaging,
    DxSearchPanel,
    DxDataGrid
  },
  data() {
    return {
      customers,
      dataGridRef
    };
  },
  computed: {
    dataGrid: function() {
      return this.$refs[dataGridRef].instance;
    }
  },
  methods: {
    exportGrid() {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: this.dataGrid
      }).then(() => {
        doc.save('Customers.pdf');
      });
    }
  }
};
</script>

<style scoped>
#exportButton {
  margin-bottom: 10px;
}
</style>
