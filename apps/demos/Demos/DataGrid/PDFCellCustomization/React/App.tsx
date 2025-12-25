import React from 'react';
import { jsPDF } from 'jspdf';

import DataGrid, {
  Column, Summary, GroupPanel, Grouping, SortByGroupSummaryInfo, TotalItem, Export,
} from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import { exportDataGrid } from 'devextreme-react/common/export/pdf';
import type { DataGridExportOptions } from 'devextreme-react/common/export/pdf';

import { companies } from './data.ts';

type CustomizeCellOptions = Parameters<Required<DataGridExportOptions>['customizeCell']>[0];
type CustomDrawCellOptions = Parameters<Required<DataGridExportOptions>['customDrawCell']>[0];

const exportFormats = ['pdf'];

const onExporting = (e: DataGridTypes.ExportingEvent) => {
  const doc = new jsPDF();

  exportDataGrid({
    jsPDFDocument: doc,
    component: e.component,
    columnWidths: [40, 40, 30, 30, 40],
    customizeCell({ gridCell, pdfCell }: CustomizeCellOptions) {
      if (gridCell?.rowType === 'data' && gridCell?.column?.dataField === 'Phone' && pdfCell?.text) {
        pdfCell.text = pdfCell.text.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      } else if (gridCell?.rowType === 'group' && pdfCell) {
        pdfCell.backgroundColor = '#BEDFE6';
      } else if (gridCell?.rowType === 'totalFooter' && pdfCell?.font) {
        pdfCell.font.style = 'italic';
      }
    },
    customDrawCell(options: CustomDrawCellOptions) {
      const { gridCell, pdfCell, rect } = options;

      if (gridCell && pdfCell && rect && gridCell.rowType === 'data' && gridCell.column?.dataField === 'Website') {
        options.cancel = true;
        doc.setFontSize(11);
        doc.setTextColor('#0000FF');

        const textHeight = pdfCell.text ? doc.getTextDimensions(pdfCell.text).h : 0;
        doc.textWithLink('website',
          rect.x + (pdfCell.padding?.left ?? 0),
          rect.y + rect.h / 2 + textHeight / 2,
          { url: pdfCell.text });
      }
    },
  }).then(() => {
    doc.save('Companies.pdf');
  });
};

const renderGridCell = (data: DataGridTypes.ColumnCellTemplateData) => (
  <a href={ data.text } target='_blank' rel='noopener noreferrer'>Website</a>
);

const phoneNumberFormat = (value: number) => {
  const valueStr = String(value);
  const USNumber = valueStr.match(/(\d{3})(\d{3})(\d{4})/);
  return USNumber ? `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}` : '';
};

const App = () => (
  <div>
    <DataGrid
      id="gridContainer"
      dataSource={companies}
      keyExpr="ID"
      width="100%"
      showBorders={true}
      onExporting={onExporting}>

      <Export enabled={true} formats={exportFormats} />
      <GroupPanel visible={true} />
      <Grouping autoExpandAll={true} />
      <SortByGroupSummaryInfo summaryItem="count" />

      <Column dataField="Name" width={190} />
      <Column dataField="Address" width={200} />
      <Column dataField="City" />
      <Column dataField="State" groupIndex={0} />
      <Column dataField="Phone" format={phoneNumberFormat} />
      <Column dataField="Website" alignment="center" width={100} cellRender={(e: DataGridTypes.ColumnCellTemplateData) => renderGridCell(e)} />

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
