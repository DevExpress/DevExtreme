import React from 'react';

import PivotGrid, {
  FieldChooser,
  Export
} from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import FileSaver from 'file-saver';
*/
import { exportPivotGrid } from 'devextreme/excel_exporter';

import { sales } from './data.js';

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    dataField: 'region',
    area: 'row'
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row'
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column'
  }, {
    caption: 'Amount',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }, {
    caption: 'Count',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'count',
    area: 'data'
  }],
  store: sales
});

export default function App() {
  const onExporting = (e) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales');

    exportPivotGrid({
      component: e.component,
      worksheet: worksheet,
      customizeCell: ({ pivotCell, excelCell }) => {
        if(pivotCell.rowType === 'T' || pivotCell.type === 'T' || pivotCell.type === 'GT' || pivotCell.rowType === 'GT' || pivotCell.columnType === 'GT') {
          excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };
          if(pivotCell.dataIndex === 0) {
            excelCell.numFmt = '$ #,##.#,"K"';
          }
        }

        if(pivotCell.area === 'data') {
          if(pivotCell.dataIndex === 1) {
            excelCell.font = { bold: true };
          } else {
            const color = pivotCell.value < 100000 ? 'DC3545' : '28A745';
            excelCell.font = { color: { argb: color } };
          }
        }

        const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
        excelCell.border = {
          bottom: borderStyle,
          left: borderStyle,
          right: borderStyle,
          top: borderStyle
        };
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
      });
    });
    e.cancel = true;
  };

  const onCellPrepared = (e) => {
    if(e.rowType === 'T' || e.type === 'T' || e.type === 'GT' || e.rowType === 'GT' || e.columnType === 'GT') {
      e.cellElement.style.backgroundColor = '#DDDDDD';
    }
    if(e.area === 'data') {
      if(e.cell.dataIndex === 1) {
        e.cellElement.style.fontWeight = 'bold';
      } else {
        if(e.cell.value < 100000) {
          e.cellElement.style.color = '#DC3545';
        } else {
          e.cellElement.style.color = '#28A745';
        }
      }
    }
  }

  return (
    <React.Fragment>
      <PivotGrid
        allowSortingBySummary={true}
        allowSorting={true}
        allowFiltering={true}
        allowExpandAll={true}
        dataSource={dataSource}
        height={440}
        showBorders={true}
        onExporting={onExporting}
        onCellPrepared={onCellPrepared}
      >
        <FieldChooser enabled={false} />
        <Export enabled={true} />
      </PivotGrid>
    </React.Fragment>
  );
}

