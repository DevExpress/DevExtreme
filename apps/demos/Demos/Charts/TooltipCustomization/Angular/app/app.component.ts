import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxPieChartModule } from 'devextreme-angular';
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
    DxPieChartModule,
    DecimalPipe,
  ],
})
export class AppComponent {
  readonly populationData = inject(Service).getPopulationData();

  readonly getImagePath = ({ data: { name } }) => `../../../../images/flags/${name.replace(/\s/, '')}.svg`;
}

bootstrapApplication(AppComponent);
