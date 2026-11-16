import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxPieChartModule } from 'devextreme-angular';
import { DecimalPipe } from '@angular/common';
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
    DxPieChartModule,
  ],
})

export class AppComponent {
  readonly service = inject(Service);

  readonly countries = new Set(this.service.getData().map((item) => item.country));

  readonly pipe = new DecimalPipe('en-US');

  customizeLabel(e) {
    return `${e.argumentText}\n${e.valueText}`;
  }

  calculateTotal(pieChart) {
    const totalValue = pieChart.getAllSeries()[0].getVisiblePoints().reduce((s, p) => s + p.originalValue, 0);
    return this.pipe.transform(totalValue, '1.0-0');
  }

  getImagePath(country) {
    return `../../../../images/flags/${country.replace(/\s/, '').toLowerCase()}.svg`;
  }
}

bootstrapApplication(AppComponent);
