import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxBulletModule } from 'devextreme-angular';
import { Week, Service } from './app.service';

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
  providers: [Service],
  imports: [
    DxBulletModule,
  ],
})

export class AppComponent {
  weeksData: Week[];

  constructor(service: Service) {
    this.weeksData = service.getWeeksData();
  }

  customizeTooltip(arg) {
    return {
      text: `Current t&#176: ${arg.value}&#176C<br>Average t&#176: ${arg.target}&#176C`,
    };
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
