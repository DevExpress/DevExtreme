import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxChartModule, DxChartComponent, DxButtonModule } from 'devextreme-angular';
import type { DxChartTypes } from 'devextreme-angular/ui/chart';

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
    DxChartModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  private readonly component = viewChild.required(DxChartComponent);

  readonly data = inject(Service).getData();

  resetZoom() {
    this.component().instance.resetVisualRange();
  }

  customizeTooltip(pointInfo: DxChartTypes.CommonPointInfo) {
    const { data } = pointInfo.point;
    return {
      text: `${data.country} ${data.year}`,
    };
  }
}

bootstrapApplication(AppComponent);
