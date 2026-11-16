import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxNumberBoxModule, DxButtonModule } from 'devextreme-angular';
import { DxCircularGaugeModule, type DxCircularGaugeTypes } from 'devextreme-angular/ui/circular-gauge';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCircularGaugeModule,
    DxNumberBoxModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  readonly mainGenerator = signal(34);

  readonly additionalGenerator1 = signal(12);

  readonly additionalGenerator2 = signal(23);

  readonly gaugeValue = signal(34);

  readonly gaugeSubvalues = signal([12, 23]);

  readonly customizeText: DxCircularGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} kV`;

  updateValues() {
    this.gaugeValue.set(this.mainGenerator());
    this.gaugeSubvalues.set([this.additionalGenerator1(), this.additionalGenerator2()]);
  }
}

bootstrapApplication(AppComponent);
