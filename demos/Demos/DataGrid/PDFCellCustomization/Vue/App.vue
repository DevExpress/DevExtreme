<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :key-expr="'ID'"
      :data-source="companies"
      :width="'100%'"
      :show-borders="true"
      @exporting="onExporting"
    >
      <DxExport
        :enabled="true"
        :formats="['pdf']"
      />
      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="true"/>
      <DxSortByGroupSummaryInfo summary-item="count"/>

      <DxColumn
        data-field="Name"
        :width="190"
      />
      <DxColumn
        data-field="Address"
        :width="200"
      />
      <DxColumn data-field="City"/>
      <DxColumn
        data-field="State"
        :group-index="0"
      />
      <DxColumn
        data-field="Phone"
        :format="phoneNumberFormat"
      />
      <DxColumn
        data-field="Website"
        caption=""
        alignment="center"
        :width="100"
        cell-template="grid-cell"
      />
      <template #grid-cell="{ data }">
        <a
          :href="data.text"
          target="_blank"
        >
          Website
        </a>
      </template>
      />

      <DxSummary>
        <DxTotalItem
          column="Name"
          summary-type="count"
          display-format="Total count: {0}"
        />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxExport,
  DxSummary,
  DxSortByGroupSummaryInfo,
  DxTotalItem,
  DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { companies } from './data.ts';

const onExporting = (e: DxDataGridTypes.ExportingEvent) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();

  exportDataGrid({
    jsPDFDocument: doc,
    component: e.component,
    columnWidths: [40, 40, 30, 30, 40],
    customizeCell({ gridCell, pdfCell }) {
      if (gridCell.rowType === 'data' && gridCell.column.dataField === 'Phone') {
        pdfCell.text = pdfCell.text.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      } else if (gridCell.rowType === 'group') {
        pdfCell.backgroundColor = '#BEDFE6';
      } else if (gridCell.rowType === 'totalFooter') {
        pdfCell.font.style = 'italic';
      }
    },
    customDrawCell(options) {
      const { gridCell, pdfCell } = options;

      if (gridCell.rowType === 'data' && gridCell.column.dataField === 'Website') {
        options.cancel = true;
        doc.setFontSize(11);
        doc.setTextColor('#0000FF');

        const textHeight = doc.getTextDimensions(pdfCell.text).h;
        doc.textWithLink('website',
          options.rect.x + pdfCell.padding.left,
          options.rect.y + options.rect.h / 2 + textHeight / 2, { url: pdfCell.text });
      }
    },
  }).then(() => {
    doc.save('Companies.pdf');
  });
};

const phoneNumberFormat = (value: string) => {
  const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/)!;

  return `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}`;
};
</script>

<style scoped>
#gridContainer {
  height: 436px;
}
</style>
