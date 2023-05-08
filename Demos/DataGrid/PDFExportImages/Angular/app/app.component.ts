import {
  NgModule, Component, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { Service, Employees } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})

export class AppComponent {
  employees: Employees[];

  constructor(private service: Service) {
    this.employees = service.getEmployess();
  }

  onExporting({ component }) {
    const doc = new jsPDF();

    exportDataGrid({
      jsPDFDocument: doc,
      component,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      topLeft: { x: 5, y: 5 },
      columnWidths: [30, 30, 30, 30, 30, 30],
      onRowExporting: (e) => {
        const isHeader = e.rowCells[0].text === 'Picture';
        if (!isHeader) {
          e.rowHeight = 40;
        }
      },
      customDrawCell: (e) => {
        if (e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'Picture') {
          doc.addImage(e.gridCell.value, 'PNG', e.rect.x, e.rect.y, e.rect.w, e.rect.h);
          e.cancel = true;
        }
      },
    }).then(() => {
      doc.save('DataGrid.pdf');
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
