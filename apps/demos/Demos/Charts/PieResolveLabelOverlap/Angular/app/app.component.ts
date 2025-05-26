import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { MedalsInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
})

export class AppComponent {
  olympicMedals: MedalsInfo[];

  resolveOverlappingTypes = ['shift', 'hide', 'none'];

  constructor(service: Service) {
    this.olympicMedals = service.getMedalsData();
  }

  customizeLabel(arg) {
    return `${arg.argumentText} (${arg.percentText})`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPieChartModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
