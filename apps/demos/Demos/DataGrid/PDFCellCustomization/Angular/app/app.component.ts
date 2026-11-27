import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme-angular/common/export/pdf';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import type { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
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
  readonly companies = inject(Service).getCompanies();

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const doc = new jsPDF();

    exportDataGrid({
      jsPDFDocument: doc,
      component: e.component,
      columnWidths: [40, 40, 30, 30, 40],
      customizeCell({ gridCell, pdfCell }) {
        if (gridCell?.rowType === 'data' && gridCell.column?.dataField === 'Phone' && pdfCell?.text) {
          pdfCell.text = pdfCell.text.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (gridCell?.rowType === 'group' && pdfCell) {
          pdfCell.backgroundColor = '#BEDFE6';
        } else if (gridCell?.rowType === 'totalFooter' && pdfCell?.font) {
          pdfCell.font.style = 'italic';
        }
      },
      customDrawCell(options) {
        const { gridCell, pdfCell, rect } = options;

        if (gridCell && pdfCell && rect && gridCell.rowType === 'data' && gridCell.column?.dataField === 'Website') {
          options.cancel = true;
          doc.setFontSize(11);
          doc.setTextColor('#0000FF');

          const textHeight = pdfCell.text ? doc.getTextDimensions(pdfCell.text).h : 0;
          doc.textWithLink('website',
            rect.x + (pdfCell.padding?.left ?? 0),
            rect.y + rect.h / 2 + textHeight / 2,
            { url: pdfCell.text });
        }
      },
    }).then(() => {
      doc.save('Companies.pdf');
    });
  }

  phoneNumberFormat(value: number | Date | string) {
    const USNumber = String(value).match(/(\d{3})(\d{3})(\d{4})/);

    return USNumber ? `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}` : '';
  }
}

bootstrapApplication(AppComponent);
