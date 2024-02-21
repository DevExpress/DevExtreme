import React from 'react';
import DataGrid, {
  Column,
  Summary,
  GroupPanel,
  Grouping,
  SortByGroupSummaryInfo,
  TotalItem,
  Export,
} from 'devextreme-react/data-grid';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { companies } from './data.js';

const exportFormats = ['pdf'];
const onExporting = (e) => {
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
        doc.textWithLink(
          'website',
          options.rect.x + pdfCell.padding.left,
          options.rect.y + options.rect.h / 2 + textHeight / 2,
          { url: pdfCell.text },
        );
      }
    },
  }).then(() => {
    doc.save('Companies.pdf');
  });
};
const renderGridCell = (data) => (
  <a
    href={data.text}
    target="_blank"
    rel="noopener noreferrer"
  >
    Website
  </a>
);
const phoneNumberFormat = (value) => {
  const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);
  return `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}`;
};
const App = () => (
  <div>
    <DataGrid
      id="gridContainer"
      dataSource={companies}
      keyExpr="ID"
      width="100%"
      showBorders={true}
      onExporting={onExporting}
    >
      <Export
        enabled={true}
        formats={exportFormats}
      />
      <GroupPanel visible={true} />
      <Grouping autoExpandAll={true} />
      <SortByGroupSummaryInfo summaryItem="count" />

      <Column
        dataField="Name"
        width={190}
      />
      <Column
        dataField="Address"
        width={200}
      />
      <Column dataField="City" />
      <Column
        dataField="State"
        groupIndex={0}
      />
      <Column
        dataField="Phone"
        format={(e) => phoneNumberFormat(e)}
      />
      <Column
        dataField="Website"
        caption=""
        alignment="center"
        width={100}
        cellRender={(e) => renderGridCell(e)}
      />

      <Summary>
        <TotalItem
          column="Name"
          summaryType="count"
          displayFormat="Total count: {0}"
        />
      </Summary>
    </DataGrid>
  </div>
);
export default App;
