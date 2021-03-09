

import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule,
         DxCheckBoxModule,
         DxDateBoxModule,
         DxCalendarModule,
         DxTemplateModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    now: Date = new Date();
    currentValue: Date = new Date();
    firstDay: number = 0;
    minDateValue: Date | null = null;
    maxDateValue: Date | null = null;
    disabledDates: Function | null = null;
    zoomLevels: string[] = [
        "month", "year", "decade", "century"
    ];
    cellTemplate = "cell";
    holydays: any = [[1,0], [4,6], [25,11]];
    isWeekend(date) {
        var day = date.getDay();

        return day === 0 || day === 6;
    }
    setMinDate(e) {
        if(e.value) {
            this.minDateValue = new Date(this.now.getTime() - 1000*60*60*24*3);
        } else {
            this.minDateValue = null;
        }
    }
    setMaxDate(e) {
        if(e.value) {
            this.maxDateValue = new Date(this.now.getTime() + 1000*60*60*24*3);
        } else {
            this.maxDateValue = null;
        }
    }
    disableWeekend(e) {
        if(e.value) {
            var that = this;
            that.disabledDates = function(data) {
                return data.view === "month" && that.isWeekend(data.date);
            };
        } else {
            this.disabledDates = null;
        }
    }
    setFirstDay(e) {
        if(e.value) {
            this.firstDay = 1;
        } else {
            this.firstDay = 0;
        }
    }
    useCellTemplate(e) {
        if(e.value) {
            this.cellTemplate = "custom";
        } else {
            this.cellTemplate = "cell";
        }
    }
    getCellCssClass(date) {
        var cssClass = "";

        if(this.isWeekend(date))
            cssClass = "weekend";

        this.holydays.forEach(function(item) {
            if(date.getDate() === item[0] && date.getMonth() === item[1]) {
                cssClass = "holyday";
                return false;
            }
        });

        return cssClass;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxCalendarModule,
        DxCheckBoxModule,
        DxDateBoxModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);