import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCircularGaugeModule, DxCircularGaugeTypes } from 'devextreme-angular/ui/circular-gauge';
import { DxLinearGaugeModule, DxLinearGaugeTypes } from 'devextreme-angular/ui/linear-gauge';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type ScaleLabel = DxLinearGaugeTypes.ScaleLabel | DxCircularGaugeTypes.ScaleLabel;

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
    DxLinearGaugeModule,
    DxCircularGaugeModule,
  ],
})
export class AppComponent {
  customizeText: ScaleLabel['customizeText'] = ({ valueText }) => `${valueText}°`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
