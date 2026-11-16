import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxLinearGaugeModule, DxSelectBoxModule } from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxLinearGaugeModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  readonly cities = inject(Service).getCities();

  readonly weatherData = signal(this.cities[0].data);
}

bootstrapApplication(AppComponent);
