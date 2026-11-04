import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxLinearGaugeModule, type DxLinearGaugeTypes } from 'devextreme-angular/ui/linear-gauge';
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
    DxLinearGaugeModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly powerInfo = inject(Service).getPowerInfo();

  readonly currentValue = signal(this.powerInfo[0]);

  readonly customizeText: DxLinearGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} kW`;

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

bootstrapApplication(AppComponent);
