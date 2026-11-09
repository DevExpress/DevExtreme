import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';
import { type StatesCollection, Service } from './app.service';

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
    DecimalPipe,
  ],
})

export class AppComponent {
  readonly usaMap = mapsData.usa;

  readonly states = inject(Service).getStatesData();

  readonly getImagePath = (annotation: StatesCollection) => {
    const name = annotation.data.name.replace(/\s/, '');
    return `../../../../images/flags/${name}.svg`;
  };
}

bootstrapApplication(AppComponent);
