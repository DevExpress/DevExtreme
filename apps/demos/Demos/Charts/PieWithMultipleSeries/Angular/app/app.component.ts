import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxPieChartModule } from 'devextreme-angular';
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
  readonly exportImportData = inject(Service).getExportImportData();

  customizeTooltip(arg) {
    return { text: `${arg.argumentText}<br>${arg.seriesName}: ${arg.valueText}B` };
  }
}

bootstrapApplication(AppComponent);
