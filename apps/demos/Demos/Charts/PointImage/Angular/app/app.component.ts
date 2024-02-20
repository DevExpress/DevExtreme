import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, IceHockeyStatistics } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  title = 'Canadian Men’s National Ice Hockey Team\n at the World Championships';

  iceHockeyStatistics: IceHockeyStatistics[];

  constructor(service: Service) {
    this.iceHockeyStatistics = service.getIceHockeyStatistics();
  }

  customizePoint: DxChartTypes.Properties['customizePoint'] = ({ value }) => {
    const color = {
      1: 'gold',
      2: 'silver',
      3: 'bronse',
    }[value];

    if (color) {
      return { image: { url: `../../../../images/Charts/PointImage/icon-medal-${color}.png`, width: 20, height: 20 }, visible: true };
    }
  };

  customizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ valueText }) => ({
    1: `${valueText}st place`,
    2: `${valueText}nd place`,
    3: `${valueText}rd place`,
  }[valueText] || `${valueText}th place`);
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
