import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
import { Countries, Service } from './app.service';

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

  countries: Countries;

  constructor(service: Service) {
    this.countries = service.getCountries();
    this.click = this.click.bind(this);
  }

  customizeTooltip = ({ attribute }) => {
    const name = attribute('name');
    const country = this.countries[name];
    if (country) {
      return {
        text: `${name}: ${country.totalArea}M km&#178`,
        color: country.color,
      };
    }
  };

  customizeLayers = (elements: { attribute: Function, applySettings: Function }[]) => {
    elements.forEach((element) => {
      const country = this.countries[element.attribute('name')];
      if (country) {
        element.applySettings({
          color: country.color,
          hoveredColor: '#e0e000',
          selectedColor: '#008f00',
        });
      }
    });
  };

  click({ target }: DxVectorMapTypes.ClickEvent) {
    if (target && this.countries[target.attribute('name')]) {
      target.selected(!target.selected());
    }
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
