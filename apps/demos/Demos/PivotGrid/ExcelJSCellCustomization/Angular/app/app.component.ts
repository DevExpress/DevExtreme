import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'. We recommend that you use the official 'file-saver' package in your applications.
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { Options as DataSourceConfig } from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridModule, DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';
import { Service, Sale } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type CellData = DxPivotGridTypes.CellPreparedEvent['cell'] & { area?: string };

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  providers: [Service],
})
export class AppComponent {
  sales: Sale[];

  dataSource: DataSourceConfig;

  constructor(service: Service) {
    this.dataSource = {
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
      store: service.getSales(),
    };
  }

  onExporting(e: DxPivotGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sales');

    exportPivotGrid({
      component: e.component,
      worksheet,
      customizeCell: ({ pivotCell, excelCell }) => {
        if (this.isDataCell(pivotCell) || this.isTotalCell(pivotCell)) {
          const appearance = this.getConditionalAppearance(pivotCell);
          Object.assign(excelCell, this.getExcelCellFormat(appearance));
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
  }

  onCellPrepared({ cell, area, cellElement }: DxPivotGridTypes.CellPreparedEvent) {
    const cellData = { ...cell, area };

    if (this.isDataCell(cellData) || this.isTotalCell(cellData)) {
      const appearance = this.getConditionalAppearance(cellData);
      Object.assign(cellElement.style, this.getCssStyles(appearance));
    }
  }

  isDataCell(cell: CellData) {
    return (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');
  }

  isTotalCell(cell: CellData) {
    return (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');
  }

  getExcelCellFormat({ fill, font, bold }: ReturnType<typeof this.getConditionalAppearance>) {
    return {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } },
      font: { color: { argb: font }, bold },
    };
  }

  getCssStyles({ fill, font, bold }: ReturnType<typeof this.getConditionalAppearance>) {
    return {
      'background-color': `#${fill}`,
      color: `#${font}`,
      'font-weight': bold ? 'bold' : undefined,
    };
  }

  getConditionalAppearance(cell: CellData) {
    if (this.isTotalCell(cell)) {
      return { fill: 'F2F2F2', font: '3F3F3F', bold: true };
    }

    const { value } = cell;

    if (value < 20000) {
      return { font: '9C0006', fill: 'FFC7CE', bold: false };
    }

    return (value > 50000)
      ? { font: '006100', fill: 'C6EFCE', bold: false }
      : { font: '9C6500', fill: 'FFEB9C', bold: false };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
