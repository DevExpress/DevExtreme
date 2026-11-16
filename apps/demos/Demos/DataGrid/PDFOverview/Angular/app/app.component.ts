import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme-angular/common/export/pdf';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  readonly customers = inject(Service).getCustomers();

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const doc = new jsPDF();
    exportDataGrid({
      jsPDFDocument: doc,
      component: e.component,
      indent: 5,
    }).then(() => {
      doc.save('Companies.pdf');
    });
  }
}

bootstrapApplication(AppComponent);
