import React from 'react';

import PivotGrid, {
  FieldChooser,
  Export,
  PivotGridTypes,
} from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'.
// We recommend that you use the official 'file-saver' package in your applications.
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { sales } from './data.ts';

interface ConditionalAppearance {
  fill: string,
  font: string,
  bold?: boolean,
}

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    dataField: 'region',
    area: 'row',
    expanded: true,
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }],
  store: sales,
});

const isDataCell = (cell) => (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');

const isTotalCell = (cell) => (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');

const getExcelCellFormat = ({ fill, font, bold }: ConditionalAppearance) =>
  ({
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } },
    font: { color: { argb: font }, bold },
  });

const getCssStyles = ({ fill, font, bold }: ConditionalAppearance) =>
  ({
    'background-color': `#${fill}`,
    color: `#${font}`,
    'font-weight': bold ? 'bold' : undefined,
  });

const getConditionalAppearance = (cell): ConditionalAppearance => {
  if (isTotalCell(cell)) {
    return { fill: 'F2F2F2', font: '3F3F3F', bold: true };
  }
  const { value } = cell;
  if (value < 20000) {
    return { font: '9C0006', fill: 'FFC7CE' };
  }
  if (value > 50000) {
    return { font: '006100', fill: 'C6EFCE' };
  }
  return { font: '9C6500', fill: 'FFEB9C' };
};

const onExporting = (e: PivotGridTypes.ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Sales');

  exportPivotGrid({
    component: e.component,
    worksheet,
    customizeCell: ({ pivotCell, excelCell }) => {
      if (isDataCell(pivotCell) || isTotalCell(pivotCell)) {
        const appearance = getConditionalAppearance(pivotCell);
        Object.assign(excelCell, getExcelCellFormat(appearance));
      }

      const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
      excelCell.border = {
        bottom: borderStyle,
        left: borderStyle,
        right: borderStyle,
        top: borderStyle,
      };
    },
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
    });
  });
};

const onCellPrepared = ({ cell, area, cellElement }: any) => {
  cell.area = area;

  if (isDataCell(cell) || isTotalCell(cell)) {
    const appearance = getConditionalAppearance(cell);
    Object.assign(cellElement.style, getCssStyles(appearance));
  }
};

const App = () => (
  <PivotGrid
    allowSortingBySummary={true}
    allowSorting={true}
    allowFiltering={true}
    allowExpandAll={true}
    dataSource={dataSource}
    height={490}
    showBorders={true}
    onExporting={onExporting}
    onCellPrepared={onCellPrepared}
  >
    <FieldChooser enabled={false} />
    <Export enabled={true} />
  </PivotGrid>
);

export default App;
