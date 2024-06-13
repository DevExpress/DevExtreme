import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxLinearGaugeModule, DxLinearGaugeTypes } from 'devextreme-angular/ui/linear-gauge';
import { Service, PowerInfo } from './app.service';

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
  powerInfo: PowerInfo[];

  currentValue: PowerInfo;

  constructor(service: Service) {
    this.powerInfo = service.getPowerInfo();
    this.currentValue = this.powerInfo[0];
  }

  customizeText: DxLinearGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} kW`;

  customizeTooltip({ index, valueText }) {
    let result = `${valueText} kW`;

    result = (index >= 0)
      ? `Secondary ${index + 1}: ${result}`
      : `Primary: ${result}`;

    return {
      text: result,
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxLinearGaugeModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
