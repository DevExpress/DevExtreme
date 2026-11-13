import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import {
  DxButtonModule, DxTabPanelModule, DxDataGridModule, DxDataGridComponent,
} from 'devextreme-angular';
import { ArrayStore, DataSourceOptions } from 'devextreme-angular/common/data';
import { Workbook } from 'devextreme-exceljs-fork';
import { saveAs } from 'file-saver-es';
// Our demo infrastructure requires us to use 'file-saver-es'. We recommend that you use the official 'file-saver' package in your applications.
import { exportDataGrid } from 'devextreme-angular/common/export/excel';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxButtonModule,
    DxTabPanelModule,
    DxDataGridModule,
  ],
})

export class AppComponent {
  private readonly priceDataGrid = viewChild.required<DxDataGridComponent>('priceDataGrid');

  private readonly ratingDataGrid = viewChild.required<DxDataGridComponent>('ratingDataGrid');

  private readonly service = inject(Service);

  readonly priceDataSource: DataSourceOptions = {
    store: new ArrayStore({
      data: this.service.getProducts(),
      key: 'Product_ID',
    }),
    select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
    filter: ['Product_ID', '<', 10],
  };

  readonly ratingDataSource: DataSourceOptions = {
    store: new ArrayStore({
      data: this.service.getProducts(),
      key: 'Product_ID',
    }),
    select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
    filter: ['Product_ID', '<', 10],
  };

  exportGrids() {
    const workbook = new Workbook();
    const priceSheet = workbook.addWorksheet('Price');
    const ratingSheet = workbook.addWorksheet('Rating');

    priceSheet.getRow(2).getCell(2).value = 'Price';
    priceSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

    ratingSheet.getRow(2).getCell(2).value = 'Rating';
    ratingSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

    function setAlternatingRowsBackground(gridCell, excelCell) {
      if (gridCell.rowType === 'header' || gridCell.rowType === 'data') {
        if (excelCell.fullAddress.row % 2 === 0) {
          excelCell.fill = {
            type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }, bgColor: { argb: 'D3D3D3' },
          };
        }
      }
    }

    exportDataGrid({
      worksheet: priceSheet,
      component: this.priceDataGrid().instance,
      topLeftCell: { row: 4, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        setAlternatingRowsBackground(gridCell, excelCell);
      },
    }).then(() => exportDataGrid({
      worksheet: ratingSheet,
      component: this.ratingDataGrid().instance,
      topLeftCell: { row: 4, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        setAlternatingRowsBackground(gridCell, excelCell);
      },
    })).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MultipleGrids.xlsx');
      });
    });
  }
}

bootstrapApplication(AppComponent);
