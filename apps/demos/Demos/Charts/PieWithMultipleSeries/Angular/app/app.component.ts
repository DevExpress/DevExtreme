import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPieChartModule } from 'devextreme-angular';
import { ExportImportEntry, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})

export class AppComponent {
  exportImportData: ExportImportEntry[];

  constructor(service: Service) {
    this.exportImportData = service.getExportImportData();
  }

  customizeTooltip(arg) {
    return { text: `${arg.argumentText}<br>${arg.seriesName}: ${arg.valueText}B` };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPieChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
