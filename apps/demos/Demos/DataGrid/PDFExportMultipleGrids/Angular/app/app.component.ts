import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { jsPDF } from 'jspdf';
import {
  DxButtonModule, DxTabPanelModule, DxDataGridModule, DxDataGridComponent,
} from 'devextreme-angular';
import { exportDataGrid } from 'devextreme-angular/common/export/pdf';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';
import { Product, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})

export class AppComponent {
  @ViewChild('priceDataGrid', { static: false }) priceDataGrid: DxDataGridComponent;

  @ViewChild('ratingDataGrid', { static: false }) ratingDataGrid: DxDataGridComponent;

  priceDataSource: DataSource<Product, number>;

  ratingDataSource: DataSource<Product, number>;

  store: ArrayStore<Product, number>;

  constructor(service: Service) {
    this.store = new ArrayStore<Product, number>({
      key: 'Product_ID',
      data: service.getProducts(),
    });
    this.priceDataSource = new DataSource<Product, number>({
      store: this.store,
      select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
      filter: ['Product_ID', '<', 10],
    });

    this.ratingDataSource = new DataSource<Product, number>({
      store: this.store,
      select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
      filter: ['Product_ID', '<', 10],
    });
  }

  setAlternatingRowsBackground(dataGrid, gridCell, pdfCell) {
    if (gridCell.rowType === 'data') {
      const rowIndex = dataGrid.getRowIndexByKey(gridCell.data.Product_ID);
      if (rowIndex % 2 === 0) {
        pdfCell.backgroundColor = '#D3D3D3';
      }
    }
  }

  exportGrids() {
    const context = this;
    const doc = new jsPDF();

    exportDataGrid({
      jsPDFDocument: doc,
      component: context.priceDataGrid.instance,
      topLeft: { x: 7, y: 5 },
      columnWidths: [20, 50, 50, 50],
      customizeCell: ({ gridCell, pdfCell }) => {
        context.setAlternatingRowsBackground(context.priceDataGrid.instance, gridCell, pdfCell);
      },
    }).then(() => {
      doc.addPage();
      exportDataGrid({
        jsPDFDocument: doc,
        component: context.ratingDataGrid.instance,
        topLeft: { x: 7, y: 5 },
        columnWidths: [20, 50, 50, 50],
        customizeCell: ({ gridCell, pdfCell }) => {
          context.setAlternatingRowsBackground(context.ratingDataGrid.instance, gridCell, pdfCell);
        },
      }).then(() => {
        doc.save('MultipleGrids.pdf');
      });
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxTabPanelModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
