import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';

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
    DxRangeSelectorModule,
  ],
})
export class AppComponent {
  dataSource = [
    { t: new Date(2024, 11, 22), costs: 19, income: 18 },
    { t: new Date(2024, 11, 29), costs: 27, income: 12 },
    { t: new Date(2025, 0, 5), costs: 30, income: 5 },
    { t: new Date(2025, 0, 12), costs: 26, income: 6 },
    { t: new Date(2025, 0, 19), costs: 18, income: 10 },
    { t: new Date(2025, 0, 26), costs: 15, income: 15 },
    { t: new Date(2025, 1, 2), costs: 14, income: 21 },
    { t: new Date(2025, 1, 9), costs: 14, income: 25 },
  ];

  startSelectedValue: Date = new Date(2024, 11, 25);

  endSelectedValue: Date = new Date(2025, 0, 1);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
