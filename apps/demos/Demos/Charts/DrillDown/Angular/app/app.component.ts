import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeMapModule } from 'devextreme-angular';
import { CitiesPopulation, Service } from './app.service';

interface DrillInfo {
  text: string;
  node?: Element;
}

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
    DxTreeMapModule,
  ],
})
export class AppComponent {
  citiesPopulations: CitiesPopulation[];

  drillInfos: DrillInfo[] = [];

  constructor(service: Service) {
    this.citiesPopulations = service.getCitiesPopulations();
  }

  nodeClick(e) {
    e.node.drillDown();
  }

  drill(e) {
    this.drillInfos = [];
    for (let node = e.node.getParent(); node; node = node.getParent()) {
      this.drillInfos.unshift({
        text: node.label() || 'All Continents',
        node,
      });
    }
    if (this.drillInfos.length) {
      this.drillInfos.push({
        text: e.node.label(),
      });
    }
  }

  drillInfoClick(node) {
    if (node) {
      node.drillDown();
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
