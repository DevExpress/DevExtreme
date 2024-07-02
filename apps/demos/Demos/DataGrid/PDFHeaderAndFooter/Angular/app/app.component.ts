import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTemplateModule } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Country } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})
export class AppComponent {
  countries: Country[];

  constructor(service: Service) {
    this.countries = service.getCountries();
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const doc = new jsPDF();
    const lastPoint = { x: 0, y: 0 };

    exportDataGrid({
      jsPDFDocument: doc,
      component: e.component,
      topLeft: { x: 1, y: 15 },
      columnWidths: [30, 20, 30, 15, 22, 22, 20, 20],
      customDrawCell({ rect }) {
        if (lastPoint.x < rect.x + rect.w) {
          lastPoint.x = rect.x + rect.w;
        }
        if (lastPoint.y < rect.y + rect.h) {
          lastPoint.y = rect.y + rect.h;
        }
      },
    }).then(() => {
      // header
      const header = 'Country Area, Population, and GDP Structure';
      const pageWidth = doc.internal.pageSize.getWidth();
      const headerWidth = doc.getTextDimensions(header).w;

      doc.setFontSize(15);
      doc.text(header, (pageWidth - headerWidth) / 2, 20);

      // footer
      const footer = 'www.wikipedia.org';
      const footerWidth = doc.getTextDimensions(footer).w;

      doc.setFontSize(9);
      doc.setTextColor('#cccccc');
      doc.text(footer, (lastPoint.x - footerWidth), lastPoint.y + 5);

      doc.save('Companies.pdf');
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
