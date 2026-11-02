import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
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

  private readonly store = new ArrayStore<Product, number>({
    key: 'Product_ID',
    data: inject(Service).getProducts(),
  });

  readonly priceDataSource = new DataSource<Product, number>({
    store: this.store,
    select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
    filter: ['Product_ID', '<', 10],
  });

  readonly ratingDataSource = new DataSource<Product, number>({
    store: this.store,
    select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
    filter: ['Product_ID', '<', 10],
  });

  setAlternatingRowsBackground(dataGrid, gridCell, pdfCell) {
    if (gridCell.rowType === 'data') {
      const rowIndex = dataGrid.getRowIndexByKey(gridCell.data.Product_ID);
      if (rowIndex % 2 === 0) {
        pdfCell.backgroundColor = '#D3D3D3';
      }
    }
  }

  exportGrids() {
    const doc = new jsPDF();

    exportDataGrid({
      jsPDFDocument: doc,
      component: this.priceDataGrid().instance,
      topLeft: { x: 7, y: 5 },
      columnWidths: [20, 50, 50, 50],
      customizeCell: ({ gridCell, pdfCell }) => {
        this.setAlternatingRowsBackground(this.priceDataGrid().instance, gridCell, pdfCell);
      },
    }).then(() => {
      doc.addPage();
      exportDataGrid({
        jsPDFDocument: doc,
        component: this.ratingDataGrid().instance,
        topLeft: { x: 7, y: 5 },
        columnWidths: [20, 50, 50, 50],
        customizeCell: ({ gridCell, pdfCell }) => {
          this.setAlternatingRowsBackground(this.ratingDataGrid().instance, gridCell, pdfCell);
        },
      }).then(() => {
        doc.save('MultipleGrids.pdf');
      });
    });
  }
}

bootstrapApplication(AppComponent);
