import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxVectorMapModule,
  ],
})

export class AppComponent {
  readonly usaMap = mapsData.usa;

  readonly weather = inject(Service).getWeatherData();
}

bootstrapApplication(AppComponent);
