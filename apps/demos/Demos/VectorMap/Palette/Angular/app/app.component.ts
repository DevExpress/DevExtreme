import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  worldMap = mapsData.world;

  populations: Object;

  constructor(service: Service) {
    this.populations = service.getPopulations();
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  customizeTooltip({ attribute }: { attribute: Function }) {
    if (attribute('population')) {
      return {
        text: `${attribute('name')}: ${attribute('population')}% of world population`,
      };
    }
  }

  customizeLayers(elements: { attribute: Function }[]) {
    elements.forEach((element) => {
      element.attribute('population', this.populations[element.attribute('name')]);
    });
  }

  customizeText({ index, start, end }: Record<string, number>) {
    let text = (index === 0) ? '< 0.5%' : `${start}% to ${end}%`;

    return (index === 5) ? '> 3%' : text;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxVectorMapModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
