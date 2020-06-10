import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxLinearGaugeModule, DxSelectBoxModule } from 'devextreme-angular'
import { Service, PowerInfo } from './app.service'

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
    powerInfo: PowerInfo[];
    currentValue: PowerInfo;

    constructor(service: Service) {
        this.powerInfo = service.getPowerInfo();
        this.currentValue = this.powerInfo[0];
    }

    customizeText(arg: any) {
        return arg.valueText + " kW";
    }

    customizeTooltip(arg) {
        var result = arg.valueText + " kW";
        if (arg.index >= 0) {
            result = "Secondary " + (arg.index + 1) + ": " + result;
        } else {
            result = "Primary: " + result;
        }
        return {
            text: result
        };
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxLinearGaugeModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);