import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxRangeSelectorModule, type DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxRangeSelectorModule,
    DecimalPipe,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getData();

  readonly totalResult = signal(12809000);

  onValueChanged(e: DxRangeSelectorTypes.ValueChangedEvent) {
    const data = this.dataSource;
    let total = 0;
    let startIndex;
    let endIndex;

    data.forEach((item, index) => {
      if (item.country === e.value[0]) {
        startIndex = index;
      } else if (item.country === e.value[1]) {
        endIndex = index;
      }
    });

    if (endIndex) {
      data
        .slice(startIndex, endIndex + 1)
        .forEach((item) => {
          total += item.copper;
        });
    } else {
      total = data[startIndex].copper;
    }

    this.totalResult.set(total);
  }
}

bootstrapApplication(AppComponent);
