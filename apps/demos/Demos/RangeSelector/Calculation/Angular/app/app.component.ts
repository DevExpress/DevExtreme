import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxRangeSelectorModule, type DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxRangeSelectorModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly pipe = new DatePipe('en-US');

  readonly dataSource = ['onHandleMove', 'onHandleRelease'];

  readonly workingDaysCount = signal(260);

  readonly startValue = new Date(2011, 0, 1);

  readonly endValue = new Date(2011, 11, 31);

  readonly onValueChanged = (e: DxRangeSelectorTypes.ValueChangedEvent) => {
    const currentDate = new Date(e.value[0]);
    let workingDaysCount = 0;

    while (currentDate <= e.value[1]) {
      if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
        workingDaysCount += 1;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.workingDaysCount.set(workingDaysCount);
  };

  readonly customizeSliderMarker: DxRangeSelectorTypes.Properties['sliderMarker']['customizeText'] = ({ value }) => this.pipe.transform(value, 'dd EEEE');

  readonly customizeLabel: DxRangeSelectorTypes.Properties['scale']['label']['customizeText'] = ({ value }) => this.pipe.transform(value, 'MMM');
}

bootstrapApplication(AppComponent);
