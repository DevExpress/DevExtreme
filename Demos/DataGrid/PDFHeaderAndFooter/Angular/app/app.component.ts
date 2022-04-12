import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxDataGridModule, DxTemplateModule, DxButtonModule, DxDataGridComponent,
} from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { Service, Country } from './app.service';

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
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  countries: Country[];

  constructor(service: Service) {
    this.countries = service.getCountries();
  }

  exportGrid() {
    const doc = new jsPDF();
    const lastPoint = { x: 0, y: 0 };
    exportDataGrid({
      jsPDFDocument: doc,
      component: this.dataGrid.instance,
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
      const header = 'Country Area, Population, and GDP Structure';
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(15);
      const headerWidth = doc.getTextDimensions(header).w;
      doc.text(header, (pageWidth - headerWidth) / 2, 20);

      const footer = 'www.wikipedia.org';
      doc.setFontSize(9);
      doc.setTextColor('#cccccc');
      const footerWidth = doc.getTextDimensions(footer).w;
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
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
