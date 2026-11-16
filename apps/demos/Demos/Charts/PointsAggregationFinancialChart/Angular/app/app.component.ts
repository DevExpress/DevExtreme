import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { VisualRange } from 'devextreme-angular/common/charts';
import { DxChartModule } from 'devextreme-angular/ui/chart';
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
    DxRangeSelectorModule,
  ],
})
export class AppComponent {
  readonly stockPrices = inject(Service).getStockPrices();

  readonly visualRange = signal<VisualRange>({});
}

bootstrapApplication(AppComponent);
