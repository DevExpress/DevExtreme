import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxBulletModule } from 'devextreme-angular';
import { Week, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
