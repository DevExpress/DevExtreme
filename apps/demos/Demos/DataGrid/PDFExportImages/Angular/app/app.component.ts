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
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})

export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  onExporting({ component }: DxDataGridTypes.ExportingEvent) {
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
        const isHeader = e.rowCells?.[0].text === 'Picture';
        if (!isHeader) {
          e.rowHeight = 40;
        }
      },
      customDrawCell: (e) => {
        const { gridCell, rect } = e;
        if (gridCell && rect && gridCell.rowType === 'data' && gridCell.column?.dataField === 'Picture') {
          doc.addImage(gridCell.value, 'PNG', rect.x, rect.y, rect.w, rect.h);
          e.cancel = true;
        }
      },
    }).then(() => {
      doc.save('DataGrid.pdf');
    });
  }
}

bootstrapApplication(AppComponent);
