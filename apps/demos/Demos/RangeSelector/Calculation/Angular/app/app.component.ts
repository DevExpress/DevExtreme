import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxRangeSelectorModule, DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
  imports: [
    DxRangeSelectorModule,
    DxSelectBoxModule,
  ],
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
        workingDaysCount += 1;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.workingDaysCount = workingDaysCount;
  };

  customizeSliderMarker: DxRangeSelectorTypes.Properties['sliderMarker']['customizeText'] = ({ value }) => this.pipe.transform(value, 'dd EEEE');

  customizeLabel: DxRangeSelectorTypes.Properties['scale']['label']['customizeText'] = ({ value }) => this.pipe.transform(value, 'MMM');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
