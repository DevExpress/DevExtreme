import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { MedalsInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
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
    BrowserTransferStateModule,
    DxPieChartModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
