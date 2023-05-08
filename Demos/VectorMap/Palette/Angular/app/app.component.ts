import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
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
  worldMap: any = mapsData.world;

  populations: Object;

  constructor(service: Service) {
    this.populations = service.getPopulations();
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  customizeTooltip(arg) {
    if (arg.attribute('population')) {
      return {
        text: `${arg.attribute('name')}: ${arg.attribute('population')}% of world population`,
      };
    }
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
      element.attribute('population', this.populations[element.attribute('name')]);
    });
  }

  customizeText(arg) {
    let text;
    if (arg.index === 0) {
      text = '< 0.5%';
    } else if (arg.index === 5) {
      text = '> 3%';
    } else {
      text = `${arg.start}% to ${arg.end}%`;
    }
    return text;
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
