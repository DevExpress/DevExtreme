import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule, DxSelectBoxModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})
export class AppComponent {
    pipe: any = new DatePipe("en-US");
    dataSource: string[] = ["onMoving", "onMovingComplete"];
    workingDaysCount = 260;
    startValue: Date = new Date(2011, 0, 1);
    endValue: Date = new Date(2011, 11, 31);
    onValueChanged = (e) => {
        let currentDate = new Date(e.value[0]),
            workingDaysCount = 0;

        while (currentDate <= e.value[1]) {
            if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
                workingDaysCount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        this.workingDaysCount = workingDaysCount;
    }
    customizeSliderMarker = (data) => {
        return this.pipe.transform(data.value, "dd EEEE");
    }
    customizeLabel = (data) => {
        return this.pipe.transform(data.value, "MMM");
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxRangeSelectorModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);