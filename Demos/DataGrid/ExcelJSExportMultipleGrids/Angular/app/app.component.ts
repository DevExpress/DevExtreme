import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule, DxTabPanelModule, DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
  // Use this import for codeSandBox
  import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
  import * as FileSaver from 'file-saver';
*/
import DataGrid from 'devextreme/ui/data_grid';
import 'devextreme/data/odata/store';

if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css']
})

export class AppComponent {
  @ViewChild('priceDataGrid', { static: false }) priceDataGrid: DxDataGridComponent;
  @ViewChild('ratingDataGrid', { static: false }) ratingDataGrid: DxDataGridComponent;
  priceDataSource: any;
  ratingDataSource: any;

  constructor() {
    this.priceDataSource = {
      store: {
        type: 'odata',
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
        key: 'Product_ID'
      },
      select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
      filter: ['Product_ID', '<', 10]
    };
    
    this.ratingDataSource = {
      store: {
        type: 'odata',
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
        key: 'Product_ID'
      },
      select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
      filter: ['Product_ID', '<', 10]
    };
  }

  exportGrids(e) {
    const context = this;
    const workbook = new ExcelJS.Workbook();
    const priceSheet = workbook.addWorksheet('Price');
    const ratingSheet = workbook.addWorksheet('Rating');

    priceSheet.getRow(2).getCell(2).value = 'Price';
    priceSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

    ratingSheet.getRow(2).getCell(2).value = 'Rating';
    ratingSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

    function setAlternatingRowsBackground(gridCell, excelCell) {
      if(gridCell.rowType === 'header' || gridCell.rowType === 'data') {
        if(excelCell.fullAddress.row % 2 === 0) {
          excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }, bgColor: { argb: 'D3D3D3' }};
        }
      }
    }

    exportDataGrid({
      worksheet: priceSheet,
      component: context.priceDataGrid.instance,
      topLeftCell: { row: 4, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        setAlternatingRowsBackground(gridCell, excelCell)
      }
    }).then(() => {
      return exportDataGrid({
        worksheet: ratingSheet,
        component: context.ratingDataGrid.instance,
        topLeftCell: { row: 4, column: 2 },
        customizeCell: ({ gridCell, excelCell }) => {
          setAlternatingRowsBackground(gridCell, excelCell)
        }
      });
    }).then(() => {   
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MultipleGrids.xlsx');
      });
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxTabPanelModule,
    DxDataGridModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);