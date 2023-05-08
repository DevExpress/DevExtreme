import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeMapModule } from 'devextreme-angular';
import { CitiesPopulation, Service } from './app.service';

interface DrillInfo {
  text: string;
  node?: any;
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
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

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeMapModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
