import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxPolarChartModule, DxPolarChartTypes } from 'devextreme-angular/ui/polar-chart';
import { WindRose, WindDescription, Service } from './app.service';

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
  windRoseData: WindRose[];

  windSources: WindDescription[];

  constructor(service: Service) {
    this.windRoseData = service.getWindRoseData();
    this.windSources = service.getWindSources();
  }

  onLegendClick({ target: series }: DxPolarChartTypes.LegendClickEvent) {
    series.isVisible()
      ? series.hide()
      : series.show();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxPolarChartModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
