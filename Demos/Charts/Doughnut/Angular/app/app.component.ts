import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPieChartModule } from 'devextreme-angular';
import { PopulationByRegion, Service } from './app.service';
import { PercentPipe } from '@angular/common';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})

export class AppComponent {
    pipe: any = new PercentPipe("en-US");
    
    populationByRegions: PopulationByRegion[];

    constructor(service: Service) {
        this.populationByRegions = service.getPopulationByRegions();
    }

    customizeTooltip = (arg: any) => {
        return {
            text: arg.valueText + " - " + this.pipe.transform(arg.percent, "1.2-2")
        };
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxPieChartModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);