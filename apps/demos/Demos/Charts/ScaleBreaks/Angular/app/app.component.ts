import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChartModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';

import { SolarSystemObject, Service } from './app.service';

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
  data: SolarSystemObject[];

  lineStyles: Array<string> = ['waved', 'straight'];

  breaksCount: Array<number> = [1, 2, 3, 4];

  lineStyleValue: string;

  autoBreaksEnabledValue = true;

  breaksCountValue: number;

  title = 'Relative Masses of the Heaviest\n Solar System Objects';

  constructor(service: Service) {
    this.data = service.getData();
    this.lineStyleValue = this.lineStyles[0];
    this.breaksCountValue = this.breaksCount[2];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
