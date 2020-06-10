import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDateBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

import 'devextreme/localization/globalize/number';
import 'devextreme/localization/globalize/date';
import 'devextreme/localization/globalize/currency';
import 'devextreme/localization/globalize/message';

import Globalize from 'globalize';

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
    value: Date = new Date(1981, 3, 27);
    now: Date = new Date();
    firstWorkDay2017: Date = new Date(2017, 0, 3);
    min: Date = new Date(1900, 0, 1);
    dateClear = new Date(2015, 11, 1, 6);
    disabledDates: Date[];

    constructor(service: Service) {
        this.disabledDates = service.getFederalHolidays();
    }

    get diffInDay() {
        return Math.floor(Math.abs(((new Date()).getTime() - this.value.getTime())/(24*60*60*1000))) + " days";
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDateBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);