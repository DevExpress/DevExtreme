import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeMapModule } from 'devextreme-angular';
import { CitiesPopulation, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxTreeMapModule,
  ],
})
export class AppComponent {
  citiesPopulations: CitiesPopulation[];

  constructor(service: Service) {
    this.citiesPopulations = service.getCitiesPopulations();
  }

  customizeTooltip(arg) {
    const data = arg.node.data;
    let result = null;

    if (arg.node.isLeaf()) {
      result = `<span class='city'>${data.name}</span> (${
        data.country})<br/>Population: ${arg.valueText}`;
    }

    return {
      text: result,
    };
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
