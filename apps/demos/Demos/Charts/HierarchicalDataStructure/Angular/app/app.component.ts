import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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

@NgModule({
  imports: [
    BrowserModule,
    DxTreeMapModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
