import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxRangeSliderModule, DxNumberBoxModule } from 'devextreme-angular';

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
    DxRangeSliderModule,
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  start = 10;

  end = 90;

  format = (value: unknown) => `${value}%`;

  label = {
    visible: true,
    format: (value: unknown) => this.format(value),
    position: 'top',
  };

  tooltip = {
    enabled: true,
    format: (value: unknown) => this.format(value),
    showMode: 'always',
    position: 'bottom',
  };

  tooltipEnabled = {
    enabled: true,
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
