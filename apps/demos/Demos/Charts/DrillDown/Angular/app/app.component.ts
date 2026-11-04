import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxTreeMapModule } from 'devextreme-angular';
import { Service } from './app.service';

interface DrillInfo {
  text: string;
  node?: Element;
}

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
  readonly citiesPopulations = inject(Service).getCitiesPopulations();

  readonly drillInfos = signal<DrillInfo[]>([]);

  nodeClick(e) {
    e.node.drillDown();
  }

  drill(e) {
    const drillInfos: DrillInfo[] = [];
    for (let node = e.node.getParent(); node; node = node.getParent()) {
      drillInfos.unshift({
        text: node.label() || 'All Continents',
        node,
      });
    }
    if (drillInfos.length) {
      drillInfos.push({
        text: e.node.label(),
      });
    }
    this.drillInfos.set(drillInfos);
  }

  drillInfoClick(node) {
    if (node) {
      node.drillDown();
    }
  }
}

bootstrapApplication(AppComponent);
