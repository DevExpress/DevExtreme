import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, Temperature } from './app.service';

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
  highAverage = 77;

  lowAverage = 58;

  temperaturesData: Temperature[];

  constructor(service: Service) {
    this.temperaturesData = service.getTemperaturesData();
  }

  customizePoint: DxChartTypes.Properties['customizePoint'] = ({ value }) => {
    if (value > this.highAverage) {
      return { color: '#ff7c7c', hoverStyle: { color: '#ff7c7c' } };
    }

    return (value < this.lowAverage)
      ? { color: '#8c8cff', hoverStyle: { color: '#8c8cff' } }
      : undefined;
  };

  customizeLabel: DxChartTypes.Properties['customizeLabel'] = ({ value }) => {
    if (value > this.highAverage) {
      return {
        visible: true,
        backgroundColor: '#ff7c7c',
        customizeText: this.customizeText,
      };
    }
  };

  customizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ valueText }) => `${valueText}&#176F`;
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
