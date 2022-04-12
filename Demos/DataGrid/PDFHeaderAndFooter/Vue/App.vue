<template>
  <DxDataGrid
    id="grid"
    key-expr="ID"
    :ref="dataGridRef"
    :data-source="countries"
    :show-borders="true"
    @exporting="onExporting"
  >
    <DxExport :enabled="true"/>
    <DxColumn data-field="Country"/>
    <DxColumn data-field="Area"/>
    <DxColumn caption="Population">
      <DxColumn
        caption="Total"
        data-field="Population_Total"
        format="fixedPoint"
      />
      <DxColumn
        caption="Urban"
        data-field="Population_Urban"
        format="percent"
      />
    </DxColumn>
    <DxColumn caption="Nominal GDP">
      <DxColumn
        caption="Total, mln $"
        data-field="GDP_Total"
        format="fixedPoint"
        sort-order="desc"
      />
      <DxColumn caption="By Sector">
        <DxColumn
          :width="95"
          :format="gdpFormat"
          caption="Agriculture"
          data-field="GDP_Agriculture"
        />
        <DxColumn
          :width="80"
          :format="gdpFormat"
          caption="Industry"
          data-field="GDP_Industry"
        />
        <DxColumn
          :width="85"
          :format="gdpFormat"
          caption="Services"
          data-field="GDP_Services"
        />
      </DxColumn>
    </DxColumn>

    <DxToolbar>
      <DxItem name="groupPanel"/>
      <DxItem location="after">
        <DxButton
          icon="exportpdf"
          text="Export to PDF"
          @click="exportGrid()"
        />
      </DxItem>
    </DxToolbar>
  </DxDataGrid>
</template>

<script>

import DxButton from 'devextreme-vue/button';
import DxDataGrid, { DxColumn, DxToolbar, DxItem } from 'devextreme-vue/data-grid';

import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';

import { countries } from './data.js';

const dataGridRef = 'dataGrid';

export default {
  components: {
    DxButton,
    DxDataGrid,
    DxColumn,
    DxToolbar,
    DxItem,
  },
  data() {
    return {
      countries,
      gdpFormat: {
        type: 'percent',
        precision: 1,
      },
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
      const lastPoint = { x: 0, y: 0 };
      exportDataGrid({
        jsPDFDocument: doc,
        component: this.dataGrid,
        topLeft: { x: 1, y: 15 },
        columnWidths: [30, 20, 30, 15, 22, 22, 20, 20],
        customDrawCell({ rect }) {
          if (lastPoint.x < rect.x + rect.w) {
            lastPoint.x = rect.x + rect.w;
          }
          if (lastPoint.y < rect.y + rect.h) {
            lastPoint.y = rect.y + rect.h;
          }
        },
      }).then(() => {
        const header = 'Country Area, Population, and GDP Structure';
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(15);
        const headerWidth = doc.getTextDimensions(header).w;
        doc.text(header, (pageWidth - headerWidth) / 2, 20);

        const footer = 'www.wikipedia.org';
        doc.setFontSize(9);
        doc.setTextColor('#cccccc');
        const footerWidth = doc.getTextDimensions(footer).w;
        doc.text(footer, (lastPoint.x - footerWidth), lastPoint.y + 5);

        doc.save('Companies.pdf');
      });
    },
  },
};
</script>

<style>
#grid sup {
  font-size: 0.8em;
  vertical-align: super;
  line-height: 0;
}

.long-title h3 {
  font-family:
    'Segoe UI Light',
    'Helvetica Neue Light',
    'Segoe UI',
    'Helvetica Neue',
    'Trebuchet MS',
    Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
