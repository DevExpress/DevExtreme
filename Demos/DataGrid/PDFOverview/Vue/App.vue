<template>
  <div>
    <DxDataGrid
      :ref="dataGridRef"
      :allow-column-reordering="true"
      :data-source="customers"
      key-expr="ID"
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
      <DxToolbar>
        <DxItem name="groupPanel"/>
        <DxItem location="after">
          <DxButton
            icon="exportpdf"
            text="Export to PDF"
            @click="exportGrid()"
          />
        </DxItem>
        <DxItem name="searchPanel"/>
      </DxToolbar>
    </DxDataGrid>
  </div>
</template>
<script>
import DxButton from 'devextreme-vue/button';
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxPaging,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/data-grid';

import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';

import { customers } from './data.js';

const dataGridRef = 'dataGrid';

export default {
  components: {
    DxButton,
    DxColumn,
    DxGroupPanel,
    DxGrouping,
    DxPaging,
    DxSearchPanel,
    DxDataGrid,
    DxToolbar,
    DxItem,
  },
  data() {
    return {
      customers,
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
        indent: 5,
      }).then(() => {
        doc.save('Companies.pdf');
      });
    },
  },
};
</script>

<style scoped>
#exportButton {
  margin-bottom: 10px;
}
</style>
