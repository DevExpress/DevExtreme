import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  readonly productionData = inject(Service).getProductionData();

  customizeSeries(valueFromNameField: number) {
    return valueFromNameField === 2020
      ? { type: 'line', label: { visible: true }, color: '#ff3f7a' } : {};
  }
}

bootstrapApplication(AppComponent);
