import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxNumberBoxModule, DxButtonModule } from 'devextreme-angular';
import { DxCircularGaugeModule, DxCircularGaugeTypes } from 'devextreme-angular/ui/circular-gauge';

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
  imports: [
    DxCircularGaugeModule,
    DxNumberBoxModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  mainGenerator = 34;

  additionalGenerator = [12, 23];

  gaugeValue = 34;

  gaugeSubvalues = [12, 23];

  customizeText: DxCircularGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} kV`;

  updateValues() {
    this.gaugeValue = this.mainGenerator;
    this.gaugeSubvalues = this.additionalGenerator.slice();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
