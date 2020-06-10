import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { Countries, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [ Service ],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
   worldMap: any = mapsData.world;
   countries: Countries;

   constructor(service: Service) {
       this.countries = service.getCountries();
       this.customizeTooltip = this.customizeTooltip.bind(this);
       this.customizeLayers = this.customizeLayers.bind(this);
       this.click = this.click.bind(this);
   }

   customizeTooltip(arg) {
       let name = arg.attribute("name"),
           country = this.countries[name];
       if(country) {
           return {
               text: name + ": " + country.totalArea + "M km&#178",
               color: country.color
           };
       }
   }

   customizeLayers(elements) {
       elements.forEach((element) => {
           let country = this.countries[element.attribute("name")];
           if(country) {
               element.applySettings({
                   color: country.color,
                   hoveredColor: "#e0e000",
                   selectedColor: "#008f00"
               });
           };
       });
   }

   click(e) {
       let target = e.target;
       if(target && this.countries[target.attribute("name")]) {
           target.selected(!target.selected());
       }
   }
}

@NgModule({
    imports: [
        BrowserModule,
        DxVectorMapModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
