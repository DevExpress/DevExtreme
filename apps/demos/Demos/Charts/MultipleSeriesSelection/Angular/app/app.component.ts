import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, Statistics } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  statisticsData: Statistics[];

  constructor(service: Service) {
    this.statisticsData = service.getStatisticsData();
  }

  seriesClick({ target: series }: DxChartTypes.SeriesClickEvent) {
    if (series.isSelected()) {
      series.clearSelection();
    } else {
      series.select();
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
