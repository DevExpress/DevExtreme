import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule } from 'devextreme-angular';

import { Service, IceHockeyStatistics } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    title: string = "Canadian Men’s National Ice Hockey Team\n at the World Championships";
    iceHockeyStatistics: IceHockeyStatistics[];

    constructor(service: Service) {
        this.iceHockeyStatistics = service.getIceHockeyStatistics();
    }

    customizePoint(arg: any) {
        if(arg.value == 1) {
            return { image: { url: "../../../../images/icon-medal-gold.png", width: 20, height: 20 }, visible: true };
        } else if(arg.value == 2) {
            return { image: { url: "../../../../images/icon-medal-silver.png", width: 20, height: 20 }, visible: true };
        } else if(arg.value == 3) {
            return { image: { url: "../../../../images/icon-medal-bronse.png", width: 20, height: 20 }, visible: true };
        }
    }

    customizeText(arg: any) {
        if(arg.valueText == 1) {
            return arg.valueText + "st place";
        } else if(arg.valueText == 2) {
            return arg.valueText + "nd place";
        } else if(arg.valueText == 3) {
            return arg.valueText + "rd place";
        } else {
            return arg.valueText + "th place";
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxChartModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);