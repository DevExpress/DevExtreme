import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxRangeSelectorModule, DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  pipe = new DatePipe('en-US');

  dataSource = ['onHandleMove', 'onHandleRelease'];

  workingDaysCount = 260;

  startValue = new Date(2011, 0, 1);

  endValue = new Date(2011, 11, 31);

  onValueChanged = (e: DxRangeSelectorTypes.ValueChangedEvent) => {
    const currentDate = new Date(e.value[0]);
    let workingDaysCount = 0;

    while (currentDate <= e.value[1]) {
      if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
        workingDaysCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.workingDaysCount = workingDaysCount;
  };

  customizeSliderMarker: DxRangeSelectorTypes.Properties['sliderMarker']['customizeText'] = ({ value }) => this.pipe.transform(value, 'dd EEEE');

  customizeLabel: DxRangeSelectorTypes.Properties['scale']['label']['customizeText'] = ({ value }) => this.pipe.transform(value, 'MMM');
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxRangeSelectorModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
